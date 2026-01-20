function setMsg(text, ok = false) {
  const el = document.getElementById("msg");
  if (!el) return;
  el.style.color = ok ? "#10B981" : "#EF4444";
  el.textContent = text || "";
}

function getCart() {
  return JSON.parse(localStorage.getItem("lagteck_cart") || "[]");
}
function setCart(cart) {
  localStorage.setItem("lagteck_cart", JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((acc, it) => acc + (it.quantity || 0), 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = String(count);
}
function formatBRL(v) {
  return Number(v || 0).toFixed(2);
}

function productCard(item) {
  const stock = Number(item.stock || 0);
  const disabled = stock <= 0;

  // imagem opcional (se você preencher imageUrl no banco)
  const imgHtml = item.imageUrl
    ? `<img src="${item.imageUrl}" alt="${item.name}" style="width:100%;height:160px;object-fit:cover;border-radius:14px;margin-bottom:10px;">`
    : `<div style="width:100%;height:160px;border-radius:14px;margin-bottom:10px;background:linear-gradient(135deg,#2563EB,#0EA5E9);display:flex;align-items:center;justify-content:center;color:white;font-weight:1000;">
         <i class="fas fa-cube" style="font-size:44px;"></i>
       </div>`;

  return `
    <div style="background:#fff;border-radius:18px;box-shadow:0 12px 35px rgba(37,99,235,.15);padding:16px;border:2px solid #e2e8f0;">
      ${imgHtml}

      <div style="font-weight:1000;color:#0f172a;font-size:18px;">${item.name}</div>
      <div style="color:#475569;font-weight:800;margin-top:6px;min-height:44px;">
        ${item.description || "Gamepass Blox Fruits"}
      </div>

      <div style="margin-top:10px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div style="font-weight:1000;color:#0f172a;">
          Loja: <span style="color:#2563EB;">R$ ${formatBRL(item.priceReal)}</span>
          <div style="color:#64748b;font-weight:900;font-size:12px;">
            Robux: ${item.priceRobux ?? "—"}
          </div>
        </div>

        <div style="font-weight:1000;color:${disabled ? "#ef4444" : "#10B981"};">
          Estoque: ${stock}
        </div>
      </div>

      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn" style="flex:1;min-width:180px;background:${disabled ? "#94a3b8" : "#2563EB"};color:#fff;"
          ${disabled ? "disabled" : ""} onclick='addToCart("${item._id}", "${escapeQuotes(item.name)}", ${Number(item.priceReal || 0)})'>
          <i class="fas fa-cart-plus"></i> Adicionar
        </button>

        <button class="btn" style="background:#10B981;color:#fff;flex:1;min-width:180px;"
          ${disabled ? "disabled" : ""} onclick='buyNow("${item._id}", "${escapeQuotes(item.name)}", ${Number(item.priceReal || 0)})'>
          <i class="fas fa-bolt"></i> Comprar agora
        </button>
      </div>
    </div>
  `;
}

function escapeQuotes(str) {
  return String(str || "").replace(/"/g, '\\"').replace(/'/g, "\\'");
}

async function loadGamepasses() {
  try {
    setMsg("Carregando produtos...", true);
    const data = await api("/gamepass/list");
    const items = data.items || [];

    const box = document.getElementById("products");
    box.innerHTML = items.map(productCard).join("");

    setMsg(`Produtos carregados: ${items.length}`, true);
  } catch (e) {
    setMsg(e.message || "Erro ao carregar produtos.", false);
  }
}

function addToCart(gamepassId, name, priceReal) {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.gamepassId === gamepassId);

  if (idx >= 0) cart[idx].quantity += 1;
  else cart.push({ gamepassId, name, priceReal, quantity: 1 });

  setCart(cart);
  setMsg("Adicionado ao carrinho!", true);
}

function buyNow(gamepassId, name, priceReal) {
  addToCart(gamepassId, name, priceReal);
  window.location.href = "checkout.html";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadGamepasses();
});
