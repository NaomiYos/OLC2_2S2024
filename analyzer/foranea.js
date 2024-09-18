import { Entorno } from "./entorno.js";
import { Invocable } from "./invocable.js";
import { FuncDcl } from "./nodos.js";
import { ReturnException } from "./transferencia.js";


export class FuncionForanea extends Invocable {


    constructor(nodo, clousure) {
        super();
        /**
         * @type {FuncDcl}
         */
        this.nodo = nodo;

        /**
         * @type {Entorno}
         */
        this.clousure = clousure;
    }

    aridad() {
        return this.nodo.params.length;
    }


    /**
    * @type {Invocable['invocar']}
    */
   /* invocar(interprete, args) {
        const entornoNuevo = new Entorno(this.clousure);
    
        this.nodo.params.forEach((param, i) => {
            console.log(`Setting parameter: ${JSON.stringify(param)}`);
            entornoNuevo.setVariable(param.id, param.tipo, args[i].valor);
        });
    
        const entornoAntesDeLaLlamada = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;
    
        try {
            this.nodo.bloque.accept(interprete);
        } catch (error) {
            interprete.entornoActual = entornoAntesDeLaLlamada;
    
            if (error instanceof ReturnException) {
                return error.value;
            }
    
            throw error;
        }
    
        interprete.entornoActual = entornoAntesDeLaLlamada;
        return null;
    }*/
        invocar(interprete, args) {
            const entornoNuevo = new Entorno(this.clousure);
        
            this.nodo.params.forEach((param, i) => {
                // Asumiendo que param es una cadena que representa el nombre del parámetro
                const nombreParametro = param; // param es el nombre directamente
                const tipoParametro = args[i].tipo; // Tipo del argumento pasado
        
                entornoNuevo.setVariable(nombreParametro, tipoParametro, args[i].valor);
            });
        
            const entornoAntesDeLaLlamada = interprete.entornoActual;
            interprete.entornoActual = entornoNuevo;
        
            try {
                this.nodo.bloque.accept(interprete);
            } catch (error) {
                interprete.entornoActual = entornoAntesDeLaLlamada;
        
                if (error instanceof ReturnException) {
                    return error.value;
                }
        
                throw error;
            }
        
            interprete.entornoActual = entornoAntesDeLaLlamada;
            return null;
        }
        
    atar(instancia) {
        const entornoOculto = new Entorno(this.clousure);
        entornoOculto.set('this', instancia);
        return new FuncionForanea(this.nodo, entornoOculto);
    }

}