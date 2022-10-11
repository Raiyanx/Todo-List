const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const User = require("./models/user")
const dotenv = require("dotenv")

const port = process.env.PORT | 3000;
dotenv.config();

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended : true }))
app.use(bodyParser.json())


const { auth, requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: 'http://localhost:3000',
  clientID: 'cCrHWPL7GYn0NdAm3MWSyxqVRiYpsAHg',
  issuerBaseURL: 'https://dev-p1sz-sew.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


const dbName = process.env.DBNAME;
const dbPassword = process.env.DBPASSWORD
const dbUser = process.env.DBUSER;

 
const dburl = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.khluax3.mongodb.net/${dbName}?retryWrites=true&w=majority`
mongoose.connect(dburl)
.then(() => {
    console.log('Connected to MongoDB')
})
.catch(err => console.log(err));


app.get("/", (req, res) => {
    res.render("index")
})
 

/*

app.get("/guest", (req, res) => {
    Todo.find({})
        .then(result => {
            console.log(result);
            res.render("guest", { data: result })
        })
})
*/


app.get("/profile", requiresAuth(), (req, res) => {
    
    User.exists({ sub: req.oidc.user.sub })
        .then(result => {
            if(!result){
                console.log("here");
                const newUser = new User({
                    sub: req.oidc.user.sub,
                    todos: []
                }) 
                newUser.save();
                res.render("profile", {data : newUser.todos })
            }
            else{
                User.findOne({ sub: req.oidc.user.sub })
                .then(result => {
                    console.log(result);
                    res.render("profile", { data: result.todos })
                 })                
            }
        })

}) 


app.post("/profile", (req, res) => {
    User.updateOne({ sub: req.oidc.user.sub }, { $push: { todos: req.body.todoValue }  })
        .then(result => {
            res.redirect("/profile")
        })
})

app.listen(port, () => {
    console.log(`server is running at ${port}`)
})