const express = require('express');
const router = express.Router();

const Poll = require('../models/poll.js');

router.get('/', (req, res) => {
    res.status(200).render('index', { title: 'Voting App' });
});

module.exports = router;