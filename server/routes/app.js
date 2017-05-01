const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).render('index', { title: 'Voting App' });
});

router.get('/login', (req, res) => {
    res.status(200).render('login');
});

router.get('/trending', (req, res) => {
    res.status(200).render('trending');
});

router.get('/recent', (req, res) => {
    res.status(200).render('recent');
});

router.get('/register', (req, res) => {
    res.status(200).render('register');
});

module.exports = router;