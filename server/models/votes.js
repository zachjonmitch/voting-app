const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const VoteSchema = mongoose.Schema({
    user: {
        type: String
    },
    poll: {
        type: String
    },
    choice: {
        type: String
    }
});

const Vote = module.exports = mongoose.model('Vote', VoteSchema);

module.exports.createVote = (newVote, callback) => {
    newVote.save(callback);
}