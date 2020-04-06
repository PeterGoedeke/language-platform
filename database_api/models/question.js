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
    // the weightings used to determine how frequently to ask a question
    l1Weight: Number,
    l2Weight: Number,
    // the number of times the question has been answered correctly in a row
    l1Streak: Number,
    l2Streak: Number,
    // the time which should pass before the question is asked again after being finished
    l1Downtime: Number,
    l2Downtime: Number,
    // the time at which the question was last finished
    l1LastFinish: Number,
    l2LastFinish: Number,
    // tally of the wrong answers since the last finish
    l1RecentWrongAnswers: Number,
    l2RecentWrongAnswers: Number
})

mongoose.model('Question', QuestionSchema)

module.exports = QuestionSchema