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

app.get("/todolist", )

app.listen(port, () => {
    console.log(`server is running at ${port}`)
})