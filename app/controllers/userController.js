const express = require('express');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const inStandardCheck = require('./../libs/paramsValidationLib');
const validCheck = require('./../libs/checklib');
const timeLib = require('./../libs/time');
const logger = require('./../libs/loggerlib');
const tokenLib = require('./../libs/tokenLib');
const response = require('./../libs/response');
const generatePassword = require('./../libs/generatePasswordLib');
const shortid = require('shortid');
const AuthModel = mongoose.model("Auth");



let getSingleUserDetails = (req, res)=>{
    console.log("getSingleUserDetails");
    UserModel.findOne({userId : req.user.userId})
        .select("-_id -__v -password")
        .lean()
        .exec((err, result)=>{
            console.log("getSingleUserDetails - execution");
            if(err){
                logger.error("error retreiving userDetails", "userController : getSingleUserDetails", 9);
                let apiResponse =response.generate(true, "error retreivign userDetails", 400, err);
                res.send(apiResponse);
            }else if(validCheck.isEmpty(result)){
                logger.error("No user of given user Id found", "userController : getSingleUserDetails", 9);
                let apiResponse = response.generate(true, "No user of given user Id found ", 400, null);
                res.send(apiResponse);
            }else{
                logger.info("user found", "userController : getSingleUserDetails", 9);
                let apiResponse = response.generate(false, "user found", 200, result);
                res.send(apiResponse)
            }
        })

}

let getAllUserDetails = (req, res)=>{
    UserModel.find()
        .select("-_id -__v -password")
        .lean()
        .exec((err, result)=>{
            if(err){
                logger.error("error retreiving userDetails", "userController : getAllUserDetails", 9);
                let apiResponse =response.generate(true, "error retreiving userDetails", 400, err);
                res.send(apiResponse);
            }else if(validCheck.isEmpty(result)){
                logger.error("No user details found", "userController : getAllUserDetails", 9);
                let apiResponse = response.generate(true, "No users found", 404, null);
                res.send(apiResponse);
            }else{
                logger.info("users found", "userController : getAllUserDetails", 9);
                let apiResponse = response.generate(false, "user found", 200, result);
                res.send(apiResponse)
            }
        })

}

let deleteUser = (req, res)=>{
    UserModel.remove({userId : req.params.userId})
        
        .exec((err, result)=>{
            if(err){
                logger.error("error removing user", "userController : deleteUser", 9);
                let apiResponse =response.generate(true, "error removing user", 400, err);
                res.send(apiResponse);
            }else if(validCheck.isEmpty(result)){
                logger.error("No user of given userId found", "userController : deleteUser", 9);
                let apiResponse = response.generate(true, "No user found", 404, null);
                res.send(apiResponse);
            }else{
                logger.info("user deleted", "userController : deleteUser", 9);
                let apiResponse = response.generate(false, "user deleted successfully", 200, result);
                res.send(apiResponse)
            }
        })

}


let editUser = (req, res)=>{
    let options = req.body;
    UserModel.update({userId : req.params.userId}, options, (err, result)=>{
            if(err){
                logger.error("error updating user", "userController : editUser", 9);
                let apiResponse =response.generate(true, "error updating user", 400, err);
                res.send(apiResponse);
            }else if(validCheck.isEmpty(result)){
                logger.error("No user of given userId found", "userController : editUser", 9);
                let apiResponse = response.generate(true, "No user found", 404, null);
                res.send(apiResponse);
            }else{
                logger.info("user updated", "userController : editUser", 9);
                let apiResponse = response.generate(false, "user details updated successfully", 200, result);
                res.send(apiResponse)
            }
        })

}


