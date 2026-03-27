let currentRange = null;
let activeAnnotation = null;

function showAnnotationPopover(rect) {
    const popover = document.getElementById("annotation-popover");
    const input = document.getElementById("annotation-input");

    popover.style.top = `${window.scrollY + rect.bottom + 8}px`;
    popover.style.left = `${window.scrollX + rect.left}px`;

    popover.classList.remove("hidden");

    input.focus();
}

function hidePopover() {
    const popover = document.getElementById("annotation-popover");
    const input = document.getElementById("annotation-input");

    popover.classList.add("hidden");

    window.getSelection().removeAllRanges();

    currentRange = null;
    activeAnnotation = null;

    input.value = "";
}

function initAnnotationSystem() {
    const preview = document.getElementById("htmlpreview");

    if (!preview) return;

    const popover = document.getElementById("annotation-popover");
    const input = document.getElementById("annotation-input");
    const cancelBtn = document.getElementById("annotation-cancel");
    const saveBtn = document.getElementById("annotation-save");
    const deleteBtn = document.getElementById("annotation-delete");



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

        showAnnotationPopover(range);

        selection.removeAllRanges();
    });


    preview.addEventListener("click", (e) => {
        if (!currentHTMLFileHandle) return;

        const el = e.target.closest(".annotation");
        if (!el) return;

        activeAnnotation = el;
        currentRange = null;

        input.value = el.dataset.note || "";

        const rect = el.getBoundingClientRect();
        showAnnotationPopover(rect);
    });


    cancelBtn.addEventListener("click", () => {
        hidePopover();
    });


    saveBtn.addEventListener("click", async () => {
        const text = input.value.trim();
        if (!text) return;

        if (currentRange) {
            wrapSelection(currentRange, text);
        }

        else if (activeAnnotation) {
            activeAnnotation.dataset.note = text;
        }

        window.getSelection().removeAllRanges();

        hidePopover();
        await saveFile();
    });


    deleteBtn.addEventListener("click", async () => {
        if (!activeAnnotation) return;

        const parent = activeAnnotation.parentNode;

        while (activeAnnotation.firstChild) {
            parent.insertBefore(activeAnnotation.firstChild, activeAnnotation);
        }

        parent.removeChild(activeAnnotation);

        hidePopover();
        await saveFile();
    });


    document.addEventListener("click", (e) => {
        if (!popover.contains(e.target) && !e.target.closest(".annotation")) {
            hidePopover();
        }
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


async function saveFile() {
    if (!currentHTMLFileHandle) return;

    const writable = await currentHTMLFileHandle.createWritable();

    const html = document.getElementById("htmlpreview").innerHTML;

    await writable.write(html);
    await writable.close();
}