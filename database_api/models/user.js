const mongoose = require('mongoose')

const ListSchema = require('./list')

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
    // importerBlacklists,
    lists: [ListSchema],
    weeklyChallenges: [ListSchema],
    currentChallenge: ListSchema
})

mongoose.model('User', UserSchema)