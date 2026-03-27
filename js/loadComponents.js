// ---------- Load Component Function ----------
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Run post-load hooks for specific components
            if (id === "nav-placeholder") {
                initNavDropdowns();
            }
        });
}


// ---------- Components ----------
loadComponent("nav-placeholder", "components/nav.html");
loadComponent("footer-placeholder", "components/footer.html");
loadComponent("head-placeholder", "components/head.html");
loadComponent("preview-ao3-style-placeholder", "components/ao3_preview_style.html");
loadComponent("default-annot-format", "components/defaultannotformat.html");