async function loadDevlog() {
    try {
        const response = await fetch('components/devlog.json');
        const data = await response.json();

        const container = document.getElementById('devlog-container');

        const order = {
            bug: 0,
            feature: 1,
            fix: 2
        };

        data.items.sort((a, b) => order[a.type] - order[b.type]);

        data.items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('devlog-card', item.type);

            card.innerHTML = `
                <div class="devlog-header">
                    <div class="devlog-title">
                        <span class="type ${item.type}">${item.type}</span>
                        <h3 class="devlog-title">${item.description}</h3>
                    </div>
                    <span class="date">${item.date}</span>
                </div>

                <p class="devlog-notes">${item.notes}</p>

                <div class="devlog-footer">
                    <span class="status">${item.status}</span>

                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error('Failed to load devlog:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadDevlog);