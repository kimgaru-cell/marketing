document.addEventListener('DOMContentLoaded', function () {
  // 메뉴 HTML을 비동기로 불러와서 삽입
  fetch('/menu.html')
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById('menu-container');
      if (!container) return;

      container.innerHTML = html;

      // 현재 페이지 파일명
      const currentPath = window.location.pathname.split('/').pop();

      // 활성 메뉴 표시
      document.querySelectorAll('#menu-container .menu-link').forEach(link => {
        const linkPath = link.getAttribute('href');

        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
          link.classList.add('text-indigo-600', 'bg-indigo-50', 'rounded-md', 'font-medium');
        } else {
          link.classList.add('text-gray-700', 'hover:text-indigo-600', 'font-medium', 'transition', 'rounded-md', 'hover:bg-indigo-50');
        }
      });

      // 햄버거 메뉴 토글
      const toggleBtn = document.getElementById('menu-toggle');
      const menu = document.getElementById('menu');
      if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', function () {
          menu.classList.toggle('menu-open');
          toggleBtn.classList.toggle('open'); // 햄버거 → X
        });
      }

      // 입력창 자동 포커스 & 초기화 (존재할 때만)
      const urlInput = document.getElementById('url-input');
      if (urlInput) {
        urlInput.focus();
        urlInput.value = '';
      }
    });
});
