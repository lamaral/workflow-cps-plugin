function handlePrototype(url, crumb_header, crumb_value) {
    buildFormTree(document.forms.config);
    // TODO JSON.stringify fails in some circumstances: https://gist.github.com/jglick/70ec4b15c1f628fdf2e9 due to Array.prototype.toJSON
    // TODO simplify when Prototype.js is removed
    const json = Object.toJSON ? Object.toJSON(JSON.parse(document.forms.config.elements.json.value).prototype) : JSON.stringify(JSON.parse(document.forms.config.elements.json.value).prototype);
    if (!json) {
        return; // just a separator
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append(crumb_header, crumb_value);

    fetch(url, {
        method: "POST",
        headers: headers,
        body: "json=" + encodeURIComponent(json),

    })
        .then(response => {
            if (response.ok) {
                response.text().then((responseText) => {
                    document.getElementById('prototypeText').value = responseText;
                    copybutton = document.querySelector('.jenkins-copy-button');
                    copybutton.setAttribute("text", responseText);
                    copybutton.classList.remove('jenkins-hidden');
                });
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}


document.addEventListener('DOMContentLoaded', () => {

    const generatePipelineScript = document.getElementById("generatePipelineScript");
    const url = generatePipelineScript.getAttribute("data-url");
    const crumb_header = generatePipelineScript.getAttribute("data-crumb-header");
    const crumb_value = generatePipelineScript.getAttribute("data-crumb-value");
    generatePipelineScript.onclick = (_) => {
        handlePrototype(url, crumb_header, crumb_value);
        return false;
    };

});