let exampleMiddleware = (req, res, next) =>{
    req.user = {'firstName':'krishna','lastName':'thirumalasetty'};
    next();
}

module.exports = {
    exampleMiddleware: exampleMiddleware
}