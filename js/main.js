// Menú en celular
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

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