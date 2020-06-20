/*
Miguel Angel Guerrero Padilla
Version 0.0.0.1
Ecuaciones revisadas 

Errores actuales:
    Las formulas son texto y no objetos
*/


const tipos_variables=["velocidad","aceleracion","distancia","tiempo"];
const tiempo_variables=["general","media","inicio","fin"];
const  dimension_variables=["general","x","y","z"];
const  objetos_variables=["A","B"];
var propiedades={"tipo":"variable","tiempo":"general","dimension":"general","objeto":"A","otro":"sin_asignar","constante":"sin_asignar","valor":"sin_asignar","valor2":"sin_asignar"};

class Variable{
    constructor(propiedades){
        this.tipo=propiedades["tipo"];
        this.tiempo=propiedades["tiempo"];
        this.dimension=propiedades["dimension"];
        this.objeto=propiedades["objeto"];
        this.otro=propiedades["otro"];
        this.constante=propiedades["constante"];
        this.valor=propiedades["valor"];
        this.valor2=propiedades["valor2"];
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
        if (this.constante!=v2.constante)
            return false;                         
        return true;
    }

    compararP(v2){ //Compara dos variables solo tomando en cuenta las propiedades tipo,tiempo y constante
        if (this.tipo!=v2.tipo)
            return false;
        if (this.tiempo!=v2.tiempo)
            return false;
        if (this.constante!=v2.constante)
            return false;                         
        return true;
    }
    compararP2(v2){ //Compara dos variables solo tomando en cuenta las propiedades tipo,tiempo y constante
        if (this.dimension!=v2.dimension)
            return false;
        if (this.objeto!=v2.objeto)
            return false;
        if (this.otro!=v2.otro)
            return false;                         
        return true;
    }
}

class Ecuacion{ //Clase que toda ecuación debe heredar
    inicializar() {
    }
    constructor(obtener,param_vars){ //Inicializa una ecuacion con una variable base y las variables que encuentre
        this.representacion="sin_asignar"; //Representación por defecto de la ecuación
        this.despejes=[]; //Lista de string con todos los despejes que necesita
        this.variables=[] //lista de variables con las propiedades para usar la ecuación
        this.variables_asignadas=[]; //Lista de booleanos que representan que variables no se tienen para usar la ecuacion
        this.nombre="ecuacion"; 
        this.variable_base=-1; //indice de la variable que se busca con la ecuacion, menos uno si no ha sido asignada
        this.variables_faltantes=0; //Número de variables que faltan para usar la ecuación
        this.dificultad=1; //Peso o dificultad de la ecuación 
        this.inicializar();

        for ( var i=0;i<this.variables.length; i++){ //Otiene el indice del valor que se quiere obtener 
            if (obtener.compararP(this.variables[i])){
                this.variable_base=i; 
                this.variables[i]=obtener;
                this.variables_asignadas[i]=true;
                break;
            }
        }
        if (this.variable_base!=-1){ // //Si se encontro la variable
            for (var V of this.variables){ //Asignar las propiedades de la base a buscar a las demas variables de la ecuacion, si no está para el mismo objeto no la puede usar
                V.dimension=this.variables[this.variable_base].dimension;
                V.otro=this.variables[this.variable_base].otro;
                V.objeto=this.variables[this.variable_base].objeto;
            }

            this.ecuacionUsar=this.despejes[this.variable_base];

            for (var i=0;i<this.variables.length;i++){ //Comprobar si las encuentra en otras variables
                for (var j=0;j<param_vars.length;j++){ //Para cada variable en parametro se revisa si coincide con alugna de las propiedades de las variables para usar la ecuacion y si tiene valor
                    if (param_vars[j].comparar(this.variables[i]) && param_vars[j].valor!='sin_asignar' && param_vars[j].valor!='sin_asignar'){
                        this.variables_asignadas[i]=true;
                        this.variables[i]=param_vars[j];
                        break;
                    }
                }
            }
        }
        else
            this.ecuacionUsar=this.representacion;
        
        this.contarFaltantes()

    }

    contarFaltantes(){ //Cunta cuantas variables faltan para usar la ecuacion
        this.variables_faltantes=0;
        for (var v of this.variables_asignadas)
            if (!v)
                this.variables_faltantes+=1;
    }
    usar(){      
    }

