const response = require('./../libs/response')

let appGlobalErrorHandler =(err, req, res, next)=>{
    if(err){
        console.log("global error handler initiated");
        console.log(err);
        let apiResponse = response.generate(true, "error occured in the root of the API", 500, err)
        res.send(apiResponse);
        
    }
}

let routeNotFoundHandler = (req, res, next) =>{
    console.log("global - route not found error handler initiated");
    let apiResponse = response.generate(true, "no such route found: please check the url provided", 404, "please check the url provided")
    res.status(404).send(apiResponse);
}

module.exports = {
    appGlobalErrorHandler : appGlobalErrorHandler,
    routeNotFoundHandler : routeNotFoundHandler
}