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
    // accountType: {
    //     type: String,
    //     required: true
    // },

    weeklyChallenges: [ListSchema]
})

mongoose.model('User', UserSchema)