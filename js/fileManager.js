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

function loadAnnotPreview(htmlContent) {

    originalHTMLContent = htmlContent;

    formattedAnnots = buildAnnotationPreview(originalHTMLContent);

    window.formattedAnnots = formattedAnnots;

    const previewRoot = document.getElementById('annot-preview-frame');

    previewRoot.innerHTML = formattedAnnots;
}