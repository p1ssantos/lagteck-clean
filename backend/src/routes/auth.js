const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendVerificationCode } = require("../utils/email");
const auth = require("../middleware/auth");

function make6() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, password2, discordId } = req.body;

    if (!name || !email || !password || !password2) {
      return res.status(400).json({ ok: false, message: "Preencha todos os campos." });
    }
    if (password !== password2) {
      return res.status(400).json({ ok: false, message: "As senhas não conferem." });
    }
    if (password.length < 6) {
      return res.status(400).json({ ok: false, message: "Senha precisa ter no mínimo 6 caracteres." });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ ok: false, message: "E-mail já cadastrado." });

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      discordId: (discordId || "").trim(),
      verified: false
    });
    await user.setPassword(password);

    const code = make6();
    user.emailVerifyCode = code;
    user.emailVerifyExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await user.save();

    await sendVerificationCode(user.email, code);

    return res.json({ ok: true, message: "Conta criada. Verifique seu e-mail com o código." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Erro ao cadastrar." });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.status(404).json({ ok: false, message: "Conta não encontrada." });

    if (user.verified) return res.json({ ok: true, message: "Conta já verificada." });

    if (!user.emailVerifyCode || !user.emailVerifyExpiresAt) {
      return res.status(400).json({ ok: false, message: "Sem código de verificação ativo." });
    }

    if (new Date() > user.emailVerifyExpiresAt) {
      return res.status(400).json({ ok: false, message: "Código expirado." });
    }

    if (String(code).trim() !== user.emailVerifyCode) {
      return res.status(400).json({ ok: false, message: "Código inválido." });
    }

    user.verified = true;
    user.emailVerifyCode = "";
    user.emailVerifyExpiresAt = null;
    await user.save();

    return res.json({ ok: true, message: "E-mail verificado com sucesso!" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Erro ao verificar e-mail." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.status(401).json({ ok: false, message: "Login inválido." });

    const ok = await user.comparePassword(password || "");
    if (!ok) return res.status(401).json({ ok: false, message: "Login inválido." });

    if (!user.verified) {
      return res.status(403).json({ ok: false, message: "Verifique seu e-mail antes de entrar." });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      user: { name: user.name, email: user.email, discordId: user.discordId, balance: user.balance, cpf: user.cpf }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Erro no login." });
  }
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-passwordHash -emailVerifyCode");
  if (!user) return res.status(404).json({ ok: false, message: "Usuário não encontrado." });
  res.json({ ok: true, user });
});

router.post("/update-profile", auth, async (req, res) => {
  try {
    const { discordId, cpf } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ ok: false, message: "Usuário não encontrado." });

    if (discordId !== undefined) user.discordId = String(discordId).trim();
    if (cpf !== undefined) user.cpf = String(cpf).trim();

    await user.save();
    res.json({ ok: true, message: "Perfil atualizado.", user: { discordId: user.discordId, cpf: user.cpf, balance: user.balance } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Erro ao atualizar perfil." });
  }
});

module.exports = router;
