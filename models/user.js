
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userSchema=new Schema({
    unique_id:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confPassword: {
        type: String,
        required: true
    }
    
}, {timeStamps: true});

const User=mongoose.model("User", userSchema);

module.exports=User;