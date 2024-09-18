import { Entorno } from "./entorno.js";
import { BaseVisitor } from "./visitor.js";
import nodos, { Expresion } from './nodos.js'
import { BreakException, ContinueException, ReturnException } from "./transferencia.js";
import { Invocable } from "./invocable.js";
import { embebidas } from "./embebidas.js";
import { Clase } from "./clase.js";
import { Instancia } from "./instancia.js";
import { FuncionForanea } from "./foranea.js";
let matrixSuma = [
    ['     ', 'float', 'int', 'string'],
    ['float', true, true, false],
    ['int', true, true, false],
    ['string', false, false, true],
];

let matrixBasicOperation = [
    ['     ', 'float', 'int'],
    ['float', true, true],
    ['int', true, true],
];

let matrixModulo = [
    ['     ', 'int'],
    ['int', true],
];

let matrixLogic = [
    ['     ', 'boolean'],
    ['boolean', true],
];

let matrixRelacional = [
    ['     ', 'int', 'float', 'char'],
    ['int', true, true, false],
    ['float', true, true, false],
    ['char', false, false, true],
];

let matrixComparacion = [
    ['     ', 'int', 'float', 'char', 'string', 'boolean'],
    ['int', true, true, false,  false, false],
    ['float', true, true, false, false, false],
    ['char', false, false, true, false, false],
    ['string', false, false, false, true, false],
    ['boolean', false, false, false, false, true],
];

let matrixBasicOperationResult = [
    ['     ', 'float', 'int', 'string'],
    ['float', 'float', 'float', false],
    ['int', 'float', 'int', false],
    ['string', false, false, 'string'],
];
function checkMatrix(type1, type2, matrix, matrix2) {

    let rowIndex = matrix.findIndex(row => row[0] === type1);
    let colIndex = matrix[0].findIndex(col => col === type2);

    let rowIndexType = matrix2.findIndex(row => row[0] === type1);
    let colIndexType = matrix2[0].findIndex(col => col === type2);

    if (rowIndex !== -1 && colIndex !== -1) {
        return {validar: matrix[rowIndex][colIndex], tipo: matrix2[rowIndexType][colIndexType]};
    }
    return {validar: false, tipo: 'null'};
}

function checkMatrixLogic(type1, type2, matrix) {

    let rowIndex = matrix.findIndex(row => row[0] === type1);
    let colIndex = matrix[0].findIndex(col => col === type2);


    if (rowIndex !== -1 && colIndex !== -1) {
        return {validar: matrix[rowIndex][colIndex]};
    }
    return {validar: false};
}

