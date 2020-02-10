const logger = require('pino')();
const moment = require('moment');

let errorLogger = (errorMessage, errorOrigin, errorImportance) =>{
    let time = moment().format();
    
    let errorResponse = {
        timeStamp : time,
        message : errorMessage,
        origin : errorOrigin,
        importance : errorImportance,
    }

    logger.error(errorResponse);
    return errorResponse;
}

let infoLogger = (message, origin, importance) =>{
    let time = moment().format();

    let infoResponse = {
        timeStamp : time,
        infoMessage : message,
        infoOrigin : origin,
        infoImportance : importance
    }

    logger.info(infoResponse);
    return infoResponse;
}


module.exports = {
    error : errorLogger,
    info : infoLogger
}