const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const premiumUserSchema =new Schema({

    premium: {
        type: String,
        required: true
    },
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
    fullname: {
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    imgAddr: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    about: {
        type: String
    },
    bankDetail: {
        type: String
    },
    btcAddress: {
        type: String
    }


}, {timeStamps: true});


const PremiumUser=mongoose.model("Premium", premiumUserSchema);

module.exports=PremiumUser;