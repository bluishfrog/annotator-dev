async function loadDevlog() {
    try {
        const response = await fetch('/components/devlog.json');
        const data = await response.json();

        const container = document.getElementById('devlog-container');

        data.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('devlog-card');

            card.innerHTML = `
                <div class="devlog-header">
                    <span class="type ${item.type}">${item.type}</span>
                    <span class="status">${item.status}</span>
                </div>
                <h3>${item.description}</h3>
                <p class="notes">${item.notes}</p>
                <span class="date">${item.date}</span>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error('Failed to load devlog:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadDevlog);