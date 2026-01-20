const mercadopago = require("mercadopago");

function initMP() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("MP_ACCESS_TOKEN não definido no .env");
  mercadopago.configure({ access_token: token });
  return mercadopago;
}

module.exports = { initMP };
