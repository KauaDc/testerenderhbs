//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const usuario = require("./routes/usuario")
const path = require('path')
const mongoose = require('mongoose')  
const session = require('express-session')
const flash= require('connect-flash')
const db = require('./config/db')
const webpush = require('web-push')
//
require("./models/Aluno")
const Aluno = mongoose.model("Alunos")
require("./models/Turmas")
const Turma = mongoose.model("Turmas")
require("./models/Agendas")
const Agenda = mongoose.model("Agendas")
require("./models/Atividades")
const Atividade = mongoose.model("Atividades")
require('./models/Subs')
const Sub = mongoose.model('Sub')

const passport=require("passport")
require("./config/auth")(passport)

const {logado}=require("./helpers/logado")

//configurações
    //sessão
        app.use(session({
            secret: "SonhoEncantado",
            resave: true,
            saveUninitialized: true
        })) 
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg=req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            res.locals.userlogado = req.nome;
            res.locals.userAdmin = req.eAdmin || null
            res.locals.admin = req.eAdmin
            
            next()
        })


        const publicVapidKey = 'BFTkZBOS_z4CJ3-7e-zrILz70H0bw9xoxanAtmq6KyMHpfeGmYAG46VaduG2W3R3biUfBzuZv8u__ZVasmwcja8'
const privateVapidKey = 'vkCtCEmQXqkDAt0bPQCoX3L-k6q9vCrVrAvMgJ4XTOA'

webpush.setVapidDetails('mailto:teste@teste.com', publicVapidKey, privateVapidKey)

    //body parser
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    //handlebars
    app.engine('handlebars', handlebars.engine({
        defaultLayout:'main',
        runtimeOptions:{
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,

        }

}))
    app.set('view engine', 'handlebars')
    //mongoose

    mongoose.Promise=global.Promise
    mongoose.set("strictQuery", true);

    mongoose.connect(db.mongoURI)
    //zzmongoose.connect('mongodb://localhost:27017/notificacao')
    .then(()=>{
        console.log("Banco de dados conectado")
    }).catch((err)=>{
        console.log("Erro ao conectar Banco de dados")
        next(err)
    })

    //Public
    app.use(express.static(path.join(__dirname,"public")))
    app.use(express.static(path.join(__dirname, "client")))

//rotas

app.post('/subscribe', (req, res) => {
    const subscription = req.body
    const usuario = req.user
    Sub.findOne({subscription: subscription}).then(sub=>{if(sub){
        console.log('ja inscrito')
    }
    else{
    const newSub = new Sub({subscription,usuario})
    newSub.save().then(()=>console.log('salvo')).catch(err=>console.log(err))
    const payload = JSON.stringify({title:'Seja bem vindo(a)'})
    webpush.sendNotification(subscription,payload).catch(err=>console.error(err))

}})
})

app.get('/', (req, res) =>{

    
    Aluno.find({responsavel: req.user}).lean().populate('turma').sort({data:"desc"}).then((aluno)=>{
        if(aluno){
            res.render("index",{aluno:aluno})

        }

    })

})

app.get('/agendas/:responsavel',logado,(req,res)=>{
    Aluno.findOne({ responsavel: req.user}).lean().then((aluno)=>{
        if(aluno){
                Agenda.find({aluno: aluno._id}).lean().sort({_id:-1}).then((agenda)=>{
                    res.render("usuario/agendas",{aluno:aluno , agenda:agenda})
                })     
            
      
        }else{
            req.flash("error_msg","você não tem acesso à estas agendas")
            res.redirect("/")
        }
       }).catch((err)=>{
        req.flash("error_msg","houve um erro ao listar as agendas")
        res.redirect("/")
        next(err)

       })
       
    })

app.get('/agendacompleta/:id',logado,(req,res)=>{
    Aluno.findOne({ responsavel: req.user}).lean().then((aluno)=>{
    if(aluno){
        Agenda.findOne({_id: req.params.id}).lean().then((agenda)=>{
            if(agenda){
                res.render("usuario/agendacompleta",{agenda:agenda})
    
            }
        })
    }else{
        req.flash("error_msg","você não tem acesso à esta agendas")
        res.redirect("/")
    }
    })


})

app.get("/atividades/:id", logado,(req,res)=>{
    Aluno.findOne({ responsavel: req.user}).lean().then((aluno)=>{
        if(aluno){
            Atividade.find({aluno: aluno._id}).lean().then((atividade)=>{
                res.render("usuario/atividadesextras",{aluno:aluno , atividade:atividade})
            })
  }else{
    req.flash("error_msg","você não tem acesso à estas atividades")
    res.redirect("/")
  }})})


/*
  app.post('/enviar' ,(req,res)=>{

 
    Sub.find().then(subs=>{
        subs.forEach(subscription=>{
            const payload = JSON.stringify({  
                title:'Sonho encantado',
                body: subscription.usuario.nome + ' a agenda do seu filho foi atualizada',
                icon: 'https://www.google.com.br/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
                })
          webpush.sendNotification(subscription.subscription,payload).catch(err=>console.error(err))
          console.log('enviado')
  
        })
    })
    res.redirect('/')
})

*/




app.use('/admin', admin)
app.use('/usuario', usuario)
//outros

const port = process.env.PORT ||8080
app.listen(port, () => console.log(`servidor rodando na porta: ${port}!`))
