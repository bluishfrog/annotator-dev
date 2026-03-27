let currentRange = null;

function showAnnotationPopover(range) {
    const popover = document.getElementById("annotation-popover");
    const input = document.getElementById("annotation-input");

    const rect = range.getBoundingClientRect();

    popover.style.top = `${window.scrollY + rect.bottom + 8}px`;
    popover.style.left = `${window.scrollX + rect.left}px`;

    popover.classList.remove("hidden");

    input.value = "";
    input.focus();
}

function hidePopover() {
    const popover = document.getElementById("annotation-popover");
    popover.classList.add("hidden");

    window.getSelection().removeAllRanges();
    currentRange = null;
}

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

        currentRange = range;
        showAnnotationPopover(range);

        document.getElementById("annotation-save").addEventListener("click", () => {
            const input = document.getElementById("annotation-input");
            const text = input.value.trim();

            if (!text || !currentRange) return;

            wrapSelection(currentRange, text);
            saveHTMLPreviewToFile();

            hidePopover();
        });

        document.getElementById("annotation-cancel").addEventListener("click", () => {
            hidePopover();
        });

        selection.removeAllRanges();
    });


    let activeAnnotation = null;

    const popover = document.getElementById("annotation-popover");
    const input = document.getElementById("annotation-input");
    const cancelBtn = document.getElementById("annotation-cancel");
    const saveBtn = document.getElementById("annotation-save");
    const deleteBtn = document.getElementById("annotation-delete");

    preview.addEventListener("click", (e) => {
        if (!currentHTMLFileHandle) return;

        const el = e.target.closest(".annotation");
        if (!el) return;

        activeAnnotation = el;

        // load text
        input.value = el.dataset.note || "";

        // position popover
        const rect = el.getBoundingClientRect();

        popover.style.top = window.scrollY + rect.bottom + 8 + "px";
        popover.style.left = window.scrollX + rect.left + "px";

        popover.classList.remove("hidden");
    });

    cancelBtn.addEventListener("click", () => {
        hidePopover();
    });

    saveBtn.addEventListener("click", async () => {
        if (!activeAnnotation) return;

        activeAnnotation.dataset.note = input.value;

        popover.classList.add("hidden");

        await saveFile(); // 🔥 immediate save
    });

    deleteBtn.addEventListener("click", async () => {
        if (!activeAnnotation) return;

        const parent = activeAnnotation.parentNode;

        // unwrap span (keep text)
        while (activeAnnotation.firstChild) {
            parent.insertBefore(activeAnnotation.firstChild, activeAnnotation);
        }

        parent.removeChild(activeAnnotation);

        popover.classList.add("hidden");

        await saveFile();
    });

    document.addEventListener("click", (e) => {
        if (!popover.contains(e.target) && !e.target.closest(".annotation")) {
            popover.classList.add("hidden");
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


// SAVE FUNCTION
async function saveFile() {
    if (!currentHTMLFileHandle) return;

    const writable = await currentHTMLFileHandle.createWritable();

    const html = document.getElementById("htmlpreview").innerHTML;

    await writable.write(html);
    await writable.close();
}