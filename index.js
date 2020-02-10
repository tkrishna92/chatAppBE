const express = require('express');

const path = require('path');

const appConfig = require('./config/appConfig');

const mongoose = require('mongoose');

const fs = require('fs');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const appErrorHandler = require('./app/middlewares/appErrorMiddleware');

const routeLogger = require('./app/middlewares/routeIpLogger');

const helmet = require('helmet');

const http = require('http');

const logger = require('./app/libs/loggerlib');


const app = express();


//middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

app.use(appErrorHandler.appGlobalErrorHandler);

app.use(routeLogger.routeIpLogger);

app.use(express.static(path.join(__dirname, 'client')));

app.use(helmet());
//bootstrap model

let modelPath = './app/models';

fs.readdirSync(modelPath).forEach(function(file){
    if(~file.indexOf('.js')) require(modelPath+'/'+file);
})



// bootstrap route
let routePath = './app/route';

fs.readdirSync(routePath).forEach(function (file) {
    if(~file.indexOf('.js')){
        console.log(routePath+'/'+file);
        let route = require(routePath+'/'+file);
        console.log(route);
        route.setRouter(app);
    }
}) // completed bootstrapping route

app.use(appErrorHandler.routeNotFoundHandler);

// -----------importing modules and models complete-------------------

// initiating the app

const server = http.createServer(app);
console.log(appConfig);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

const socketLib = require('./app/libs/socketLib');
const socketServer = socketLib.setServer(server);

function onError(error){
    if(error.syscall !== 'listen'){
        logger.error(error.code + ': not equal to listen',"serverOnErrorHandler", 10);
        throw error
    }

    switch(error.code){
        case 'EACCES':
            logger.error(error.code +": elevated priviliges required", "serverOnErrorHandler", 10);
            break;
        case 'EADDRINUSE':
            logger.error(error.code +": port already in use", "serverOnErrorHandler", 10);
            break;
        default :
            logger.error(error.code + " unknown error occurred", "serverOnErrorHandler",10)
            throw error;
    }
}

function onListening(){
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
        ('listening on' + bind)
        logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 1);
        let db = mongoose.connect(appConfig.db.uri, {useUnifiedTopology : true})
}

process.on ('unhandledRejection', (reason, p)=>{
    console.log("unhandled rejectino at : Promise", p, " reason : ", reason);
})


// app.listen(appConfig.port, () =>{ 
//     console.log("the app is listening on localhost:"+appConfig.port);

//     let db = mongoose.connect(appConfig.db.uri,{useNewUrlParser: true});

// } )

// mongo db connection error handler
mongoose.connection.on('error', function(err) {
    console.log("mongoDB connection failure")
    console.log(err);
});

// mongo db connection success handler
 mongoose.connection.on('open', function(err){
     if(err){
         console.log("error in connecting to db")
         console.log(err);
     }else{
         console.log("connection to mongodb success");
     }
 })