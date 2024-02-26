const mongoose = require("mongoose")
const Schema = mongoose.Schema

const turma=new Schema({

    nome:{
        type: String,
        required: true
    }


})

mongoose.model("Turmas", turma)