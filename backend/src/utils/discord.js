const axios = require("axios");

// Recomendado: use DISCORD_WEBHOOK_URL (webhook do canal de compras)
async function notifyDiscordPurchase({ name, discordId, products, total, orderId }) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;

  const mention = discordId ? `<@${discordId}>` : "(sem discord id)";
  const lines = products.map((p) => `・${p}`).join("\n");
  const now = new Date();

  const content =
`👥 | CLIENTE:
${name} (${mention})
🪐 | PRODUTO(S) COMPRADO(S):
${lines}
💵 | TOTAL PAGO:
R$ ${total.toFixed(2)}
📅 | DATA/HORA:
${now.toLocaleString("pt-BR")}
🧾 | ID DA COMPRA:
${orderId}`;

  await axios.post(url, { content });
}

module.exports = { notifyDiscordPurchase };