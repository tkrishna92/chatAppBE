const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const secretKey = "someRandomString";

let generateToken = (data, cb) =>{
    try{
        let claims = {
            jwtid : shortid.generate(),
            iat : Date.now(),
            exp :(Math.floor(Date.now()/1000)) + (60*60*24),
            sub : 'authToken',
            iss : 'edChat',
            data : data
        }
        let tokenDetails = {
            token : jwt.sign(claims,secretKey),
            tokenSecret : secretKey
        }
        cb(null, tokenDetails);
    }catch(err){
        console.log(err);
        cb(err, null);
    }
}


let verify = (token, secretKey, cb) =>{
    jwt.verify(token, secretKey, function(err, decoded){
        if(err){
            console.log("error decoding the user token")
            console.log(err);
            cb(err, null);
        }else{
            console.log("user verified successfully");
            console.log(decoded);
            cb(null, decoded);
        }
    })
}

let verifyTokenWithoutSecretKey = (token, cb)=>{
    jwt.verify(token,secretKey, (err, decoded)=>{
        if(err){
            console.log("error decoding user token");
            console.log(err);
            cb(err, null);
        }else{
            console.log("user verified successfully");
            console.log(decoded);
            cb(null, decoded)
        }
    })
}

module.exports = {
    generateToken : generateToken,
    verify : verify,
    verifyTokenWithoutSecretKey : verifyTokenWithoutSecretKey
}