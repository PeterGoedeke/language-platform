const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    // the arrays of possible correct answers for both languages
    l1Values: {
        type: [String],
        required: true
    },
    l2Values: {
        type: [String],
        required: true
    },
    // the grammatical type of the words represented by the question
    wordClass: {
        type: String,
        required: true
    },
    // the weightings used to determine how frequently to ask a question
    l1Weight: {
        type: Number,
        default: 10
    },
    l2Weight: {
        type: Number,
        default: 10
    },
    // the number of times the question has been answered correctly in a row
    l1Streak: {
        type: Number,
        default: 0
    },
    l2Streak: {
        type: Number,
        default: 0
    },
    // the time which should pass before the question is asked again after being finished
    l1Downtime: {
        type: Number,
        default: 0
    },
    l2Downtime: {
        type: Number,
        default: 0
    },
    // the time at which the question was last finished
    l1LastFinish: {
        type: Number,
        default: 0
    },
    l2LastFinish: {
        type: Number,
        default: 0
    },
    // tally of the wrong answers since the last finish
    l1RecentWrongAnswers: {
        type: Number,
        default: 0
    },
    l2RecentWrongAnswers: {
        type: Number,
        default: 0
    }
})

mongoose.model('Question', QuestionSchema)

module.exports = QuestionSchema