let selectedRange = null;
let activeAnnotationEl = null;
let annotationCounter = 0;
let selectionTimeout = null;

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

/* ---------------- INIT ---------------- */

function initAnnotationSystem() {

    const preview = document.getElementById("htmlpreview");

    if (!preview) return;

    // click inside preview to create or edit annotation
    preview.addEventListener("mouseup", handleSelectionChange);
    preview.addEventListener("click", handleAnnotationClick);

    // popup buttons
    document.getElementById("annotation-cancel").onclick = closePopover;
    document.getElementById("annotation-save").onclick = saveAnnotation;
    document.getElementById("annotation-delete").onclick = deleteAnnotation;

    document.addEventListener("mousedown", handleOutsideClick);

    document.dispatchEvent(new Event("source-file-preview-updated"));

    // MOBILE FIX
    if (window.matchMedia("(pointer: coarse)").matches) {
        document.addEventListener("selectionchange", handleMobileFinalSelection);
    }
}

/* ---------------- Save File ---------------- */

async function saveFile() {

    try {

        if (!currentHTMLFileHandle) return;

        const writable = await currentHTMLFileHandle.createWritable();

        const html = document.getElementById("htmlpreview").innerHTML;

        await writable.write(html);
        await writable.close();

        document.dispatchEvent(new Event("source-file-preview-updated"));

    } catch (error) {
        showToast("Failed to save your annotation. I do not know why :(", "error")
    }

}


/* ---------------- SELECTION ---------------- */

function handleSelectionChange() {

    clearTimeout(selectionTimeout);

    selectionTimeout = setTimeout(() => {

        const selection = window.getSelection();

        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);

        if (!currentHTMLFileHandle) {
            showToast("You need to load your own HTML first before you can start annotating :)", "warning");
            return;
        }

        const preview = document.getElementById("htmlpreview");
        if (!preview.contains(range.commonAncestorContainer)) return;

        // prevent selection inside annotations
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;

        const startAnnotation = startContainer.nodeType === 3
            ? startContainer.parentElement?.closest(".annotation")
            : startContainer.closest?.(".annotation");

        const endAnnotation = endContainer.nodeType === 3
            ? endContainer.parentElement?.closest(".annotation")
            : endContainer.closest?.(".annotation");

        if (startAnnotation || endAnnotation) {
            showToast("You cannot create an annotation inside an existing annotation. Please select text outside the highlighted areas.", "warning");
            selection.removeAllRanges();
            return;
        }

        // prevent selection that fully wraps existing annotations
        const fragment = range.cloneContents();
        const hasInnerAnnotation = fragment.querySelector(".annotation");

        if (hasInnerAnnotation) {
            showToast(
                "You cannot create an annotation that surrounds an existing annotation.",
                "warning"
            );
            selection.removeAllRanges();
            return;
        }

        // warn away from selection that attemps to go over more than one paragraph
        const startEl = range.startContainer.nodeType === 3
            ? range.startContainer.parentElement
            : range.startContainer;

        const endEl = range.endContainer.nodeType === 3
            ? range.endContainer.parentElement
            : range.endContainer;

        const startParagraph = startEl.closest("p");
        const endParagraph = endEl.closest("p");

        if (startParagraph && endParagraph && startParagraph !== endParagraph) {
            showToast(
                "Annotations cannot span multiple paragraphs. Please select text within a single paragraph.",
                "warning"
            );
            selection.removeAllRanges();
            return;
        }

        selectedRange = range;

        showPopoverAtRange(range);

        document.getElementById("annotation-input").value = "";
        activeAnnotationEl = null;

    }, 300); // delay helps mobile drag finish
}


/* ---------------- Mobile Selection ---------------- */

function handleMobileFinalSelection() {

    clearTimeout(selectionTimeout);

    selectionTimeout = setTimeout(() => {

        const selection = window.getSelection();

        if (!selection || selection.isCollapsed) return;

        const text = selection.toString().trim();

        // ignore accidental taps / word-only
        if (text.length < 2) return;

        const range = selection.getRangeAt(0);

        if (!currentHTMLFileHandle) {
            showToast("You need to load your own HTML first before you can start annotating :)", "warning");
            return;
        }

        const preview = document.getElementById("htmlpreview");
        if (!preview.contains(range.commonAncestorContainer)) return;

        // prevent annotation inside annotation
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;

        const startAnnotation = startContainer.nodeType === 3
            ? startContainer.parentElement?.closest(".annotation")
            : startContainer.closest?.(".annotation");

        const endAnnotation = endContainer.nodeType === 3
            ? endContainer.parentElement?.closest(".annotation")
            : endContainer.closest?.(".annotation");

        if (startAnnotation || endAnnotation) {
            showToast("You cannot create an annotation inside an existing annotation. Please select text outside the highlighted areas.", "warning");
            selection.removeAllRanges();
            return;
        }

        // prevent selection that fully wraps existing annotations
        const fragment = range.cloneContents();
        const hasInnerAnnotation = fragment.querySelector(".annotation");

        if (hasInnerAnnotation) {
            showToast(
                "You cannot create an annotation that surrounds an existing annotation.",
                "warning"
            );
            selection.removeAllRanges();
            return;
        }

        // warn away from selection that attemps to go over more than one paragraph
        const startEl = range.startContainer.nodeType === 3
            ? range.startContainer.parentElement
            : range.startContainer;

        const endEl = range.endContainer.nodeType === 3
            ? range.endContainer.parentElement
            : range.endContainer;

        const startParagraph = startEl.closest("p");
        const endParagraph = endEl.closest("p");

        if (startParagraph && endParagraph && startParagraph !== endParagraph) {
            showToast(
                "Annotations cannot span multiple paragraphs. Please select text within a single paragraph.",
                "warning"
            );
            selection.removeAllRanges();
            return;
        }

        selectedRange = range;
        activeAnnotationEl = null;

        document.getElementById("annotation-input").value = "";

        showPopoverAtRange(range);

    }, 400);
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
        el.getAttribute("dataAnnotationText") || "";
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
        activeAnnotationEl.setAttribute("dataAnnotationText", text);
        closePopover();
        return;
    }

    // CASE 2: CREATE NEW
    if (!selectedRange) return;

    const span = document.createElement("span");
    span.className = "annotation";
    span.setAttribute("dataAnnotationId", generateId());
    span.setAttribute("dataAnnotationText", text);

    try {
        selectedRange.surroundContents(span);
    } catch (e) {
        console.warn("Invalid selection for annotation:", e);
        return;
    }

    saveFile()
    closePopover();
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
}

/* ---------------- UTIL ---------------- */

function generateId() {
    return `ann-${Date.now()}-${annotationCounter++}`;
}


/* ---------------- handle outside click ---------------- */
function handleOutsideClick(e) {
    const popover = document.getElementById("annotation-popover");

    // if popover is hidden, do nothing
    if (popover.classList.contains("hidden")) return;

    const isClickInsidePopover = popover.contains(e.target);
    const isClickOnAnnotation = e.target.closest(".annotation");

    if (!isClickInsidePopover && !isClickOnAnnotation) {
        closePopover();
    }
}