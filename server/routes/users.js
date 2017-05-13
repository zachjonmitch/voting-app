const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user.js');

passport.use(new LocalStrategy((username, password, done) => {
      User.getUserByUsername(username, (err, user) => {
          if(err) throw err;
          if(!user) {
              return done(null, false, {message: 'Unknown User'});
          }
          User.comparePassword(password, user.password, (err, isMatch) => {
              if(err) throw err;
              if(isMatch) {
                  return done(null, user);
              } else {
                  return done(null, false, {message: 'Invalid password'})
              }
          });
      });
  }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

router.param('userid', (req, res, next, userid) => {
    User.findOne({userid: userid}, (err, user) => {
        if (err) {
            res.status(200).render('error');
        } else if (user) {
            req.user = user;
            next();
        } else {
            res.status(200).render('error');
        }
    });
});

router.get('/login', (req, res) => {
    res.status(200).render('login');
});

router.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
    (req,res,err) => {
        if(err) {
            req.flash('error_msg', 'Incorrect username or password');
            console.log(error_msg);
        } else {
            res.redirect('/');
        }
});

router.get('/logout', function(req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');
    
    res.redirect('/users/login');
});

router.get('/register', (req, res) => {
    res.status(200).render('register');
});

router.post('/register', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password;
    
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors:errors
        });
    } else {
        const newUser = new User({
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser, (err, user) => {
            if(err) throw err;
            console.log(user);
            passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            });
        });
    }       
});

router.get('/:userid', function(req, res) {
    res.status(200).render('profile');
});

module.exports = router;