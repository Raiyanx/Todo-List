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
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER
}; 

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
    if(req.oidc.isAuthenticated())
        res.redirect("/profile")
    res.render("index")
})
 
app.get("/profile", requiresAuth(), (req, res) => {
    
    User.exists({ sub: req.oidc.user.sub })
        .then(result => {
            if(!result){
                const newUser = new User({
                    sub: req.oidc.user.sub,
                    todos: []
                }) 
                newUser.save();
                res.render("profile", {data : newUser.todos, user: req.oidc.user })
            }
            else{
                User.findOne({ sub: req.oidc.user.sub })
                .then(result => {
                    res.render("profile", { data: result.todos, user: req.oidc.user  })
                 })                
            }
        })

}) 
 

app.post("/profile", (req, res) => {
    User.updateOne({ sub: req.oidc.user.sub }, 
                    { $push: { todos: {
                                work: req.body.workValue,
                                deadline: req.body.deadValue 
                            }}  })
        .then(result => {
            res.redirect("/profile")
        })
})

app.delete("/:id", (req, res) => {
    User.updateOne({ sub: req.oidc.user.sub }, 
        { $pull: { todos: {
                    _id: new mongoose.Types.ObjectId(req.params.id)
                }}  })
    .then(
    )
})

app.listen(port, () => {
    console.log(`server is running at ${port}`)
}) 