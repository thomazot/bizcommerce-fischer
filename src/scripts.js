document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".fischer-2026-segments__box");

  boxes.forEach((box) => {
    const header = box.querySelector(".fischer-2026-segments__name");
    const content = box.querySelector(".fischer-2026-segments__content");

    header.addEventListener("click", () => {
      const isOpen = box.classList.contains("fischer-2026-segments__box--active");

      // Fecha todos os outros
      boxes.forEach((b) => {
        b.classList.remove("fischer-2026-segments__box--active");

        const h = b.querySelector(".fischer-2026-segments__name");
        const c = b.querySelector(".fischer-2026-segments__content");

        h.classList.remove("fischer-2026-segments__name--open");
        c.classList.remove("fischer-2026-segments__content--expanded");
      });

      // Abre o atual se estava fechado
      if (!isOpen) {
        box.classList.add("fischer-2026-segments__box--active");
        header.classList.add("fischer-2026-segments__name--open");
        content.classList.add("fischer-2026-segments__content--expanded");
      }
    });
  });
});