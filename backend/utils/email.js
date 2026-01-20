const nodemailer = require("nodemailer");

function makeTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_* não configurado no .env (SMTP_HOST, SMTP_USER, SMTP_PASS).");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

async function sendVerificationCode(email, code) {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const transport = makeTransport();

  await transport.sendMail({
    from: `LAG TECK <${from}>`,
    to: email,
    subject: "LAG TECK - Código de verificação",
    html: `
      <div style="font-family:Arial;padding:18px">
        <h2>Verificação de conta - LAG TECK</h2>
        <p>Seu código (válido por 10 minutos):</p>
        <div style="font-size:32px;font-weight:900;letter-spacing:6px;margin:16px 0">${code}</div>
        <p>Se não foi você, ignore.</p>
      </div>
    `
  });
}

module.exports = { sendVerificationCode };
