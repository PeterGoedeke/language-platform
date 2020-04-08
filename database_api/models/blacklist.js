const mongoose = require('mongoose')

const BlacklistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    words: {
        type: [String],
        required: true
    }
})

mongoose.model('ImporterBlacklist', BlacklistSchema)

module.exports = BlacklistSchema