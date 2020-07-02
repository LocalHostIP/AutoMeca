//Bug al eliminar una fuerza
var nFuerzasContador=5  ; //Mantiene la cuenta de cuantos numeros poner en el menu de nFuerzas

//Cambiar la cantidad de variables
$("#txtCantidadV").change(function(){
    //Establece cuantas y agrega nuevas variables a las variables conocidas
    var val=$("#txtCantidadV").val();
    if (isNaN(val) || val=='0'){
        $("#txtCantidadV").val($("#cuerpoTabla").children().length);
    }else{
        var n=parseInt(val);
        if($("#cuerpoTabla").children().length!=0){
            var limite=( $("#cuerpoTabla").children().length - n);
            for(var i = 0; i < limite ;i++){
                $("#cuerpoTabla").children()[ $("#cuerpoTabla").children().length-1 ].remove();
            }
        }
        var inicio=$("#cuerpoTabla").children().length;
        
        for(var i=inicio;i<n;i++){
            agregarVariableTabla(i+1);
        }        
    }
});

function obtenerNumberoVarible(target){
    //Obtiene el numero de variable de un id (tipo23->23 o tipoB ->B)
    var nv="B";
    var fin=target.length;
    for(var n=0;n<fin;n++){
        if (!isNaN(target[n])){
            nv=target.substring(n,fin);
            break;
        }
    }
    return nv;
}

function cambiarMenuPropiedad(target,valores,valorInicial){
    
    $("#"+target).parent().html('<a id="'+target+'">'+valorInicial+'</a> <ul class="ulOpciones"> </ul>');

    for (var v of valores){
        console.log(v);
        $('#'+target).parent().children('.ulOpciones').append('\
        <li><a class="linkClick" onclick=\'cambioPropiedad("'+target+'","'+v+'")\'>'+v+'</a>\
        </li>');
    }

}

//Cambio de propiedad
function cambioPropiedad(target,valor){
    //Click en cualquier menu de propiedad de la tabla de variables y varible
    $("#"+target).html(valor);
    nVariable=obtenerNumberoVarible(target);

    //Tiempo general
    if (target.startsWith("tipo")&& (valor=="aceleracion" || valor=="masa")){
        cambiarMenuPropiedad("tiempo"+nVariable,["general"],"general");
    }
    else if(target.startsWith("tipo") && valor=="fuerza"){
        cambiarMenuPropiedad("tiempo"+nVariable,["general","inicio"],"general");

        if($("#tiempo"+nVariable).html()=="general"){
            cambiarMenuPropiedad("nFuerza"+nVariable,["general"],"general");
        }
        else{
            actualizarFuerza(nVariable);
        }
    }
    else if( target.startsWith("tipo") ){
        cambiarMenuPropiedad("tiempo"+nVariable,["general","inicio","fin","media"],"general");
    }

    //Valores fuerza, en Tiempos fuerza
    if ($("#tipo"+nVariable).html()=="fuerza"){
        if(target.startsWith("tiempo") && valor=="general"){
            cambiarMenuPropiedad("nFuerza"+nVariable,["general"],"general");
        }
        else if(target.startsWith("tiempo") && valor=="inicio"){
            actualizarFuerza(nVariable);
        }
    }

    //Quitar o poner columna Numero fuerza
    if((valor=="fuerza") && target.startsWith("tipo")){
        $("#nFuerza"+nVariable).css("display","block");  
    }
    else if (target.startsWith("tipo")){
        $("#nFuerza"+nVariable).css("display","none");
    }


    //Ajustando propiedades de angulo
    if((valor=="angulo") && target.startsWith("tipo")){
        cambiarMenuPropiedad("dimension"+nVariable,["velocidad","fuerza 1","fuerza 2"," fuerza 3",
    "fuerza 4", "fuerza 5"],"velocidad");   
    cambiarMenuPropiedad("tiempo"+nVariable,["inicio","fin","general"],"inicio");  
    }else if(target.startsWith("tipo")){
        cambiarMenuPropiedad("dimension"+nVariable,["x","y","x/y"],"x");
    }
    if ($("#tipo"+nVariable).html()=="angulo"){
        if(target.startsWith("tiempo") && valor=="general"){
            cambiarMenuPropiedad("dimension"+nVariable,["aceleracion","fuerza general"],"aceleracion");
        }
        else if(target.startsWith("tiempo") && (valor=="inicio" || valor=="fin")){
            cambiarMenuPropiedad("dimension"+nVariable,["velocidad","fuerza 1","fuerza 2"," fuerza 3",
    "fuerza 4", "fuerza 5"],"velocidad"); 
        }       
    }
}

