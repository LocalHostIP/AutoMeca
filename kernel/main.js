/*
Miguel Angel Guerrero Padilla
Version 0.0.0.1
funciona con ecuaciones 0.0.0.1
Algoritmo revisado con rango indefinido

Errores actuales:
    Fomrulas de ecuaciones agregadas aun con solucion no encontrada
    Posibles fallas por referencia al espacio de memoria en las formulas en vez de copiar con seguridad
    Las formulas son texto y no objetos
*/


const path = require('path');
var e = require(path.join(__dirname+'/ecuaciones.js'));

propiedades={"tipo":"variable","tiempo":"general","dimension":"general","objeto":"A","otro":"sin_asignar","constante":"sin_asignar","valor":"sin_asignar","valor2":"sin_asignar"};

var cpp={}
Object.assign(cpp, propiedades);

cpp['tipo']="tiempo";
cpp['tiempo']="inicio";
cpp['valor']=2.0;
cpp['constante']=false;
var ti= new e.Variable(cpp);

cpp['tipo']="tiempo";
cpp['tiempo']="fin";
cpp['valor']=5.0;
cpp['constante']=false;
var tf= new e.Variable(cpp);


cpp['tipo']="tiempo";
cpp['tiempo']="general";
cpp['valor']=3;
cpp['constante']=false;
var tg= new e.Variable(cpp);

cpp['tipo']="velocidad";
cpp['tiempo']="inicio";
cpp['valor']=5.0;
cpp['constante']=false;
var vi= new e.Variable(cpp);
 
cpp['tipo']="velocidad";
cpp['tiempo']="fin";
cpp['valor']=11;
cpp['constante']=false;
var vf= new e.Variable(cpp);

cpp['tipo']="velocidad";
cpp['tiempo']="media";
cpp['valor']=175/6;
cpp['constante']=false;
var vm= new e.Variable(cpp);

cpp['tipo']="aceleracion";
cpp['tiempo']="general";
cpp['valor']=2.0;
cpp['constante']=true;
var a= new e.Variable(cpp);

cpp['tipo']="distancia";
cpp['tiempo']="inicio";
cpp['valor']=3.0;
cpp['constante']=false;
var di= new e.Variable(cpp);

cpp['tipo']="distancia";
cpp['tiempo']="fin";
cpp['valor']="sin_asingar";
cpp['constante']=false;
var df= new e.Variable(cpp);

cpp['tipo']="distancia";
cpp['tiempo']="general";
cpp['constante']=false;
cpp['valor']=24;
var dg= new e.Variable(cpp);


function clone(obj) {
    //crea un objeto de la clase Object con las propiedades que se le dan
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function cloneVariable(variable){
    //Clonar objetos de la calse variable
    //Evita la referencia al espacio de memoria creando un objeto completamente nuevo que ocasiona errores
    const objResultado=clone(variable);
    var cpp={};
    Object.assign(cpp, propiedades);
    cpp['tipo']=objResultado.tipo;
    cpp['tiempo']=objResultado.tiempo;
    cpp['valor']=objResultado.valor;
    cpp['constante']=objResultado.constante;
    cpp['objeto']=objResultado.objeto;
    cpp['dimension']=objResultado.dimension;
    cpp['valor2']=objResultado.valor2;
    cpp['otro']=objResultado.otro;
    
    const varResultado=new e.Variable(cpp);
    return varResultado;
}

function buscarSolucion(buscar,parametros,rango){//Primer parametro es el valor a encontrar, los sieguientes son los datos que se conoces, el siguiente siempre es cero
    var soluciones=[];
    for (var claseE of e.grafo[buscar.tipo]){ //Obtener todas las ecuaciones que consiguen esta variable
        var ecuacion=Object.assign(new claseE(buscar,parametros));
        var peso=ecuacion.getPeso(); //Peso o dificultad de la ecuacion
        var resuelta=false; //Es para saber si está solución funciona o no con estos parametros
        var ecuaciones_usadas=[]; //Guarda el conjunto de ecuaciones a utilizar para esta solución
        var resultado = cloneVariable(buscar);//Guarda la variable resultado

        if (ecuacion.getSoluble()){ //Si la ecuacion se resolvio con está ecuacion
            resultado=ecuacion.usar();
            resuelta=true;
            ecuaciones_usadas.push(ecuacion.ecuacionUsar);
        }
        
        else if (rango<4){//Si no se soluciono pero se está dentro del rango de busqueda 
            var faltantes=ecuacion.getFaltantes(); //Se obtienen todos las variables que faltan para la ecuación.
            //var n_parametros=parametros.slice();
            
            var n_parametros=[]; //Se clonan los parametros
            for (var v of parametros){
                n_parametros.push(cloneVariable(v));
            }

            for (var faltante of faltantes){ //Buscar las soluciones a todos las variables necesarias para la ecuacion
                var solucion_faltante=buscarSolucion(faltante,n_parametros,rango+1);
                peso+=solucion_faltante[1];
                
                if ((solucion_faltante[2]==true)){
                    n_parametros.push(cloneVariable(solucion_faltante[3])); //Agregar las variables faltantes a las variables que se usan como parametro
                    for (var ecu of solucion_faltante[0]){
                        ecuaciones_usadas.push(ecu) //Agregar a las ecuaciones que se usaron para la solucion
                    }
                }
            }

            ecuacion=new claseE(buscar,n_parametros);

            if (ecuacion.getSoluble()){ //Si se resolvio con está ecuacion 
                resultado=ecuacion.usar();
                resuelta=true;
                ecuaciones_usadas.push(ecuacion.ecuacionUsar);         
            }
        }

        var solucion=[ecuaciones_usadas.slice(),peso,resuelta,cloneVariable(resultado)];
        soluciones.push(solucion.slice());
    }

    solucion=soluciones[0];
    for (var s of soluciones){ //Se obtiene la solución con menor peso
        if (solucion[1] > s[1])
            solucion=s;
    }

    return solucion;
}

solucion=buscarSolucion(df,[di,vi,vf,tf,ti],0);

console.log(solucion[3]);
console.log(solucion[0]);
