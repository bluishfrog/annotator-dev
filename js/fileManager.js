let currentHTMLFileHandle = null;

function isChromium() {
    return !!window.chrome;
}

async function assignHTMLFile() {

    if (!isChromium()) {
        showToast("Error: Please use a Chromium-based browser (DuckDuckGo, Chrome, Edge, Brave, etc.). Else you can't save the annotations in your main source file.", "error");
        return;
    }

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

function loadPlaceholderPreview() {
    fetch('components/nofileselected.html')
        .then(res => res.text())
        .then(html => {
            loadHTMLIntoPreview(html);
        });
}

loadPlaceholderPreview();