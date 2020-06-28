const path = require('path');
var e = require(path.join(__dirname+'/ecuaciones.js'));


propiedades={"tipo":"variable","tiempo":"general","dimension":"general","objeto":"A","otro":"sin_asignar","valor":"sin_asignar","valor2":"sin_asignar"};

class sumatoriaFuerzasGeneral extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="F = (Fx^2 + Fy^2)^0.5"; //sdlkjlksd
        this.nombre="Fuerza resultante";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="fuerza";
        cpp['dimension']="x";
        cpp['tiempo']="general";
        var fx=new Variable(cpp) ;   
        cpp['tipo']="fuerza";
        cpp['dimension']="y";
        cpp['tiempo']="general";
        var fy=new Variable(cpp);
        cpp['tipo']="fuerza";
        cpp['dimension']="x/y";
        cpp['tiempo']="general";
        var ft=new Variable(cpp);

        this.variables=[f,x,y];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo', 'tiempo', 'dimension'];
        this.propiedadesVariablesSobrantes=['otro','objeto'];
        this.despejes=["fx = (ft^2 - fy^2)^0.5","fx = (ft^2 - fx^2)^0.5","ft = (fy^2 + fx^2)^0.5"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    usar(){
        var resultado="sin_asignar";
        var f=this.variables[0].valor;
        var m=this.variables[1].valor;
        var a=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado = Math.sqrt(Math.pow(ft, 2) - Math.pow(fy, 2));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado = Math.sqrt(Math.pow(ft, 2) - Math.pow(fx, 2));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado = Math.sqrt(Math.pow(fy, 2) + Math.pow(fx, 2));
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';
        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

exports.sumatoriaFuerzasGeneral = sumatoriaFuerzasGeneral; 

