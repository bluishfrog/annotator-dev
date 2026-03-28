let currentHTMLFileHandle = null;

async function assignHTMLFile() {
    try {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".html,.htm";
        input.multiple = false;

        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            currentHTMLFileHandle = file;

            const text = await file.text();

            document.getElementById("HTMLFile").textContent = file.name;

            loadHTMLIntoPreview(text);

            document.dispatchEvent(new Event("source-file-uploaded"));
        };

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

