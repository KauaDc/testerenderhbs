const mongoose = require("mongoose")
const Schema = mongoose.Schema

const aluno = new Schema({
   
    nome:{
        type:String,
        required: true
    },
    idade:{
        type:Number,
        required:true
    },
    responsavel:{
        type: Schema.Types.ObjectId,
        ref:"Usuarios",
        required: true
    },


    contatoresp:{
        type: String,
        required: true
    },


    turma:{
        type: Schema.Types.ObjectId,
        ref:"Turmas",
        required:true
    },
    alergias:{
        type: String,
        default:"Não"
    },


})

mongoose.model("Alunos", aluno)