const mongoose = require('mongoose')


const Schema = mongoose.Schema
// const ObjectId = Schema.ObjectId

const userSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: String,
    email: {
        type: String,
        required: true
    },
    channels: []
})


const User = mongoose.model('Users', userSchema)
module.exports = User