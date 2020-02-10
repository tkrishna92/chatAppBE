const logger = require('./../libs/loggerlib');
const response = require('./../libs/response');
const validCheck = require('./../libs/checklib');
const token = require('./../libs/tokenLib');

const mongoose = require('mongoose');

const AuthModel = mongoose.model('Auth');

let isAuthenticated = (req, res, next) =>{

    console.log("checking for authentication")
    if(req.params.authToken || req.body.authToken || req.query.authToken || req.header('authToken')){
        console.log("checking for authentication")
        AuthModel.findOne({authToken : req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')}, (err, authDetails)=>{
            if(err){
                logger.error("error retreiving authentication details","middleware - auth : isAuthenticated", 8);
                let apiResponse = response.generate(true, "error retreiving authentication details", 400, err);
                res.send(apiResponse);
            }else if(validCheck.isEmpty(authDetails)){
                logger.error("No authorization key present", "middleware - auth: isAuthenticated", 8);
                let apiResponse = response.generate(true, "Authorization key expired or invalid", 404, null);
                res.send(apiResponse)
            }else{
                token.verify(authDetails.authToken, authDetails.tokenSecret, (err, decoded)=>{
                    if(err){
                        logger.error(err.message, "middleware - auth : isAuthenticated", 10);
                        let apiResponse = response.generate(true, "error verifying authorization token", 400, err);
                        res.send(apiResponse);
                    }else{
                        req.user = {userId : decoded.data.userId};
                        next();
                    }
                })
            }
        })

    }else{
        logger.error("no authentication token provided", "middlewares - auth : isAuthenticated", 9);
        let apiResponse = response.generate(true, "no authentication token provided", 400, null);
        res.send(apiResponse);
    }
}

module.exports = {
    isAuthenticated : isAuthenticated
}
