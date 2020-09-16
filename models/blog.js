const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const blogSchema=new Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    snippet:{
        type:String
    },
    content: {
        type: String,
        required: true
    },
    postImgLink: {
        type: String
    }

}, {timestamps: true});

const Blog=mongoose.model("Blog", blogSchema);

module.exports=Blog;