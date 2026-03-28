async function loadAnnotPreviewTest() {

    try {
        const response = await fetch('components/testannotfile.html');
        const html = await response.text();
        const previewRoot = document.getElementById('annot-preview-frame');

        previewRoot.innerHTML = html

    } catch (err) {
        console.error('Failed to load test annot file:', err);
    }

}

document.addEventListener('DOMContentLoaded', loadAnnotPreviewTest);