const mongoose = require('mongoose')

const ListSchema = require('./list')
const BlackListSchema = require('./blacklist')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        default: 'user'
    },
    // accountSettings,
    blacklists: [BlackListSchema],
    lists: [ListSchema],
    weeklyChallenges: [ListSchema],
    currentChallenge: ListSchema
})

mongoose.model('User', UserSchema)