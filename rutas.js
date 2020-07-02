var express = require('express');
const path = require('path');
const colors = require('colors');
var router = express.Router();
var kernel = require(path.join(__dirname+'/kernel/main.js'));

//Middlewares
router.use('/buscarBariable',function(req,res,next) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

  const {buscar}=req.body;
  const {parametros}=req.body;

  console.log("Datos enviados por: ".gray+ip.cyan);
  console.log(buscar);
  //console.log(parametros);
  var respuesta=kernel.usar(buscar,parametros);
  console.log(respuesta[2]);
  res.send(respuesta);

  process.stdout.write('>> '.gray);
  next();
});

//Rutas
router.get('/',function(req,res){
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  res.sendFile(path.join(__dirname+'/public/login.html'));
});

router.get('*',function(req,res){
  res.send("No se pudo encontrar la pagina");
});

exports.router = router;