    getPeso(){
        this.contarFaltantes();
        return this.dificultad+this.variables_faltantes*4;  
    }
    getSoluble(){
        this.contarFaltantes();
        if (this.variables_faltantes==0){
            return true;
        }else{
            return false;
        }
    }
    getFaltantes(){
        var v=[]
        for (var i=0;i<this.variables_asignadas.length;i++ )
            if (this.variables_asignadas[i]==false && i!=this.variable_base){
                v.push(this.variables[i]);
            }
        return v;
    }
}

class VelocidadFinal1 extends Ecuacion{
    inicializar(){
        this.representacion="V_f=V_0+at"; //La ecuación por defecto
        this.nombre="velocidad con aceleracion constante"; //Nombre de la ecuación
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        //Se crean las propiedades que deben tener las varaibles para usar esta ecuacioóin
        cpp['tipo']="velocidad";
        cpp['tiempo']="fin";
        cpp['constante']=false;
        var vf=new Variable(cpp);    
        cpp['tipo']="velocidad";
        cpp['tiempo']="inicio";
        cpp['constante']=false;
        var vi=new Variable(cpp);
        cpp['tipo']="aceleracion";
        cpp['tiempo']="general";
        cpp['constante']=true;
        var a=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="general";
        cpp['constante']=false;
        var t=new Variable(cpp);
        this.variables=[vf,vi,a,t];
        this.variables_asignadas=[false,false,false,false];
        this.despejes=["v_f=v_i+a*t","v_i=-a*t+v_f","a=(v_f-v_i)/t","t=(v_f-v_i)/a"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars); //Se llama al metodo padre, Ecuacion __init__()
    }   
    usar(){
        var resultado="sin_asignar";
        if (this.variables_faltantes==0){
            if (this.variable_base==0) //vf=vi+a*t
                resultado= this.variables[1].valor+this.variables[2].valor*this.variables[3].valor;
            else if (this.variable_base==1) //vi=-a*t+vf
                resultado=-this.variables[2].valor*this.variables[3].valor+this.variables[0].valor;
            else if (this.variable_base==2) //a=(vf-vi)/t
                resultado=(this.variables[0].valor-this.variables[1].valor)/this.variables[3].valor;
            else if (this.variable_base==3) //t=(vf-vi)/a
                resultado=(this.variables[0].valor-this.variables[1].valor)/this.variables[2].valor;
            
            this.variables[this.variable_base].valor=resultado;
        }
        return this.variables[this.variable_base];
    }
}

