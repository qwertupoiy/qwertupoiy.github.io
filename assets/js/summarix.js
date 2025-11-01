// Summarix 페이지 전용 스크립트
(() => {
  const root = document.querySelector(".proj-summarix");
  if (!root) return;

  const backdrop = root.querySelector("#sxModalBackdrop");
  const modalImg = root.querySelector("#sxModalImg");
  const modalCaption = root.querySelector("#sxModalCaption");
  const btnClose = root.querySelector("#sxModalClose");

  let zoom = 1;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  function openModal(src, caption) {
    if (!backdrop) return;
    modalImg.src = src;
    modalCaption.textContent = caption || "";
    backdrop.style.display = "flex";
    zoom = 1;
    originX = 0;
    originY = 0;
    modalImg.style.transform = "none";
    modalImg.style.cursor = "zoom-in";
  }

  function closeModal() {
    if (!backdrop) return;
    backdrop.style.display = "none";
    zoom = 1;
    originX = 0;
    originY = 0;
    modalImg.style.transform = "none";
  }

  root.querySelectorAll(".preview-img").forEach((img) => {
    img.addEventListener("click", () => {
      openModal(img.src, img.dataset.caption);
    });
  });

  if (btnClose) btnClose.addEventListener("click", closeModal);

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop && backdrop.style.display === "flex") {
      closeModal();
    }
  });

  // 클릭으로 확대/축소
  modalImg.addEventListener("click", (e) => {
    if (isDragging) return;
    if (zoom === 1) {
      zoom = 2;
      modalImg.style.cursor = "grab";
    } else {
      zoom = 1;
      originX = 0;
      originY = 0;
      modalImg.style.cursor = "zoom-in";
    }
    modalImg.style.transform = `scale(${zoom}) translate(${originX}px, ${originY}px)`;
    e.stopPropagation();
  });

  // 드래그 이동
  modalImg.addEventListener("mousedown", (e) => {
    if (zoom === 1) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    modalImg.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;
    originX += dx;
    originY += dy;
    startX = e.clientX;
    startY = e.clientY;
    modalImg.style.transform = `scale(${zoom}) translate(${originX}px, ${originY}px)`;
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    if (zoom > 1) {
      modalImg.style.cursor = "grab";
    }
  });
})();
