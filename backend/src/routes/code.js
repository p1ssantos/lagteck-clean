const router = require("express").Router();
const Code = require("../models/Code");
const botAuth = require("../middleware/botAuth");

// Bot cria código (a cada 30s)
router.post("/create", botAuth, async (req, res) => {
  try {
    const { code, expiresInMs } = req.body;
    if (!code) return res.status(400).json({ ok: false, message: "code obrigatório" });

    const expiresAt = new Date(Date.now() + Number(expiresInMs || 30000));

    await Code.create({
      code: String(code).trim().toUpperCase(),
      expiresAt
    });

    res.json({ ok: true });
  } catch (e) {
    // se repetir código, ignora
    console.error(e.message);
    res.status(500).json({ ok: false, message: "Erro ao criar código." });
  }
});

// Site verifica código
router.post("/verify", async (req, res) => {
  try {
    const { code } = req.body;
    const c = String(code || "").trim().toUpperCase();
    if (!c) return res.status(400).json({ ok: false, message: "Código vazio." });

    const row = await Code.findOne({ code: c });
    if (!row) return res.status(404).json({ ok: false, message: "Código inválido." });

    if (row.used) return res.status(400).json({ ok: false, message: "Código já usado." });
    if (new Date() > row.expiresAt) return res.status(400).json({ ok: false, message: "Código expirado." });

    row.used = true;
    await row.save();

    res.json({ ok: true, valid: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Erro ao verificar código." });
  }
});

module.exports = router;
