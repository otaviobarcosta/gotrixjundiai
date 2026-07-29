/* ============================================================
   GOTRIX JUNDIAÍ — main.js
   Preloader, cursor, header, menu, GSAP, cards, dataLayer
   ============================================================ */

window.dataLayer = window.dataLayer || [];
const isDesktop = window.matchMedia("(min-width: 821px)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- preloader ---------- */
(function preloader() {
  const pl = document.querySelector(".preloader");
  if (!pl) return;
  let disparado = false;
  const done = () => {
    if (disparado) return;
    disparado = true;
    pl.classList.add("done");
    document.dispatchEvent(new Event("gtx:ready"));
  };
  // tempo mínimo pra animação respirar + espera o load; teto de segurança de 2,5s
  const minimo = new Promise(r => setTimeout(r, 1100));
  const carregou = new Promise(r => {
    if (document.readyState === "complete") r();
    else window.addEventListener("load", r, { once: true });
  });
  Promise.all([minimo, carregou]).then(() => setTimeout(done, 120));
  setTimeout(done, 2500);
})();

/* ---------- custom cursor ---------- */
(function cursor() {
  if (!isDesktop || reduceMotion) return;
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", e => {
    ring.classList.toggle("hovering", !!e.target.closest("a, button"));
  });
})();

/* ---------- header scroll + mega-menu + menu mobile ---------- */
(function header() {
  const h = document.querySelector(".site-header");
  const onScroll = () => h && h.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // mega-menu (hover no desktop, clique como fallback)
  document.querySelectorAll(".nav-drop").forEach(drop => {
    const btn = drop.querySelector(".nav-drop-btn");
    let closeTimer;
    const open = () => { clearTimeout(closeTimer); drop.classList.add("open"); btn.setAttribute("aria-expanded", "true"); };
    const close = () => { drop.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
    if (window.matchMedia("(hover: hover)").matches) {
      drop.addEventListener("mouseenter", open);
      drop.addEventListener("mouseleave", () => { closeTimer = setTimeout(close, 180); });
    }
    btn.addEventListener("click", () => {
      drop.classList.contains("open") ? close() : open();
    });
    document.addEventListener("click", e => {
      if (!drop.contains(e.target)) close();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  });

  // hamburger animado + painel mobile
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".mobile-menu");
  toggle && toggle.addEventListener("click", () => {
    const isOpen = toggle.classList.toggle("open");
    panel.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
})();

/* ---------- magnetic buttons (desktop) ---------- */
(function magnetic() {
  if (!isDesktop || reduceMotion) return;
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.25;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });
})();

/* ---------- GSAP reveals ---------- */
document.addEventListener("gtx:ready", () => {
  const alvos = document.querySelectorAll(".reveal");
  const contadores = document.querySelectorAll("[data-count]");

  if (typeof gsap === "undefined" || reduceMotion) {
    alvos.forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
    contadores.forEach(el => { el.innerText = parseFloat(el.dataset.count).toLocaleString("pt-BR"); });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Reveals via IntersectionObserver: o navegador avisa quando o elemento
  // entra na tela, sem checar posição a cada quadro do scroll.
  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      gsap.to(e.target, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", overwrite: "auto" });
      o.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -12% 0px" });
  alvos.forEach(el => obs.observe(el));

  // contadores: mesmo mecanismo
  const obsNum = new IntersectionObserver((entradas, o) => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: parseFloat(el.dataset.count), duration: 2, ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate: function () {
          el.innerText = Math.floor(this.targets()[0].innerText).toLocaleString("pt-BR");
        }
      });
      o.unobserve(el);
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  contadores.forEach(el => obsNum.observe(el));
});

/* ---------- render de card de produto ---------- */
function cardHTML(p) {
  const media = p.img
    ? imgTag(p, `onerror="this.outerHTML='<span class=&quot;ph&quot;>${p.categoria}</span>'"`)
    : `<span class="ph">${p.categoria}</span>`;
  return `
  <article class="card reveal" data-cat="${p.categoria}">
    ${p.tag ? `<span class="card-tag">${p.tag}</span>` : ""}
    <a href="produto.html?id=${p.id}" class="card-media" aria-label="${p.nome}">${media}</a>
    <div>
      <span class="cat">${p.categoria}${p.cnh ? " · Exige CNH" : " · Sem CNH"}</span>
      <h3>${p.nome}</h3>
    </div>
    <div class="hud">
      <div class="hud-chip"><b>${p.velocidade}</b><small>km/h</small></div>
      <div class="hud-chip"><b>${p.autonomia}</b><small>km autonomia</small></div>
      <div class="hud-chip"><b>${p.potencia}</b><small>watts</small></div>
    </div>
    <div class="preco-row">
      <div class="preco"><small>A partir de</small><b>${formatPreco(p.preco)}</b></div>
      <a class="card-link" href="produto.html?id=${p.id}">Ver detalhes →</a>
    </div>
  </article>`;
}

/* ---------- dataLayer helper ---------- */
function trackWhats(origem, produto) {
  window.dataLayer.push({
    event: "whatsapp_click",
    origem: origem,
    produto: produto || "geral"
  });
}
document.addEventListener("click", e => {
  const a = e.target.closest("a[href*='wa.me']");
  if (a) trackWhats(a.dataset.origem || "site", a.dataset.produto || "geral");
});

/* ============================================================
   Cards de produto em 3D (efeito Aceternity, em JS puro)
   O card acompanha o mouse e as camadas internas ganham
   profundidade. Chame ativar3D(escopo) depois de renderizar.
   ============================================================ */
function ativar3D(escopo) {
  if (!isDesktop || reduceMotion) return;
  const raiz = escopo || document;
  raiz.querySelectorAll(".card:not([data-tilt])").forEach(card => {
    card.dataset.tilt = "1";
    // profundidades: foto na frente, preço logo atrás, texto ao fundo
    const camadas = [
      [card.querySelector(".card-media"), 34],
      [card.querySelector(".card-tag"), 20],
      [card.querySelector("h3")?.parentElement, 14],
      [card.querySelector(".hud"), 10],
      [card.querySelector(".preco-row"), 22]
    ].filter(([el]) => el);

    let raf = null, alvoX = 0, alvoY = 0, atualX = 0, atualY = 0, dentro = false;

    const loop = () => {
      atualX += (alvoX - atualX) * 0.18;
      atualY += (alvoY - atualY) * 0.18;
      card.style.transform =
        `perspective(1100px) translateY(${dentro ? -5 : 0}px) ` +
        `rotateY(${atualX.toFixed(2)}deg) rotateX(${atualY.toFixed(2)}deg)`;
      if (Math.abs(alvoX - atualX) > 0.01 || Math.abs(alvoY - atualY) > 0.01) {
        raf = requestAnimationFrame(loop);
      } else { raf = null; }
    };
    const anima = () => { if (!raf) raf = requestAnimationFrame(loop); };

    card.addEventListener("mouseenter", () => {
      dentro = true;
      card.classList.add("tilt-on");
      camadas.forEach(([el, z]) => { el.style.transform = `translateZ(${z}px)`; });
      anima();
    });
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      alvoX = (e.clientX - r.left - r.width / 2) / 40;
      alvoY = -(e.clientY - r.top - r.height / 2) / 40;
      anima();
    });
    card.addEventListener("mouseleave", () => {
      dentro = false;
      alvoX = 0; alvoY = 0;
      card.classList.remove("tilt-on");
      camadas.forEach(([el]) => { el.style.transform = "translateZ(0px)"; });
      anima();
    });
  });
}
