function initAnnotationSystem() {
    const preview = document.getElementById("htmlpreview");

    if (!preview) return;

    // TEXT SELECTION → CREATE ANNOTATION
    preview.addEventListener("mouseup", () => {

        if (!currentHTMLFileHandle) {
            alert("You need to load your own HTML first before you can start annotating :)");
            return;
        }

        const selection = window.getSelection();

        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        if (range.collapsed) return;

        // prevent annotating inside annotation
        const container = range.commonAncestorContainer;
        if (container.parentElement?.closest(".annotation")) {
            alert("Cannot annotate inside another annotation");
            return;
        }

        const note = prompt("Enter annotation:");
        if (!note) return;

        wrapSelection(range, note);
        saveHTMLPreviewToFile();

        selection.removeAllRanges();
    });


    // CLICK → SHOW ANNOTATION
    preview.addEventListener("click", (e) => {

        if (!currentHTMLFileHandle) return;

        const el = e.target.closest(".annotation");
        if (!el) return;

        const note = el.dataset.note;
        alert(note);
    });
}


function wrapSelection(range, annotationText) {
    const span = document.createElement("span");

    const id = "a-" + Date.now();

    span.classList.add("annotation");
    span.setAttribute("data-id", id);
    span.setAttribute("data-note", annotationText);

    try {
        range.surroundContents(span);
    } catch (err) {
        alert("Selection too complex. Try selecting within one paragraph.");
        console.error(err);
    }
}


// SAVE FUNCTION
async function saveFile() {
    if (!currentHTMLFileHandle) return;

    const writable = await currentHTMLFileHandle.createWritable();

    const html = document.getElementById("htmlpreview").innerHTML;

    await writable.write(html);
    await writable.close();
}