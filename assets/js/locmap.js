/* ============================================================
   GOTRIX JUNDIAÍ — locmap.js
   Card de localização expansível com Google Maps real.
   Uso: <div data-locmap></div> em qualquer página.
   Endereço vem do ENDERECO em data.js.
   ============================================================ */

(function locMapComponent() {
  const alvos = document.querySelectorAll("[data-locmap]");
  if (!alvos.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fino = window.matchMedia("(hover: hover)").matches;
  const end = enderecoCompleto();
  const q = encodeURIComponent(end);

  alvos.forEach(alvo => {
    alvo.classList.add("locmap-wrap");
    alvo.innerHTML = `
      <div class="locmap" role="button" tabindex="0" aria-label="Ver mapa da loja">
        <div class="lm-grid"></div>
        <div class="lm-map"></div>
        <div class="lm-top">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
          <span class="lm-status"><i></i>Gotrix Jundiaí</span>
        </div>
        <div class="lm-info">
          <b>${ENDERECO.rua} · ${ENDERECO.bairro}</b>
          <small>${ENDERECO.cidade} · ${ENDERECO.cep}</small>
          <div class="lm-under"></div>
        </div>
        <a class="lm-rota" href="https://www.google.com/maps/dir/?api=1&destination=${q}" target="_blank" rel="noopener" data-origem="mapa">Como chegar →</a>
        <button class="lm-fechar" aria-label="Fechar mapa">×</button>
      </div>
      <div class="lm-hint">Clique para expandir o mapa</div>`;

    const card = alvo.querySelector(".locmap");
    const mapBox = alvo.querySelector(".lm-map");
    const fechar = alvo.querySelector(".lm-fechar");
    let mapaCarregado = false;

    function abrir() {
      if (card.classList.contains("expanded")) return;
      card.classList.add("expanded");
      alvo.classList.add("expanded");
      if (!mapaCarregado) {
        mapBox.innerHTML = `<iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=${q}&output=embed" title="Mapa da loja"></iframe>`;
        mapaCarregado = true;
      }
      card.style.transform = "";
    }
    function fecharMapa(e) {
      e.stopPropagation();
      card.classList.remove("expanded");
      alvo.classList.remove("expanded");
    }
    card.addEventListener("click", e => { if (!e.target.closest(".lm-fechar, .lm-rota")) abrir(); });
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });
    fechar.addEventListener("click", fecharMapa);

    if (fino && !reduce) {
      let rx = 0, ry = 0, tx = 0, ty = 0, ativo = false;
      card.addEventListener("mousemove", e => {
        if (card.classList.contains("expanded")) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const py = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        tx = py * -8; ty = px * 8;
        if (!ativo) { ativo = true; loop(); }
      });
      card.addEventListener("mouseleave", () => { tx = 0; ty = 0; });
      function loop() {
        rx += (tx - rx) * 0.12; ry += (ty - ry) * 0.12;
        if (!card.classList.contains("expanded")) {
          card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        }
        if (Math.abs(rx - tx) > 0.01 || Math.abs(ry - ty) > 0.01 || tx !== 0 || ty !== 0) {
          requestAnimationFrame(loop);
        } else { ativo = false; card.style.transform = ""; }
      }
    }
  });
})();
