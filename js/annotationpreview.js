async function copyToClipboard() {
    try {
        const preview = document.getElementById('annot-preview-frame');
        const htmlContent = preview.innerHTML.trim();

        if (navigator.clipboard && window.isSecureContext) {
            // modern way
            await navigator.clipboard.writeText(htmlContent);
        } else {
            // fallback (works almost everywhere)
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

        showToast("Copied to clipboard :)");

    } catch (err) {
        console.error(err);
        showToast("Failed copying :(");
    }
}


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


