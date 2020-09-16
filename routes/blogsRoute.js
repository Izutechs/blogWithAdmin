const express=require("express");
const blogRoute=express.Router();


const User=require("../models/user");
const Blog=require("../models/blog");
const Comment=require("../models/comment");
const upload=require("express-fileupload");
const fs=require("fs");


//site homepage
blogRoute.get("/", (req, res)=>{
    Blog.find().sort({createdAt:-1})
    .then((result)=>{
        console.log(result);
        res.render("blogpage", {title: "Blogs", blogs: result});
    })
    .catch((err)=>{
        res.send({notify: "internal error"});
    })
});



//create post
blogRoute.get("/createpost", (req, res)=>{
    User.findOne({unique_id: req.session.userId})
    .then((data)=>{
        if(req.session.userId==data.unique_id){
            res.render("createpost", {title: "Create Post"});
        }
        else{
            res.send({notify: "Please login to post an article"})
        }
    })
    .catch((err)=>{
        res.send({notify: "Please login"})
    });
    
    
})
blogRoute.use(upload());



blogRoute.post("/createpost", (req, res)=>{
    
    if(req.files){
        let blogpicture=req.files.blogpicture;
        let randomString=Math.random()*100000000000;
        let pictureName=randomString+blogpicture.name;
        blogpicture.mv('./views/img/posts/'+pictureName, function(err){
            if(err){
                console.log(err)
            }else{
                const blog= new Blog({
                    author: req.session.userId,
                    title: req.body.blogtitle,
                    snippet: req.body.blogsnippet,
                    content: req.body.blogcontent,
                    postImgLink: pictureName
                });
                blog.save()
                .then((result)=>{
                    // res.send({notify: "posted"});
                    res.redirect("/");
                })
                .catch((err)=>{
                    res.send({notify: "an error occured"});
                })



            }
        })


    }
    else{
    const blog= new Blog({
        author: req.session.userId,
        title: req.body.blogtitle,
        snippet: req.body.blogsnippet,
        content: req.body.blogcontent
        
    });
    blog.save()
    .then((result)=>{
        // res.send({notify: "posted"});
        res.redirect("/");
    })
    .catch((err)=>{
        res.send({notify: "an error occured"});
    })
}
});

blogRoute.get("/authors", (req, res)=>{

                
            // console.log(blogs.author);
                // console.log(resultt.title);
               User.find({}).collation({locale: "en", strength: 2}).sort({username: 1})

             .then((thoseAuthors)=>{
                if(thoseAuthors){
                    
                    res.render("authors", {title: "Authors", authors: thoseAuthors});
                }
                else{
                    console.log("no authors yet")
                }
             })
          
            .catch((err)=>{console.log(err)});
        
});


blogRoute.post("/postcontent/:id", (req, res)=>{
    const id=req.params.id;
    const comment= new Comment({
        uniq_id: req.params.id,
        nickname: req.body.usernameComment,
        comment: req.body.comment
    });

    comment.save((err, done)=>{
        if(err){
            res.send({notify: "There was a problem commenting"});
        }
        else{
            res.send({notify: "You just commented"});
        }
    })
    // Comment.find()
});


blogRoute.get("/blogs/:id", (req, res)=>{
    const id=req.params.id;
    let usercommentArr=[];
    Blog.findById(id)
    .then((result)=>{
        const authorId=result.author;
        console.log(result.author);
        User.findOne({unique_id: authorId}, (err, data)=>{
            if(data){

        Comment.find({uniq_id: id}).sort({createdAt: -1})
        .then((resultantComments)=>{
           
            console.log(resultantComments);
            // usercommentArr.push(resultantComments);
            // console.log(data);
            // console.log(data.username);
            res.render("postcontent", {author: data, post: result, usersComments: resultantComments});

           
        })
        .catch((err)=>{
            console.log(err);
            res.send("no comment");
        })
               
            
                
            }
            else{
                res.send("No author found");
            }
        });
        
        
    })
    .catch((err)=>{
        res.send("Content Not available");
    })
    
});


//allow only the author to delete post


blogRoute.delete("/blogs/:id", (req, res)=>{
    const id=req.params.id;

    Blog.findById(id)
    .then((thePost)=>{
        console.log(thePost);
        if(thePost.author==req.session.userId){
            let theImg=thePost.postImgLink;
            fs.unlink('./views/img/posts/'+theImg, (err)=>{
                if(err)
                    console.log(err);
                else
                    
                Blog.findByIdAndDelete(id)
                .then((result)=>{
                    
                    console.log("Sucessfully deleted");
                    res.json({redirect: "/"});
                
               
                })
                .catch((err)=>{
                    console.log(err);
                });
                
            })
           
        
        }
        else{
            console.log("You are not the author");
        }
    })
    .catch((err)=>{
        console.log(err);
    });



   
});




module.exports=blogRoute;