const path = require('path');
var e = require(path.join(__dirname+'/ecuaciones.js'));

propiedades={"tipo":"variable","tiempo":"general","dimension":"general","objeto":"A","otro":"sin_asignar","valor":"sin_asignar","valor2":"sin_asignar"};

class Variable{
    constructor(propiedades){
        this.tipo=propiedades["tipo"];
        this.tiempo=propiedades["tiempo"];
        this.dimension=propiedades["dimension"];
        this.objeto=propiedades["objeto"];
        this.otro=propiedades["otro"];
        
        this.valor=propiedades["valor"];
        this.valor2=propiedades["valor2"];

        this.id='sin_asignar';
    }
    comparar(v2){
        if (this.tipo!=v2.tipo)
            return false;
        if (this.tiempo!=v2.tiempo)
            return false;
        if (this.dimension!=v2.dimension)
            return false;
        if (this.objeto!=v2.objeto)
            return false;
        if (this.otro!=v2.otro)
            return false;                           
        return true;
    }

    compararP(v2,propiedadesComparar){ //Compara dos variables solo tomando en cuenta las propiedades tipo,tiempo y constante
        for (var p of propiedadesComparar){
            if (p=='tipo' && this.tipo!=v2.tipo){
                return false;
            }
            if (p=='tiempo' && this.tiempo!=v2.tiempo){
                return false;
            }
            if (p=='dimension' && this.dimension!=v2.dimension){
                return false;
            }
            if (p=='objeto' && this.objeto!=v2.objeto){
                return false;
            }
            if (p=='otro' && this.otro!=v2.otro){
                return false;
            }               
        }
                      
        return true;
    }
}


function fuerzas(buscar,parametros){
    console.log("funciona");
    console.log("variable buscar:");
    console.log(buscar);

    var variableResulta = new Variable(propiedades);
    variableResulta.valor=213;
    variableResulta.valor2=100;

    var ecuacionUsada1=["Representacion base 1","Despeje","en que dimension se utilizo",variableResulta.valor,variableResulta.valor2 ]; //Formato de una ecuacion usada
    var ecuacionUsada2=["Representacion base 2","Despeje","en que dimension se utilizo",variableResulta.valor,variableResulta.valor2 ]; //Formato de una ecuacion usada
    
    var resulta=true; //Si fue resuelta o no
    var peso=2;//peso o dificultad de la solucion
    var solucion = [[ecuacionUsada1,ecuacionUsada2],peso,resulta,variableResulta]; //Formato de la solucion
    return solucion;
}

exports.fuerzas=fuerzas;