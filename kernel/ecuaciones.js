/*
Miguel Angel Guerrero Padilla
Version 0.0.0.5
Ecuaciones revisadas 

Errores actuales:
    Las formulas son texto y no objetos
*/

const tipos_variables=["velocidad","aceleracion","distancia","tiempo","angulo","fuerza","masa","trabajo","cinetica"];
const tiempo_variables=["general","media","inicio","fin"];
const  dimension_variables=["x/y","x","y"];
const  objetos_variables=["A","B"];
var propiedades={"id":"sin_asignar","tipo":"variable","tiempo":"general","dimension":"general","objeto":"A","otro":"sin_asignar","valor":"sin_asignar","valor2":"sin_asignar","nFuerza":"general"};

class Variable{
    constructor(propiedades){
        this.tipo=propiedades["tipo"];
        this.tiempo=propiedades["tiempo"];
        this.dimension=propiedades["dimension"];
        this.objeto=propiedades["objeto"];
        this.otro=propiedades["otro"];
        this.nFuerza=propiedades["nFuerza"];
        
        this.valor=propiedades["valor"];
        this.valor2=propiedades["valor2"];

        this.id=propiedades["id"];
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
            if (p=='nFuerza' && this.nFuerza!=v2.nFuerza){
                return false;
            }             
        }
                      
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
        this.dimensionBase='x';
        this.propiedadesVariablesComparar=[]; //Propiedades que son requerimientos para inicilizar las variables de las ecuaciones
        this.propiedadesVariablesSobrantes=[];

        this.ecuacionconIdentificador="sin_asignar";
        this.inicializar();

        for ( var i=0;i<this.variables.length; i++){ //Otiene el indice del valor que se quiere obtener 
            if (obtener.compararP(this.variables[i],this.propiedadesVariablesComparar)){
                this.variable_base=i; 
                this.variables[i]=obtener;
                this.variables_asignadas[i]=true;
                break;
            }
        }

        if (this.variable_base!=-1){ // //Si se encontro la variable
            
            this.dimensionBase=this.variables[this.variable_base].dimension;

            for (var V of this.variables){ //Asignar las propiedades de la base a buscar a las demas variables de la ecuacion, si no está para el mismo objeto no la puede usar
                for (var p of this.propiedadesVariablesSobrantes){
                    if (p=='tipo'){
                        V.tipo=this.variables[this.variable_base].tipo;
                    }
                    if (p=='tiempo'){
                        V.tiempo=this.variables[this.variable_base].tiempo;
                    }
                    if (p=='dimension'){
                        V.dimension=this.variables[this.variable_base].dimension;
                    }
                    if (p=='objeto'){
                        V.objeto=this.variables[this.variable_base].objeto;
                    }
                    if (p=='otro'){
                        V.otro=this.variables[this.variable_base].otro;
                    }   
                }
            }

            this.ecuacionUsar=this.despejes[this.variable_base];

            for (var i=0;i<this.variables.length;i++){ //Comprobar si las encuentra en otras variables
                for (var j=0;j<param_vars.length;j++){ //Para cada variable en parametro se revisa si coincide con alugna de las propiedades de las variables para usar la ecuacion y si tiene valor
                    if (param_vars[j].comparar(this.variables[i]) && param_vars[j].valor!='sin_asignar'){
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

    getEcuacionIdentificada(nuevoID){
        return "sin_asignar";
    }
}

class VelocidadFinal1 extends Ecuacion{
    inicializar(){
        this.representacion="v_f = v_i + a*t"; //La ecuación por defecto
        this.nombre="velocidad con aceleracion constante"; //Nombre de la ecuación
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        //Se crean las propiedades que deben tener las varaibles para usar esta ecuacioóin
        cpp['tipo']="velocidad";
        cpp['tiempo']="fin";
        var vf=new Variable(cpp);    
        cpp['tipo']="velocidad";
        cpp['tiempo']="inicio";
        var vi=new Variable(cpp);
        cpp['tipo']="aceleracion";
        cpp['tiempo']="general";
        var a=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="general";
        var t=new Variable(cpp);
        this.variables=[vf,vi,a,t];
        this.variables_asignadas=[false,false,false,false];
        this.propiedadesVariablesComparar=['tipo','tiempo'];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["v_f = v_i + a*t","v_i = -a*t + v_f","a = (v_f-v_i)/t","t = (v_f-v_i)/a"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars); //Se llama al metodo padre, Ecuacion __init__()
    }  
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var vf=this.variables[0];
            var vi=this.variables[1];
            var a=this.variables[2];
            var t=this.variables[3];
            this.ecuacionconIdentificador="v["+vf.id+"] = "+"v["+vi.id+"] + a["+a.id+"]*t["+t.id+"]";
        }
        return this.ecuacionconIdentificador;
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
            
            resultado=Math.round(resultado*10000)/10000;

            if (!Number.isFinite(resultado)){
                resultado='sin_asignar';
            }
            
            this.variables[this.variable_base].valor=resultado;
        }
        return this.variables[this.variable_base];
    }
}

class TiempoG extends Ecuacion{
    inicializar(){
        this.representacion="t = t_f - t_i";
        this.nombre="Cambio de tiempo";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="tiempo";
        cpp['tiempo']="inicio";
        var ti=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="fin";
        var tf=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="general";
        var t = new Variable(cpp);
        this.variables=[t,ti,tf];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo','tiempo'];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["t = t_f - t_i","t_i = t_f - t","t_f = t_i + t"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var tg=this.variables[0];
            var ti=this.variables[1];
            var tf=this.variables[2];
            this.ecuacionconIdentificador="t["+tg.id+"] = "+"t["+tf.id+"] - t["+ti.id+"]";
        }
        return this.ecuacionconIdentificador;
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
            resultado=Math.round(resultado*10000)/10000;
        }

