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

        loadHTMLIntoPreview(text);

        document.getElementById("HTMLFile").textContent = file.name;

    } catch (err) {
        console.log("File selection cancelled or failed:", err);
    }
}


function loadHTMLIntoPreview(htmlContent) {
    const previewRoot = document.getElementById('preview-frame');

    originalHTMLContent = htmlContent;

    previewRoot.innerHTML = `<div id="htmlpreview">${htmlContent}</div>`;

    // important: initialize annotation AFTER loading
    initAnnotationSystem();
}


async function saveHTMLPreviewToFile() {
    if (!currentHTMLFileHandle) return;

    const writable = await currentHTMLFileHandle.createWritable();

    const updatedInnerHTML = document.getElementById("htmlpreview").innerHTML;

    // Replace ONLY the preview section in original HTML
    let updatedFullHTML = originalHTMLContent;

    updatedFullHTML = updatedFullHTML.replace(
        /<div id="htmlpreview">[\s\S]*<\/div>/,
        `<div id="htmlpreview">${updatedInnerHTML}</div>`
    );

    await writable.write(updatedFullHTML);
    await writable.close();
}