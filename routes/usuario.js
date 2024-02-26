const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require("passport")
const webpush = require('web-push')
require("../models/Agendas")
const Agenda = mongoose.model("Agendas")
require("../models/Aluno")
const Aluno = mongoose.model("Alunos")
require("../models/Turmas")
const Turma = mongoose.model("Turmas")
require("../models/Usuario")
const Usuario = mongoose.model("Usuarios")
require("../models/Atividades")
const Atividade = mongoose.model("Atividades")
require('../models/Subs')
const Sub = mongoose.model('Sub')


const {eAdmin} = require("../helpers/eadmin")
const eadmin = require('../helpers/eadmin')

router.get("/usuarios/novo",eAdmin, (req,res)=>{
    res.render("admin/usuarioadd")
})

router.post("/usuarioadd",eAdmin, (req,res)=>{
    var erros = []
    if(!req.body.nome||typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    
    if(!req.body.email||typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }

    if(erros.length>0){
        req.flash("error_msg","houve um erro ao adicionar o usuario",{erros:erros})
        res.redirect("/admin/usuarios")
    }else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario)=>{
            if(usuario){
                req.flash("error_msg", "Email já cadastrado")
                res.redirect("/admin/usuarios")
            }else{
            const novoUsuario = new Usuario({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha
            })

            bcrypt.genSalt(10,(error, salt)=>{
                bcrypt.hash(novoUsuario.senha,salt,(error,hash)=>{
                    if(error){
                        req.flash("error_msg","houve um erro ao salvar o usuario")
                        res.redirect("/admin/usuarios")
                    }
                    novoUsuario.senha=hash

                   new Usuario(novoUsuario).save().then(()=>{
                        req.flash("sucess_msg", "Usuario criado com sucesso")
                        res.redirect("/admin/usuarios")
                    }).catch((err)=>{
                        req.flash("error_msg","houve um erro ao criar o usuario,tente novamente")
                        res.redirect("/admin/usuarios")
                    })
                })
            })

            }
        }).catch((err)=>{
            console.log(err)
            req.flash("error_msg","Houve um erro interno")
            res.redirect("/")
            next(err)

        })
    }
})

router.post("/usuariodeletar",eAdmin,(req,res)=>{
Usuario.findOne({eadmin: req.body.eadmin}).lean().then((eadmin)=>{

    Usuario.deleteOne({_id: req.body.id}).then(()=>{
        res.redirect("/admin/usuarios")
    })
})
})
    


router.get("/login",(req,res)=>{
    res.render("usuario/login")
})

router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true        
    })
    (req,res,next)
     //pegar o objeto de inscrição

})

router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        req.flash("success_msg","Deslogado com sucesso")
        res.redirect("/")
    })
})



module.exports = router