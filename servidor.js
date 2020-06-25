const colors = require('colors');
const express = require('express');
const path = require('path');
const rutas = require(path.join(__dirname+'/rutas.js'))

var app = express();
var server = require('http').Server(app);

//Setting
app.set('port', process.env.PORT || 7777);
app.set('trust proxy', true);

//Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Static files
app.use(express.static('public'));

//Rutas
app.use(rutas.router);

//listen
server.listen(app.get('port'),function(){
  console.log('Servidor corriendo en puerto 7777'.yellow);
  var stdin = process.openStdin();

  process.stdout.write('>> '.gray);
  stdin.addListener('data',(d)=>{
    switch(d.toString().trim()){
      case "salir":
        console.log("Termiando procesos...".yellow);
        process.exit(0);
      default:
        console.log("Comando no reconocido".red);
    }
    process.stdout.write('>> '.gray);
  });

});