function actualizarFuerza(nvariable){
    var fuerzas=[];
    for (var i=1;i<=nFuerzasContador;i++){
        fuerzas.push(i.toString());
    }
    cambiarMenuPropiedad("nFuerza"+nvariable,fuerzas,"1");
}

//Eliminar una variable
function eliminarVar(target,idNumber){
    //Click en boton eleiminar de cualquier variable
    var val=parseInt($("#txtCantidadV").val());
    if(val>1){
        $("#"+target).remove();
        val=val-1;
        $("#txtCantidadV").val(val);

        //Cambiar las ids de todos los elementos siguientes al eliminado
        var idInicio=parseInt(idNumber)+1;
        var idFin=parseInt($("#cuerpoTabla").children().length)+1;
        console.log(idFin);
        for (var i=idInicio;i<=idFin;i=i+1){
            var respaldoTipo=$('#tipo'+i).html();
            var respaldoTiempo=$('#tiempo'+i).html();
            var respaldoDimension=$('#dimension'+i).html();
            var respaldoValor=$('#valor'+i).val();

            $("#var"+i).attr('id','var'+(i-1));
            $("#var"+(i-1)).html('<td class="tablaID" id="tablaTH'+(i-1)+'">\
            '+(i-1)+'\
            </td>\
            <td>\
            <ul class="nav nav_variable">\
                    <li><a id="tipo'+(i-1)+'">Sin asignar</a>\
                        <ul>\
                            <li><a>MOVIMIENTO</a>\
                                <ul>\
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i-1)+'","velocidad")\'>velocidad</a></li>\
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i-1)+'","aceleracion")\'>aceleraci&oacuten</a></li>\
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i-1)+'","distancia")\'>distancia</a></li>\
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i-1)+'","tiempo")\'>tiempo</a></li>\
                                </ul>\
                            </li>\
                            <li><a>ENERG&IacuteA</a>\
                                <ul>\
                                    <li><a class="linkClick">mec&aacutenica</a></li>\
                                    <li><a class="linkClick">potencial</a></li>\
                                    <li><a class="linkClick">cin&eacutetica</a></li>\
                                    <li><a class="linkClick">potencial gravitacional</a></li>\
                                    <li><a class="linkClick">potencial elastica</a></li>\
                                </ul>\
                            </li>\
                            <li><a>FUERZA</a>\
                                <ul>\
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i-1)+'","fuerza")\'>fuerza</a></li>\
                                    <li><a class="linkClick">fricci&oacuten est&aacutetica</a></li>\
                                    <li><a class="linkClick">fricci&oacuten cin&eacutetica</a></li>\
                                    <li><a class="linkClick">fuerza normal</a></li>\
                                </ul>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i-1)+'","angulo")\'>&aacutengulo</a></li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i-1)+'","masa")\'>masa</a></li>\
                        </ul>\
                    </li>\
                </ul>\
            </td>\
            <td>\
                <ul class="nav nav_variable">\
                    <li><a id="tiempo'+(i-1)+'">general</a>\
                        <ul class="ulOpciones">\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+(i-1)+'","general")\'>general</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+(i-1)+'","inicio")\'>inicio</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+(i-1)+'","fin")\'>fin</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+(i-1)+'","media")\'>media</a>\
                            </li>\
                        </ul>\
                    </li>\
                </ul></td>\
            <td>\
                <ul class="nav nav_variable">\
                    <li><a id="dimension'+(i-1)+'">x</a>\
                        <ul class="ulOpciones">\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+(i-1)+'","x")\'>x</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+(i-1)+'","y")\'>y</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+(i-1)+'","x/y")\'>x/y</a>\
                            </li>\
                        </ul>\
                    </li>\
                </ul></td>\
            </td>\
            <td><input class="txt_valor search-input" type="text" value="0" id="valor'+(i-1)+'"></td>\
            <td>\
            <ul class="nav nav_variable">\
                <li><a style="display: none;" id="nFuerza'+(i-1)+'">1</a>\
                    <ul class="ulOpciones">\
                        <li><a class="linkClick" onclick=\'cambioPropiedad("nFuerza'+(i-1)+'","1")\'>1</a>\
                        </li>\
                    </ul>\
                </li>\
            </ul></td>\
            <td class="thEliminarVariable"> <img onclick=\'eliminarVar("var'+(i-1)+'","'+(i-1)+'")\' src="img/eliminar.png" alt="" width="45" height="35" /> </td>');
            
            $('#tipo'+(i-1)).html(respaldoTipo);
            $('#tiempo'+(i-1)).html(respaldoTiempo);
            $('#dimension'+(i-1)).html(respaldoDimension);
            $('#valor'+(i-1)).val(respaldoValor);
        }
    }
}

