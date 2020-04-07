const mongoose = require('mongoose')
const User = mongoose.model('User')
const List = mongoose.model('List')
const validate = require('./validation')

function readUserAnd(f, fieldsDesired = '') {
    return async function(req, res) {
        try {
            const user = await User.findById(req.payload._id, fieldsDesired)
            if(!user) return res.status(400).json('Could not find a user with that id.')
            
            req.user = user
            f(req, res)
        }
        // User.findById will throw if the id provided is not a valid id. This should not happen because of the Joi validation
        catch (err) {
            return res.status(401).json('Invalid id.')
        }
    }
}
function readListAnd(f) {
    return readUserAnd((req, res) => {
        if(!validate.isId(req.params.list_id, res)) return

        try {
            req.list = req.user.lists.id(req.params.list_id)
            f(req, res)
        }
        catch (err) {
            return res.status(404).json(err)
        }
    }, 'lists')
}
function readQuestionAnd(f) {
    return readListAnd((req, res) => {
        if(!validate.isId(req.params.question_id, res)) return
        
        try {
            req.question = req.list.questions.find(question => question._id == req.params.question_id)
            f(req, res)
        }
        catch (err) {
            console.log(err)
            return res.status(404).json(err)
        }
    })
}

const getUserLists = readUserAnd((req, res) => {
    return res.status(200).json(req.user.lists)
}, 'lists')

const createListForUser = readUserAnd((req, res) => {
    if(!validate.isList(req, res)) return

    req.user.lists.push({
        language1: req.body.language1,
        language2: req.body.language2,
        name: req.body.name,
        public: req.body.public,
        official: req.payload.official,
    })
    try {
        req.user.save() // this may be a possible bug?
        const newList = req.user.lists.slice(-1).pop()
        return res.status(201).json(newList)
    }
    catch (err) {
        return res.status(400).json(err)
    }

}, 'lists')

const deleteListForUser = readListAnd((req, res) => {
    try {
        req.list.remove()
        req.user.save()
        return res.status(204).json(null)
    }
    catch (err) {
        return res.status(404).json(err)
    }
})

const editListForUser = readListAnd((req, res) => {
    if(!validate.isList(req, res)) return

    try {
        req.list.language1 = req.body.language1
        req.list.language2 = req.body.language2
        req.list.name = req.body.name
        req.list.public = req.body.public
    
        req.user.save()
        return res.status(204).json(null)
    }
    catch (err) {
        return res.status(404).json(err)
    }
})


function addQuestion(req, source) {
    if(!source) source = req.body
    req.list.questions.push({
        l1Values: source.l1Values,
        l2Values: source.l2Values,
    
        wordClass: source.wordClass,
    
        l1Weight: source.l1Weight,
        l2Weight: source.l2Weight,
    
        l1Streak: source.l1Streak,
        l2Streak: source.l2Streak,
    
        l1Downtime: source.l1Downtime,
        l2Downtime: source.l2Downtime,
    
        l1LastFinish: source.l1LastFinish,
        l2LastFinish: source.l2LastFinish,
    
        l1RecentWrongAnswers: source.l1RecentWrongAnswers,
        l2RecentWrongAnswers: source.l2RecentWrongAnswers
    })
}
const createQuestionForList = readListAnd((req, res) => {
    if(!validate.isQuestion(req, res)) return

    addQuestion(req)
    try {
        req.user.save() // this may be a possible bug?
        const newQuestion = req.list.questions.slice(-1).pop()
        return res.status(201).json(newQuestion)
    }
    catch (err) {
        return res.status(400).json(err)
    }
})
const createQuestionsForList = readListAnd((req, res) => {
    if(!validate.isQuestionList(req, res)) return

    try {
        req.body.questions.forEach(question => {
            addQuestion(req, question)
        })
        req.user.save()
        const newQuestions = req.list.questions.slice(Math.max(req.list.questions.length - req.body.questions.length), 0)
        return res.status(201).json(newQuestions)
    }
    catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
})

const deleteQuestionForList = readQuestionAnd((req, res) => {
    console.log('okay')
    try {
        req.question.remove()
        req.user.save()
        return res.status(204).json(null)
    }
    catch (err) {
        return res.status(404).json(err)
    }
})

const editQuestionForList = readQuestionAnd((req, res) => {
    if(!validate.isQuestion(req, res)) return

    try {
        req.question.l1Values = req.body.l1Values,
        req.question.l2Values = req.body.l2Values,
    
        req.question.wordClass = req.body.wordClass,
    
        req.question.l1Weight = req.body.l1Weight,
        req.question.l2Weight = req.body.l2Weight,
    
        req.question.l1Streak = req.body.l1Streak,
        req.question.l2Streak = req.body.l2Streak,
    
        req.question.l1Downtime = req.body.l1Downtime,
        req.question.l2Downtime = req.body.l2Downtime,
    
        req.question.l1LastFinish = req.body.l1LastFinish,
        req.question.l2LastFinish = req.body.l2LastFinish,
    
        req.question.l1RecentWrongAnswers = req.body.l1RecentWrongAnswers,
        req.question.l2RecentWrongAnswers = req.body.l2RecentWrongAnswers
    
        req.user.save()
        return res.status(204).json(null)
    }
    catch (err) {
        return res.status(404).json(err)
    }
})


const newChallengeForUser = readUserAnd(async (req, res) => {

})

const getUserHistoricalChallenges = readUserAnd((req, res) => {
    return res.status(200).json(req.user.weeklyChallenges)
}, 'weeklyChallenges')

module.exports = {
    list: getUserLists,
    createList: createListForUser,
    deleteList: deleteListForUser,
    editList: editListForUser,

    createQuestion: createQuestionForList,
    createQuestions: createQuestionsForList,
    deleteQuestion: deleteQuestionForList,
    editQuestion: editQuestionForList,

    challengesList: getUserHistoricalChallenges,
    newChallenge: newChallengeForUser
}