const express = require('express');

const middleware = require('../middlewares/userMiddleware');

const controller = require('../controllers/userController');

const appConfig = require('./../../config/appConfig');

const auth = require('../middlewares/auth');

let setRouter = (app) =>{
      
   console.log("set router called")

    let baseUrl = `${appConfig.apiVersion}/users`;

    
    app.get(`${baseUrl}/:userId/details`, auth.isAuthenticated, controller.getSingleUserDetails);

    app.get(`${baseUrl}/allDetails`, auth.isAuthenticated, controller.getAllUserDetails);

    app.post(`${baseUrl}/:userId/deleteUser`, auth.isAuthenticated, controller.deleteUser);

    app.put(`${baseUrl}/:userId/editUser`, auth.isAuthenticated, controller.editUser);

    // params : firstName, lastName, email, mobileNumber, password

    app.post(`${baseUrl}/signup`,controller.signUp);

    /**
     * @api {post} user signup - for user signup
     * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} authToken the token for authentication can be passed as a body parameter.
     * @apiParam {String} firstName user first name to be passed as body parameter
     * @apiParam {String} lastName user last name to be passed as body parameter
     * @apiParam {String} email users email Id to be passed as body parameter
     * @apiParam {String} password password starting with a capital alphabet containing atleast 8 characters to be passed as body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     * {
            "errorOccurred": false,
            "message": "signup successful",
            "status": 200,
            "data": {


            }
     *  }
     * 
     * @apiErrorExample {json} Error- Response:
     * {
     * "errorOccurred": true,
        "message": "signup error",
        "status": 500,
        "data": "error data"
     * }
     *  
     */


    app.post(`${baseUrl}/login`, controller.login);

    /**
     * @api {post} user - login
     * @apiVersion 1.0.0
     * @apiGroup user
     * 
     * @apiParam {String} emailId emailId of the registered user to be passed as a body parameter
     * @apiParam {String} password password of the registered user to be passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     * {
        "errorOccurred": false,
        "message": "user logged in successfully",
        "status": 200,
        "data": {

                }
     *  }
     * 
     * @apiErrorExample {json} Error- Response:
     * {
     * "errorOccurred": true,
        "message": "error logging in",
        "status": 500,
        "data": "error data"
     * }
     *  
     */


    app.post(`${baseUrl}/logout`, auth.isAuthenticated, controller.logout);


    /**
     * @api {post} user - logout
     * @apiVersion 1.0.0
     * @apiGroup user
     * 
     * 
     *  @apiSuccessExample {json} Success-Response:
     * {
        "errorOccurred": false,
        "message": "log out successfull",
        "status": 200,
        "data": {

            }
     * }
     * 
     * @apiErrorExample {json} Error- Response:
     * {
     * "errorOccurred": true,
        "message": "error logging out",
        "status": 500,
        "data": "error logging out"
     * }
     *  
     */
};

module.exports = {
    setRouter:setRouter
}