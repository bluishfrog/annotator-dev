async function loadDevlog() {
    try {
        const response = await fetch('/components/devlog.json');
        const data = await response.json();

        const container = document.getElementById('devlog-container');

        data.items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('devlog-card', item.type);

            card.innerHTML = `
                <div class="devlog-header">
                    <span class="type ${item.type}">${item.type}</span>
                    <span class="status">${item.status}</span>
                </div>

                <h3 class="devlog-title">${item.description}</h3>

                <p class="devlog-notes">${item.notes}</p>

                <div class="devlog-footer">
                    <span class="date">${item.date}</span>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error('Failed to load devlog:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadDevlog);