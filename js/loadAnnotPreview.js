/* ---------------- ANNOTATION CONSTRUCTION ---------------- */

async function extractAnnotations(doc) {
    const annotations = [];

    doc.querySelectorAll(".annotation").forEach(span => {
        const annotID = span.getAttribute("dataannotationid");
        const text = span.textContent.trim();
        const annotationText = span.getAttribute("dataannotationtext");

        annotations.push({
            annot_id: annotID,
            quoted_text: text,
            annotation_text: annotationText
        });
    });

    return annotations;
}

async function formatAnnots(annotations) {

    const template = document.getElementById('annotation-template').value;

    const container = document.createElement('div');

    annotations.forEach(item => {

        let html = template;

        html = html.replace(/{quoted_text}/g, item.quoted_text);
        html = html.replace(/{annotation_text}/g, item.annotation_text);

        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;

        container.appendChild(wrapper.firstElementChild);
    });

    return container;
}


/* ---------------- ANNOT PREVIEW ---------------- */

async function loadAnnotPreview() {
    try {
        if (!currentHTMLFileHandle) return;

        const file = await currentHTMLFileHandle.getFile();
        const text = await file.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const annotations = await extractAnnotations(doc);

        const previewRoot = document.getElementById('annot-preview-frame');

        if (!annotations || annotations.length === 0) {
            previewRoot.innerHTML = "<p>Add a first annotation to get a preview here.</p>";
            return;
        }

        const htmlcontainer = await formatAnnots(annotations);

        annotRawHTML = htmlcontainer.innerHTML;

        previewRoot.innerHTML = "";

        previewRoot.appendChild(htmlcontainer);

    } catch (err) {
        console.error('Failed to load test annot file:', err);
    }
}

document.addEventListener('source-file-preview-updated', () => {
    loadAnnotPreview();
});

document.addEventListener('annot-format-area-changed', () => {
    loadAnnotPreview();
});

const textarea = document.getElementById('annotation-template');

textarea.addEventListener('input', () => {
    document.dispatchEvent(new Event("annot-format-area-changed"));
});