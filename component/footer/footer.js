document.addEventListener("DOMContentLoaded", () => {
    fetch('./component/footer/footer.html')
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

    const scripts = document.querySelectorAll('script[data-footer-base]');
    if (scripts.length > 0) {
        const basePath = scripts[scripts.length - 1].getAttribute('data-footer-base');
    }
});