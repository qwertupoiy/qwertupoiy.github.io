document.addEventListener("DOMContentLoaded", () => {
  // 0. 주요 요소
  const mainWrapper = document.querySelector(".main-wrapper");
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.querySelector(".menu-btn");

  // mainWrapper 없으면 동작 안 함
  if (!mainWrapper) return;

  // 1. 사이드바에서 data-page 있는 링크들만 가져오기
  const sidebarLinks = document.querySelectorAll(".sidebar-menu a[data-page]");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const pageUrl = link.getAttribute("data-page");
      if (!pageUrl) return;

      // active 초기화
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // 페이지 fetch
      fetch(pageUrl)
        .then((res) => res.text())
        .then((html) => {
          mainWrapper.innerHTML = html;
          // 모바일일 경우 사이드바 닫기
          sidebar.classList.remove("active");
          document.body.classList.remove("menu-open");
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch(() => {
          mainWrapper.innerHTML =
            '<p style="color:#999; padding:20px;">❌ 페이지를 불러오지 못했습니다.</p>';
        });
    });
  });

  // 2. 모바일 햄버거 토글
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });
  }

  // 3. 메인 안의 Projects 카드에서 클릭했을 때도 fetch로 열기
  // (pages/projects/honestpick.html 같은 정적 조각을 불러오는 용도)
  document.addEventListener("click", (e) => {
    const projectLink = e.target.closest(".project-links a, .project-more");
    if (!projectLink) return;

    const url = projectLink.getAttribute("href");
    if (!url) return;

    e.preventDefault();

    fetch(url)
      .then((res) => res.text())
      .then((html) => {
        mainWrapper.innerHTML = html;
        window.scrollTo({ top: 0, behavior: "smooth" });
        sidebar.classList.remove("active");
        document.body.classList.remove("menu-open");
      })
      .catch(() => {
        mainWrapper.innerHTML =
          '<p style="color:#999; padding:20px;">❌ 프로젝트를 불러오지 못했습니다.</p>';
      });
  });
});
