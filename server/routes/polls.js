const express = require('express');
const router = express.Router();

const Poll = require('../models/poll.js');
const Vote = require('../models/votes.js');

let currentPoll = '';

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
    Poll.find().sort({likeCount: -1}).exec((err, polls) => {
        if(err) throw err;
        res.status(200).render('trending', {polls: polls});
    });
});

router.get('/recent', (req, res) => {
    Poll.find().sort({_id: -1}).exec((err, polls) => {
        if(err) throw err;
        res.status(200).render('recent', {polls: polls});
    });
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
            const user = req.user;
            user.polls.push(poll);
            user.save((error, user) => {
                if(error) {
                    console.log('ERROR')
                } else {
                    return res.redirect('/');
                }
            })
            
            console.log(poll);
        })
    }
});

router.get('/likes', (req, res) => {
    if(req.user) {
        const currentUser = req.user.userid;
        Poll.findOne({pollid: currentPoll}, (err, poll) => {
            if(err) throw err;
            
            const found = poll.likes.includes(currentUser);

            if(found) {
                res.send('Already liked poll')
            }
        })
    }
})

router.post('/likes', (req, res) => {
    if(req.user) {
        const currentUser = req.user.userid;
        Poll.findOne({pollid: currentPoll}, (err, poll) => {
            if(err) throw err;

            const found = poll.likes.includes(currentUser);
            
            if(!found) {
                poll.likeCount += 1

                poll.likes.push(currentUser)
                poll.save((error, poll) => {
                    if(error) {
                        console.log('ERROR')
                    }
                    console.log(poll)
                });
            }
            res.redirect('back');
        });
    } else {
        res.status(500).send("Login or register to like polls")
    }
});

router.get('/answers', (req,res) => {
    Vote.aggregate([
        { $match: { poll: currentPoll }},
        { $group: { _id: "$choice", total: { $sum: 1 }}}
    ], (err, result) => {
        if(err) throw err;
        res.send(result)
    })
})

router.get('/:pollid', (req, res) => {
    const poll = req.poll;
    currentPoll = poll.pollid;
    const pollAnswers = req.poll.pollAnswers.split(',')
    res.status(200).render('poll-details', {poll: poll, pollAnswers: pollAnswers});
    console.log(pollAnswers);
});

router.post('/:pollid', (req, res) => {    
    if(req.user) {
        const currentUser = req.user.userid

        Vote.findOne({$and: [{poll: currentPoll}, {user: currentUser}]}, (err, result) => {
            if (err) throw err;
            
            if(result) {
                res.send("You already voted");
            } else {
                const newVote = new Vote({
                    user: currentUser,
                    poll: req.poll.pollid,
                    choice: req.body.radioChoice
                });
                Vote.createVote(newVote, (err, poll) => {
                    if (err) throw err;
                    console.log(poll);
                    res.redirect('/polls/' + req.poll.pollid);
                });
            }
        })
    } else {
        res.send("Login or register to vote on polls");
    }
});

module.exports = router;