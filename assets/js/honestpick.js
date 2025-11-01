// HonestPick 페이지 전용 스크립트
(() => {
  const root = document.querySelector(".proj-honestpick");
  if (!root) return;

  const backdrop = root.querySelector("#hpModalBackdrop");
  const modalImg = root.querySelector("#hpModalImg");
  const modalCaption = root.querySelector("#hpModalCaption");
  const btnClose = root.querySelector("#hpModalClose");

  // 확대 관련 상태
  let zoom = 1;           // 1 or 2
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  // 모달 열기
  function openModal(src, caption) {
    if (!backdrop) return;
    modalImg.src = src;
    modalCaption.textContent = caption || "";
    backdrop.style.display = "flex";

    // 초기화
    zoom = 1;
    originX = 0;
    originY = 0;
    modalImg.style.transform = "none";
    modalImg.style.cursor = "zoom-in";
  }

  // 모달 닫기
  function closeModal() {
    if (!backdrop) return;
    backdrop.style.display = "none";
    zoom = 1;
    originX = 0;
    originY = 0;
    modalImg.style.transform = "none";
  }

  // 섬네일 클릭 → 모달 열기
  root.querySelectorAll(".preview-img").forEach((img) => {
    img.addEventListener("click", () => {
      openModal(img.src, img.dataset.caption);
    });
  });

  // 닫기 버튼
  if (btnClose) {
    btnClose.addEventListener("click", closeModal);
  }

  // 배경 클릭 시 닫기
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  // ESC 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop && backdrop.style.display === "flex") {
      closeModal();
    }
  });

  // 이미지 클릭으로 확대/축소
  modalImg.addEventListener("click", (e) => {
    // 드래그 끝나고 mouseup 직후 click이 들어오는 경우 방지
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

  // 마우스로 드래그해서 이동
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
