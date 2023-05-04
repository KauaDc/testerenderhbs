'use strict';

var express = require('express')
const exphbs  = require('express-handlebars'); // "express-handlebars"

var app = express();

app.engine('.handlebarsapp.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main"}));
', exphbs.engine({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(3000, function () {
    console.log('express-handlebars example server listening on: 3000');
});
