const express = require('express');

const controller = require('../controllers/chatController');

const appConfig = require('./../../config/appConfig');

const auth = require('../middlewares/auth');

let setRouter = (app) =>{
      
   console.log("set router called")

    let baseUrl = `${appConfig.apiVersion}/chat`;

    
     // queryParams : receiverId (which is the userId), senderID, skip
     // body/ query/ header param : authToken

    app.get(`${baseUrl}/getAllChat/`, auth.isAuthenticated , controller.getUsersAllChats);

    /**
     * @api {get} chat getAllChat - get all chats with selected sender
     * @apiVersion 1.0.0
     * @apiGroup chat
     * 
     * @apiParam {String} authToken the token for authentication can be passed as a body parameter.
     * @apiParam {String} receiverId userId to be passed as query parameter
     * @apiParam {String} senderID sender's userId to be passed as query parameter
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




     
     // queryParams : chatRoom (which is the room the users has joined), skip
     // body/ query/ header param : authToken
    app.get(`${baseUrl}/getGroupChat/`, auth.isAuthenticated , controller.getGroupChat);

    /**
     * @api {get} chat getGroupChat - get all chats in the room
     * @apiVersion 1.0.0
     * @apiGroup chat
     * 
     * @apiParam {String} authToken the token for authentication can be passed as a body parameter.
     * @apiParam {String} chatRoom name of the chat room the user has joined.
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


    
     // queryParams : userId, senderId
     // body/ query/ header param : authToken
    app.get(`${baseUrl}/getUnseenChatCount/`, auth.isAuthenticated , controller.unseenChatCount);

    /**
     * @api {get} chat getUnseenChatCount - get number of unseen messages from particular user
     * @apiVersion 1.0.0
     * @apiGroup chat
     * 
     * @apiParam {String} authToken the token for authentication can be passed as a body parameter.
     * @apiParam {String} userId Id of the receiver passed as a query parameter
     * @apiParam {String} senderId Id of the sender passed as a query parameter
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


     // queryParams : userId , senderId
     // body/ query/ header param : authToken
    app.get(`${baseUrl}/getUnseenChat/`, auth.isAuthenticated , controller.unseenUserChat);

    /**
     * @api {get} chat getUnseenChat - get unseen messages from particular user
     * @apiVersion 1.0.0
     * @apiGroup chat
     * 
     * @apiParam {String} authToken the token for authentication can be passed as a body parameter.
     * @apiParam {String} userId Id of the receiver passed as a query parameter
     * @apiParam {String} senderId Id of the sender passed as a query parameter
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


     
     // queryParams : userId
     // body/ query/ header param : authToken
    app.get(`${baseUrl}/getUnseenChatUserList/`, auth.isAuthenticated , controller.getUnseenChatUserList);

    /**
     * @api {get} chat getUnseenChatUserList - get list of senders whose messages are unseen by the user
     * @apiVersion 1.0.0
     * @apiGroup chat
     * 
     * @apiParam {String} authToken the token for authentication can be passed as a body parameter.
     * @apiParam {String} userId Id of the receiver passed as a query parameter
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

};

module.exports = {
    setRouter:setRouter
}