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
    const errorConsole = document.getElementById('errorConsole'); // Consola de errores
    consoleOutput.value = ''; // Limpiar consola
    errorConsole.value = ''; // Limpiar consola de errores

    textAreas.forEach((textarea, index) => {
        const content = textarea.value;
        try {
            const expresion = parse(content);
            const interprete = new InterpreterVisitor();
            console.log({ expresion });
            expresion.forEach(expresion => expresion.accept(interprete));
            consoleOutput.value += `Ejecutando archivo ${index + 1}:\n${interprete.salida}\n`;
        } catch (error) {
            console.log(error);
            if (error.location && error.location.start) {
                const errorMessage = `${error.message} at line ${error.location.start.line} column ${error.location.start.column}`;
                errorConsole.value += `Error en archivo ${index + 1}:\n${errorMessage}\n\n`;
            } else {
                // Muestra el mensaje de error genérico si no hay información de ubicación
                errorConsole.value += `Error en archivo ${index + 1}: ${error.message}\n\n`;
            }
        }
    });
}


function generateReport() {
    const textAreas = document.querySelectorAll('#textAreasContainer textarea');
    const reportConsole = document.getElementById('reportConsole'); // Nueva consola para reportes
    let report = `Report generated on ${new Date().toLocaleString()}:\n\n`;

    textAreas.forEach((textarea, index) => {
        const content = textarea.value;
        try {
            const expresion = parse(content);
            const interprete = new InterpreterVisitor();

            // Ejecutar las expresiones para llenar el reporte
            expresion.forEach(expresion => expresion.accept(interprete));

            report += `Archivo ${index + 1}:\n`;
            interprete.report.forEach(item => {
                report += `Entorno: ${item.entorno}, Nombre: ${item.nombre}, Tipo: ${item.tipo}, Valor: ${item.valor}\n`;
            });
            report += `\n`;
        } catch (error) {
            report += `Error en archivo ${index + 1}: ${error.message}\n\n`;
        }
    });

    reportConsole.value = report; // Mostrar el reporte en la nueva consola
}


