const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const eadmin = require('../helpers/eadmin')
const webpush = require('web-push')
require("../models/Aluno")
const Aluno = mongoose.model("Alunos")
require("../models/Agendas")
const Agenda = mongoose.model("Agendas")
require("../models/Turmas")
const Turma = mongoose.model("Turmas")
require("../models/Usuario")
const Usuario = mongoose.model("Usuarios")
const {eAdmin} = require("../helpers/eadmin")
require("../models/Atividades")
const Atividade = mongoose.model("Atividades")
require('../models/Subs')
const Sub = mongoose.model('Sub')


router.get('/', (req,res)=>{
    res.render("admin/index")
})

router.get('/alunos', eAdmin,(req,res)=>{
    Aluno.find().lean().sort({"nome":1,"_id":1}).then((alunos)=>{
        res.render("admin/alunos",{alunos:alunos})

    })
})

router.get('/turmas', eAdmin, (req,res)=>{
    Turma.find().lean().then((turmas)=>{
        res.render("admin/turmas", {turmas:turmas})

    })
})

router.get("/addturmas",eAdmin,(req,res)=>{
    res.render("admin/addturmas")
})

router.post("/turmas/nova",eAdmin,(req,res)=>{
    var erros=[]
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "nome invalido"})
    }
    if(erros.length>0){
        console.log(erros)
        req.flash("Nome da turma invalido")
        res.redirect("/admin/turmas")
    }else{
        const novaTurma = new Turma({
            nome: req.body.nome
        })
        new Turma(novaTurma).save().then(()=>{
            res.redirect("/admin/turmas")
        })
    }
})

router.get("/turma/:id",eAdmin, (req,res)=>{
    Turma.findOne({_id:req.params.id}).lean().then((turma)=>{
        if(turma){
            Aluno.find({turma: turma._id}).lean().then((alunos)=>{
                res.render("admin/alunosturma",{turma:turma,alunos:alunos})
            })
        }
    })
})


router.get('/addalunos',eAdmin,(req,res)=>{
    Turma.find().lean().then((turmas)=>{
        Usuario.find().lean().then((resp)=>{
            res.render("admin/addalunos", {turmas:turmas,resp:resp})

        })

    })
})

router.post('/aluno/novo',eAdmin, (req,res)=>{
    var erros=[]
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "nome invalido"})
    }
    if(!req.body.idade || typeof req.body.idade == undefined || req.body.idade == null){
        erros.push({texto: "idade invalida"})
    }
    if(!req.body.responsavel || typeof req.body.responsavel == undefined || req.body.responsavel == null){
        erros.push({texto: "responsavel invalido"})
    }
    
    if(!req.body.contato || typeof req.body.contato == undefined || req.body.contato == null){
        erros.push({texto: "contato do responsavel invalido"})
    }
    
    if(erros.length>0){
        console.log(erros)
        req.flash("error_msg","houve um erro ao adicionar o aluno",{erros:erros})
        res.redirect("/admin/alunos")
    }else{
        const novoAluno= new Aluno({
            nome: req.body.nome,
            idade: req.body.idade,
            responsavel: req.body.responsavel,
            contatoresp: req.body.contato,
            turma: req.body.turma,
            alergias: req.body.alergias
        })
        new Aluno(novoAluno).save().then(()=>{
            res.redirect("/admin/alunos")
        })
    }
})

router.get('/aluno/edit/:id',eAdmin,(req,res)=>{
    Aluno.findOne({_id:req.params.id}).lean().then((aluno)=>{
        Turma.find().lean().then((turmas)=>{
            Usuario.find().lean().then((resp)=>{
                Usuario.findOne({_id: aluno.responsavel}).lean().then((responsavel)=>{

                res.render("admin/editalunos",{turmas:turmas,aluno:aluno,resp:resp, responsavel:responsavel})
            })
        })
        })
    })
})

router.post("/alunoedit",eAdmin,(req,res)=>{
    Aluno.findOne({_id: req.body.id}).then((aluno)=>{
            aluno.nome= req.body.nome,
            aluno.idade= req.body.idade,
            aluno.responsavel= req.body.responsavel,
            aluno.contatoresp= req.body.contato,
            aluno.turma= req.body.turma,
            aluno.alergias= req.body.alergias

            aluno.save().then(()=>{
                res.redirect('/admin/alunos')
            })
    })
})

router.post("/alunodeletar",eAdmin, (req,res)=>{
    Aluno.deleteOne({_id:req.body.id}).then(()=>{
        res.redirect("/admin/alunos")
    })
})

router.get("/agendas/:id",eAdmin, (req,res)=>{
    Aluno.findOne({_id: req.params.id}).lean().then((alunos)=>{
        res.render("admin/agendas",{alunos:alunos})
    })
})

router.get("/agendendasant/:nome",eAdmin,(req,res)=>{
    //res.render("admin/agendendasant")

   Aluno.findOne({nome: req.params.nome}).lean().then((aluno)=>{
    if(aluno){
        Agenda.find({aluno: aluno._id}).lean().sort({_id:-1}).then((agenda)=>{
            res.render("admin/agendendasant",{aluno:aluno , agenda:agenda})
        })
    }
   }).catch((err)=>{
    req.flash("error_msg","houve um erro ao listar as agendas")
    res.redirect("/admin/alunos")
    next(err)

   })
   
})

