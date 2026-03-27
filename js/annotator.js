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