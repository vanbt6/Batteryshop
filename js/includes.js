// js/includes.js
document.addEventListener("DOMContentLoaded", () => {
    const rutaBase = location.pathname.includes('/pages/') ? '../' : './';

    // Cargar Header
    fetch(`${rutaBase}components/header.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;

            // Cargar script del navbar después de insertar el header
            const script = document.createElement("script");
            script.src = `${rutaBase}js/menu.js`;
            document.body.appendChild(script);
        });

    // Cargar Footer
    fetch(`${rutaBase}components/footer.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        });
});
