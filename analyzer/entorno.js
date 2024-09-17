import { embebidas } from "./embebidas.js";
export class Entorno {

    /**
     * @param {Entorno} padre
     */
    constructor(padre = undefined) {
        this.valores = {};
        this.padre = padre;

        
        // funciones embebidas
        Object.entries(embebidas).forEach(([nombre, funcion]) => {
            this.setOrUpdateVariable(nombre,{valor:funcion,tipo: "function"} );
        });
    }

    /**
     * @param {string} nombre
     * @param {string} tipo
     * @param {any} valor
     */
    setVariable(nombre, tipo, valor) {
        // Si algo ya está definido, lanzar error
        if (this.valores[nombre]) {
            throw new Error(`Variable ${nombre} ya está definida`);
        }
        this.valores[nombre] = { tipo, valor };
    }

    /**
     * @param {string} nombre
     */
    getVariable(nombre) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) return valorActual;

        if (!valorActual && this.padre) {
            return this.padre.getVariable(nombre);
        }

        throw new Error(`Variable ${nombre} no definida`);
    }

    /**
     * @param {string} nombre
     * @param {any} valor
     */
    assignVariable(nombre, valor) {
        const variable = this.valores[nombre];

        if (variable !== undefined) {
            // Verificar si el tipo coincide
            console.log(valor," ",variable)
            if ( valor.tipo !== variable.tipo  ) {
               if(valor.tipo!=="int" && variable.tipo!=="float") throw new Error(`El valor asignado no coincide con el tipo de la variable ${nombre}`);
            }
            this.valores[nombre].valor = valor.valor;
            return;
        }

        if (!variable && this.padre) {
            this.padre.assignVariable(nombre, valor);
            return;
        }

        throw new Error(`Variable ${nombre} no definida`);
    }
    setOrUpdateVariable(nombre, valor) {
        if (this.valores.hasOwnProperty(nombre)) {
            console.log(`Actualizando variable ${nombre} con nuevo valor: ${valor}`);
            this.valores[nombre] = valor;
        } else {
            console.log(`Guardando nueva variable ${nombre} con valor: ${valor}`);
            this.setVariable(nombre, valor);
        }
    }
}
