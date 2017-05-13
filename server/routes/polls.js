const express = require('express');
const router = express.Router();

const Poll = require('../models/poll.js');

router.param('pollid', (req, res, next, pollid) => {
    Poll.findOne({pollid: pollid}, (err, poll) => {
        if (err) {
            res.status(200).render('error');
        } else if (poll) {
            req.poll = poll;
            next();
        } else {
            res.status(200).render('error');
        }
    });
});

router.get('/trending', (req, res) => {
    res.status(200).render('trending');
});

router.get('/recent', (req, res) => {
    res.status(200).render('recent');
});

router.get('/new-poll', (req, res) => {
    res.status(200).render('new-poll');
});

router.post('/new-poll', (req, res) => {
    const pollTitle = req.body.pollTitle;
    const pollAnswers = req.body.pollAnswers;

    req.checkBody('pollTitle', 'Poll title is required').notEmpty();
    req.checkBody('pollAnswers', 'Poll answers are required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.render('new-poll', {
            errors:errors
        });
        console.log(errors);
    } else {
        const newPoll = new Poll({
            pollTitle: pollTitle,
            pollAnswers: pollAnswers
        });

        Poll.createPoll(newPoll, (err, poll) => {
            if(err) throw err;
            console.log(poll);
        })
    }
});

router.get('/:pollid', (req, res) => {
    res.status(200).render('poll-details');
    console.log(req.poll);
});

module.exports = router;