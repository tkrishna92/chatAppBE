const events = require('events');
const eventEmitter = new events.EventEmitter();
const socketio = require('socket.io');
const tokenLib = require('./tokenLib');

const shortId = require('shortid');
const mongoose = require('mongoose');
const ChatModel = mongoose.model('Chat');

const loggerLib = require('./loggerlib');
const response = require('./response');
const checkLib = require('./checklib');

let setServer = (server)=>{
    
    let allOnlineUsers = [];

    let io = socketio.listen(server);

    let myIo = io.of('');

    myIo.on('connection', (socket)=>{
        
        console.log('connection established - trying to emit verifyUser with the connected user');

        socket.emit('verifyUser', '');

        socket.on('set-user', (authToken)=>{
            tokenLib.verifyTokenWithoutSecretKey(authToken, (err, user)=>{
                console.log(user + " : user response from verifying the token with token lib");

                if(err){
                    socket.emit('error-occurred', {status: 500, error : " token provided is invalid"});
                }else{

                    let currentUser = user.data;
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`;

                    
                    let userObj = {userId : currentUser.userId, fullName : fullName};

                    allOnlineUsers.push(userObj);

                    console.log(allOnlineUsers);

                    socket.room = 'edChat';
                    socket.join(socket.room);
                    socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);

                }

            })
        })

        socket.on('chat-msg', (data)=>{
            data['chatId'] = shortId.generate();
            setTimeout(()=>{
                eventEmitter.emit('save-chat',data)
            },2000)

            myIo.emit(data.receiverId, data);
        })

        socket.on('typing', (data)=>{
            socket.to(socket.room).broadcast.emit('typing', data);
        })

        socket.on('mark-chat-as-seen', (data)=>{
            eventEmitter.emit('update-chat-as-seen',data);
        })

        socket.on('disconnect', ()=>{
            
            let removeIndex = allOnlineUsers.map((user)=>{
                return user.userId
            })
            .indexOf(socket.userId);

            allOnlineUsers.splice(removeIndex, 1);
            console.log(allOnlineUsers);

            socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);
            socket.leave(socket.room);
        })
    })
    
}

eventEmitter.on('save-chat', (data)=>{

    let newChatMessage = new ChatModel({
        chatId : data.chatId,
        receiverName : data.receiverName,
        receiverId : data.receiverId,
        senderName : data.senderName,
        senderId : data.senderId,
        message : data.message,
        createdOn : data.createdOn,
        chatRoom : data.chatRoom        
    })
    newChatMessage.save((err, result)=>{
        if(err){
            loggerLib.error("error while saving chat message", "socketLib : eventemmiter-on-save-chat", 9);
            
        }else if(checkLib.isEmpty(result)){
            loggerLib.error("no chat message saved", "socketlib: eventEmmiter - on - save-chat", 9);

        }else {
            loggerLib.info("chatSaved Successfully", "socketLib : eventEmitter - on - save-chat", 9);
        }
    })

})


eventEmitter.on('update-chat-as-seen', (data)=>{
    
    let updateOptions = {
        seen : true
    }

    let findQuery = {
        $and : [
            {receiverId : data.receiverId},
            {senderId : data.senderId}
        ]
    }
    ChatModel.update(findQuery, updateOptions, {multi : true}, (err, result)=>{
        if(err){
            loggerLib.error("error updating chat as seen", "socketLib : eventEmitter - on - update-chat-as-seen",9);
        }else if(checkLib.isEmpty(result)){
            loggerLib.error("chat message not updated to seen", "socketLib : eventEmitter - on - update-chat-as-seen",9);
            
        }else {
            loggerLib.info("chat updated as seen", "socketLib : eventEmitter - on - update-chat-as-seen",9);
            console.log(result);
            
        }
    })
})

module.exports = {
    setServer : setServer
}