async function authRegister() {
  try {
    setMsg("msg", "Enviando...", true);
    const name = document.getElementById("name").value.trim();
    const discordId = document.getElementById("discordId").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    const data = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, discordId, email, password, password2 })
    });

    setMsg("msg", data.message || "Conta criada. Verifique seu e-mail.", true);

    // ajuda: preenche a caixa de verificação
    const ve = document.getElementById("verifyEmail");
    if (ve) ve.value = email;
  } catch (e) {
    setMsg("msg", e.message || "Erro no cadastro.", false);
  }
}

async function verifyEmailCode() {
  try {
    setMsg("msg", "Verificando...", true);
    const email = document.getElementById("verifyEmail").value.trim();
    const code = document.getElementById("verifyCode").value.trim();

    const data = await api("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code })
    });

    setMsg("msg", data.message || "Verificado! Agora faça login.", true);
  } catch (e) {
    setMsg("msg", e.message || "Erro ao verificar.", false);
  }
}

async function authLogin() {
  try {
    setMsg("msg", "Entrando...", true);
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem("lagteck_token", data.token);
    localStorage.setItem("lagteck_user", JSON.stringify(data.user || {}));

    setMsg("msg", "Login ok! Redirecionando...", true);
    setTimeout(() => (window.location.href = "dashboard.html"), 800);
  } catch (e) {
    setMsg("msg", e.message || "Erro no login.", false);
  }
}

function logout() {
  localStorage.removeItem("lagteck_token");
  localStorage.removeItem("lagteck_user");
  window.location.href = "login.html";
}

async function loadMe() {
  const token = localStorage.getItem("lagteck_token");
  if (!token) return (window.location.href = "login.html");

  try {
    const data = await api("/auth/me");
    const u = data.user;

    document.getElementById("userName").textContent = u.name;
    document.getElementById("userEmail").textContent = u.email;
    document.getElementById("balance").textContent = Number(u.balance || 0).toFixed(2);

    const discord = document.getElementById("discordId");
    const cpf = document.getElementById("cpf");
    if (discord) discord.value = u.discordId || "";
    if (cpf) cpf.value = u.cpf || "";
  } catch (e) {
    logout();
  }
}

async function saveProfile() {
  try {
    setMsg("msg", "Salvando...", true);
    const discordId = document.getElementById("discordId").value.trim();
    const cpf = document.getElementById("cpf").value.trim();

    const data = await api("/auth/update-profile", {
      method: "POST",
      body: JSON.stringify({ discordId, cpf })
    });

    setMsg("msg", data.message || "Atualizado!", true);
    document.getElementById("balance").textContent = Number(data.user.balance || 0).toFixed(2);
  } catch (e) {
    setMsg("msg", e.message || "Erro ao salvar.", false);
  }
}