function agregarVariableTabla(idNumber){
    //Agrega una nueva variable a la tabla de varibles conocidas
    $("#cuerpoTabla").append('\
    <tr class="AgregarVariable" id=\'var'+idNumber+'\'>\
    <td class="tablaID" id="tablaTH'+idNumber+'">\
    '+idNumber+'\
    </td>\
    <td>\
    <ul class="nav nav_variable">\
            <li><a id="tipo'+idNumber+'">Sin asignar</a>\
                <ul>\
                    <li><a>MOVIMIENTO</a>\
                        <ul>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+idNumber+'","velocidad")\'>velocidad</a></li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+idNumber+'","aceleracion")\'>aceleraci&oacuten</a></li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+idNumber+'","distancia")\'>distancia</a></li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+idNumber+'","tiempo")\'>tiempo</a></li>\
                        </ul>\
                    </li>\
                    <li><a>ENERG&IacuteA</a>\
                        <ul>\
                            <li><a class="linkClick">mec&aacutenica</a></li>\
                            <li><a class="linkClick">potencial</a></li>\
                            <li><a class="linkClick">cin&eacutetica</a></li>\
                            <li><a class="linkClick">potencial gravitacional</a></li>\
                            <li><a class="linkClick">potencial elastica</a></li>\
                        </ul>\
                    </li>\
                    <li><a>FUERZA</a>\
                        <ul>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+idNumber+'","fuerza")\'>fuerza</a></li>\
                            <li><a class="linkClick">fricci&oacuten est&aacutetica</a></li>\
                            <li><a class="linkClick">fricci&oacuten cin&eacutetica</a></li>\
                            <li><a class="linkClick">fuerza normal</a></li>\
                        </ul>\
                    </li>\
                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+idNumber+'","angulo")\'>&aacutengulo</a></li>\
                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+idNumber+'","masa")\'>masa</a></li>\
                </ul>\
            </li>\
        </ul>\
    </td>\
    <td>\
        <ul class="nav nav_variable">\
            <li><a id="tiempo'+idNumber+'">general</a>\
                <ul class="ulOpciones">\
                    <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+idNumber+'","general")\'>general</a>\
                    </li>\
                    <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+idNumber+'","inicio")\'>inicio</a>\
                    </li>\
                    <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+idNumber+'","fin")\'>fin</a>\
                    </li>\
                    <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+idNumber+'","media")\'>media</a>\
                    </li>\
                </ul>\
            </li>\
        </ul></td>\
    <td>\
        <ul class="nav nav_variable">\
            <li><a id="dimension'+idNumber+'">x</a>\
                <ul class="ulOpciones">\
                    <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+idNumber+'","x")\'>x</a>\
                    </li>\
                    <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+idNumber+'","y")\'>y</a>\
                    </li>\
                    <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+idNumber+'","x/y")\'>x/y</a>\
                    </li>\
                </ul>\
            </li>\
        </ul></td>\
    </td>\
    <td>\
    <input class="txt_valor search-input" type="text" value="0" id="valor'+idNumber+'"></td>\
    <td>\
    <ul class="nav nav_variable">\
    <li>\
        <a style="display: none;" id="nFuerza'+idNumber+'">1</a>\
        <ul class="ulOpciones">\
            <li><a class="linkClick" onclick=\'cambioPropiedad("nFuerza'+idNumber+'","1")\'>1</a>\
            </li>\
        </ul>\
    </li>\
    </ul>\
    </td>\
    <td class="thEliminarVariable"> <img onclick=\'eliminarVar("var'+idNumber+'","'+idNumber+'")\' src="img/eliminar.png" alt="" width="45" height="35" /> </td>\
    </tr>');     
}

