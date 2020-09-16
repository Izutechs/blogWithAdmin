const express=require("express");
const userRoute=express.Router();


const User=require("../models/user");
const PremiumUser=require("../models/premiumUser");

userRoute.get("/register", (req, res)=>{
    res.render("register", {title: "Register"});
})



userRoute.post("/register", (req, res)=>{
    let incomingUser=req.body;
    if( !incomingUser.username || !incomingUser.email||!incomingUser.password||!incomingUser.confpassword){
        res.send({"notify": "please fill all fields"});
    }else{
            
        
        if(incomingUser.password===incomingUser.confpassword){
        User.findOne({username: incomingUser.username}, (err, data)=>{
        if(!data){
            let c;
            User.findOne({}, (err, data)=>{
                if(data){
                    c=Number(data.unique_id) + Number(1);
                }
                else{
                    c=1;
                }
            let latestUser=new User({
                unique_id: c,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                confPassword: req.body.confpassword,
            });
            latestUser.save((err, done)=>{
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

userRoute.get("/login", (req, res)=>{
    if(req.session.userId){
        res.redirect("/");
    }
    else{
    res.render("login", {title: "Login"});
    }
});

userRoute.post("/login", (req, res)=>{
    let incomingUser=req.body;
    User.findOne({username: incomingUser.username}, (err, data)=>{
        if(data){
            if(incomingUser.password==data.password){
            req.session.userId=data.unique_id;
            res.redirect("/dashboard");
            }else{
                res.send({notify: "Incorrect password"});
            }
        }
        else{
            res.send({notify: "That username exists"});
        }
    });
});



userRoute.get("/dashboard", (req, res)=>{
    User.findOne({unique_id: req.session.userId}, (err, data)=>{
        if(data){
        PremiumUser.findOne({unique_id: req.session.userId}, (err, premium)=>{

if(premium){
    res.render("dashboard", {title: data.username,  user: data, premiumUser: premium});
}
else{
    res.render("dashboard", {title: data.username, user: data, premiumUser: false});
}


        })
        
        }
        else{
            res.redirect("/login");
        }
    })
    
});

userRoute.get("/upgradeMain", (req, res)=>{
    res.render("upgradeMain", {title: "Upgrade"});

});

userRoute.get("/editProf", (req, res)=>{
    if(req.session.userId){
    res.render("editprofile", {title: "Upgrade"});
}  else{
    console.log("login");
    res.redirect("/login")
}
});
userRoute.post("/editProf", (req, res)=>{
    
    
        let newPremium=req.body;
    User.findOne({unique_id: req.session.userId})
    .then((user)=>{

   
    PremiumUser.findOne({unique_id: user.unique_id}, (err, data)=>{

        if(!data){
        const newPremUser=new PremiumUser({
            premium: "yes",
            unique_id: user.unique_id,
            email:  user.email,
            username: user.username,
            password: user.password,
            fullname: newPremium.fullname,
            country: newPremium.country,
            imgAddr: newPremium.imgAddr,
            phone: newPremium.phone,
            about: newPremium.about,
            bankDetail: newPremium.bank,
            btcAddress: newPremium.btc
        });
        newPremUser.save((err, done)=>{
            if(err){
                res.send("error submitting");
            }
            else{
                res.send("success");
            }
        });
        }
        else{
            res.send("There is a premium user");
        }

    })

})

});




userRoute.get("/logout", (req, res)=>{
    req.session.destroy(function(err){
        if(err){
            return next(err);
        }
        else{
            res.redirect("/");
        }
    });
});

module.exports=userRoute;
