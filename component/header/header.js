function loadHeader(basePath = '') {
    const headerPath = basePath ? `${basePath}/component/header/header.html` : './header/header.html';
    fetch(headerPath)
        .then(response => {
            if (!response.ok) throw new Error("Error loading header");
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
            }
        })
        .catch(error => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => {
    // Auto-load if basePath is set via data attribute on script tag
    const scripts = document.querySelectorAll('script[data-header-base]');
    if (scripts.length > 0) {
        const basePath = scripts[scripts.length - 1].getAttribute('data-header-base');
        loadHeader(basePath);
    }
});