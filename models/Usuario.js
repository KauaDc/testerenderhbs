const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usuario = new Schema({

    nome:{
        type: String,
        required:true,
    },
    senha:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true
    },
    eadmin:{
        type: Number,
        required:true,
        default: 0
    }


})

mongoose.model("Usuarios",usuario   )