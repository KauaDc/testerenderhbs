const mongoose = require("mongoose")
const Schema = mongoose.Schema

const agenda = new Schema({

    data:{
        type: String
    },
    cafe:{
        type: String
    },
    almoco:{
        type: String
    },
    fruta:{
        type: String
    },
    lanche:{
        type: String
    },

    observacao:{
      type: String,  
      default:"Nenhuma observação"
    },

    xixi:{
        type: String,  
        default:"Não"
    },

    coco:{
        type: String,  
        default:"Não"
    },
    
    quantxixi:{
        type: Number,
        default:0
    },

    quantcoco:{
        type: Number,
        default:0
    },

    aluno:{
        type: Schema.Types.ObjectId,
        ref: "Alunos",
        required:true
    }

})

mongoose.model("Agendas", agenda)