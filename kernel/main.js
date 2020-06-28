/*
Miguel Angel Guerrero Padilla y el otro
Version 0.0.0.5
funciona con ecuaciones 0.0.0.5
Algoritmo revisado con rango indefinido

Errores actuales:
    Fomrulas de ecuaciones agregadas aun con solucion no encontrada
    Posibles fallas por referencia al espacio de memoria en las formulas en vez de copiar con seguridad
    Las formulas son texto y no objetos
*/

const path = require('path');
var e = require(path.join(__dirname+'/ecuaciones.js'));
const path = require('path');
var eFuerzas = require(path.join(__dirname+'/sumatoriaFuerzas.js'));

propiedades={"tipo":"variable","tiempo":"general","dimension":"general","objeto":"A","otro":"sin_asignar","valor":"sin_asignar","valor2":"sin_asignar"};

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
    cpp['objeto']=objResultado.objeto;
    cpp['dimension']=objResultado.dimension;
    cpp['valor2']=objResultado.valor2;
    cpp['otro']=objResultado.otro;
    
    const varResultado=new e.Variable(cpp);
    varResultado.id=variable.id;

    return varResultado;
}

function buscarSolucionDimensionGeneral(buscar,parametros,rango,buscarInicial){
    var tx=cloneVariable(buscar);
    tx.dimension='x';
    var ty=cloneVariable(buscar);
    ty.dimension='y';
    var tg=cloneVariable(buscar);
    tg.dimension='general';
    
    var solucionx=buscarSolucion(tx,parametros,rango,buscarInicial);
    var soluciony=buscarSolucion(ty,parametros,rango,buscarInicial);
    var soluciong=buscarSolucion(tg,parametros,rango,buscarInicial);

    solucionx[3].dimension=buscar.dimension;
    soluciony[3].dimension=buscar.dimension;
    soluciong[3].dimension=buscar.dimension;

    var soluciones=[solucionx,soluciony,soluciong]

    var solucion=soluciones[0];
    for (var s of soluciones){ //Se obtiene la solución con menor peso
        if (solucion[1] > s[1]){
            if(s[2]==true){
                solucion=s;
            }
        }else{
            if(s[2]==true && solucion[2]==false){
                solucion=s;
            }
        }
    }
    return solucion;
}

function buscarSolucion(buscar,parametros,rango,buscarInicial){//Primer parametro es el valor a encontrar, los sieguientes son los datos que se conoces, el siguiente siempre es cero
    if (buscar.tipo!="fuerza"){
        var soluciones=[];

        //Intento de solucion a la primera
        var solucion_encontrada=false;
    
        for (var claseE of e.grafo[buscar.tipo]){
            var ecuacion=Object.assign(new claseE(buscar,parametros));
            var peso=ecuacion.getPeso(); //Peso o dificultad de la ecuacion
            var resuelta=false; //Es para saber si está solución funciona o no con estos parametros
            var ecuaciones_usadas=[]; //Guarda el conjunto de ecuaciones a utilizar para esta solución
            var resultado = cloneVariable(buscar);//Guarda la variable resultado
    
            if (ecuacion.getSoluble()){ //Si la ecuacion se resolvio con está ecuacion
                resultado=ecuacion.usar();
                if(resultado.valor!='sin_asignar'){
                    resuelta=true;
                    solucion_encontrada=true;
                }
                ecuaciones_usadas.push([ecuacion.representacion,ecuacion.ecuacionUsar,ecuacion.dimensionBase,resultado.valor,resultado.valor2]);
            }
            var solucion=[ecuaciones_usadas.slice(),peso,resuelta,cloneVariable(resultado)];
            soluciones.push(solucion.slice());
            if (solucion[2]==true && solucion[1]<3){
                return solucion;
            }        
        }
    
        if (solucion_encontrada==false){
            var soluciones=[];
            for (var claseE of e.grafo[buscar.tipo]){ //Obtener todas las ecuaciones que consiguen esta variable
                var ecuacion=Object.assign(new claseE(buscar,parametros));
                var peso=ecuacion.getPeso(); //Peso o dificultad de la ecuacion
                var resuelta=false; //Es para saber si está solución funciona o no con estos parametros
                var ecuaciones_usadas=[]; //Guarda el conjunto de ecuaciones a utilizar para esta solución
                var resultado = cloneVariable(buscar);//Guarda la variable resultado
    
                if (rango<1){//Si no se soluciono pero se está dentro del rango de busqueda 
                    var faltantes=ecuacion.getFaltantes(); //Se obtienen todos las variables que faltan para la ecuación.
                    
                    var n_parametros=[]; //Se clonan los parametros
                    for (var v of parametros){
                        n_parametros.push(cloneVariable(v));
                    }
        
                    var valida=true; //Si vale la pena iniciar otro rango con la nueva variable
                    for (var faltante of faltantes){ 
                        if (faltante.comparar(buscarInicial)){ //S   una variable faltante es la misma que se esta bucando, se ignora esta solucion
                            valida=false;
                            break;
                        }
                    }
        
                    if (valida){
                        for (var faltante of faltantes){ //Buscar las soluciones a todos las variables necesarias para la ecuacion
        
                            if (faltante.tipo=='tiempo' || faltante.tipo=='masa'){
                                var solucion_faltante=buscarSolucionDimensionGeneral(faltante,n_parametros,rango+1,buscarInicial);
                            }
                            else{
                                var solucion_faltante=buscarSolucion(faltante,n_parametros,rango+1,buscarInicial);
                            }
                            
                            if (solucion_faltante[2]==false){ //Si alguna variable no se pudo conseguir no buscar las demas
                                break;
                            }
        
                            peso+=solucion_faltante[1];
                            
                            if ((solucion_faltante[2]==true)){
                                n_parametros.push(cloneVariable(solucion_faltante[3])); //Agregar las variables faltantes a las variables que se usan como parametro
                                for (var ecu of solucion_faltante[0]){
                                    ecuaciones_usadas.push([ ecu[0],ecu[1],ecu[2],ecu[3],ecu[4] ]); //Agregar a las ecuaciones que se usaron para la solucion
                                }
                            }
                        }
                    }
        
                    ecuacion=new claseE(buscar,n_parametros);
        
                    if (ecuacion.getSoluble()){ //Si se resolvio con está ecuacion 
                        resultado=ecuacion.usar();
        
                        if(resultado.valor!='sin_asignar'){
                            resuelta=true;
                        }
        
                        ecuaciones_usadas.push([ecuacion.representacion,ecuacion.ecuacionUsar,ecuacion.dimensionBase,resultado.valor,resultado.valor2 ]);         
                    }
                }
        
                var solucion=[ecuaciones_usadas.slice(),peso,resuelta,cloneVariable(resultado)];
                soluciones.push(solucion.slice());
                if (solucion[2]==true && solucion[1]<3){
                    return solucion;
                }
            }
        }
    
        solucion=soluciones[0];
        for (var s of soluciones){ //Se obtiene la solución con menor peso
            if (solucion[1] > s[1]){
                if(s[2]==true){
                    solucion=s;
                }
            }else{
                if(s[2]==true && solucion[2]==false){
                    solucion=s;
                }
            }
        }
    
    }else{
        eFuerzas.fuerzas(buscar,parametros); 
    }

    return solucion;
}

