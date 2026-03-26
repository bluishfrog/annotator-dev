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


function initNavDropdowns() {
    const isMobile = window.matchMedia("(max-width: 700px)").matches;

    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        let tappedOnce = false;

        btn.addEventListener('click', e => {
            const menu = btn.nextElementSibling;
            if (!menu) return;

            // Desktop → allow normal navigation
            if (!isMobile) return;

            // Mobile behavior
            if (!tappedOnce) {
                e.preventDefault(); // stop navigation on first tap
                menu.style.display = 'block';
                tappedOnce = true;
            } else {
                // second tap → allow navigation
                tappedOnce = false;
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', e => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            const toggle = menu.previousElementSibling;

            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.style.display = 'none';

                // reset tap state
                toggle._tappedOnce = false;
            }
        });
    });
}