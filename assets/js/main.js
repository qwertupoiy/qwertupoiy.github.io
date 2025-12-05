document.addEventListener("DOMContentLoaded", () => {
  const mainWrapper = document.querySelector(".main-wrapper");
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.querySelector(".menu-btn");

  if (!mainWrapper) return;

  // 페이지용 CSS 로드
  function loadPageCss(pageUrl) {
    // 기존 페이지 css 제거
    document.querySelectorAll('link[data-page-style]').forEach((link) => link.remove());

    if (!pageUrl) return;

    const fileName = pageUrl.split("/").pop(); // honestpick.html
    const pageName = fileName ? fileName.replace(".html", "") : "";

    if (!pageName || pageName === "index") return;

    const cssHref = `assets/css/${pageName}.css`;
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = cssHref;
    linkEl.dataset.pageStyle = pageName;
    document.head.appendChild(linkEl);
  }

  // 페이지용 JS 로드
  function loadPageScript(pageUrl) {
    // 기존 페이지 스크립트 제거
    document.querySelectorAll('script[data-page-script]').forEach((s) => s.remove());

    if (!pageUrl) return;

    const fileName = pageUrl.split("/").pop();
    const pageName = fileName ? fileName.replace(".html", "") : "";

    if (!pageName || pageName === "index") return;

    const jsSrc = `assets/js/${pageName}.js`;

    const scriptEl = document.createElement("script");
    scriptEl.src = jsSrc;
    scriptEl.dataset.pageScript = pageName;
    document.body.appendChild(scriptEl);
  }

  // 사이드바 링크
  const sidebarLinks = document.querySelectorAll(".sidebar-menu a[data-page]");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const pageUrl = link.getAttribute("data-page");
      if (!pageUrl) return;

      sidebarLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      fetch(pageUrl)
        .then((res) => res.text())
        .then((html) => {
          mainWrapper.innerHTML = html;
          loadPageCss(pageUrl);
          loadPageScript(pageUrl);

          sidebar.classList.remove("active");
          document.body.classList.remove("menu-open");
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch(() => {
          mainWrapper.innerHTML =
            '<p style="color:#999; padding:20px;">❌ 페이지를 불러오지 못했습니다.</p>';
          loadPageCss(null);
          loadPageScript(null);
        });
    });
  });

  // 모바일 토글
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });
  }

  // 메인 카드 클릭해서 프로젝트 여는 경우
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
        loadPageCss(url);
        loadPageScript(url);

        window.scrollTo({ top: 0, behavior: "smooth" });
        sidebar.classList.remove("active");
        document.body.classList.remove("menu-open");
      })
      .catch(() => {
        mainWrapper.innerHTML =
          '<p style="color:#999; padding:20px;">❌ 프로젝트를 불러오지 못했습니다.</p>';
        loadPageCss(null);
        loadPageScript(null);
      });
  });
});

// ------------------------------
// 테마 토글 (라이트 / 다크)
// ------------------------------
(() => {
  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;

  const STORAGE_KEY = "theme";
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.classList.add("dark");
      btn.textContent = "☼"; // 다크일 때는 "라이트로 전환" 느낌
      btn.setAttribute("aria-label", "라이트 모드로 전환");
    } else {
      root.classList.remove("dark");
      btn.textContent = "◑"; // 라이트일 때는 "다크로 전환" 느낌
      btn.setAttribute("aria-label", "다크 모드로 전환");
    }
  }

  // 1) localStorage에 저장된 테마 우선
  let saved = localStorage.getItem(STORAGE_KEY);

  // 2) 없으면 시스템 설정 따라감
  if (!saved) {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    saved = prefersDark ? "dark" : "light";
  }

  applyTheme(saved);

  // 클릭 시 토글
  btn.addEventListener("click", () => {
    const isDark = root.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });
})();
