const mongoose = require('mongoose');
const shortid = require('shortid');

const PollSchema = mongoose.Schema({
    pollTitle: {
        type: String,
        index: true
    },
    pollAnswers: {
        type: String
    },
    pollid: {
        type: String,
        unique: true,
        default: shortid.generate
    }
});

const Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = (newPoll, callback) => {
    newPoll.save(callback);
}