let signUp = (req, res) =>{

    let validateInput = ()=>{
        console.log("validate Input")
        return new Promise((resolve, reject)=>{
            if(req.body.email){
                if(!inStandardCheck.Email(req.body.email)){
                    logger.error("email id not meeting required standards", "userController: signup - validate input", 7);
                    let apiResponse = response.generate(true, "email id not meeting required standards", 400, null);
                    reject(apiResponse);
                }else if(validCheck.isEmpty(req.body.password)){
                    logger.error("no valid password input", "userController: signup - validateInput", 6);
                    let apiResponse = response.generate(true, "no valid password input", 400, null);
                    reject(apiResponse)
                }else{
                    resolve(req)
                }
            }else{
                logger.error("email id input required", "userController: signup - validateInput", 8);
                let apiResponse = response.generate(true, "email id input required", 400, null);
                reject(apiResponse);
            }
        })
    }

    let createUser = () =>{
        return new Promise((resolve, reject)=>{
            UserModel.findOne({email : req.body.email}, (err, result)=>{
                if(err){
                    logger.error("error looking for existing user email","userController : signup - createUser", 7);
                    let apiResponse = response.generate(true, "error while looking for existing user email", 400, err);
                    reject(apiResponse);
                }else if(validCheck.isEmpty(result)){
                    let newUser = new UserModel({
                        userId : shortid.generate(),
                        firstName : req.body.firstName,
                        lastName : req.body.lastName || "",
                        password : generatePassword.generatePassword(req.body.password),
                        email : req.body.email,
                        mobileNumber : req.body.mobileNumber,
                        created : timeLib.timeNow()
                    })
                    newUser.save((err, result)=>{
                        if(err){
                            logger.error("error saving new user", "userController : signup - createUser", 8);
                            let apiResponse = response.generate(true, "error saving new user", 400, err);
                            reject(apiResponse);
                        }else{
                            logger.info("user created successfully", "userController : signup- createUSer", 10);
                            let userDetails = result.toObject();
                            resolve(userDetails);
                        }
                    })
                }else{
                    logger.error("user already exists with the given email Id", "userController : signup- createUser", 8);
                    let apiResponse = response.generate(true, "user with the given email alreay exists", 400, null);
                    reject(apiResponse);
                }
            })
        })
    }

    validateInput(req, res)
    .then(createUser)
    .then((resolve)=>{
        delete resolve.password;
        console.log(resolve);
        let apiResponse = response.generate(false, "user created successfully", 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    })



}

let login = (req, res)=>{

    let findUser = () =>{
        return new Promise((resolve, reject)=>{
            if(req.body.email){
                UserModel.findOne({email : req.body.email}, (err, userDetails)=>{
                    if(err){
                        logger.error("error while retreiving user Details", "userController : login - findUser", 8);
                        let apiResponse = response.error(true, "error retreiving user details from DB", 400, err);
                        reject(apiResponse);
                    }else if(validCheck.isEmpty(userDetails)){
                        logger.error("no user with given details found", "userController : login - findUser", 8);
                        let apiResponse = response.generate(true, "no user with given details found", 404, null);
                        reject(apiResponse);
                    }else{
                        logger.info("user found", "userController : login - findUser");
                        resolve(userDetails);
                    }
                })
            
            }else{
                logger.error("user details not provided", "userController : login - findUser", 8);
                let apiResponse = response.generate(true, "user email Id needs to be provided", 400, null);
                reject(apiResponse);
            }
        })
    }

    let validatePassword = (userDetails) =>{
        return new Promise((resolve, reject) =>{
            generatePassword.comparePassword(req.body.password, userDetails.password, (err, isMatch)=>{
                if(err){
                    logger.error("error while comparing password","userController : login - validate Password", 9);
                    let apiResponse = response.generate(true, "error while comparing passwords", 400, err);
                    reject(apiResponse);
                }else if(isMatch){
                    let retreivedUserDetails = userDetails.toObject();
                    delete retreivedUserDetails.password;
                    delete retreivedUserDetails._id;
                    delete retreivedUserDetails.__v;
                    delete retreivedUserDetails.created;
                    resolve(retreivedUserDetails);
                }else{
                    logger.error("incorrect user password provided", "userController : login - validate password", 9);
                    let apiResponse = response.generate(true, "incorrect user password", 400, null);
                    reject(apiResponse);
                }
            })
        })
    }

    let generateToken = (userDetails) =>{
        return new Promise((resolve, reject)=>{
            tokenLib.generateToken(userDetails, (err, tokenDetails)=>{
                if(err){
                    logger.error("error while generating token", "userController : login - generate token", 9);
                    let apiResponse = response.generate(true, "error while generating token", 400, err);
                    reject(apiResponse);
                }else {
                    tokenDetails.userId = userDetails.userId;
                    tokenDetails.userDetails = userDetails;
                    resolve(tokenDetails);
                }
            })
        })
    }

    let saveToken = (tokenDetails)=>{
        return new Promise((resolve, reject)=>{
            AuthModel.findOne({userId : tokenDetails.userId}, (err, resUserDetails)=>{
                if(err){
                    logger.error("error retreiving authentication details", "userController : login - saveToken", 9);
                    let apiResponse = response.generate(true, "error retreiving authentication details", 400, err);
                    reject(apiResponse);
                }else if(validCheck.isEmpty(resUserDetails)){
                    let newUserAuthDetails = new AuthModel({
                        userId : tokenDetails.userId,
                        authToken : tokenDetails.token,
                        tokenSecret : tokenDetails.tokenSecret,
                        tokenGenerationTime : timeLib.timeNow()
                    })
                    newUserAuthDetails.save((err, newUserAuth)=>{
                        if(err){
                            logger.error("error saving new authentication details", "userController : login - saveToken", 9);
                            let apiResponse = response.generate(true, "error saving new authentication details", 400, err);
                            reject(apiResponse);
                        }else {
                            let resNewDetails = {
                                authToken : newUserAuth.authToken,
                                userDetails : tokenDetails.userDetails
                            }
                            resolve(resNewDetails);
                        }
                    })
                }else{
                    resUserDetails.authToken = tokenDetails.token;
                    resUserDetails.tokenSecret = tokenDetails.tokenSecret;
                    resUserDetails.tokenGenerationTime = timeLib.timeNow();
                    resUserDetails.save((err, updatedUserAuth) =>{
                        if(err){
                            logger.error("error updating login authentication details", "userController : login -saveToken", 9);
                            let apiResponse = response.generate(true, "error updating login authentication details", 400, err);
                            reject(apiResponse);
                        }else{
                            let resUpdatedDetails = {
                                authToken : updatedUserAuth.authToken,
                                userDetails : tokenDetails.userDetails
                            }
                            resolve(resUpdatedDetails);
                        }
                    })
                }
            })
        })
    }

    findUser(req, res)
    .then(validatePassword)
    .then(generateToken)
    .then(saveToken)
    .then((resolve)=>{
        console.log("token generated successfully")
        let apiResponse = response.generate(false, "token generated successfully", 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    })

}


let logout = (req, res)=>{
    
    AuthModel.remove({userId : req.user.userId}, (err, result)=>{
            if(err){
                logger.error("error deleting the user authentication details on logging out", "userController : logout", 10);
                let apiResponse = response.generate(true, "error deleting the user authentication details on logging out", 400, err);
                res.send(apiResponse);
            }else if( validCheck.isEmpty(result)){
                logger.error("user id invalid or already logged out", "userController : logout",8);
                let apiResponse = response.generate(true, "user Id invalid or already logged out", 404, null);
                res.send(apiResponse);
            }else {
                logger.info("user logout successful", "userController : logout", 10);
                let apiResponse = response.generate(false, "user logout successful", 200, result);
                res.send(apiResponse);
            }
        })
}

module.exports = {
    getAllUserDetails : getAllUserDetails,
    getSingleUserDetails : getSingleUserDetails,
    deleteUser : deleteUser,
    editUser : editUser,
    signUp : signUp,
    login : login,
    logout : logout
}