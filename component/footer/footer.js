document.addEventListener("DOMContentLoaded", () => {
    fetch('./footer/footer.html')
        .then(response => {
            if (!response.ok) throw new Error("Error");
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error(error));
});