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

    previewRoot.innerHTML = `<div id="htmlpreview">${htmlContent}</div>`;
}


const selection = window.getSelection();

if (!selection.rangeCount) return;

const range = selection.getRangeAt(0);

function wrapSelection(range, annotationText) {

    if (range.commonAncestorContainer.closest?.(".annotation")) {
        alert("Cannot annotate inside another annotation");
        return;
    }
    
    const span = document.createElement("span");

    const id = "a-" + Date.now();

    span.classList.add("annotation");
    span.setAttribute("data-id", id);
    span.setAttribute("data-note", annotationText);

    range.surroundContents(span);
}


const note = prompt("Enter annotation:");

if (note) {
    wrapSelection(range, note);
}

document.addEventListener("click", (e) => {
    const el = e.target.closest(".annotation");
    if (!el) return;

    const note = el.dataset.note;

    alert(note); // replace later with nice UI
});


async function saveFile() {
    if (!currentHTMLFileHandle) return;

    const writable = await currentHTMLFileHandle.createWritable();

    const html = document.getElementById("htmlpreview").innerHTML;

    await writable.write(html);
    await writable.close();
}