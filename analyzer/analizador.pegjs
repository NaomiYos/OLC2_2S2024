
{
  const crearNodo = (tipoNodo, props) =>{
    const tipos = {
      'numero': nodos.Numero,
      'agrupacion': nodos.Agrupacion,
      'binaria': nodos.OperacionBinaria,
      'unaria': nodos.OperacionUnaria,
      'declaracionVariable': nodos.DeclaracionVariable,
      'referenciaVariable': nodos.ReferenciaVariable,
      'print': nodos.Print,
      'expresionStmt': nodos.ExpresionStmt,
      'asignacion': nodos.Asignacion,
      'bloque': nodos.Bloque,
      'if': nodos.If,
      'while': nodos.While,
      'for': nodos.For,
      'break': nodos.Break,
      'continue': nodos.Continue,
      'return': nodos.Return,
      'llamada': nodos.Llamada,
      'dclFunc': nodos.FuncDcl,
      'dclClase': nodos.ClassDcl,
      'instancia': nodos.Instancia,
      'get': nodos.Get,
      'set': nodos.Set,
      'ternaria': nodos.Ternario,
      'incrementoDecremento': nodos.incrementoDecremento
    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
  }
}

programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:ClassDcl _ { return dcl }
            / dcl:VarDcl _ { return dcl }
            / dcl:FuncDcl _ { return dcl }
            / stmt:Stmt _ { return stmt }

VarDcl = tipo:(Tipo/"var") _ id:Identificador _ "=" _ exp:Expresion _ ";" {
  return crearNodo('declaracionVariable', {  tipo,id, exp })
}

  


FuncDcl = tipo:(Tipo/"void") _ id:Identificador _ "("  _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('dclFunc', { id, params: params || [], bloque }) }

ClassDcl = "struct" _ id:Identificador _ "{" _ dcls:ClassBody* _ "}" { return crearNodo('dclClase', { id, dcls }) }

ClassBody = dcl:VarDcl _ { return dcl }
          / dcl:FuncDcl _ { return dcl }

// param1, param2, param3
// id = 'param1'
// params = ['param2, 'param3']
// return ['param1', ...['param2', 'param3']]
Parametros = tipo:Tipo _ id:Identificador _ params:(","_ Tipo _ ids:Identificador { return ids })* { return [id, ...params] }


Tipo = "int" { return "int" }
     / "float" { return "float" }
     / "string" { return "string" }
     / "boolean" { return "boolean" }
     / "char" { return "char" }


Stmt = "System.out.println("_ exp:Expresion _ ")" _ ";" { return crearNodo('print', { exp }) }

    / "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', { dcls }) }
    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
      stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
      )? { return crearNodo('if', { cond, stmtTrue, stmtFalse }) }
    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('while', { cond, stmt }) }
    / "for" _ "(" _ init:ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Stmt {
      return crearNodo('for', { init, cond, inc, stmt })
    }
    / "break" _ ";" { return crearNodo('break') }
    / "continue" _ ";" { return crearNodo('continue') }
    / "return" _ exp:Expresion? _ ";" { return crearNodo('return', { exp }) }
    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

Bloque = "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', { dcls }) }
ForInit = dcl:VarDcl { return dcl }
        / exp:Expresion _ ";" { return exp }
        / ";" { return null }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Asignacion


Cadena = "\"" chars:([^\"]*) "\"" { 
  return crearNodo('numero', { valor: chars.join("") ,tipo :'string'}) 
}

Asignacion = asignado:Llamada _ "=" _ asgn:Asignacion 
  { 

    console.log({asignado})

    if (asignado instanceof nodos.ReferenciaVariable) {
      return crearNodo('asignacion', { id: asignado.id, asgn })
    }

    if (!(asignado instanceof nodos.Get)) {
      throw new Error('Solo se pueden asignar valores a propiedades de objetos')
    }
    
    return crearNodo('set', { objetivo: asignado.objetivo, propiedad: asignado.propiedad, valor: asgn })


  }
  /IncrementoDecremento
          / Ternaria
Ternaria
  = condicion:Or _ "?" _ exprTrue:Ternaria _ ":" _ exprFalse:Ternaria {
      return crearNodo('ternaria', { condicion, exprTrue, exprFalse });
  }
  / Or
IncrementoDecremento
  = id:Identificador _ op:("+=" / "-=")_ n2:Expresion{
      return crearNodo('incrementoDecremento', { id, op,n2 });
  }



Or = izq:And expansion:(
  _ op:"||" _ der:And { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

And = izq:IgualAndDesigual expansion:(
  _ op:"&&" _ der:IgualAndDesigual { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

IgualAndDesigual = izq:OpRelacional expansion:(
  _ op:("==" / "!=") _ der:OpRelacional { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
} 

OpRelacional = izq:Suma expansion:(
  _ op:("<=" / ">="/"<" / ">" ) _ der:Suma { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

Suma = izq:Multiplicacion expansion:(
  _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

Multiplicacion = izq:Unaria expansion:(
  _ op:("*" / "/" / "%") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
      },
      izq
    )
}
 


Unaria = "-" _ num:Unaria { return crearNodo('unaria', { op: '-', exp: num }) }
/ Llamada
/IncrementoDecremento

// "a"()()
// a.b().c().d.c.e
Llamada = objetivoInicial:Dato operaciones:(
    ("(" _ args:Argumentos? _ ")" { return {args, tipo: 'funcCall' } })
    / ("." _ id:Identificador _ { return { id, tipo: 'get' } })
  )* 
  {
  const op =  operaciones.reduce(
    (objetivo, args) => {
      // return crearNodo('llamada', { callee, args: args || [] })
      const { tipo, id, args:argumentos } = args

      if (tipo === 'funcCall') {
        return crearNodo('llamada', { callee: objetivo, args: argumentos || [] })
      }else if (tipo === 'get') {
        return crearNodo('get', { objetivo, propiedad: id })
      }
    },
    objetivoInicial
  )

  console.log('llamada', {op}, {text: text()});

return op
}


// a()()
// NODO-> callee: a, params: [] --- CALLEE1
// NODO-> callee: NODO-> callee: CALLEE1, params: []
Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }


// { return{ tipo: "numero", valor: parseFloat(text(), 10) } }
Char = "'" char:[^'] "'" { return crearNodo('numero', { valor: char, tipo: 'char'}) }
Bool = booleano:("true" / "false") { return crearNodo('numero', { valor: booleano === "true"? true: false, tipo: 'boolean'}) }
Dato = [0-9]+( "." [0-9]+ ) {return crearNodo('numero', { valor: parseFloat(text(), 10) ,tipo: 'float'})}
/ [0-9]+ {return crearNodo('numero', { valor: parseFloat(text(), 10) ,tipo: 'int'})}
/dato:Cadena{return dato}
/dato:Char{return dato}
/dato: Bool {return dato}
  / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
  / id:Identificador { return crearNodo('referenciaVariable', { id }) }


_ = ([ \t\n\r] / Comentarios)* 


Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"