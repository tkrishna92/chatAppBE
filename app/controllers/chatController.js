const express = require('express');
const checkLib = require('./../libs/checklib');
const loggerLib = require('./../libs/loggerlib');
const response = require('./../libs/response');
const timeLib = require('./../libs/time');

const mongoose = require('mongoose');
const ChatModel = mongoose.model('Chat');
const UserModel = mongoose.model('User');

let getUsersAllChats = (req, res)=>{
    let validReqCheck = ()=>{
        return new Promise((resolve, reject)=>{
            if(checkLib.isEmpty(req.query.senderId) || (checkLib.isEmpty(req.query.receiverId))){
                loggerLib.error("no receiver or sender Id provided", "chatController : getUsersAllChats - validReqCheck", 8);
                let apiResponse = response.generate(true, "no receiver or sender information provided", 500, null);
                reject(apiResponse);
            }else{
                resolve();
            }
        })
    }

    let findChats = () =>{
        return new Promise((resolve, reject)=>{
            let findQuery = {
                $or : [
                    {
                        $and : [
                            {receiverId : req.query.receiverId},
                            {senderId : req.query.senderId}
                        ]
                    },
                    {
                        $and : [
                            {senderId : req.query.receiverId},
                            {receiverId : req.query.senderId}
                        ]
                    }
                ]
            }
            ChatModel.find(findQuery)
                    .select('-_id -__v -chatRoom')
                    .sort('-createdOn')
                    .skip(parseInt(req.query.skip) || 0)
                    .lean()
                    .limit(10)
                    .exec((err, result)=>{
                        if(err){
                            loggerLib.error("error retreiving chats of user", "chatController : getUsersAllChat - findChat", 10);
                            let apiResponse = response.generate(true, "error retreiving user messages", 500, err);
                            reject(apiResponse);
                        }else if(checkLib.isEmpty(result)){
                            loggerLib.error("no chats of the user found", "chatController : getUsersAllChats - findCahts", 9);
                            let apiResponse = response.generate(true, "no chats with the user found", 404, null);
                            reject(apiResponse);
                        }else{
                            loggerLib.info("user chats found", "chatController : getUsersAllChats - findChats", 10);
                            console.log("original result : "+result);
                            let retreivedMessages = result.reverse();
                            // console.log(result);
                            console.log(retreivedMessages);
                            
                            resolve(retreivedMessages);
                        }
                    })

        })
    }

    validReqCheck()
    .then(findChats)
    .then((retreivedMessages)=>{
        let apiResponse = response.generate(false, "Chats found", 200, retreivedMessages);
        res.send(apiResponse);
    })
    .catch((error)=>{
        res.send(error);
    })


}

let getGroupChat = (req,res)=>{

    let validReqCheck = ()=>{
        return new Promise((resolve, reject)=>{
            if(checkLib.isEmpty(req.query.chatRoom)){
                loggerLib.error("required details missing", "chatController : getGroupChat - validReqCheck");
                let apiResponse = response.generate(true, "room name not provided", 500, null);
                reject(apiResponse);
            }else{
                resolve();
            }
        })
    }

    let findChats = () =>{
        return new Promise((resolve, reject)=>{
            ChatModel.find({chatRoom : req.query.chatRoom})
                .select('-_id -__v -receiverName -receiverId')
                .sort('-createdOn')
                .skip(parseInt(req.query.skip) || 0)
                .limit(10)
                .lean()
                .exec((err, result)=>{
                if(err){
                    loggerLib.error("error finding group chats of the given room","chatController : getGroupChat - findChats", 9);
                    let apiResponse = response.generate(true, "error finding chats of the given room group", 400, err);
                    reject(apiResponse);
                }else if(checkLib.isEmpty(result)){
                    loggerLib.error("no chats of the given group found", "chatController : getGroupChats - findChats", 9);
                    let apiResponse = response.generate(true, "no chats of the given room group found", 404, null);
                    reject(apiResponse);
                }else{
                    let reverseResult = result.reverse();
                    resolve(reverseResult);
                }
            })
        })
    }


    validReqCheck()
    .then(findChats)
    .then((result)=>{
        let apiResponse = response.generate(false, "group chats found", 200, result);
        res.send(apiResponse);
    })
    .catch((error)=>{
        res.send(error);
    })

}

let unseenChatCount = (req, res) =>{

    let validReqCheck = () =>{
        return new Promise((resolve, reject)=>{
            if(checkLib.isEmpty(req.query.userId) || checkLib.isEmpty(req.query.senderId)){
                loggerLib.error("no user Id provided to search for chats", "chatController : unseenChatCount - validReqCheck");
                let apiResponse = response.generate(true, "no user id provided to search for chat", 400, null);
                reject(apiResponse);
            }else{
                resolve();
            }
        })
    }

    let findChatCount = ()=>{
        let findQuery = {
            receiverId : req.query.userId,
            senderId : req.query.senderId,
            seen : false
        }
        return new Promise((resolve, reject)=>{
            ChatModel.count(findQuery , (err, result)=>{
                if(err){
                    loggerLib.error("error getting the count of unseen messages", "chatController : unseenChatCount - findChatCount", 9);
                    let apiResponse = response.generate(true, "error retreiving unseen chat count", 400, err);
                    reject(apiResponse);
                }else{
                    loggerLib.info("unseen chat count found", "chatController : unseenChatCount - findChatCount", 9);
                    resolve(result);
                }
            })
            
        })
        
    }

    validReqCheck()
    .then(findChatCount)
    .then((result)=>{
        let apiResponse = response.generate(false, "unseen chat count found", 200, result);
        res.send(apiResponse);
    })
    .catch((error)=>{
        res.send(error);
    })
}