router.post("/agenda/nova",eAdmin, (req,res)=>{
   
        var erros=[]


        if(erros.length>0){
            console.log(erros)
            req.flash("error_msg","houve um erro ao adicionar o aluno",{erros:erros})
            res.redirect("/admin/alunos")
        }else{
            const novaAgenda={
                cafe: req.body.cafe,
                almoco: req.body.almoco,
                fruta: req.body.fruta,
                lanche: req.body.lanche,
                xixi: req.body.xixi,
                quantxixi: req.body.quantxixi,
                coco: req.body.coco,
                quantcoco: req.body.quantcoco,
                observacao: req.body.observacao,
                aluno:req.body.aluno
            }
            new Agenda(novaAgenda).save().then(()=>{
                Aluno.findOne({_id: req.body.aluno}).lean().then((aluno)=>{
                    Sub.find({'usuario._id':aluno.responsavel}).then(subscription=>{
                        subscription.forEach(subscription=>{
                        const payload = JSON.stringify({  
                            title:'Sonho encantado',
                            body: subscription.usuario.nome + ' uma nova agenda foi adicionada',
                            icon: '../public/img/Logo_Cel.jpg',
                            })
                      webpush.sendNotification(subscription.subscription,payload).catch(err=>console.error(err))
                      console.log('enviado')
                        })
                    })
                })
                res.redirect("/admin/alunos")
            }).catch((err)=>{
                console.log(err)
                next(err)

            })
        }



    })
    
router.get("/agendacompleta/:id",eAdmin, (req,res)=>{
    
    Agenda.findOne({_id: req.params.id}).lean().then((agenda)=>{
        if(agenda){
            res.render("admin/agendacompleta" ,{agenda:agenda})
        }
    })
})
router.get("/agendaedit/:id",eAdmin, (req,res)=>{
    
    Agenda.findOne({_id: req.params.id}).lean().then((agenda)=>{
        if(agenda){
            res.render("admin/agendaedit" ,{agenda:agenda})
        }
    })
})

router.post("/agendaedit",eAdmin, (req,res)=>{
    Agenda.findOne({_id: req.body.id}).then((agenda)=>{
        agenda.cafe= req.body.cafe,
        agenda.almoco= req.body.almoco,
        agenda.fruta= req.body.fruta,
        agenda.lanche = req.body.lanche,
        agenda.xixi= req.body.xixi,
        agenda.quantxixi= req.body.quantxixi,
        agenda.coco= req.body.coco,
        agenda.quantcoco= req.body.quantcoco,
        agenda.observacao= req.body.observacao

        agenda.save().then(()=>{

            Aluno.findOne({_id: agenda.aluno}).lean().then((aluno)=>{
                Sub.find({'usuario._id':aluno.responsavel}).then(subscription=>{
                    subscription.forEach(subscription=>{
                    const payload = JSON.stringify({  
                        title:'Sonho encantado',
                        body: subscription.usuario.nome + ' a agenda do seu filho foi atualizada',
                        icon: '../public/img/LogoAtalho.png',
                        })
                  webpush.sendNotification(subscription.subscription,payload).catch(err=>console.error(err))
                  console.log('enviado')
                    })
                })
            })
                

            
            


            res.redirect('/admin/alunos')
        })

})})

router.post("/agendadeletar",eAdmin, (req,res)=>{
    Agenda.deleteOne({_id:req.body.id}).then(()=>{
        res.redirect("/admin/alunos")
    })
})

router.get("/alunoinfo/:id",eAdmin,(req,res)=>{
    Aluno.findOne({_id: req.params.id}).lean().populate().then((aluno)=>{
       Turma.findOne({_id: aluno.turma}).lean().then((turma)=>{
        Usuario.findOne({_id: aluno.responsavel}).lean().then((responsavel)=>{
            res.render("admin/alunosinfo",{aluno:aluno,turma:turma,responsavel:responsavel})

        })

       })
        
    })
})

//adicionar usuarios

router.get("/usuarios",eAdmin, (req,res)=>{
    Usuario.find().lean().then((usuarios)=>{
        res.render("admin/usuarios", {usuarios:usuarios})

    })
})

//aba para adicionar boletos

router.get("/boletos",eAdmin,(req,res)=>{
    res.render("admin/boletos")
})

//aba para Atividades extras
router.get("/atividadesextras/:id",eAdmin,(req,res)=>{
    Aluno.findOne({_id: req.params.id}).lean().then((aluno)=>{
            Atividade.find({aluno: aluno._id}).lean().sort({_id:-1}).then((atividade)=>{
                res.render("admin/atividadesextras",{aluno:aluno ,atividade:atividade})
            })
  })
})

router.get("/addatividade/:id", eAdmin, (req,res)=>{
    Aluno.findOne({_id: req.params.id}).lean().then((alunos)=>{
        res.render("admin/addatividadeextra",{alunos:alunos})
    })
} )

router.post("/atividade/nova",eAdmin,(req,res)=>{
    const atividade={
        Atividade: req.body.atividades,
        aluno: req.body.aluno
    }
    new Atividade(atividade).save().then(()=>{
        Aluno.findOne({_id: req.body.aluno}).lean().then((aluno)=>{
            Sub.find({'usuario._id':aluno.responsavel}).then(subscription=>{
                subscription.forEach(subscription=>{
                const payload = JSON.stringify({  
                    title:'Sonho encantado',
                    body: subscription.usuario.nome + ' uma nova atividade   foi adicionada',
                    icon: '../public/img/Logo_Cel.jpg',
                    })
              webpush.sendNotification(subscription.subscription,payload).catch(err=>console.error(err))
              console.log('enviado')
                })
            })
        })
        res.redirect("/admin/alunos")
    }
    ).catch((err)=>{
        console.log(err)
        res.redirect("/admin/alunos")
    })

})





module.exports = router