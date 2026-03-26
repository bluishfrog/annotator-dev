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
