const path = require('path');
var e = require(path.join(__dirname+'/ecuaciones.js'));

propiedades={"tipo":"variable","tiempo":"general","dimension":"general","objeto":"A","otro":"sin_asignar","valor":"sin_asignar","valor2":"sin_asignar"};


function fuerzas(buscar,parametros){
    console.log("funcion");
    console.log("variable buscar:");
    console.log(buscar);
}

exports.fuerzas=fuerzas;