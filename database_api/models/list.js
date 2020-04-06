const mongoose = require('mongoose')
const QuestionSchema = require('./question')

const ListSchema = new mongoose.Schema({
    language1: {
        type: String,
        required: true
    },
    language2: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        default: false
    },
    official: {
        type: Boolean,
        default: false
    },
    questions: [QuestionSchema]
})

mongoose.model('List', ListSchema)

module.exports = ListSchema