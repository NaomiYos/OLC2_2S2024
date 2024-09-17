import { parse } from "/analyzer/analizador.js";
import { InterpreterVisitor } from '/analyzer/interprete.js'
document.getElementById('createFileBtn').addEventListener('click', createFile);
document.getElementById('fileInput').addEventListener('change', loadFile);
document.getElementById('executeBtn').addEventListener('click', executeText);
document.getElementById('generateReportBtn').addEventListener('click', generateReport);
const ast= document.getElementById('ast')
const salida = document.getElementById('salida')
console.log('hola')
function createFile() {
    const textAreasContainer = document.getElementById('textAreasContainer');
    const newTextArea = document.createElement('textarea');
    newTextArea.placeholder = 'Escribe el contenido del archivo aquí...';
    textAreasContainer.appendChild(newTextArea);
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
        try{
            const expresion =parse(content)
            const interprete = new InterpreterVisitor()
            console.log({expresion})
            expresion.forEach(expresion =>expresion.accept(interprete))
          //  salida.innerHTML = interprete.salida
           consoleOutput.value += `Ejecutando archivo ${index + 1}:\n${interprete.salida}\n`;
        }
        catch (error) {
            console.log(error)
            // console.log(JSON.stringify(error, null, 2))
           // salida.innerHTML = error.message + ' at line ' + error.location.start.line + ' column ' + error.location.start.column
        
        }

       
        //ast.innerHTML =JSON.stringify(arbol,null,2)
        //console.log({ sentencias })
  

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
