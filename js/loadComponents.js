// ---------- Load Component Function ----------
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Run post-load hooks for specific components
            if (id === "nav-placeholder") {
                initNavDropdowns();
                initThemeToggle();
            }
        });
}


// ---------- Components ----------
loadComponent("nav-placeholder", "components/nav.html");
loadComponent("footer-placeholder", "components/footer.html");
loadComponent("head-placeholder", "components/head.html");