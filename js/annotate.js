let selectedRange = null;
let activeAnnotationEl = null;
let annotationCounter = 0;

/* ---------------- INIT ---------------- */

function initAnnotationSystem() {

    const preview = document.getElementById("htmlpreview");

    if (!preview) return;

    // click inside preview to create or edit annotation
    preview.addEventListener("mouseup", handleTextSelection);
    preview.addEventListener("click", handleAnnotationClick);

    // popup buttons
    document.getElementById("annotation-cancel").onclick = closePopover;
    document.getElementById("annotation-save").onclick = saveAnnotation;
    document.getElementById("annotation-delete").onclick = deleteAnnotation;

    updatePreview();
}

/* ---------------- Save File ---------------- */

async function saveFile() {
    if (!currentHTMLFileHandle) return;

    const writable = await currentHTMLFileHandle.createWritable();

    const html = document.getElementById("htmlpreview").innerHTML;

    await writable.write(html);
    await writable.close();
}


/* ---------------- SELECTION -> NEW ANNOTATION ---------------- */

function handleTextSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    if (!currentHTMLFileHandle) {
        showToast("You need to load your own HTML first before you can start annotating :)");
        return;
    }

    // ensure selection is inside preview
    const preview = document.getElementById("htmlpreview");
    if (!preview.contains(range.commonAncestorContainer)) return;

    // detect if selection touches an existing annotation
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    const startAnnotation = startContainer.nodeType === 3
        ? startContainer.parentElement?.closest(".annotation")
        : startContainer.closest?.(".annotation");

    const endAnnotation = endContainer.nodeType === 3
        ? endContainer.parentElement?.closest(".annotation")
        : endContainer.closest?.(".annotation");

    if (startAnnotation || endAnnotation) {
        showToast("You cannot create an annotation inside an existing annotation. Please select text outside the highlighted areas.");
        selection.removeAllRanges();
        return;
    }

    selectedRange = range;

    showPopoverAtRange(range);

    document.getElementById("annotation-input").value = "";
    activeAnnotationEl = null;
}

/* ---------------- CLICK EXISTING ANNOTATION ---------------- */

function handleAnnotationClick(e) {
    const el = e.target.closest(".annotation");
    if (!el) return;

    e.preventDefault();

    activeAnnotationEl = el;
    selectedRange = null;

    const rect = el.getBoundingClientRect();
    showPopoverAtPosition(rect.left, rect.top);

    document.getElementById("annotation-input").value =
        el.getAttribute("data-annotation-text") || "";
}

/* ---------------- POPUP ---------------- */

function showPopoverAtRange(range) {
    const rect = range.getBoundingClientRect();
    showPopoverAtPosition(rect.left, rect.top);
}

function showPopoverAtPosition(x, y) {
    const popover = document.getElementById("annotation-popover");

    popover.classList.remove("hidden");

    popover.style.left = `${x + window.scrollX}px`;
    popover.style.top = `${y + window.scrollY - 80}px`;
}

function closePopover() {
    const popover = document.getElementById("annotation-popover");
    popover.classList.add("hidden");

    selectedRange = null;
    activeAnnotationEl = null;

    window.getSelection().removeAllRanges();
}

/* ---------------- SAVE ---------------- */

function saveAnnotation() {
    const text = document.getElementById("annotation-input").value.trim();
    if (!text) return;

    const preview = document.getElementById("htmlpreview");

    // CASE 1: EDIT EXISTING
    if (activeAnnotationEl) {
        activeAnnotationEl.setAttribute("data-annotation-text", text);
        closePopover();
        return;
    }

    // CASE 2: CREATE NEW
    if (!selectedRange) return;

    const span = document.createElement("span");
    span.className = "annotation";
    span.setAttribute("data-annotation-id", generateId());
    span.setAttribute("data-annotation-text", text);

    try {
        selectedRange.surroundContents(span);
    } catch (e) {
        console.warn("Invalid selection for annotation:", e);
        return;
    }

    saveFile()
    closePopover();
    updatePreview();
}

/* ---------------- DELETE ---------------- */

function deleteAnnotation() {
    if (!activeAnnotationEl) {
        closePopover();
        return;
    }

    const parent = activeAnnotationEl.parentNode;

    // unwrap span
    while (activeAnnotationEl.firstChild) {
        parent.insertBefore(activeAnnotationEl.firstChild, activeAnnotationEl);
    }

    parent.removeChild(activeAnnotationEl);

    saveFile()
    closePopover();
    updatePreview();
}

/* ---------------- UTIL ---------------- */

function generateId() {
    return `ann-${Date.now()}-${annotationCounter++}`;
}



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


function renderTemplate(template, data) {
    return template
        .replaceAll("{chapter}", data.chapter)
        .replaceAll("{quoted_text}", data.quoted_text)
        .replaceAll("{annotation_text}", data.annotation_text);
}


function buildAnnotationPreview(doc) {
    const template = document.getElementById("annotation-template").value;
    const annotations = extractAnnotations(doc);

    return annotations.map(a => renderTemplate(template, a)).join("\n");
}


function updatePreview() {
    const doc = document.getElementById("preview-frame").contentDocument;
    const output = buildAnnotationPreview(doc);

    document.getElementById("annotation-preview-output").innerHTML = output;

    document.getElementById("annotation-template")
        .addEventListener("input", updatePreview);
}


function updateFormat() {

    updatePreview();
}


document.addEventListener("DOMContentLoaded", () => {
    initAnnotationSystem();

    document
        .getElementById("annotation-template")
        .addEventListener("input", updatePreview);

    document
        .getElementById("preview-mode-toggle")
        .addEventListener("change", togglePreviewMode);
});