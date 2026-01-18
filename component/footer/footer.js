function loadFooter(basePath = '') {
    const footerPath = basePath ? `${basePath}/component/footer/footer.html` : './footer/footer.html';
    fetch(footerPath)
        .then(response => {
            if (!response.ok) throw new Error("Error loading footer");
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
            }
        })
        .catch(error => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => {
    // Auto-load if basePath is set via data attribute on script tag
    const scripts = document.querySelectorAll('script[data-footer-base]');
    if (scripts.length > 0) {
        const basePath = scripts[scripts.length - 1].getAttribute('data-footer-base');
        loadFooter(basePath);
    }
});