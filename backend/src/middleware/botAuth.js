module.exports = function botAuth(req, res, next) {
  const key = req.headers["x-bot-key"];
  if (!key || key !== process.env.BOT_API_KEY) {
    return res.status(401).json({ ok: false, message: "Bot não autorizado." });
  }
  next();
};
