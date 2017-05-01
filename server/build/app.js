'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.status(200).render('index', { title: 'Voting App' });
});

router.get('/login', function (req, res) {
    res.status(200).render('login');
});

router.get('/trending', function (req, res) {
    res.status(200).render('trending');
});

router.get('/recent', function (req, res) {
    res.status(200).render('recent');
});

router.get('/register', function (req, res) {
    res.status(200).render('register');
});

module.exports = router;