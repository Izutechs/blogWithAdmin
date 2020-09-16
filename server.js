const express=require("express");
const app=express();
const mongodb=require("mongodb");
const morgan=require("morgan");
const mongoose=require("mongoose");
const session=require("express-session");
const MongoStore=require("connect-mongo")(session);
const path=require("path");

//use morgan middleware
app.use(morgan("dev"));


//use ejs as template
app.set("view engine", "ejs");


//to make form data accessible

app.use(express.urlencoded({extended: false}));


//link to connect to mongodb

mongoUrl="mongodb://localhost:27017/blogWithAdmin";


//create connection it is an async function and then and catch method is used to help the flow from blocking
mongoose.connect(mongoUrl, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then((result)=>{
        console.log("MongoDb connected");
        app.listen(3000);
    })
    .catch((err)=>{
        console.log(err)
    });
let connection=mongoose.connection;


app.use(session({
    secret: "watsup",
    resave: false,
    saveUninitialized: false,
    store : new MongoStore({
        mongooseConnection: connection
    })
}));

//bring  users routes via middleware
const usersRoute=require("./routes/usersRoute");
//bring the blogs via middleware

const blogsRoute=require("./routes/blogsRoute");



//bring the admin panel via middleware

const adminRoute=require("./routes/adminRoute");
//middleware to help apply css 

app.use(express.static(__dirname + '/views'));

app.use("/", blogsRoute);
app.use("/", usersRoute);
app.use("/cp", adminRoute);
