const mongoose = require("mongoose")
const Schema = mongoose.Schema

const sub = new Schema({
    subscription:Object,
    usuario:Object
})
mongoose.model('Sub',sub)
