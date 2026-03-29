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

            // Desktop 
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


function togglePreviewMode(e) {
    const isCode = e.target.checked;

    document.getElementById("annotation-preview-output").style.display =
        isCode ? "block" : "none";

    document.getElementById("annotation-preview-rendered").style.display =
        isCode ? "none" : "block";
}


// annotation preview
async function copyToClipboard() {
    try {
        const preview = document.getElementById('annot-preview-frame');
        const htmlContent = preview.innerHTML.trim();

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(htmlContent);
        } else {
            // fallback
            const textarea = document.createElement('textarea');
            textarea.value = htmlContent;

            // prevent scrolling
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';

            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            document.execCommand('copy');

            document.body.removeChild(textarea);
        }

        showToast("Copied to clipboard :)", "success");

    } catch (err) {
        console.error(err);
        showToast("Failed copying :(", "error");
    }
}

// annotation preview toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('annot-preview-mode-toggle');
    const preview = document.getElementById('annot-preview-frame');

    toggle.addEventListener('change', () => {

        if (toggle.checked) {
            preview.classList.add('code-mode');
            preview.textContent = annotRawHTML;
            
        } else {
            preview.classList.remove('code-mode');
            preview.innerHTML = annotRawHTML;
        }

    });
});