        if (this.variable_base!=-1){
            if (!Number.isFinite(resultado)){
                resultado='sin_asignar';
            }
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
        this.representacion="d = d_f - d_i";
        this.nombre="Cambio de distancia";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="distancia";
        cpp['tiempo']="inicio";
        var di=new Variable(cpp);   
        cpp['tipo']="distancia";
        cpp['tiempo']="fin";
        var df=new Variable(cpp);
        cpp['tipo']="distancia";
        cpp['tiempo']="general";
        var d=new Variable(cpp);
        this.variables=[d,di,df];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo','tiempo'];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["d = d_f - d_i","d_i = d_f - d","d_f = d + d_i"]
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars)
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var d=this.variables[0];
            var di=this.variables[1];
            var df=this.variables[2];
            this.ecuacionconIdentificador="d["+d.id+"] = "+"d["+df.id+"] - d["+di.id+"]";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar"
        var d=this.variables[0].valor
        var di=this.variables[1].valor
        var df=this.variables[2].valor
        
        if (this.variables_faltantes==0){ //d=df-di
            if (this.variable_base==0 )
                resultado= df-di;
            else if (this.variable_base==1) //di=df-d
                resultado=df-d;
            else if (this.variable_base==2)  //df=d+di
                resultado=d+di;

            resultado=Math.round(resultado*10000)/10000;
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';
        }
        this.variables[this.variable_base].valor=resultado
        return this.variables[this.variable_base]    
    }
}

