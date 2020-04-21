var express = require('express');
var session = require('cookie-session'); // charge le middleware de sessions
var bodyParser = require('body-parser'); // charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false});

var app = express();

app.use(session({secret: 'todotopsecret'}))

/* s'il n'y a pas de todolist dans la sessions, on en crée une vide sous forme d'array avant la suite */

.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }

    next();
})

/* on affiche la todolist et le formulaire */

.get('/todo', function(req, res) {
    res.render('todo.ejs', {todolist: req.session.todolist});
})

/* ajout d'un élément à la todolist */

.post('/todo/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }

    res.redirect('/todo');
})

/* supprimer un élément de la todolist */

.get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

/* on redirige vers la todolist si la page demandée n'est pas trouvée */

.use(function(req, res, next) {
    res.redirect('/todo');
})

.listen(8080);