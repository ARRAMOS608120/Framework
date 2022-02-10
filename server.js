const express = require('express')
const app = express()

const http = require ('http').Server(app);
const io = require ('socket.io')(http);

const {listarMensajes, insertarMensaje,CRUD,crearSesionMongo} = require('./persistencia/funciones');
const {router,routerApi} = require('./rutas/rutas');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

require('dotenv').config()

const session =  require ('express-session')

app.use(session(crearSesionMongo()))

const logger = require('./winston-module.js')

const Koa = require('koa')
const koaBody = require('koa-body')

const app2 = new Koa()

// Set up body parsing middleware
app2.use(koaBody())

/* ------------------ DATABASE -------------------- */

CRUD();

app2.use(routerApi.routes())
app.set('view engine', 'hbs')

app.set('views', 'C:/Users/ArielMatias/Curso Backend MERN/46Desafio/public/plantillas')

app.use('/', router)


//sqlmensajes.crearTablaMensajes();

/*async function crear ( ){
    await sqlproductos.crearTablaProductos();
}
crear();*/

io.on('connection', async socket => {

    console.log('Nuevo cliente conectado!')

    socket.emit('mensajes', await listarMensajes());
  addAbortSignal+
  
    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await insertarMensaje(mensaje)
        io.sockets.emit('mensajes', await listarMensajes());
    })
});


 /* --------- MINIMIST ---------- */

const parseArgs = require('minimist');

const optionsMinimist = {
    alias: {
        p: 'puerto',
        m: 'modo'
    },
    default: {
        puerto: process.env.PORT || 8080,
        modo: 'FORK'
    }
}

const commandLineArgs = process.argv.slice(2);

const {puerto, modo} = parseArgs(commandLineArgs, optionsMinimist);

/* --------- FORK  ---------- */
//const { fork } = require('child_process')

const { addAbortSignal } = require('stream');
const cluster = require('cluster');

if (modo == "FORK") {
  levantarServer();
} else if (modo== "CLUSTER") {
  if (cluster.isMaster){
      console.log(`Cantidad de CPUs: ${numCPUs}`);
      console.log(`Master PID ${process.pid} is running`);
      for (let i=0; i<numCPUs; i++){
          cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`)
        cluster.fork();});
  } else {
      levantarServer();
  }    
}

function levantarServer(){
    const server =app2.listen(puerto, () => {
      logger.info(`Ser vidor express escuchando en el puerto ${puerto}`)
    });
    server.on('error', error=>logger.error(`Error en servidor: ${error}`));
  }