//Click boton principal
$("#btBuscar").click(function(){
    $(".spinner").css("display", "block");
    $(".Resultados").css("display", "none");       
    var variables=[];
    var tipo;
    var tiempo;
    var valor;
    var nFuerza="sin_asignar";
    var dimension;
    var variable={};
    var validado=true;

    var n=parseInt($("#txtCantidadV").val());
    for (var i=0;i<n;i++){
        tipo=$("#tipo"+(i+1)).html();
        tiempo =$("#tiempo"+(i+1)).html();
        valor = $("#valor"+(i+1)).val();
        dimension = $("#dimension"+(i+1)).html();
        
        if (tipo=="fuerza"){
            nFuerza=$("#nFuerza"+(i+1)).html();
        }else{
            nFuerza="sin_asignar";
        }

        variable={"tipo":tipo,"tiempo":tiempo,"valor":valor,"dimension":dimension,"nFuerza":nFuerza};
        variables.push(variable);

        if(tipo=='Sin asignar'){
            validado=false;
        }
    }

    tipo=$("#tipoB").html();
    tiempo =$("#tiempoB").html();
    dimension = $("#dimensionB").html();
    nFuerza="sin_asignar";
    if (tipo=="fuerza"){
        nFuerza=$("nFuerzaB").html();
    }
    variable={"tipo":tipo,"tiempo":tiempo,"dimension":dimension,"nFuerza":nFuerza};
    if(tipo=='Sin asignar'){
        validado=false;
    }

    if(validado){
        $.ajax({
            url: "/buscarBariable",
            method: "POST",
            dataType: "json",
            data: {
                parametros:variables,
                buscar:variable},
            success: function(result){
                $('#ecuaciones').html("");
                if(result[2]==true){
                    
                    if(result[3].valor2=='sin_asignar'){
                        $('#resultado').html(result[3].valor);
                    }else{
                        $('#resultado').html(result[3].valor+' , '+result[3].valor2);
                    }
                    
                    $('#ecuaciones').html('<h2 class="lbEcuacion">Ecuaciones: </h2>');
                    for (e of result[0]){
                        if (e[4]=='sin_asignar'){ //Si hay segundo valor
                            $('#ecuaciones').append('\
                            <div class="divEcuacion">\
                            <h3 class="ecuacion2">('+e[2]+')</h3>\
                            <h2 class="ecuacion1">'+e[1]+' = '+e[3]+'</h2>\
                            <h3 class="ecuacion2">'+e[0]+'</h3>\
                            </div><br><br><br>');
                        }else{
                            $('#ecuaciones').append('\
                            <div class="divEcuacion">\
                            <h3 class="ecuacion2">('+e[2]+')</h3>\
                            <h2 class="ecuacion1">'+e[1]+' = '+e[3]+' , '+e[4]+' </h2>\
                            <h3 class="ecuacion2"> '+e[0]+'</h3>\
                            </div><br><br><br>');                           
                        }

                    }
                    $('.lbResultado').css("display", "block"); 
                    $('.lbEcuacion').css("display", "block"); 
                }else{
                    $('.lbResultado').css("display", "none"); 
                    $('.lbEcuacion').css("display", "none"); 
                    $('#resultado').html("No se encontr&oacute una soluci&oacuten, prueba agregando m&aacutes variables");              
                }
                setTimeout(() => { $(".spinner").css("display", "none"); $(".Resultados").css("display", "block"); }, 50);
            }
        });
    }else{
        alert("Necesita asignar un tipo a cada variable");
        $(".spinner").css("display", "none");
    }
});

$("#txtCantidadV").change();