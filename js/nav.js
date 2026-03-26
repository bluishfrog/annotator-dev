function toggleMenu(button) {
    const nav = button.closest('.nav-content');
    event.stopPropagation();
    nav.classList.toggle('menu-open');
}

document.addEventListener('click', function (event) {
    const nav = document.querySelector('.nav-content');
    const isClickInside = nav.contains(event.target);

    if (!isClickInside) {
        nav.classList.remove('menu-open');
    }
});