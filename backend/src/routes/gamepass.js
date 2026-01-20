const router = require("express").Router();
const Gamepass = require("../models/Gamepass");

// Lista pública
router.get("/list", async (req, res) => {
  const items = await Gamepass.find({ active: true }).sort({ createdAt: 1 });
  res.json({ ok: true, items });
});

// Seed (opcional): cria os produtos que você mandou
router.post("/seed", async (req, res) => {
  try {
    const count = await Gamepass.countDocuments();
    if (count > 0) return res.status(400).json({ ok: false, message: "Já tem gamepasses no banco." });

    await Gamepass.insertMany([
      { name: "2x Drops", description: "Aumenta a chance de drops.", priceRobux: 0, priceReal: 10.5, stock: 1 },
      { name: "2x Mastery", description: "Aumenta ganho de mastery.", priceRobux: 0, priceReal: 13.5, stock: 1 },
      { name: "2x Money", description: "Aumenta ganho de dinheiro.", priceRobux: 0, priceReal: 13.5, stock: 1 },
      { name: "Fast Boat", description: "Barcos mais rápidos.", priceRobux: 0, priceReal: 10.5, stock: 1 },
      { name: "Notificador de fruta", description: "Notifica frutas.", priceRobux: 0, priceReal: 81, stock: 0 },
      { name: "Dark blade", description: "Espada Dark Blade.", priceRobux: 0, priceReal: 36, stock: 0 },
      { name: "1 Storage", description: "Armazenamento extra.", priceRobux: 0, priceReal: 0, stock: 0 }
    ]);

    res.json({ ok: true, message: "Seed criado." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Erro seed." });
  }
});

module.exports = router;