function zeroValue(node){
    if(node.valor === 0){
        console.warn('No se puede realizar la operacion entre 0');
         return true;
    }
    return false;
}

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno();



        this.salida = '';
        this.report = [];

        /**
         * @type {Expresion | null}
        */
        this.prevContinue = null;
    }
    agregarReporte(entorno, nombre, tipo, valor) {
        this.report.push({ entorno: entorno.id, nombre, tipo, valor });
    }

    interpretar(nodo) {
        return nodo.accept(this);
    }
    

    /**
      * @type {BaseVisitor['visitOperacionBinaria']}
      */
    visitOperacionBinaria(node) {
        let izq = node.izq.accept(this);
        let der = node.der.accept(this);
        let x;
        switch (node.op) {
            case '+':
                x = checkMatrix(izq.tipo, der.tipo, matrixSuma, matrixBasicOperationResult);
                if(x.validar){ return {valor:izq.valor + der.valor, tipo: x.tipo}
            }else{
                return {valor: null , tipo: 'null'}
            }
               
            case '-':
                x = checkMatrix(izq.tipo, der.tipo, matrixBasicOperation, matrixBasicOperationResult);
                if(x.validar) return {valor:izq.valor - der.valor, tipo: x.tipo};
                return {valor: null , tipo: 'null'}
           
            case '*':
                x = checkMatrix(izq.tipo, der.tipo, matrixBasicOperation, matrixBasicOperationResult);
                if(x.validar) return {valor:izq.valor * der.valor, tipo: x.tipo};
                return {valor: null , tipo: 'null'}
            case '/':
                if(zeroValue(der)) return {valor: null, tipo: 'null'};
                x = checkMatrix(izq.tipo, der.tipo, matrixBasicOperation, matrixBasicOperationResult);
                if(x.validar) return {valor:izq.valor / der.valor, tipo: x.tipo};
                return {valor: null , tipo: 'null'}
            case '%':
                if(zeroValue(der)) return {valor: null, tipo: 'null'};
                x = checkMatrix(izq.tipo, der.tipo, matrixModulo, matrixBasicOperationResult);
                if(x.validar) return {valor:izq.valor % der.valor, tipo: x.tipo};
                return {valor: null , tipo: 'null'}
            case '<':
                x = checkMatrixLogic(izq.tipo, der.tipo, matrixRelacional);
                if(x.validar) return {valor:izq.valor < der.valor, tipo: 'boolean'};
                return {valor: null , tipo: 'null'}
            case '>':
                x = checkMatrixLogic(izq.tipo, der.tipo, matrixRelacional);
                if(x.validar) return {valor:izq.valor > der.valor, tipo: 'boolean'};
                return {valor: null , tipo: 'null'}
            case '<=':
                x = checkMatrixLogic(izq.tipo, der.tipo, matrixRelacional);
                if(x.validar) return {valor:izq.valor <= der.valor, tipo: 'boolean'};
                return {valor: null , tipo: 'null'}
            case '>=':
                x = checkMatrixLogic(izq.tipo, der.tipo, matrixRelacional);
                if(x.validar) return {valor:izq.valor >= der.valor, tipo: 'boolean'};
                return {valor: null , tipo: 'null'}
            case '==':
                x = checkMatrixLogic(izq.tipo, der.tipo, matrixComparacion);
                if(x.validar) return {valor:izq.valor === der.valor, tipo: 'boolean'};
                return {valor: null , tipo: 'null'}
            case '!=':
                x = checkMatrixLogic(izq.tipo, der.tipo, matrixComparacion);
                if(x.validar) return {valor:izq.valor !== der.valor, tipo: 'boolean'};
                return {valor: null , tipo: 'null'}
            case '&&':
                x = checkMatrixLogic(izq.tipo, der.tipo, matrixLogic);
                if(x.validar) return {valor:izq.valor && der.valor, tipo: 'boolean'};
                return {valor: null , tipo: 'null'}
            case '||':
                x = checkMatrixLogic(izq.tipo, der.tipo, matrixLogic);
                console.log(izq || der, "logica");
                if(x.validar) return {valor:izq.valor || der.valor, tipo: 'boolean'};
                return {valor: null , tipo: 'null'}
            default:
                throw new ErrorSyntax('Operador no soportado', node.location);
        }

    }
    

    /**
      * @type {BaseVisitor['visitOperacionUnaria']}
      */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this);
    
        switch (node.op) {
            case '-':
                if (exp.tipo !== 'int' && exp.tipo !== 'float') {
                    throw new Error(`Operador '-' no soportado para el tipo: ${exp.tipo}`);
                }
                return { valor: -exp.valor, tipo: exp.tipo };
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }
    }
    /**
      * @type {BaseVisitor['visitTernario']}
      */
    visitTernario(node){
        const cond = node.condicion.accept(this);
        const exp1 = node.exprTrue.accept(this);
        const exp2 = node.exprFalse.accept(this);
        if(cond.valor){
            return exp1;
            }
            else{
                return exp2;
            }

    }
    visitincrementoDecremento(node){
        const exp = this.entornoActual.getVariable(node.id);
        const valor = node.n2.accept(this);

        
        switch (node.op) {
            case '+=':
               this.entornoActual.assignVariable(node.id,{tipo:exp.tipo,valor:exp.valor+valor.valor})
               break;
            case '-=':
                this.entornoActual.assignVariable(node.id,{tipo:exp.tipo,valor:exp.valor-valor.valor})
                break;
        }
    }
    

    /**
      * @type {BaseVisitor['visitAgrupacion']}
      */
    visitAgrupacion(node) {
        return node.exp.accept(this);
    }

    /**
      * @type {BaseVisitor['visitNumero']}
      */
    visitNumero(node) {
        return node;
    }


    /**
     * @type {BaseVisitor['visitDeclaracionVariable']}
     */
    visitDeclaracionVariable(node) {
        const nombreVariable = node.id;
        let valorVariable = node.exp ? node.exp.accept(this) : { valor: null, tipo: 'null' };
        let tipo = node.tipo;
    
        // Verificación del tipo y asignación de null si el tipo no coincide
        switch (tipo) {
            case 'int':
                if (valorVariable.tipo !== 'int') {
                    valorVariable = { valor: null, tipo: 'null' };
                }
                break;
            case 'float':
                if (valorVariable.tipo !== 'float' && valorVariable.tipo !== 'int') {
                    valorVariable = { valor: null, tipo: 'null' };
                }
                break;
            case 'string':
                if (valorVariable.tipo !== 'string') {
                    valorVariable = { valor: null, tipo: 'null' };
                }
                break;
            case 'boolean':
                if (valorVariable.tipo !== 'boolean') {
                    valorVariable = { valor: null, tipo: 'null' };
                }
                break;
            case 'char':
                if (valorVariable.tipo !== 'char') {
                    valorVariable = { valor: null, tipo: 'null' };
                }
                break;
            case 'var':
                tipo = valorVariable.tipo; // Asigna el tipo dinámicamente
                break;
            default:
                throw new Error(`Tipo desconocido: ${tipo}`);
        }
    
        // Asignar la variable en el entorno
        this.entornoActual.setVariable(nombreVariable, tipo, valorVariable.valor);
        this.agregarReporte(this.entornoActual, nombreVariable, tipo, valorVariable.valor);
    }
    
    


    /**
      * @type {BaseVisitor['visitReferenciaVariable']}
      */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        return this.entornoActual.getVariable(nombreVariable);
    }


    /**
      * @type {BaseVisitor['visitPrint']}
      */
    visitPrint(node) {
        const valor = node.exp.accept(this);
        this.salida += valor.valor + '\n';
    }
    
    
    
    
    


    /**
      * @type {BaseVisitor['visitExpresionStmt']}
      */
    visitExpresionStmt(node) {
        node.exp.accept(this);
    }

    /**
     * @type {BaseVisitor['visitAsignacion']}
     */
    visitAsignacion(node) {
        // const valor = this.interpretar(node.asgn);
        const valor = node.asgn.accept(this);
        this.entornoActual.assignVariable(node.id, valor);

        return valor;
    }

    /**
     * @type {BaseVisitor['visitBloque']}
     */
    visitBloque(node) {

        const entornoAnterior = this.entornoActual;
        this.entornoActual = new Entorno(entornoAnterior);

        node.dcls.forEach(dcl => dcl.accept(this));

        this.entornoActual = entornoAnterior;
    }

    /**
     * @type {BaseVisitor['visitIf']}
     */
    visitIf(node) {
        const cond = node.cond.accept(this);
    
        if (cond.valor) {  // Asegúrate de acceder a 'valor'
            node.stmtTrue.accept(this);
        } else if (node.stmtFalse) {
            node.stmtFalse.accept(this);
        }
    }

    /**
     * @type {BaseVisitor['visitWhile']}
     */
    visitWhile(node) {
        const entornoConElQueEmpezo = this.entornoActual;
    
        try {
            while (node.cond.accept(this).valor) {
                try {
                    node.stmt.accept(this);
                } catch (error) {
                    if (error instanceof BreakException) {
                        break;  // Salir del bucle si se lanza Break
                    }
    
                    if (error instanceof ContinueException) {
                        continue;  // Pasar a la siguiente iteración si se lanza Continue
                    }
    
                    throw error;  // Volver a lanzar cualquier otro tipo de error
                }
            }
        } finally {
            this.entornoActual = entornoConElQueEmpezo;  // Restaurar el entorno original
        }
    }
    
    

    /**
     * @type {BaseVisitor['visitFor']}
     */
    visitFor(node) {
        const incrementoAnterior = this.prevContinue;
        this.prevContinue = node.inc;
    
        const forTraducido = new nodos.Bloque({
            dcls: [
                node.init,
                new nodos.While({
                    cond: node.cond,
                    stmt: new nodos.Bloque({
                        dcls: [
                            node.stmt,
                            node.inc
                        ]
                    })
                })
            ]
        });
    
        try {
            forTraducido.accept(this);
        } catch (error) {
            if (error instanceof BreakException) {
                // Romper el bucle en caso de Break
            } else if (error instanceof ContinueException) {
                // Continuar a la siguiente iteración en caso de Continue
                this.prevContinue.accept(this);  // Ejecutar el incremento del bucle
            } else {
                throw error;  // Lanzar otros errores
            }
        } finally {
            this.prevContinue = incrementoAnterior;  // Restaurar el incremento anterior
        }
    }
    
    /**
     * @type {BaseVisitor['visitBreak']}
     */
    visitBreak(node) {
        throw new BreakException();
    }

    /**
     * @type {BaseVisitor['visitContinue']}
     */
    visitContinue(node) {

        if (this.prevContinue) {
            this.prevContinue.accept(this);
        }

        throw new ContinueException();
    }

    /**
     * @type {BaseVisitor['visitReturn']}
     */
    visitReturn(node) {
        let valor = null
        if (node.exp) {
            valor = node.exp.accept(this);
        }
        throw new ReturnException(valor);
    }

    /**
    * @type {BaseVisitor['visitLlamada']}
    */
    /*visitLlamada(node) {
       
        const funcion = node.callee.accept(this).valor;
      
        const argumentos = node.args.map(arg => arg.accept(this));

        if (!(funcion instanceof Invocable)) {
            throw new Error('No es invocable');
            // 1() "sdalsk"()
        }

        if (funcion.aridad()!== argumentos.length) {
            throw new Error('Aridad incorrecta');
        }

        return funcion.invocar(this, argumentos);
    }*/
        visitLlamada(node) {
            const funcionVariable = node.callee.accept(this);  // Recibe el objeto completo de la variable
            const funcion = funcionVariable.valor;  // Accede al valor que debería ser la función
        
            const argumentos = node.args.map(arg => arg.accept(this));
        
            if (!(funcion instanceof Invocable)) {
                throw new Error('No es invocable');
            }
        
            if (funcion.aridad() !== argumentos.length) {
                throw new Error('Aridad incorrecta');
            }
        
            return funcion.invocar(this, argumentos);
        }
        

    /**
    * @type {BaseVisitor['visitFuncDcl']}
    */
   /* visitFuncDcl(node) {
        const funcion = new FuncionForanea(node, this.entornoActual);
        this.entornoActual.setVariable(node.id, {valor:funcion, tipo:"funcion"});
        this.agregarReporte(this.entornoActual, node.id, "funcion", "n/a");
    }*/
        visitFuncDcl(node) {
            const funcion = new FuncionForanea(node, this.entornoActual);
            this.entornoActual.setVariable(node.id, "funcion", funcion);
            this.agregarReporte(this.entornoActual, node.id, "funcion", "n/a");
        }
        


    /**
    * @type {BaseVisitor['visitClassDcl']}
    */
    visitClassDcl(node) {

        const metodos = {}
        const propiedades = {}

        node.dcls.forEach(dcl => {
            if (dcl instanceof nodos.FuncDcl) {
                metodos[dcl.id] = new FuncionForanea(dcl, this.entornoActual);
            } else if (dcl instanceof nodos.DeclaracionVariable) {
                propiedades[dcl.id] = dcl.exp
            }
        });

        const clase = new Clase(node.id, propiedades, metodos);

        this.entornoActual.setVariable(node.id, clase);

    }

    /**
    * @type {BaseVisitor['visitInstancia']}
    */
    visitInstancia(node) {

        const clase = this.entornoActual.getVariable(node.id);

        const argumentos = node.args.map(arg => arg.accept(this));


        if (!(clase instanceof Clase)) {
            throw new Error('No es posible instanciar algo que no es una clase');
        }



        return clase.invocar(this, argumentos);
    }


    /**
    * @type {BaseVisitor['visitGet']}
    */
    visitGet(node) {

        // var a = new Clase();
        // a.propiedad
        const instancia = node.objetivo.accept(this);

        if (!(instancia instanceof Instancia)) {
            console.log(instancia);
            throw new Error('No es posible obtener una propiedad de algo que no es una instancia');
        }

        return instancia.getVariable(node.propiedad);
    }

    /**
    * @type {BaseVisitor['visitSet']}
    */
    visitSet(node) {
        const instancia = node.objetivo.accept(this);

        if (!(instancia instanceof Instancia)) {
            throw new Error('No es posible asignar una propiedad de algo que no es una instancia');
        }

        const valor = node.valor.accept(this);

        instancia.setVariable(node.propiedad, valor);

        return valor;
    }

}