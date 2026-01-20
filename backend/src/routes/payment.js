const router = require("express").Router();
const auth = require("../middleware/auth");
const { initMP } = require("../config/mercadopago");
const makeOrderId = require("../utils/orderId");
const { notifyDiscordPurchase } = require("../utils/discord");

const User = require("../models/User");
const Order = require("../models/Order");
const Gamepass = require("../models/Gamepass");

// Criar pedido + pagamento
router.post("/create-order", auth, async (req, res) => {
  try {
    const { items, paymentMethod, cpf, discordId } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, message: "Carrinho vazio." });
    }
    if (!["pix", "card", "balance"].includes(paymentMethod)) {
      return res.status(400).json({ ok: false, message: "Método inválido." });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ ok: false, message: "Usuário não encontrado." });

    const dbItems = [];
    let total = 0;

    // valida estoque e soma
    for (const it of items) {
      const gp = await Gamepass.findById(it.gamepassId);
      if (!gp || !gp.active) return res.status(400).json({ ok: false, message: "Produto inválido." });

      const qty = Number(it.quantity || 1);
      if (qty < 1) return res.status(400).json({ ok: false, message: "Quantidade inválida." });

      if (gp.stock < qty) {
        return res.status(400).json({ ok: false, message: `${gp.name} sem estoque.` });
      }

      dbItems.push({
        gamepassId: gp._id,
        name: gp.name,
        priceReal: gp.priceReal,
        quantity: qty
      });

      total += gp.priceReal * qty;
    }

    const orderId = makeOrderId();

    // Pagamento por saldo
    if (paymentMethod === "balance") {
      if (user.balance < total) {
        return res.status(400).json({ ok: false, message: "Saldo insuficiente." });
      }

      user.balance -= total;
      await user.save();

      // baixa estoque
      for (const it of dbItems) {
        await Gamepass.updateOne({ _id: it.gamepassId }, { $inc: { stock: -it.quantity } });
      }

      const order = await Order.create({
        orderId,
        user: user._id,
        items: dbItems,
        total,
        cpf: String(cpf || user.cpf || ""),
        discordId: String(discordId || user.discordId || ""),
        paymentMethod,
        status: "approved",
        paidAt: new Date()
      });

      // notify discord
      await notifyDiscordPurchase({
        name: user.name,
        discordId: order.discordId,
        products: dbItems.map((x) => x.name),
        total,
        orderId
      });

      return res.json({ ok: true, status: "approved", orderId });
    }

    // MP (PIX / Card)
    const mp = initMP();

    const order = await Order.create({
      orderId,
      user: user._id,
      items: dbItems,
      total,
      cpf: String(cpf || user.cpf || ""),
      discordId: String(discordId || user.discordId || ""),
      paymentMethod,
      status: "pending"
    });

    // Cria pagamento MP
    const paymentData = {
      transaction_amount: Number(total.toFixed(2)),
      description: `LAG TECK - Pedido ${orderId}`,
      payment_method_id: paymentMethod === "pix" ? "pix" : undefined,
      payer: {
        email: user.email
      },
      external_reference: orderId,
      notification_url: process.env.MP_WEBHOOK_URL
    };

    const resp = await mp.payment.create(paymentData);
    const mpPayment = resp.body;

    order.mpPaymentId = String(mpPayment.id || "");
    await order.save();

    // PIX retorna QR
    if (paymentMethod === "pix") {
      const qr = mpPayment.point_of_interaction?.transaction_data?.qr_code_base64 || "";
      const copia = mpPayment.point_of_interaction?.transaction_data?.qr_code || "";

      order.pixQrCodeBase64 = qr;
      order.pixCopiaECola = copia;
      await order.save();

      return res.json({
        ok: true,
        status: "pending",
        orderId,
        pix: { qrBase64: qr, copiaECola: copia }
      });
    }

    // Cartão: você pode usar Checkout Pro (preference) ou usar card_token etc.
    // Aqui vou retornar o "init_point" se você migrar para preference. Por enquanto:
    return res.json({
      ok: true,
      status: "pending",
      orderId,
      message: "Pagamento cartão: implemente Checkout Pro (Preference) para redirecionar."
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Erro ao criar pedido." });
  }
});

// Webhook Mercado Pago (aprovação automática)
router.post("/webhook/mp", async (req, res) => {
  try {
    // MP envia vários formatos. O comum: req.body.data.id (payment id)
    const paymentId = req.body?.data?.id;
    if (!paymentId) {
      return res.json({ ok: true });
    }

    const mp = initMP();
    const payment = await mp.payment.get(paymentId);
    const body = payment.body;

    const status = body.status; // approved, rejected, etc
    const orderId = body.external_reference;

    if (!orderId) return res.json({ ok: true });

    const order = await Order.findOne({ orderId }).populate("user");
    if (!order) return res.json({ ok: true });

    // Só processa 1x
    if (order.status === "approved") return res.json({ ok: true });

    if (status === "approved") {
      // baixa estoque
      for (const it of order.items) {
        await Gamepass.updateOne({ _id: it.gamepassId }, { $inc: { stock: -it.quantity } });
      }

      order.status = "approved";
      order.paidAt = new Date();
      order.mpPaymentId = String(paymentId);
      await order.save();

      // Notifica Discord
      await notifyDiscordPurchase({
        name: order.user.name,
        discordId: order.discordId,
        products: order.items.map((x) => x.name),
        total: order.total,
        orderId: order.orderId
      });
    } else if (status === "rejected") {
      order.status = "rejected";
      await order.save();
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error("WEBHOOK ERROR:", e);
    return res.json({ ok: true });
  }
});

module.exports = router;
