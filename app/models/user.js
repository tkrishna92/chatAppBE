const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    userId :{
        type : String,
        default : '',
        index : true,
        unique : true
    },
    firstName:{
        type:String,
        default:""
    },
    lastName:{
        type:String,
        default:""
    },
    password:{
        type:String,
        default:"*******"
    },
    email:{
        type:String,
        default:""
    },
    mobileNumber:{
        type:Number,
        default: 0
    },
    created:{
        type:String,
        default:""
    }
})

mongoose.model('User',userSchema);