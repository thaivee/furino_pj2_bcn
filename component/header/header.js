document.addEventListener("DOMContentLoaded", () => {
    fetch('./header/header.html')
        .then(response => {
            if (!response.ok) throw new Error("Error");
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error(error));
});