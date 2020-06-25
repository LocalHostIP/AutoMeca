$("#txtCantidadV").change(function(){
    //Establece cuantas y agrega nuevas variables a las variables conocidas
    var val=$("#txtCantidadV").val();
    if (isNaN(val) || val=='0'){
        $("#txtCantidadV").val("1");
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

            $("#cuerpoTabla").append('\
            <tr class="AgregarVariable" id=\'var'+(i+1)+'\'>\
            <td class="tablaID" id="tablaTH'+(i+1)+'">\
            '+(i+1)+'\
            </td>\
            <td>\
            <ul class="nav nav_variable">\
                    <li><a id="tipo'+(i+1)+'">Sin asignar</a>\
                        <ul>\
                            <li><a>MOVIMIENTO</a>\
                                <ul>\
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i+1)+'","velocidad")\'>velocidad</a></li>\
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i+1)+'","aceleracion")\'>aceleraci&oacuten</a></li>\
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i+1)+'","distancia")\'>distancia</a></li>\
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i+1)+'","tiempo")\'>tiempo</a></li>\
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
                                    <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i+1)+'","fuerza")\'>fuerza</a></li>\
                                    <li><a class="linkClick">fricci&oacuten est&aacutetica</a></li>\
                                    <li><a class="linkClick">fricci&oacuten cin&eacutetica</a></li>\
                                    <li><a class="linkClick">fuerza normal</a></li>\
                                </ul>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i+1)+'","angulo")\'>&aacutengulo</a></li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tipo'+(i+1)+'","masa")\'>masa</a></li>\
                        </ul>\
                    </li>\
                </ul>\
            </td>\
            <td>\
                <ul class="nav nav_variable">\
                    <li><a id="tiempo'+(i+1)+'">general</a>\
                        <ul class="ulOpciones">\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+(i+1)+'","general")\'>general</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+(i+1)+'","inicio")\'>inicio</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+(i+1)+'","fin")\'>fin</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("tiempo'+(i+1)+'","media")\'>media</a>\
                            </li>\
                        </ul>\
                    </li>\
                </ul></td>\
            <td>\
                <ul class="nav nav_variable">\
                    <li><a id="dimension'+(i+1)+'">x</a>\
                        <ul class="ulOpciones">\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+(i+1)+'","x")\'>x</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+(i+1)+'","y")\'>y</a>\
                            </li>\
                            <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+(i+1)+'","general")\'>general</a>\
                            </li>\
                        </ul>\
                    </li>\
                </ul></td>\
            </td>\
            <td><input class="txt_valor" type="text" value="0" id="valor'+(i+1)+'"></td>\
            <td class="thEliminarVariable"> <img onclick=\'eliminarVar("var'+(i+1)+'","'+(i+1)+'")\' src="img/eliminar.png" alt="" width="45" height="35" /> </td>\
          </tr>'); 
        }        
    }
});

function cambioPropiedad(target,valor){
    $("#"+target).html(valor);
}

function eliminarVar(target,idNumber){
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
                            <li><a class="linkClick" onclick=\'cambioPropiedad("dimension'+(i-1)+'","general")\'>general</a>\
                            </li>\
                        </ul>\
                    </li>\
                </ul></td>\
            </td>\
            <td><input class="txt_valor" type="text" value="0" id="valor'+(i-1)+'"></td>\
            <td class="thEliminarVariable"> <img onclick=\'eliminarVar("var'+(i-1)+'","'+(i-1)+'")\' src="img/eliminar.png" alt="" width="45" height="35" /> </td>');
            $('#tipo'+(i-1)).html(respaldoTipo);
            $('#tiempo'+(i-1)).html(respaldoTiempo);
            $('#dimension'+(i-1)).html(respaldoDimension);
            $('#valor'+(i-1)).val(respaldoValor);
        }
    }
}

$("#btBuscar").click(function(){
    $(".spinner").css("display", "block");
    $(".Resultados").css("display", "none");       
    var variables=[];
    var tipo;
    var tiempo;
    var valor;
    var dimension;
    var variable={};
    var validado=true;

    n=parseInt($("#txtCantidadV").val());
    for (var i=0;i<n;i++){
        tipo=$("#tipo"+(i+1)).html();
        tiempo =$("#tiempo"+(i+1)).html();
        valor = $("#valor"+(i+1)).val();
        dimension = $("#dimension"+(i+1)).html();
        variable={"tipo":tipo,"tiempo":tiempo,"valor":valor,"dimension":dimension};
        variables.push(variable);

        if(tipo=='Sin asignar'){
            validado=false;
        }
    }

    tipo=$("#tipoB").html();
    tiempo =$("#tiempoB").html();
    dimension = $("#dimensionB").html();
    variable={"tipo":tipo,"tiempo":tiempo,"dimension":dimension};
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