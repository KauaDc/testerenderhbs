const mongoose = require("mongoose")
const Schema = mongoose.Schema

const atividades = new Schema({


    Atividade:{
      type: String,  
      default:"Nenhuma observação",
      required:true
    },


    aluno:{
        type: Schema.Types.ObjectId,
        ref: "Alunos",
        required:true
    },


    

})

mongoose.model("Atividades", atividades)