/* ============================================================
   GOTRIX JUNDIAÍ — layout.js
   Header com mega-menu, hamburger animado, footer e floats.
   ============================================================ */

const ICONS = {
  scooter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M15 6h2l2.5 11"/><path d="M8 17.5h8"/><path d="M5.5 15V9a3 3 0 0 1 3-3H11"/></svg>`,
  bike: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>`,
  trike: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="4.5" cy="17.5" r="2.5"/><circle cx="19.5" cy="17.5" r="2.5"/><circle cx="12" cy="17.5" r="2.5"/><path d="M12 15V8m0 0h4l2 7M12 8H8"/></svg>`,
  kick: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 18h8M14 4h2a2 2 0 0 1 2 1.6L19.5 16"/></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z"/></svg>`,
  compare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v18M16 3v18M3 8h5M3 16h5m8-8h5m-5 8h5"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
};

const MENU_CATS = [
  { icon: "scooter", title: "Scooters", desc: "De 32 a 75 km/h, com e sem CNH", href: "veiculos.html?cat=Scooter" },
  { icon: "bike", title: "Bikes elétricas", desc: "Pedal assistido e até 100 km", href: "veiculos.html?cat=Bike" },
  { icon: "trike", title: "Triciclos", desc: "Estabilidade total, opções PCD", href: "veiculos.html?cat=Triciclo" },
  { icon: "kick", title: "Patinetes", desc: "A porta de entrada elétrica", href: "veiculos.html?cat=Patinete" }
];

(function injectLayout() {
  const page = document.body.dataset.page || "";

  const megaCats = MENU_CATS.map(c => `
    <a href="${c.href}" class="mm-item">
      <span class="mm-icon">${ICONS[c.icon]}</span>
      <span class="mm-txt"><b>${c.title}</b><small>${c.desc}</small></span>
    </a>`).join("");

  const megaDestaques = ["sport-pro", "x11-3000", "bike-v8-pro-s"].map(id => {
    const p = getProduto(id);
    return `<a href="produto.html?id=${p.id}" class="mm-mini">
      <b>${p.nome}</b>
      <span>${formatPreco(p.preco)}</span>
    </a>`;
  }).join("");

  const header = `
  <div class="preloader" aria-label="Carregando">
    <div class="pl-moto">
      <svg viewBox="0 0 126 74" fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
        <g class="pl-speed">
          <line x1="2" y1="26" x2="20" y2="26"/>
          <line x1="-2" y1="38" x2="18" y2="38"/>
          <line x1="4" y1="50" x2="20" y2="50"/>
        </g>
        <circle class="pl-wheel-tire" cx="30" cy="60" r="11"/>
        <circle class="pl-wheel-rim tras" cx="30" cy="60" r="6"/>
        <circle class="pl-wheel-tire" cx="96" cy="60" r="11"/>
        <circle class="pl-wheel-rim frente" cx="96" cy="60" r="6"/>
        <path stroke="#101013" d="M41 52h34"/>
        <path stroke="#101013" d="M75 52 90 20"/>
        <path stroke="#101013" d="M84 18h13"/>
        <path stroke="#101013" d="M41 52c-6 0-9-5-9-10"/>
      </svg>
      <div class="pl-road"></div>
    </div>
  </div>

  <header class="site-header">
    <nav class="nav-shell">
      <div class="nav-left">
        <a href="index.html" class="logo">GO<span class="volt">TRIX</span> <span class="city">JUNDIAÍ</span></a>
        <div class="nav-links">
          <a href="index.html" class="${page === "home" ? "active" : ""}">Home</a>
          <div class="nav-drop ${page === "veiculos" ? "active-parent" : ""}">
            <button class="nav-drop-btn ${page === "veiculos" ? "active" : ""}" aria-expanded="false">
              Veículos
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div class="mega-menu">
              <div class="mm-grid">
                <div class="mm-col">${megaCats}</div>
                <div class="mm-col mm-side">
                  <span class="mm-label">Em destaque</span>
                  ${megaDestaques}
                  <a href="veiculos.html" class="mm-all">Ver todos os modelos →</a>
                </div>
              </div>
            </div>
          </div>
          <a href="comparador.html" class="${page === "comparador" ? "active" : ""}">Comparador</a>
          <a href="contato.html" class="${page === "contato" ? "active" : ""}">Contato</a>
        </div>
      </div>
      <div class="nav-right">
        <a href="${whatsLink()}" target="_blank" rel="noopener" class="nav-cta" data-origem="header">Falar no WhatsApp</a>
        <button class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menu">
          <svg class="mt-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path class="mt-path" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"/>
            <path d="M7 16 27 16"/>
          </svg>
        </button>
      </div>
    </nav>
  </header>

  <div class="mobile-menu" id="mobile-menu">
    <div class="mob-inner">
      <span class="mm-label">Veículos</span>
      ${megaCats}
      <span class="mm-label" style="margin-top:18px;">Navegue</span>
      <a href="comparador.html" class="mm-item"><span class="mm-icon">${ICONS.compare}</span><span class="mm-txt"><b>Comparador</b><small>Até 3 modelos lado a lado</small></span></a>
      <a href="contato.html" class="mm-item"><span class="mm-icon">${ICONS.chat}</span><span class="mm-txt"><b>Contato</b><small>Endereço, horários e canais</small></span></a>
      <div class="mob-ctas">
        <a href="veiculos.html" class="btn btn-ghost">Ver catálogo</a>
        <a href="${whatsLink()}" target="_blank" rel="noopener" class="btn btn-volt" data-origem="menu_mobile">Falar no WhatsApp</a>
      </div>
    </div>
  </div>`;

  const footer = `
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo">GO<span class="volt">TRIX</span> <span class="city">JUNDIAÍ</span></a>
        <p>Loja autorizada Gotrix em Jundiaí. Scooters, bikes e triciclos elétricos com garantia, suporte e manutenção especializada.</p>
      </div>
      <div>
        <h5>Veículos</h5>
        <ul>
          <li><a href="veiculos.html?cat=Scooter">Scooters elétricas</a></li>
          <li><a href="veiculos.html?cat=Bike">Bikes elétricas</a></li>
          <li><a href="veiculos.html?cat=Triciclo">Triciclos</a></li>
          <li><a href="veiculos.html?cat=Patinete">Patinetes</a></li>
        </ul>
      </div>
      <div>
        <h5>Navegue</h5>
        <ul>
          <li><a href="comparador.html">Comparador</a></li>
          <li><a href="contato.html">Contato</a></li>
          <li><a href="contato.html#local">Como chegar</a></li>
        </ul>
      </div>
      <div>
        <h5>Atendimento</h5>
        <ul>
          <li><a href="${whatsLink()}" target="_blank" rel="noopener" data-origem="footer">WhatsApp</a></li>
          <li><a href="https://www.instagram.com/gotrixoficial" target="_blank" rel="noopener">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} Gotrix Jundiaí</span>
      <span>Mobilidade elétrica · Jundiaí, SP</span>
    </div>
  </footer>

  <a class="wa-float" href="${whatsLink()}" target="_blank" rel="noopener" aria-label="WhatsApp" data-origem="float">
    <svg viewBox="0 0 32 32"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.6.8 5 2.3 7L4 29l7.2-2.3c1.5.8 3.1 1.2 4.8 1.2 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.5 0-3-.4-4.3-1.2l-.3-.2-4.3 1.4 1.4-4.1-.2-.3C7 19 6.2 17 6.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8zm5.4-7.3c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>
  </a>

  <div class="sticky-cta">
    <a class="btn btn-volt" href="${whatsLink()}" target="_blank" rel="noopener" data-origem="sticky_mobile">Falar com a loja agora</a>
  </div>`;

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);
})();
