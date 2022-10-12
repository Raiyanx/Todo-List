const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    sub: {
        type: String,
        required: true
    }, 
    todos: {
        type: [{
            work: {
                type: String,
                required: true
            },
            deadline: {
                type: Date,
                required: true
            }
        }],
        required: true
    }
})

const user = mongoose.model("user", userSchema)
module.exports = user