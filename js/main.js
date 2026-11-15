// Menú en celular
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const backdrop = document.getElementById("navBackdrop");
const menuLabels = {
  open: menuBtn.getAttribute("aria-label"),
  close: menuBtn.dataset.closeLabel || (document.documentElement.lang === "en" ? "Close menu" : "Cerrar menú"),
};

const setMenu = (open) => {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? menuLabels.close : menuLabels.open);
  if (backdrop) backdrop.hidden = !open;
};

menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

// Tocar fuera del menú (o la tecla Escape) lo cierra
document.addEventListener("click", (e) => {
  if (nav.classList.contains("open") && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    setMenu(false);
    menuBtn.focus();
  }
});
// Si se agranda la pantalla con el menú abierto, se cierra
window.matchMedia("(min-width: 801px)").addEventListener("change", (e) => e.matches && setMenu(false));

// Año del footer
document.getElementById("year").textContent = new Date().getFullYear();

// Transición suave entre páginas
document.querySelectorAll("a[data-transition]").forEach((link) =>
  link.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => (window.location.href = link.href), 300);
  })
);
window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));

// Trayectoria: barra fija y una sección a la vez
const tabsBar = document.getElementById("tabs");
if (tabsBar) {
  const header = document.querySelector(".header");
  const links = [...tabsBar.querySelectorAll("a")];
  const sections = [...document.querySelectorAll("#trayectoria .block")];
  const ids = sections.map((s) => s.id);

  const setSizes = () => {
    const root = document.documentElement.style;
    root.setProperty("--header-h", header.offsetHeight + "px");
    root.setProperty("--tabs-h", tabsBar.offsetHeight + "px");
  };
  setSizes();
  window.addEventListener("resize", setSizes);

  // scrollMode: "force" siempre baja a la sección, "click" solo si la barra ya está fija, false no mueve
  const show = (id, scrollMode) => {
    sections.forEach((s) => s.classList.toggle("active", s.id === id));
        links.forEach((l) => {
      const on = l.getAttribute("href") === "#" + id;
      l.classList.toggle("active", on);
      if (on) {
        l.setAttribute("aria-current", "true");
        const left = l.offsetLeft - (tabsBar.clientWidth - l.offsetWidth) / 2;
        tabsBar.scrollTo({ left: left, behavior: "smooth" });
      } else {
        l.removeAttribute("aria-current");
      }
    });

    const stuck = tabsBar.getBoundingClientRect().top <= header.offsetHeight + 1;
    if (scrollMode === "force" || (scrollMode === "click" && stuck)) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  links.forEach((l) =>
    l.addEventListener("click", (e) => {
      e.preventDefault();
      const id = l.getAttribute("href").slice(1);
      history.replaceState(null, "", "#" + id);
      show(id, "click");
    })
  );

  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (ids.includes(id)) show(id, "force");
  });

  const start = location.hash.slice(1);
  if (ids.includes(start)) show(start, "force");
  else show(ids[0], false);
}

// Tarjetas que se dan vuelta
document.querySelectorAll(".flip").forEach((btn) =>
  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", String(!on));
  })
);

// Barra fija de reserva: se muestra después de la portada y se oculta en Contacto
const stickyCta = document.getElementById("stickyCta");
if (stickyCta && "IntersectionObserver" in window) {
  const ctaLink = stickyCta.querySelector("a");
  const watched = [document.getElementById("inicio"), document.getElementById("contacto")];
  const inView = new Set();
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)));
    const show = inView.size === 0;
    stickyCta.classList.toggle("visible", show);
    stickyCta.setAttribute("aria-hidden", String(!show));
    ctaLink.tabIndex = show ? 0 : -1;
  });
  watched.forEach((el) => obs.observe(el));
}

// Email armado por partes para evitar que lo rastreen los robots de spam
const user = "ivo.flores12";      // la parte antes de la @
const domain = "gmail.com";
document.querySelectorAll("[data-mail]").forEach((el) => {
  const address = user + "@" + domain;
  el.href = "mailto:" + address;
  if (el.hasAttribute("data-show")) el.textContent = address;
});