let unseenUserChat = (req, res)=>{
    
    let validReqCheck = () =>{
        return new Promise((resolve, reject)=>{
            if(checkLib.isEmpty(req.query.userId) || checkLib.isEmpty(req.query.senderId)){
                loggerLib.error("required userId or senderId not provided", "chatController : unseenUserChat - validReqCheck", 9);
                let apiResponse = response.generate(true, "userId or senderId not provided", 400, null);
                reject(apiResponse);
            }else{
                resolve();
            }
        })
    }

    let findUnseenChat = () =>{
        let findQuery = {
            receiverId : req.query.userId,
            senderId :req.query.senderId,
            seen : false
        }
        return new Promise((resolve, reject)=>{
            ChatModel.find(findQuery)
            .select('-__v -_id -chatRoom')
            .sort('-created')
            .limit(10)
            .lean()
            .exec((err, result)=>{
                if(err){
                    loggerLib.error("error retreiving unseen user chat", "chatController : unseenUserChat - findUnseenChat",9);
                    let apiResponse = response.generate(true, "error retreiving user unseen chats", 400, err);
                    reject(apiResponse);
                }else if(checkLib.isEmpty(result)){
                    loggerLib.error(true, "no unseen chat of the user found", "chatController : unseenUserChat - findUnseenChat",8);
                    let apiResponse = response.generate(true, "no unseen chat of the user found", 404, null);
                    reject(apiResponse);
                }else {
                    let data = result.reverse();
                    resolve(data);
                }
            })
        })
    }

    validReqCheck()
    .then(findUnseenChat)
    .then((data)=>{
        let apiResponse = response.generate(false, "unseen chat found", 200, data);
        res.send(apiResponse);
    })
    .catch((error)=>{
        res.send(error);
    })

}

let getUnseenChatUserList = (req, res)=>{

    let validReqCheck = ()=>{
        return new Promise((resolve, reject)=>{
        if(checkLib.isEmpty(req.query.userId)){
            loggerLib.error("userId not provided", "chatController : getUnseenChatUserList - validReqCheck", 9);
            let apiResponse = response.generate(true, "userId not provided", 400, null);
            reject(apiResponse);
        }else{
            resolve();
        }
    })

}

    let findSendersList = () =>{
        return new Promise((resolve, reject)=>{
            ChatModel.distinct('senderId', {receiverId : req.query.userId, seen : false}, (err, result)=>{
                if(err){
                    loggerLib.error("error retreiving message senders list", "chatController : getUnseenChatUserList - findSendersList", 9);
                    let apiResponse = response.generate(true, "error retreiving senders list", 400, err);
                    reject(apiResponse);
                }else if(checkLib.isEmpty(result)){
                    loggerLib.error("no unseen message senders found", "chatController : unseenChatUserList - findSendersList", 9);
                    let apiResponse = response.generate(true, "no unseen senders found", 404, null);
                    reject(apiResponse);
                }else {
                    loggerLib.info("unseen messages senders found", "chatController: unseenChatUserList - findSendersList", 9);
                    console.log(result);
                    resolve(result);
                }
            })
        })
    }

    let findSenderDetails = (result)=>{
        return new Promise((resolve, reject)=>{
        // using "field : 0" instead of select(-field) to avoid "projection cannot have a mix of inclusion and exclusion" error
          UserModel.find({userId : {$in: result}}, { _id: 0, __v:0, password:0, email:0, mobileNumber:0, createdOn:0})
          .lean()
          .exec((err, result)=>{
              if(err){
                  loggerLib.error("error retreiving sender details", "chatController : getUnseenCharUserList- findSenderDetails", 9);
                  let apiResponse = response.generate(true, "error retreiving sender details", 400, err);
                  reject(apiResponse);
              }else if(checkLib.isEmpty(result)){
                  loggerLib.error("no sender details found", "chatController : getUnseenChatUserList - findSenderDetails", 9);
                  let apiResponse = response.generate(true, "no sender details found", 404, null);
                  reject(apiResponse);
              }else {
                  resolve(result);
              }
          })
        })
    }

    validReqCheck()
    .then(findSendersList)
    .then(findSenderDetails)
    .then((data)=>{
        let apiResponse = response.generate(false, "unseen messages sender list found", 200, data);
        res.send(apiResponse);
    })
    .catch((error)=>{
        res.send(error);
    })
}


module.exports = {
    getUsersAllChats : getUsersAllChats,
    getGroupChat : getGroupChat,
    unseenChatCount : unseenChatCount,
    unseenUserChat : unseenUserChat,
    getUnseenChatUserList : getUnseenChatUserList,
}