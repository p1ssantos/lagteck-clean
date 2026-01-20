function getCart() {
  return JSON.parse(localStorage.getItem("lagteck_cart") || "[]");
}
function setCart(cart) {
  localStorage.setItem("lagteck_cart", JSON.stringify(cart));
}
function formatBRL(v) {
  return Number(v || 0).toFixed(2);
}

function renderCart() {
  const cart = getCart();
  const box = document.getElementById("cartList");
  const totalEl = document.getElementById("total");

  if (!box) return;
  box.innerHTML = "";

  let total = 0;
  if (cart.length === 0) {
    box.innerHTML = `<div style="color:#475569;font-weight:1000">Carrinho vazio.</div>`;
    totalEl.textContent = "0.00";
    return;
  }

  cart.forEach((it, idx) => {
    total += it.priceReal * it.quantity;

    const row = document.createElement("div");
    row.style.cssText = "display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;padding:14px;border-radius:14px;border:2px solid #e2e8f0;";
    row.innerHTML = `
      <div style="font-weight:1000;color:#0f172a">
        ${it.name} <span style="color:#64748b;font-weight:900">x${it.quantity}</span>
        <div style="color:#475569;font-weight:900;font-size:13px;">R$ ${formatBRL(it.priceReal)} cada</div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;">
        <div style="font-weight:1000;color:#0f172a">R$ ${formatBRL(it.priceReal * it.quantity)}</div>
        <button class="btn" style="background:#ef4444;color:#fff;padding:10px 14px;border-radius:12px" onclick="removeItem(${idx})">
          <i class="fas fa-xmark"></i>
        </button>
      </div>
    `;
    box.appendChild(row);
  });

  totalEl.textContent = formatBRL(total);
}

function removeItem(i) {
  const cart = getCart();
  cart.splice(i, 1);
  setCart(cart);
  renderCart();
}

function clearCart() {
  setCart([]);
  renderCart();
}

async function pay(method) {
  try {
    const token = localStorage.getItem("lagteck_token");
    if (!token) return (window.location.href = "login.html");

    const cart = getCart();
    if (cart.length === 0) return setMsg("msg", "Carrinho vazio.", false);

    const cpf = document.getElementById("cpf").value.trim();
    const discordId = document.getElementById("discordId").value.trim();

    if (!cpf) return setMsg("msg", "CPF é obrigatório.", false);

    setMsg("msg", "Criando pedido...", true);

    const items = cart.map((x) => ({
      gamepassId: x.gamepassId,
      quantity: x.quantity
    }));

    const data = await api("/payment/create-order", {
      method: "POST",
      body: JSON.stringify({ items, paymentMethod: method, cpf, discordId })
    });

    // aprovado por saldo
    if (data.status === "approved") {
      setMsg("msg", "Compra aprovada! Indo para o suporte...", true);
      setCart([]);

      showOrderId(data.orderId);
      showSupport();
      return;
    }

    // pix
    if (data.pix) {
      setMsg("msg", "PIX gerado. Pague para aprovar automaticamente.", true);
      document.getElementById("payBox").style.display = "block";
      showOrderId(data.orderId);

      const img = document.getElementById("pixQr");
      const txt = document.getElementById("pixCopy");
      img.src = `data:image/png;base64,${data.pix.qrBase64}`;
      txt.value = data.pix.copiaECola;

      document.getElementById("pixArea").style.display = "flex";
      showSupport();
    } else {
      setMsg("msg", data.message || "Pagamento criado.", true);
    }
  } catch (e) {
    setMsg("msg", e.message || "Erro no checkout.", false);
  }
}

function showOrderId(orderId) {
  const box = document.getElementById("orderIdBox");
  const el = document.getElementById("orderId");
  if (!box || !el) return;
  box.style.display = "block";
  el.textContent = orderId || "--------";
}

function showSupport() {
  // Troque pelo link direto do seu suporte (canal/convite específico)
  const supportLink = "https://discord.gg/6W38nTgyWE";
  const btn = document.getElementById("supportBtn");
  if (btn) btn.href = supportLink;
}

function copyPix() {
  const txt = document.getElementById("pixCopy");
  if (!txt) return;
  txt.select();
  document.execCommand("copy");
  setMsg("msg", "PIX copiado!", true);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
