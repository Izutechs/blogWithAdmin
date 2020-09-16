const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const postCommentSchema=new Schema({
    
    personComment:  [{
        type: String,
        required: true
    }]
}, {timestamps: true});

const postComment=mongoose.model("Comment", postCommentSchema);

module.exports=postComment;