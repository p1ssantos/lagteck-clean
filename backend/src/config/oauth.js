// Este arquivo fica pronto para quando você ativar "Entrar com Google" e "Entrar com Discord".
// Por enquanto a API principal (email/senha) funciona sem isso.

module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || ""
  },
  discord: {
    clientID: process.env.DISCORD_CLIENT_ID || "",
    clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    callbackURL: process.env.DISCORD_CALLBACK_URL || ""
  }
};
