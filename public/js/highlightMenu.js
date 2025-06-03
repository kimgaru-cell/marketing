document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split("/").pop(); // 예: index.html
  const links = document.querySelectorAll('.menu-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPage === href) {
      link.classList.add('active-menu');
    }
  });
});
