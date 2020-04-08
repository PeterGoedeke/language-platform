const User = require('mongoose').model('User')
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
            console.log(err)
            return res.status(401).json('Invalid id.')
        }
    }
}

function readListAnd(f) {
    return readUserAnd((req, res) => {
        if(!validate.isId(req.params, res)) return

        try {
            req.list = req.user.lists.id(req.params._id)
            f(req, res)
        }
        catch (err) {
            return res.status(404).json(err)
        }
    }, 'lists')
}
function readQuestionAnd(f) {
    return readListAnd((req, res) => {
        if(!validate.isId(req.params, res)) return
        
        try {
            req.question = req.list.questions.find(question => question._id == req.params._id)
            f(req, res)
        }
        catch (err) {
            return res.status(404).json(err)
        }
    })
}
function readBlacklistAnd(f) {
    return readUserAnd((req, res) => {
        if(!validate.isId(req.params, res)) return

        try {
            req.blacklist = req.user.blacklists.id(req.params._id)
            f(req, res)
        }
        catch (err) {
            return res.status(404).json(err)
        }
    }, 'blacklists')
}

module.exports = {
    user: readUserAnd,
    list: readListAnd,
    question: readQuestionAnd,
    blacklist: readBlacklistAnd
}