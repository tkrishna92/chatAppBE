const bcrypt = require('bcryptjs');
const logger = require('./loggerlib');
const saltRounds = 10;

// synchronus hashing password as the process should not move further untill the password is hashed
let hashPassword = (inputPassword)=>{
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(inputPassword, salt);
    return hash;
}


let comparePassword = (inputPassword, hashedSavedPassword, cb) =>{
    bcrypt.compare(inputPassword, hashedSavedPassword, (err, res)=>{
        if(err){
            logger.error("error comparing the passwords", "generatePasswordLib : comparePassword (async method)", 7);
            cb(err, null);
        }else{
            cb(null, res);
        }
    })
}

let comparePasswordSync = (inputPassword, hashedSavedPassword)=>{
    let isMatch = bcrypt.compareSync(inputPassword, hashedSavedPassword);
    return isMatch;
}

module.exports = {
    generatePassword : hashPassword,
    comparePassword : comparePassword,
    comparePasswordSync : comparePasswordSync
}