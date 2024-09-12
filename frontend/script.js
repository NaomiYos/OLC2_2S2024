import { parse } from "/analyzer/operaciones.js";
document.getElementById('createFileBtn').addEventListener('click', createFile);
document.getElementById('fileInput').addEventListener('change', loadFile);
document.getElementById('executeBtn').addEventListener('click', executeText);
document.getElementById('generateReportBtn').addEventListener('click', generateReport);
const ast= document.getElementById('ast')
console.log('hola')
function createFile() {
    const textAreasContainer = document.getElementById('textAreasContainer');
    const newTextArea = document.createElement('textarea');
    newTextArea.placeholder = 'Escribe el contenido del archivo aquí...';
    textAreasContainer.appendChild(newTextArea);
}
const recorrer = (nodo) => {
    if (nodo.tipo === 'numero') return nodo.valor

    const num1 = recorrer(nodo.num1)
    const num2 = recorrer(nodo.num2)

    switch (nodo.tipo) {
        case "suma":
            return num1 + num2
        case "multiplicacion":
            return num1 * num2

    }
}
function loadFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const textAreasContainer = document.getElementById('textAreasContainer');
            const newTextArea = document.createElement('textarea');
            newTextArea.value = e.target.result;
            textAreasContainer.appendChild(newTextArea);
        };
        reader.readAsText(file);
    }
}

function executeText() {
    const textAreas = document.querySelectorAll('#textAreasContainer textarea');
    const consoleOutput = document.getElementById('console');
    consoleOutput.value = ''; // Clear console
    
    textAreas.forEach((textarea, index) => {
        const content = textarea.value;
        const arbol =parse(content)
        const resultado = recorrer(arbol)
        //ast.innerHTML =JSON.stringify(arbol,null,2)

        consoleOutput.value += `Ejecutando archivo ${index + 1}:\n${JSON.stringify(arbol,null,2)  }\n${resultado}\n`;
    });
}

function generateReport() {
    const textAreas = document.querySelectorAll('#textAreasContainer textarea');
    const consoleOutput = document.getElementById('console');
    let report = `Report generated on ${new Date().toLocaleString()}:\n\n`;

    textAreas.forEach((textarea, index) => {
        report += `Archivo ${index + 1}:\n${textarea.value}\n\n`;
    });

    consoleOutput.value = report;
}
