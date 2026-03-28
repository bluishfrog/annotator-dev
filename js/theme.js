function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const root = document.documentElement;

    if (!toggleBtn) return; 

    // Load saved theme or system preference
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        root.setAttribute("data-theme", savedTheme);
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }

    // event listener
    toggleBtn.addEventListener("click", () => {
        const current = root.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";

        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });
}