class DistanciaFinal1 extends Ecuacion{
    inicializar(){
        this.dificultad=2;
        this.representacion="df = di + v*t + (1/2)*a*t^2";
        this.nombre="Distancia final con aceleración constante";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="distancia";
        cpp['tiempo']="inicio";
        var di=new Variable(cpp);    

        cpp['tipo']="distancia";
        cpp['tiempo']="fin";
        var df=new Variable(cpp);

        cpp['tipo']="velocidad";
        cpp['tiempo']="inicio";
        var vi=new Variable(cpp);
        
        cpp['tipo']="tiempo";
        cpp['tiempo']="general";
        var t=new Variable(cpp);

        cpp['tipo']="aceleracion";
        cpp['tiempo']="general";
        var a=new Variable(cpp);

        this.variables=[df,di,vi,a,t];
        this.variables_asignadas=[false,false,false,false,false];
        this.propiedadesVariablesComparar=['tipo','tiempo'];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["d_f = d_i + v_i*t + 0.5*a*t^2","d_i = d_f - v_i*t - 0.5*a*t^2","v_i = (d_f-d_i-0.5*a*t^2)/t","a = (d_f-d_i-v_i*t)/(0.5*t*t)","t = ( -v_i (+/-) (v_i^2- 4(0.5*a)(d_i-d_f))^(1/2) ) / a "];
       
    }
    constructor(obtener,param_bars){
         super(obtener,param_bars)
    }  
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var df=this.variables[0];
            var di=this.variables[1];
            var vi=this.variables[2];
            var a=this.variables[3];
            var t=this.variables[4];
            this.ecuacionconIdentificador="d["+df.id+"] = "+"d["+di.id+"] + v["+vi.id+"]*t["+t.id+"] + (1/2)*a["+a.id+"]*t["+t.id+"]^2";
        }
        return this.ecuacionconIdentificador;
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
                    var resultado1=(-vi + Math.sqrt(vi*vi-4*0.5*a*(di-df)) )/(2*0.5*a);
                    var resultado2=(-vi - Math.sqrt(vi*vi-4*0.5*a*(di-df)) )/(2*0.5*a);

                    resultado1=Math.round(resultado1*10000)/10000;
                    resultado2=Math.round(resultado2*10000)/10000;

                    if(resultado1>resultado2){
                        resultado=resultado1;
                        this.variables[this.variable_base].valor2=resultado2;
                    }else{
                        resultado=resultado2;
                        this.variables[this.variable_base].valor2=resultado1;                        
                    }

                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }

                try{
                    resultado=Math.round(resultado*10000)/10000;
                }catch{}
            }

        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';
        }

        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class VelocidadFinal2 extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="vf^2 = vi^2+ 2*a*d";
        this.nombre="velocidad con aceleracion constante sin tiempo";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="velocidad";
        cpp['tiempo']="fin";
        var vf=new Variable(cpp);    
        cpp['tipo']="velocidad";
        cpp['tiempo']="inicio";
        var vi=new Variable(cpp);
        cpp['tipo']="aceleracion";
        cpp['tiempo']="general";
        var a=new Variable(cpp);
        cpp['tipo']="distancia";
        cpp['tiempo']="general";
        var d=new Variable(cpp);
        this.variables=[vf,vi,a,d];
        this.variables_asignadas=[false,false,false,false];
        this.propiedadesVariablesComparar=['tipo','tiempo'];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["v_f = (v_i^2+2*a*d)^(1/2)","v_i = (v_f^2-2*a*d)^(1/2)","a = (v_f^2-v_i^2)/(2*d)","d = (v_f^2-v_i^2)/(2*a)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var vf=this.variables[0];
            var vi=this.variables[1];
            var a=this.variables[2];
            var d=this.variables[3];
            this.ecuacionconIdentificador="vf["+vf.id+"]^2 = "+"v["+vi.id+"]^2 + 2*a["+a.id+"]*d["+d.id+"]^2";
        }
        return this.ecuacionconIdentificador;
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
            else if (this.variable_base==1){ //vi=sqrt(-2*a*d+vf^2)
                try{
                    resultado=Math.sqrt((vf*vf)-2*a*d);
                    this.variables[this.variable_base].valor2=-resultado;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==2) //a=(vf^2-vi^2)/(2*d)
                try{
                    resultado=(vf*vf-vi*vi)/(2*d);
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==3){ //d=(vf^2-vi^2)/(2*a)
                try{
                resultado=(vf*vf-vi*vi)/(2*a);
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }

            resultado=Math.round(resultado*10000)/10000;
        }


        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }

        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class DistanciaG2 extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="d = 0.5*(v_i+v_f)*t";
        this.nombre="distancia sin aceleración";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="velocidad";
        cpp['tiempo']="fin";
        var vf=new Variable(cpp) ;   
        cpp['tipo']="velocidad";
        cpp['tiempo']="inicio";
        var vi=new Variable(cpp);
        cpp['tipo']="distancia";
        cpp['tiempo']="general";
        var d=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="general";
        var t=new Variable(cpp);

        this.variables=[d,vf,vi,t];
        this.variables_asignadas=[false,false,false,false];
        this.propiedadesVariablesComparar=['tipo','tiempo'];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["d = 0.5*(v_i+v_f)*t","v_f = 2*d/t-v_i","v_i = 2*d/t-v_f","t = 2*d/(v_f+v_i)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var d=this.variables[0];
            var vf=this.variables[1];
            var vi=this.variables[2];
            var t=this.variables[3];
            this.ecuacionconIdentificador="d["+d.id+"] = "+"0.5*(v["+vi.id+"] + v["+vf.id+"])*t["+t.id+"]^2";
        }
        return this.ecuacionconIdentificador;
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
            try{
            resultado=Math.round(resultado*10000)/10000;
            }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

//Con compomnentes

