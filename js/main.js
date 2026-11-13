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