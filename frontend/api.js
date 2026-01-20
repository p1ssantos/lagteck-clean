// Troque aqui quando subir o backend
const API_BASE = "https://lagteck-backend.onrender.com/api";

async function api(path, opts = {}) {
  const token = localStorage.getItem("lagteck_token") || "";
  const headers = Object.assign(
    { "Content-Type": "application/json" },
    opts.headers || {},
    token ? { Authorization: `Bearer ${token}` } : {}
  );

  const res = await fetch(API_BASE + path, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.message || "Erro na requisição.";
    throw new Error(msg);
  }
  return data;
}

function setMsg(id, text, ok = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.color = ok ? "#10B981" : "#EF4444";
  el.textContent = text;
}

function comingSoon(name) {
  alert(`${name} será ativado quando você configurar OAuth/Checkout Pro certinho.`);
}
