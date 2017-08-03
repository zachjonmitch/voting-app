const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.set('port', (process.env.PORT || 4000));

const mongodb = require('mongodb');
const mongoose = require('mongoose');
const db = 'mongodb://user:user12345@ds141078.mlab.com:41078/customvotes';
mongoose.connect(db);

const PORT = process.env.PORT || 8080;

const routes = require('./server/routes/app.js');
const polls = require('./server/routes/polls.js');
const users = require('./server/routes/users.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('client'));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/polls', polls);

//Error page if not found
app.use((req, res) => {
      res.status(400).status(500).render('error');
});

//Start Server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