class VelocidadComponentesX1 extends Ecuacion{
    inicializar(){
        this.dificultad=1.5;
        this.representacion="vx = v*cos(teta)";
        this.nombre="Velocidad en x con respecto a la magnitud de la velocidad y un angulo con respecto a la horizontal (grados)";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="velocidad";
        cpp['dimension']="x";
        var vx=new Variable(cpp) ;   
        cpp['tipo']="velocidad";
        cpp['dimension']="x/y";
        var v=new Variable(cpp);
        cpp['tipo']="angulo";
        cpp['dimension']="velocidad";
        var angulo=new Variable(cpp);

        this.variables=[v,vx,angulo];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo','dimension'];
        this.propiedadesVariablesSobrantes=['tiempo','otro','objeto'];
        this.despejes=["v = vx/cos(teta)","vx = v*cos(teta)","teta = arccos (vx/v)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var v=this.variables[0];
            var vx=this.variables[1];
            var angulo=this.variables[2];
            this.ecuacionconIdentificador="vx["+vx.id+"] = "+"v["+v.id+"]*cos(teta["+angulo.id+"])";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var v=this.variables[0].valor;
        var vx=this.variables[1].valor;
        var teta=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=vx/(Math.cos(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=v*(Math.cos(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.acos(vx/v);
                    resultado=(resultado*180)/Math.PI; //COnvertir a grados
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }

        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';
        }

        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class VelocidadComponentesY1 extends Ecuacion{
    inicializar(){
        this.dificultad=1.5;
        this.representacion="vy = v*sin(teta)";
        this.nombre="Velocidad en y con respecto a la magnitud de la velocidad y un angulo con respecto a la horizontal (grados)";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="velocidad";
        cpp['dimension']="y";
        var vy=new Variable(cpp) ;   
        cpp['tipo']="velocidad";
        cpp['dimension']="x/y";
        var v=new Variable(cpp);
        cpp['tipo']="angulo";
        cpp['dimension']="velocidad";
        var angulo=new Variable(cpp);

        this.variables=[v,vy,angulo];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo','dimension'];
        this.propiedadesVariablesSobrantes=['tiempo','otro','objeto'];
        this.despejes=["v = vy/sin(teta)","vy = v*sin(teta)","teta = arcsin (Vy/V)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var v=this.variables[0];
            var vy=this.variables[1];
            var angulo=this.variables[2];
            this.ecuacionconIdentificador="vy["+vy.id+"] = "+"v["+v.id+"]*sin(teta["+angulo.id+"])";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var v=this.variables[0].valor;
        var vy=this.variables[1].valor;
        var teta=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=vy/(Math.sin(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=v*(Math.sin(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.asin(vy/v);
                    resultado=(resultado*180)/Math.PI; //COnvertir a grados
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';
        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class AceleracionComponentesX1 extends Ecuacion{
    inicializar(){
        this.dificultad=1.5;
        this.representacion="ax = a*cos(teta)";
        this.nombre="Aceleracion en x con respecto a la magnitud de la velocidad y un angulo con respecto a la horizontal (grados)";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="aceleracion";
        cpp['dimension']="x";
        var ax=new Variable(cpp) ;   
        cpp['tipo']="aceleracion";
        cpp['dimension']="x/y";
        var a=new Variable(cpp);
        cpp['tipo']="angulo";
        cpp['dimension']="aceleracion";
        var angulo=new Variable(cpp);

        this.variables=[a,ax,angulo];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo','dimension'];
        this.propiedadesVariablesSobrantes=['tiempo','otro','objeto'];
        this.despejes=["a = ax/cos(teta)","ax = a*cos(teta)","teta = arccos (ax/a)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var a=this.variables[0];
            var ax=this.variables[1];
            var angulo=this.variables[2];
            this.ecuacionconIdentificador="ax["+ax.id+"] = "+"a["+a.id+"]*cos(teta["+angulo.id+"])";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var a=this.variables[0].valor;
        var ax=this.variables[1].valor;
        var teta=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=ax/(Math.cos(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=a*(Math.cos(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.acos(ax/a);
                    resultado=(resultado*180)/Math.PI; //COnvertir a grados
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }

        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';
        }

        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class AceleracionComponentesY1 extends Ecuacion{
    inicializar(){
        this.dificultad=1.5;
        this.representacion="ay = a*sin(teta)";
        this.nombre="Aceleracion en y con respecto a la magnitud de la velocidad y un angulo con respecto a la horizontal (grados)";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="aceleracion";
        cpp['dimension']="y";
        var ay=new Variable(cpp) ;   
        cpp['tipo']="aceleracion";
        cpp['dimension']="x/y";
        var a=new Variable(cpp);
        cpp['tipo']="angulo";
        cpp['dimension']="aceleracion";
        var angulo=new Variable(cpp);

        this.variables=[a,ay,angulo];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo','dimension'];
        this.propiedadesVariablesSobrantes=['tiempo','otro','objeto'];
        this.despejes=["a = ay/sin(teta)","ay = a*sin(teta)","teta = arcsin (ay/a)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var a=this.variables[0];
            var ay=this.variables[1];
            var angulo=this.variables[2];
            this.ecuacionconIdentificador="ay["+ay.id+"] = "+"a["+a.id+"]*cos(teta["+angulo.id+"])";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var a=this.variables[0].valor;
        var ay=this.variables[1].valor;
        var teta=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=ay/(Math.sin(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=a*(Math.sin(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.asin(ay/a);
                    resultado=(resultado*180)/Math.PI; //COnvertir a grados
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}



class VelocidadComponentes2 extends Ecuacion{
    inicializar(){
        this.dificultad=1.5;
        this.representacion="v^2 = vx^2 + vy^2";
        this.nombre="Velocidad y sus componentes y pitagoras";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="velocidad";
        cpp['dimension']="y";
        var vy=new Variable(cpp) ;   
        cpp['tipo']="velocidad";
        cpp['dimension']="x/y";
        var v=new Variable(cpp);
        cpp['tipo']="velocidad";
        cpp['dimension']="x";
        var vx=new Variable(cpp);


        this.variables=[v,vx,vy];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo','dimension'];
        this.propiedadesVariablesSobrantes=['tiempo','otro','objeto'];
        this.despejes=["v = (vx^2+vy^2)^(1/2)","vx = (v^2-vy^2)^(1/2)","vy = (v^2-vx^2)^(1/2)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var v=this.variables[0];
            var vx=this.variables[1];
            var vy=this.variables[2];
            this.ecuacionconIdentificador="v["+v.id+"]^2 = "+"vx["+vx.id+"]^2 + vy["+vy.id+"]^2";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var v=this.variables[0].valor;
        var vx=this.variables[1].valor;
        var vy=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=Math.sqrt(vx*vx+vy*vy);
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=Math.sqrt(v*v-vy*vy);
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.sqrt(v*v-vx*vx);
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';
        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class AceleracionComponentes2 extends Ecuacion{
    inicializar(){
        this.dificultad=1.5;
        this.representacion="a^2 = ax^2 + ay^2";
        this.nombre="Aceleracion con pitagoras y sus dos componentes";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="aceleracion";
        cpp['dimension']="y";
        var vy=new Variable(cpp) ;   
        cpp['tipo']="aceleracion";
        cpp['dimension']="x/y";
        var v=new Variable(cpp);
        cpp['tipo']="aceleracion";
        cpp['dimension']="x";
        var vx=new Variable(cpp);

        this.variables=[v,vx,vy];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo','dimension'];
        this.propiedadesVariablesSobrantes=['tiempo','otro','objeto'];
        this.despejes=["a = (ax^2+ay^2)^(1/2)","ax = (a^2-ay^2)^(1/2)","ay = (a^2-ax^2)^(1/2)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var a=this.variables[0];
            var ax=this.variables[1];
            var ay=this.variables[2];
            this.ecuacionconIdentificador="a["+a.id+"]^2 = "+"ax["+ax.id+"]^2 + ay["+ay.id+"]^2";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var v=this.variables[0].valor;
        var vx=this.variables[1].valor;
        var vy=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=Math.sqrt(vx*vx+vy*vy);
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=Math.sqrt(v*v-vy*vy);
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.sqrt(v*v-vx*vx);
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }

        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';
        }

        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

//Fin con componentes 


class VelocidadMedia1 extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="vm = (df-di)/t";
        this.nombre="Velocidad media";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="distancia";
        cpp['tiempo']="inicio";
        var di=new Variable(cpp) ;   
        cpp['tipo']="distancia";
        cpp['tiempo']="fin";
        var df=new Variable(cpp);
        cpp['tipo']="velocidad";
        cpp['tiempo']="media";
        var vm=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="general";
        var t=new Variable(cpp);

        this.variables=[vm,df,di,t];
        this.variables_asignadas=[false,false,false,false];
        this.propiedadesVariablesComparar=['tipo','tiempo'];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["vm = (df-di)/t"," vf = vm*t + di","di = df - vm*t","t = (df-di)/vm"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var vm=this.variables[0];
            var df=this.variables[1];
            var di=this.variables[2];
            var t=this.variables[2];
            this.ecuacionconIdentificador="vm["+vm.id+"] = "+"(df["+df.id+"] - di["+di.id+"])/t["+t.id+"]";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var vm=this.variables[0].valor;
        var vf=this.variables[1].valor;
        var vi=this.variables[2].valor;
        var t=this.variables[3].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=(vf-vi)/t;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=vm*t+vi;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=vf-vm*t;
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==3){ 
                try{
                    resultado=(vf-vi)/vm;
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';
        }

        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class AceleracionMedia1 extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="am = (vf-vi)/t";
        this.nombre="aceleracion media";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="velocidad";
        cpp['tiempo']="inicio";
        var vi=new Variable(cpp) ;   
        cpp['tipo']="velocidad";
        cpp['tiempo']="fin";
        var vf=new Variable(cpp);
        cpp['tipo']="aceleracion";
        cpp['tiempo']="media";
        var vm=new Variable(cpp);
        cpp['tipo']="tiempo";
        cpp['tiempo']="general";
        var t=new Variable(cpp);

        this.variables=[vm,vf,vi,t];
        this.variables_asignadas=[false,false,false,false];
        this.propiedadesVariablesComparar=['tipo','tiempo'];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["am = (vf-vi)/t"," vf = am*t + vi","vi = vf - am*t","t = (vf-vi)/am"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var am=this.variables[0];
            var vf=this.variables[1];
            var vi=this.variables[2];
            var t=this.variables[2];
            this.ecuacionconIdentificador="am["+am.id+"] = "+"(vf["+vf.id+"] - vi["+vi.id+"])/t["+t.id+"]";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var vm=this.variables[0].valor;
        var vf=this.variables[1].valor;
        var vi=this.variables[2].valor;
        var t=this.variables[3].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=(vf-vi)/t;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=vm*t+vi;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=vf-vm*t;
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==3){ 
                try{
                    resultado=(vf-vi)/vm;
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class FuerzaAM extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="F = m*a";
        this.nombre="Segunda ley de newton";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="fuerza";
        cpp['tiempo']="general";
        var f=new Variable(cpp) ;   
        cpp['tipo']="masa";
        cpp['tiempo']="general";
        var m=new Variable(cpp);
        cpp['tipo']="aceleracion";
        cpp['tiempo']="general";
        var a=new Variable(cpp);

        this.variables=[f,m,a];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo',"tiempo"];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["F = m*a"," m = F/a","a = F/m"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var f=this.variables[0];
            var m=this.variables[1];
            var a=this.variables[2];
            this.ecuacionconIdentificador="f["+f.id+"] = "+"m["+m.id+"]*a["+a.id+"]";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var f=this.variables[0].valor;
        var m=this.variables[1].valor;
        var a=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=m*a;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=f/a;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=f/m;
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

class VelocidadComponentes3 extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="tan(teta) = vy/vx";
        this.nombre="Segunda ley de newton";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="velocidad";
        cpp['dimension']="x";
        var vx=new Variable(cpp) ;   
        cpp['tipo']="velocidad";
        cpp['dimension']="y";
        var vy=new Variable(cpp);
        cpp['tipo']="angulo";
        cpp['dimension']="velocidad";
        var teta=new Variable(cpp);

        this.variables=[vx,vy,teta];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo',"dimension"];
        this.propiedadesVariablesSobrantes=['tiempo','otro','objeto'];
        this.despejes=["vx = vy/tan(teta)"," vy = vx*tan(teta)","teta = arctan(vy/vx)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var vx=this.variables[0];
            var vy=this.variables[1];
            var a=this.variables[2];
            this.ecuacionconIdentificador="tan(teta["+a.id+"]) = "+"vy["+vy.id+"]/vx["+vx.id+"]";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var vx=this.variables[0].valor;
        var vy=this.variables[1].valor;
        var teta=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=vy/(Math.tan(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=vx*(Math.tan(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.atan(vy/vx);
                    resultado=(resultado*180)/Math.PI; //COnvertir a grados
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class AceleracionComponentes3 extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="tan(teta) = ay/ax";
        this.nombre="Segunda ley de newton";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="aceleracion";
        cpp['dimension']="x";
        var vx=new Variable(cpp) ;   
        cpp['tipo']="aceleracion";
        cpp['dimension']="y";
        var vy=new Variable(cpp);
        cpp['tipo']="angulo";
        cpp['dimension']="aceleracion";
        var teta=new Variable(cpp);

        this.variables=[vx,vy,teta];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo',"dimension"];
        this.propiedadesVariablesSobrantes=['tiempo','otro','objeto'];
        this.despejes=["ax = ay/tan(teta)"," ay = ax*tan(teta)","teta = arctan(ay/ax)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var vx=this.variables[0];
            var vy=this.variables[1];
            var a=this.variables[2];
            this.ecuacionconIdentificador="tan(teta["+a.id+"]) = "+"vy["+vy.id+"]/vx["+vx.id+"]";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var vx=this.variables[0].valor;
        var vy=this.variables[1].valor;
        var teta=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=vy/(Math.tan(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    teta=(Math.PI*teta)/(180); //Convertir a radianes
                    resultado=vx*(Math.tan(teta));
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.atan(vy/vx);
                    resultado=(resultado*180)/Math.PI; //COnvertir a grados
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class Trabajo1 extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="W = F*d";
        this.nombre="Trabajo con fuerza por distancia";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="trabajo";
        cpp['tiempo']="general";
        var w=new Variable(cpp) ;   
        cpp['tipo']="fuerza";
        cpp['tiempo']="general";
        var f=new Variable(cpp);
        cpp['tipo']="distancia";
        cpp['tiempo']="general";
        var d=new Variable(cpp);

        this.variables=[w,f,d];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo',"tiempo"];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["W = F*d"," F = W/d","d = W/F"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var vx=this.variables[0];
            var vy=this.variables[1];
            var a=this.variables[2];
            this.ecuacionconIdentificador="W["+vx.id+"] = "+"F["+vy.id+"]*d["+a.id+"]";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var w=this.variables[0].valor;
        var f=this.variables[1].valor;
        var d=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=f*d;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=w/d;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=w/f;
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class CineticaInicio extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="Ki = (1/2)*m*vi^2";
        this.nombre="Energia cinetica";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="masa";
        cpp['tiempo']="general";
        var m=new Variable(cpp) ;   
        cpp['tipo']="cinetica";
        cpp['tiempo']="inicio";
        var k=new Variable(cpp);
        cpp['tipo']="velocidad";
        cpp['tiempo']="inicio";
        var v=new Variable(cpp);

        this.variables=[m,k,v];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo',"tiempo"];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["m = (2*Ki)/(vi^2)"," Ki = (1/2)*m*vi^2","vi = (2*Ki/m)^(1/2)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var m=this.variables[0];
            var k=this.variables[1];
            var v=this.variables[2];
            this.ecuacionconIdentificador="Ki["+k.id+"] = "+"(1/2)*m["+m.id+"]*v["+v.id+"]^2";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var m=this.variables[0].valor;
        var k=this.variables[1].valor;
        var v=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=(2*k)/(v*v);
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=(1/2)*m*v*v;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.sqrt((2*k)/(m));
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class CineticaFin extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="Kf = (1/2)*m*vf^2";
        this.nombre="Energia cinetica";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="masa";
        cpp['tiempo']="general";
        var m=new Variable(cpp) ;   
        cpp['tipo']="cinetica";
        cpp['tiempo']="fin";
        var k=new Variable(cpp);
        cpp['tipo']="velocidad";
        cpp['tiempo']="fin";
        var v=new Variable(cpp);

        this.variables=[m,k,v];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo',"tiempo"];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["m = (2*Kf)/(vf^2)"," Kf = (1/2)*m*vf^2","vf = (2*Kf/m)^(1/2)"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var m=this.variables[0];
            var k=this.variables[1];
            var v=this.variables[2];
            this.ecuacionconIdentificador="Kf["+k.id+"] = "+"(1/2)*m["+m.id+"]*v["+v.id+"]^2";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var m=this.variables[0].valor;
        var k=this.variables[1].valor;
        var v=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=(2*k)/(v*v);
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=(1/2)*m*v*v;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=Math.sqrt((2*k)/(m));
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class CineticaGeneral extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion=String.fromCharCode(30)+"K = Kf - Ki";
        this.nombre="Energia cinetica general";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="cinetica";
        cpp['tiempo']="general";
        var k=new Variable(cpp) ;   
        cpp['tipo']="cinetica";
        cpp['tiempo']="fin";
        var kf=new Variable(cpp);
        cpp['tipo']="cinetica";
        cpp['tiempo']="inicio";
        var ki=new Variable(cpp);

        this.variables=[k,kf,ki];
        this.variables_asignadas=[false,false,false];
        this.propiedadesVariablesComparar=['tipo',"tiempo"];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=[String.fromCharCode(30)+"K = Kf - Ki","Kf = "+String.fromCharCode(30)+"K + Ki","Ki = Kf -"+String.fromCharCode(30)+"K"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var k=this.variables[0];
            var kf=this.variables[1];
            var ki=this.variables[2];
            this.ecuacionconIdentificador="K["+k.id+"] = "+"K["+kf.id+"] - K["+ki.id+"]";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var k=this.variables[0].valor;
        var kf=this.variables[1].valor;
        var ki=this.variables[2].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=kf-ki;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=k+ki;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            else if (this.variable_base==2){ 
                try{
                    resultado=kf-k;
                }
                catch (error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}

class Trabajo2 extends Ecuacion{
    inicializar(){
        this.dificultad=1;
        this.representacion="W = ▲K";
        this.nombre="trabajo con cambio de energia cinetica";
        var cpp={};
        Object.assign(cpp, propiedades); //Creacion de variables
        cpp['tipo']="trabajo";
        cpp['tiempo']="general";
        var w=new Variable(cpp) ;   
        cpp['tipo']="cinetica";
        cpp['tiempo']="general";
        var k=new Variable(cpp);


        this.variables=[w,k];
        this.variables_asignadas=[false,false];
        this.propiedadesVariablesComparar=['tipo',"tiempo"];
        this.propiedadesVariablesSobrantes=['dimension','otro','objeto'];
        this.despejes=["W=▲K","▲K=W"];
    }
    constructor(obtener,param_bars){
        super(obtener,param_bars);
    }
    getEcuacionIdentificada(nuevoID){
        if(this.variable_base!=-1){
            this.variables[this.variable_base].id=nuevoID;
        }
        if(this.getSoluble()){
            var w=this.variables[0];
            var k=this.variables[1];
            this.ecuacionconIdentificador="W["+w.id+"] = "+"K["+k.id+"]";
        }
        return this.ecuacionconIdentificador;
    }
    usar(){
        var resultado="sin_asignar";
        var w=this.variables[0].valor;
        var k=this.variables[1].valor;
        
        if (this.variables_faltantes==0){
            if (this.variable_base==0){ 
                try{
                    resultado=k;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }
            }
            else if (this.variable_base==1)
                try{
                    resultado=w;
                }
                catch(error){
                    resultado="sin_asignar";
                    console.log(error);
                }

            try{
                resultado=Math.round(resultado*10000)/10000;
                }catch{}
        }
        if (!Number.isFinite(resultado)){
            resultado='sin_asignar';

        }
        this.variables[this.variable_base].valor=resultado;
        return this.variables[this.variable_base];
    }
}


var grafo={"velocidad":[VelocidadComponentes2,VelocidadFinal1,DistanciaFinal1,VelocidadFinal2,DistanciaG2,VelocidadMedia1,AceleracionMedia1,
    VelocidadComponentesX1,VelocidadComponentesY1,VelocidadComponentes3,
    CineticaInicio,CineticaFin],
"tiempo":[TiempoG,VelocidadFinal1,DistanciaFinal1,DistanciaG2,AceleracionMedia1,VelocidadMedia1],
"aceleracion":[VelocidadFinal1,DistanciaFinal1,VelocidadFinal2,AceleracionMedia1,
    AceleracionComponentesX1,AceleracionComponentesY1,AceleracionComponentes2,AceleracionComponentes3,
    FuerzaAM],
"distancia":[DistanciaFinal1,DistanciaG,VelocidadFinal2,DistanciaG2,VelocidadMedia1,
    Trabajo1],
"angulo":[VelocidadComponentesX1,VelocidadComponentesY1,AceleracionComponentesY1,AceleracionComponentesX1,VelocidadComponentes3,AceleracionComponentes3],
"fuerza":[FuerzaAM,Trabajo1],
"masa":[FuerzaAM,CineticaInicio,CineticaFin],
"trabajo":[Trabajo1,Trabajo2],
"cinetica":[CineticaInicio,CineticaFin,CineticaGeneral,Trabajo2]};

exports.Variable = Variable;
exports.Ecuacion = Ecuacion;

exports.grafo = grafo;
exports.propiedades = propiedades;