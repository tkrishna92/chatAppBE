const config = require('./../../config/appConfig');

let routeIpLogger = (req, res, next)=>{

    let remoteIp = req.connection.remoteAddress + "://" +req.connection.remotePort;
    let realIp = req.headers['X-REAL-IP'];

    console.log(req.method + " Method from " + remoteIp + " for route " + req.originalUrl)

    if(req.method === 'OPTIONS'){
        console.log('!OPTIONS');
        var headers = {};
        headers["Access-Control-Allow-Origin"]="*";
        headers["Access-Control-Allow-Methods"]= "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"]= '86400'
        headers["Access-Control-Allow-Headers"] = "X-Requested-with, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    }
    else {
        res.header("Access-Control-Allow-Origin", config.allowedCorsOrigin);
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }
}

module.exports = {
    routeIpLogger: routeIpLogger
}