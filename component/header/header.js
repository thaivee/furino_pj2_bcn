document.addEventListener("DOMContentLoaded", () => {
    fetch('./component/header/header.html')
        .then(response => {
            if (!response.ok) throw new Error("Error loading header");
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
                initMobileMenu();
            }
        })
        .catch(error => console.error(error));


    const scripts = document.querySelectorAll('script[data-header-base]');
    if (scripts.length > 0) {
        const basePath = scripts[scripts.length - 1].getAttribute('data-header-base');
        if (typeof loadHeader === 'function') {
            loadHeader(basePath);
        }
    }
});

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('.button');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                menuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}