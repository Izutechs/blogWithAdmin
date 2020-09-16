const express=require("express");
const adminRoute=express.Router();


const User=require("../models/user");
const Blog=require("../models/blog");
const Comment=require("../models/comment");
const Admin=require("../models/admin");


adminRoute.get("/regAdmin", (req, res)=>{
    res.render("adminReg", {title: "Admin"});






});




adminRoute.post("/regAdmin", (req, res)=>{
    let admin=req.body;
    if( !admin.username || !admin.email||!admin.password||!admin.confpassword){
        res.send({"notify": "please fill all fields"});
    }else{
            
        
        if(admin.password===admin.confpassword){
        Admin.findOne({username: admin.username}, (err, data)=>{
        if(!data){
            let c;
            Admin.findOne({}, (err, data)=>{
                if(data){
                    c=Number(data.unique_id) + Number(1);
                }
                else{
                    c=1;
                }
            let latestAdmin=new Admin({
                unique_id: c,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                confPassword: req.body.confpassword,
            });
            latestAdmin.save((err, done)=>{
                if(err){
                    res.send({notify: "error"});
                }
                else{
                    
                    res.send({notify: "success"});
                }
            });
            
            
            
            })
            .sort({_id: -1}).limit(1);
            
        }
        else{
            res.send({notify: "User with that name exists"});
        }
    })
            }
            else{
                res.send({notify: "passwords don't match"});
            }
    }
});




adminRoute.get("/adminLog", (req, res)=>{
    if(req.session.adminId){
        res.redirect("/cp/admin");
    }
    else{
        res.render("adminLog", {title: "Admin"});
    }
   

});

adminRoute.post("/adminLog", (req, res)=>{
    let admin=req.body;
   
    Admin.findOne({username: admin.username}, (err, data)=>{
        if(data){
            if(admin.password==data.password){
            req.session.adminId=data.unique_id;
            res.redirect("/cp/admin");
            }else{
                res.send({notify: "No admin"});
            }
        }
        else{
            res.send({notify: "No admin with that username found"});
        }
    });

});

adminRoute.get("/admin", (req, res)=>{
    Admin.findOne({unique_id: req.session.adminId}, (err, data)=>{
        if(data){
    User.find({}).sort({createdAt: -1})
    .then((users)=>{


        res.render("adminDashboard", {title: data.username, signedUsers: users});

    })
    .catch((err)=>{
        res.send({notify: "no registered users"});
    }) ;
    
      
        
        }
        else{
            res.redirect("/cp/adminLog");
        }
    })
    
});
//get all details of a user
adminRoute.get("/admin/aUser/:id", (req, res)=>{
    let id=req.params.id;
User.findById(id)
.then((userData)=>{
    res.render("aUser", {title: userData.username, signedUser: userData});
})
.catch(err=>{console.log(err)});
})




adminRoute.get("/admin/aUser/blogs/:id", (req, res)=>{
        let id=req.params.id;
    
    Blog.find({author: id}).sort({createdAt: -1})
    .then((userArticle)=>{
        console.log(userArticle);
        res.render("allUsers", {title: userArticle.author, posts: userArticle});
    })
    .catch((err)=>{
        // res.send("no userArticle");
        console.log(err);
    })
           
});
    
      
adminRoute.get("/admin/logout", (req, res)=>{
   
        req.session.destroy(function(err){
            if(err){
                return next(err);
            }
            else{
                res.redirect("/cp/adminLog");
            }

        });
        
   
});
    


module.exports=adminRoute;
