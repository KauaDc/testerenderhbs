const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

require("../models/Usuario")
const Usuario = mongoose.model("Usuarios")

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email' , passwordField: 'senha'},(email,senha,done)=>{
        Usuario.findOne({email:email}).lean().then((Usuario)=>{
            if(!Usuario){
                return done(null, false,{message: "Esta conta não existe"})
            }
            bcrypt.compare(senha,Usuario.senha, (erro,batem)=>{
                if(batem){
                    return done(null, Usuario)
                }else{
                    return done(null,false,{message: "Senha incorreta"})
                }
            })
        })
    }))

   passport.serializeUser((usuario,done)=>{
        done(null, usuario)
    })

    passport.deserializeUser(async (id, done) => {
        try {
          const usuario = await Usuario.findById(id);
          done(null, usuario);
        } catch (err) {
          done(err);
        }
      });

}