class TiempoG extends Ecuacion{
    inicializar(){
        this.representacion="t=t_f - t_0";
        this.nombre="Cambio de tiempo";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="tiempo";
        cpp['tiempo']="inicio";
        cpp['constante']=false;
        var ti=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="fin";
        cpp['constante']=false;
        var tf=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="general";
        cpp['constante']=false;
        var t = new Variable(cpp);
        this.variables=[t,ti,tf];
        this.variables_asignadas=[false,false,false];
        this.despejes=["t=t_f-t_i","t_i=t_f-t","t_f=t_i+t"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    usar(){
        var resultado="sin_asignar";
        if (this.variables_faltantes==0){
            if (this.variable_base==0) //t=tf-ti
                resultado= this.variables[2].valor-this.variables[1].valor;
            else if (this.variable_base==1) //ti=tf-t
                resultado=-this.variables[0].valor+this.variables[2].valor;
            else if (this.variable_base==2) //tf=ti+t
                resultado=this.variables[0].valor+this.variables[1].valor;
        }
        if (this.variable_base!=-1){
            this.variables[this.variable_base].valor=resultado;
            return this.variables[this.variable_base];   
        }
        else{
            this.variables[this.variable_base].valor="sin_asignar";
            return this.variables[this.variable_base];   
        }
    }
}

class DistanciaG extends Ecuacion{
    inicializar(){
        this.representacion="d=d_f - d_0";
        this.nombre="Cambio de distancia";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="distancia";
        cpp['tiempo']="inicio";
        cpp['constante']=false;
        var di=new Variable(cpp);   
        cpp['tipo']="distancia";
        cpp['tiempo']="fin";
        cpp['constante']=false;
        var df=new Variable(cpp);
        cpp['tipo']="distancia";
        cpp['tiempo']="general";
        cpp['constante']=false;
        var d=new Variable(cpp);
        this.variables=[d,di,df];
        this.variables_asignadas=[false,false,false];
        this.despejes=["d=d_f-d_i","d_i=d_f-d","d_f=d+d_i"]
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars)
    }
    usar(){
        var resultado="sin_asignar"
        var d=this.variables[0].valor
        var di=this.variables[1].valor
        var df=this.variables[2].valor
        
        if (this.variables_faltantes==0){ //d=df-di
            if (this.variable_base==0 )
                resultado= df-di
            else if (this.variable_base==1) //di=df-d
                resultado=df-d
            else if (this.variable_base==2)  //df=d+di
                resultado=d+di
        }
        this.variables[this.variable_base].valor=resultado
        return this.variables[this.variable_base]    
    }
}

class DistanciaFinal1 extends Ecuacion{
    inicializar(){
        this.dificultad=2
        this.representacion="df=di+v*t+(1/2)*a*t^2"
        this.nombre="Distancia final con aceleración constante"
        var cpp={}
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="distancia"
        cpp['tiempo']="inicio"
        cpp['constante']=false
        var di=new Variable(cpp)    

        cpp['tipo']="distancia"
        cpp['tiempo']="fin"
        cpp['constante']=false
        var df=new Variable(cpp)

        cpp['tipo']="velocidad"
        cpp['tiempo']="inicio"
        cpp['constante']=false
        var vi=new Variable(cpp)
        
        cpp['tipo']="tiempo"
        cpp['tiempo']="general"
        cpp['constante']=false
        var t=new Variable(cpp)

        cpp['tipo']="aceleracion"
        cpp['tiempo']="general"
        cpp['constante']=true
        var a=new Variable(cpp)

        this.variables=[df,di,vi,a,t]
        this.variables_asignadas=[false,false,false,false,false]
        this.despejes=["d_f=d_i+v_i*t+0.5*a*t^2","d_i=d_f-v_i*t-0.5*a*t^2","v_i=(d_f-d_i-0.5*a*t^2)/t","a=(d_f-d_i-v_i*t)/(0.5*t*t)","t=(-v_i (+/-) sqrt(v_i^2-4(0.5a)(d_i-d_f)))/(2(0.5*a))"]
       
    }
    constructor(obtener,param_bars){
         super(obtener,param_bars)
    }    
    usar(){
        var vi=this.variables[2].valor
        var df=this.variables[0].valor
        var di=this.variables[1].valor
        var a=this.variables[3].valor
        var t=this.variables[4].valor
        var resultado="sin_asignar"

        if (this.variables_faltantes==0){ 
            if (this.variable_base==0) //df=di+v*t+0.5*a*t^2
                resultado= di+vi*t+0.5*a*t*t;
            else if (this.variable_base==1) //di=df-v*t-0.5*a*t^2
                resultado= this.variables[0].valor-this.variables[2].valor*this.variables[4].valor-0.5*this.variables[3].valor*this.variables[4].valor*this.variables[4].valor
            else if (this.variable_base==2) //v=(df-di-0.5*a*t^2)/t
                resultado=(this.variables[0].valor-this.variables[1].valor-0.5*this.variables[3].valor*this.variables[4].valor*this.variables[4].valor)/this.variables[4].valor
            else if (this.variable_base==3) //a=(df-di-v*t)/(0.5*t*t)
                resultado=(this.variables[0].valor-this.variables[1].valor-this.variables[2].valor*this.variables[4].valor)/(0.5*this.variables[4].valor*this.variables[4].valor)
            else if (this.variable_base==4) //t=(-v (+/-) sqrt(v^2-4(0.5a)(di-df)))/(2(0.5*a))
                try{
                    resultado=(-vi + Math.sqrt(vi*vi-4*0.5*a*(di-df)) )/(2*0.5*a)
                    if (resultado<=0){
                        this.variables[this.variable_base].valor2=resultado
                        resultado=(-vi - Math.sqrt(vi*vi-4*0.5*a*(di-df)) )/(2*0.5*a)
                    }
                    else
                        this.variables[this.variable_base].valor2=(-vi - Math.sqrt(vi*vi-4*0.5*a*(di-df)) )/(2*0.5*a)
                }
                catch (error){
                    resultado="sin_asignar"
                    console.log(error)
                }
            }
        this.variables[this.variable_base].valor=resultado
        return this.variables[this.variable_base]    
    }
}

class VelocidadFinal2 extends Ecuacion{
    inicializar(){
        this.dificultad=2;
        this.representacion="V_f=V_0^2+2*a*d";
        this.nombre="velocidad con aceleracion constante sin tiempo";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="velocidad";
        cpp['tiempo']="fin";
        cpp['constante']=false;
        var vf=new Variable(cpp);    
        cpp['tipo']="velocidad";
        cpp['tiempo']="inicio";
        cpp['constante']=false;
        var vi=new Variable(cpp);
        cpp['tipo']="aceleracion";
        cpp['tiempo']="general";
        cpp['constante']=true;
        var a=new Variable(cpp);
        cpp['tipo']="distancia";
        cpp['tiempo']="general";
        cpp['constante']=false;
        var d=new Variable(cpp);
        this.variables=[vf,vi,a,d];
        this.variables_asignadas=[false,false,false,false];
        this.despejes=["v_f=sqrt(v_i^2+2*a*d)","v_i=sqrt(2*a*d-v_f^2)","a=(v_f^2-v_i^2)/(2*d)","d=(v_f^2-v_i^2)/(2*a)"];
    }
    constructor(obtener,param_bars){

        super(obtener,param_bars);
    }
    usar(){
        var resultado="sin_asignar";
        var vf=this.variables[0].valor;
        var vi=this.variables[1].valor;
        var a=this.variables[2].valor;
        var d=this.variables[3].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ //vf=sqrt(vi^2+2*a*d)
                try{
                    resultado=Math.sqrt(vi*vi+2*a*d);
                    this.variables[this.variable_base].valor2=-resultado;
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1){ //vi=sqrt(2*a*d-vf^2)
                try{
                    resultado=Math.sqrt(-(vf*vf)+2*a*d);
                    this.variables[this.variable_base].valor2=-resultado;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==2) //a=(vf^2-vi^2)/(2*d)
                resultado=(vf*vf-vi*vi)/(2*d);
            else if (this.variable_base==3) //d=(vf^2-vi^2)/(2*a)
                resultado=(vf*vf-vi*vi)/(2*a);
        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}
class DistanciaG2 extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="d=0.5*(V_i+V_f)*t";
        this.nombre="distancia sin aceleración";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="velocidad";
        cpp['tiempo']="fin";
        cpp['constante']=false;
        var vf=new Variable(cpp) ;   
        cpp['tipo']="velocidad";
        cpp['tiempo']="inicio";
        cpp['constante']=false;
        var vi=new Variable(cpp);
        cpp['tipo']="distancia";
        cpp['tiempo']="general";
        cpp['constante']=false;
        var d=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="general";
        cpp['constante']=false;
        var t=new Variable(cpp);

        this.variables=[d,vf,vi,t];
        this.variables_asignadas=[false,false,false,false];
        this.despejes=["d=0.5*(v_i+v_f)*t","v_f=2*d/t-v_i","v_i=2*d/t-v_f","t=2*d/(v_f+v_i)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    usar(){
        var resultado="sin_asignar";
        var vf=this.variables[1].valor;
        var vi=this.variables[2].valor;
        var t=this.variables[3].valor;
        var d=this.variables[0].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=0.5*(vi+vf)*t;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=2*d/t-vi;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=2*d/t-vf;
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if ( this.variable_base==3){ 
                try{
                    resultado=2*d/(vf+vi);
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

var grafo={"velocidad":[VelocidadFinal1,DistanciaFinal1,VelocidadFinal2,DistanciaG2],
"tiempo":[TiempoG,VelocidadFinal1,DistanciaFinal1,DistanciaG2],
"aceleracion":[VelocidadFinal1,DistanciaFinal1,VelocidadFinal2],
"distancia":[DistanciaFinal1,DistanciaG,VelocidadFinal2,DistanciaG2]};

exports.Variable = Variable;
exports.Ecuacion = Ecuacion;

exports.grafo = grafo;
exports.propiedades = propiedades;

exports.DistanciaG2 = DistanciaG2;
exports.VelocidadFinal2 = VelocidadFinal2;
exports.DistanciaFinal1 = DistanciaFinal1;
exports.DistanciaG = DistanciaG;
exports.TiempoG = TiempoG;
exports.VelocidadFinal1 = VelocidadFinal1;


