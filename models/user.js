const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    sub: {
        type: String,
        required: true
    }, 
    todos: {
        type: [String],
        required: true
    }
})

const user = mongoose.model("user", userSchema)
module.exports = user