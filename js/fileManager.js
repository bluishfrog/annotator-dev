let currentHTMLFileHandle = null;

async function assignHTMLFile() {
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            multiple: false,
            types: [
                {
                    description: 'HTML Files',
                    accept: {
                        'text/html': ['.html', '.htm']
                    }
                }
            ]
        });

        currentHTMLFileHandle = fileHandle;

        const file = await fileHandle.getFile();
        const text = await file.text();

        document.getElementById("HTMLFile").textContent = file.name;

        loadHTMLIntoPreview(text);
        loadAnnotPreview(text);

    } catch (err) {
        console.log("File selection cancelled or failed:", err);
    }
}

function loadHTMLIntoPreview(htmlContent) {

    originalHTMLContent = htmlContent;

    window.originalHTMLContent = originalHTMLContent;
    window.currentHTMLFileHandle = currentHTMLFileHandle;

    const previewRoot = document.getElementById('preview-frame');

    previewRoot.innerHTML = `<div id="htmlpreview">${htmlContent}</div>`;

    initAnnotationSystem();
}

async function loadAnnotPreviewTest() {

    try {

        const annotHTML = constructAnnotHTML(htmlContent)

        const response = await fetch('components/testannotfile.html');
        const html = await response.text();
        const previewRoot = document.getElementById('annot-preview-frame');

        annotRawHTML = html;
        annotRawHTML = annotRawHTML.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

        previewRoot.innerHTML = html

    } catch (err) {
        console.error('Failed to load test annot file:', err);
    }

}