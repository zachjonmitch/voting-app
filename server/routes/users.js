const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user.js');

router.get('/login', (req, res) => {
    res.status(200).render('login');
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
    req.checkBody('password2', 'Passwords do not match').notEmpty();

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
        });

        req.flash('success_msg', 'You are registered');

        res.redirect('/users/login');
    }
});

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

router.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
    (req,res) => {
        res.redirect('/');
    });

module.exports = router;