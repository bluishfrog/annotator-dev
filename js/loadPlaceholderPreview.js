function loadPlaceholderPreview() {
    fetch('components/nofileselected.html')
        .then(res => res.text())
        .then(html => {
            loadHTMLIntoPreview(html);
        });
}

loadPlaceholderPreview();