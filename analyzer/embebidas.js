import { Invocable } from "./invocable.js";


class FuncionNativa extends Invocable {
    constructor(aridad, func) {
        super();
        this.aridad = aridad;
        this.invocar = func;
    }
}

  
export const embebidas = {
    'toString': new FuncionNativa(() => 1, (interprete,args) =>{ return{valor: args[0].valor.toString() , tipo:"string" };
}),
'toLowerCase': new FuncionNativa(()=>
    1, // Aridad de 1, espera un argumento de tipo string
    (interprete,args) => {
        if (typeof args[0].valor !== 'string') {
            throw new Error('toLowerCase solo se puede aplicar a cadenas');
        }
        return { valor: args[0].valor.toLowerCase(), tipo: "string" };
    }
),
'toUpperCase': new FuncionNativa(()=>
    1, // Aridad de 1, espera un argumento de tipo string
    (interprete,args) => {
        if (typeof args[0].valor !== 'string') {
            throw new Error('toUpperCase solo se puede aplicar a cadenas');
        }
        return { valor: args[0].valor.toUpperCase(), tipo: "string" };
    }
),
'typeof': new FuncionNativa(()=>
    1, // Aridad de 1, espera un argumento de cualquier tipo
    (interprete,args) => {
        return { valor: typeof args[0].valor, tipo: "string" };
    }
),
'parseFloat': new FuncionNativa(()=>
    1, // Aridad de 1, espera un argumento que sea un string o un número
    (interprete,args) => {
        const parsedValue = parseFloat(args[0].valor);
        if (isNaN(parsedValue)) {
            throw new Error('No se puede convertir a float');
        }
        return { valor: parsedValue, tipo: "float" };
    }
),
'parseInt': new FuncionNativa(()=>
    1, // Aridad de 1, espera un argumento que sea un string o un número
    (interprete,args) => {
        const parsedValue = parseInt(args[0].valor, 10); // Base 10
        if (isNaN(parsedValue)) {
            throw new Error('No se puede convertir a int');
        }
        return { valor: parsedValue, tipo: "int" };
    }
),




}