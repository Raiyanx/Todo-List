const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Todo = require("./models/todo")
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
    Todo.find()
        .then(result => {
            res.render("index", { data: result })
        })
})
 
app.post("/", (req, res) => {
    const todo = new Todo({
        todo: req.body.todoValue
    })
    todo.save()
        .then(result => {
            res.redirect("/")
        })
})

app.get("/guest", (req, res) => {
    Todo.find()
        .then(result => {
            res.render("guest", { data: result })
        })
})

app.get("/profile", requiresAuth(), (req, res) => {
    Todo.find()
        .then(result => {
            res.render("profile", { data: result })
        })
}) 

app.listen(port, () => {
    console.log(`server is running at ${port}`)
})