/* ---------------- ANNOTATION CONSTRUCTION ---------------- */

function extractAnnotations(doc) {
    const annotations = [];

    doc.querySelectorAll(".annotation").forEach(span => {
        const text = span.textContent;
        const annotationText = span.dataset.annotationText;
        const chapterEl = doc.querySelector("#chapters .heading");

        annotations.push({
            quoted_text: text,
            annotation_text: annotationText,
            chapter: chapterEl ? chapterEl.textContent.trim() : "Unknown"
        });
    });

    return annotations;
}






/* ---------------- ANNOT PREVIEW ---------------- */

async function loadAnnotPreviewTest() {

    try {
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

document.addEventListener('source-file-uploaded', loadAnnotPreviewTest);
document.addEventListener('source-file-changed', loadAnnotPreviewTest);