const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ChatSchema = new Schema({
    chatId : { type: String, unique : true, required : true},
    senderName : { type: String, default: ''},
    senderId : {type: String, default : ''},
    receiverName : {type: String, default : ''},
    receiverId : {type: String, default : ''},
    message : {type: String, default : ''},
    seen : {type : Boolean, default : false},
    chatRoom : {type: String, default : ''},
    createdOn : {type: Date, default: Date.now()},
    modifiedOn:{type: Date, default : Date.now()}
})

mongoose.model('Chat', ChatSchema)