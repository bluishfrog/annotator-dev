function switchTab(event, tabId) {
    const card = event.target.closest('.tabbed-card');

    // Remove active from buttons
    card.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Hide all panes
    card.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // Activate clicked tab
    event.target.classList.add('active');
    card.querySelector(`#${tabId}`).classList.add('active');
}


function switchTabSelect(selectElement) {
    const card = selectElement.closest('.tabbed-card');
    const tabId = selectElement.value;

    // Hide all panes
    card.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // Remove active from buttons
    card.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    card.querySelector(`#${tabId}`).classList.add('active');

    // Sync desktop tab highlight
    const matchingButton = card.querySelector(`[onclick*="${tabId}"]`);
    if (matchingButton) {
        matchingButton.classList.add('active');
    }
}


function toggleBuilderPanel() {
    
    document.querySelector('.level1-container')
        .classList.toggle('collapsed');

    document.querySelector('.collapse-button')
        .classList.toggle('collapsed');
}

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


function toggleMenu(button) {
    const nav = button.closest('.nav-content');
    nav.classList.toggle('menu-open');
}