function usar(variableBuscar,variables){
    //Utiliza la funcion buscarSolucion pasando como parametros diccionarios con dimension, tipo tiempo y valor

    var cpp={}
    var parametros=[];
    var solucion;
    
    //Crear las variables parametros
    for(v of variables){
        if (v['tipo']=='tiempo' || v['tipo']=='masa'){ //Crear una copia si es tiempo para tiempo x y y general
            Object.assign(cpp, propiedades); //Agregar copia de tiempo con dimension x
            cpp['tipo']=v['tipo'];
            cpp['valor']=parseFloat(v['valor']);
            cpp['tiempo']=v['tiempo'];
            cpp['dimension']='x';        
            parametros.push(new e.Variable(cpp));

            Object.assign(cpp, propiedades);  //Agregar copia de tiempo con dimension y
            cpp['tipo']=v['tipo'];
            cpp['valor']=parseFloat(v['valor']);
            cpp['tiempo']=v['tiempo'];
            cpp['dimension']='y';        
            parametros.push(new e.Variable(cpp));

            Object.assign(cpp, propiedades);  //Agregar copia de tiempo con dimension y
            cpp['tipo']=v['tipo'];
            cpp['valor']=parseFloat(v['valor']);
            cpp['tiempo']=v['tiempo'];
            cpp['dimension']='general';        
            parametros.push(new e.Variable(cpp));
        }
        else{
            Object.assign(cpp, propiedades);
            cpp['tipo']=v['tipo'];
            cpp['valor']=parseFloat(v['valor']);
            cpp['tiempo']=v['tiempo'];
            cpp['dimension']=v['dimension'];
            parametros.push(new e.Variable(cpp));
        }
    }

    //Crear variable a buscar

    Object.assign(cpp, propiedades);
    cpp['tipo']=variableBuscar['tipo'];
    cpp['tiempo']=variableBuscar['tiempo'];
    cpp['dimension']=variableBuscar['dimension'];
    var buscar=new e.Variable(cpp);      
    
    if (buscar.tipo=='tiempo' || buscar.tipo=='masa'){
        solucion = buscarSolucionDimensionGeneral(buscar,parametros,0,buscar);
    }
    else{
        solucion = buscarSolucion(buscar,parametros,0,buscar);
    }
    
    return solucion;
}

exports.usar=usar;