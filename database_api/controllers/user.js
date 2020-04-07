const mongoose = require('mongoose')
const User = mongoose.model('User')
const List = mongoose.model('List')
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

const idSchema = Joi.object({
    _id: Joi.objectId()
})
const listSchema = Joi.object({
    language1: Joi.string().length(2).lowercase().alphanum(),
    language2: Joi.string().length(2).lowercase().alphanum(),
    name: Joi.string().pattern(/^[\w\-\s]+$/),
    public: Joi.boolean()
})

function isValid(schema, req, res) {
    const { error } = schema.validate(req.body)
    if(error) {
        res.status(400).json(error.details[0].message)
        return false
    }
    return true
}
function isValidId(_id, res) {
    const { error } = idSchema.validate({ _id })
    if(error) {
        res.status(400).json(error.details[0].message)
        return false
    }
    return true
}

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
        if(!isValidId(req.params.list_id, res)) return

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
        if(!isValidId(req.params.question_id, res)) return

        try {
            req.question = req.list.id(req.params.question_id)
            f(req, res)
        }
        catch (err) {
            return res.status(404).json(err)
        }
    })
}

const getUserLists = readUserAnd((req, res) => {
    return res.status(200).json(req.user.lists)
}, 'lists')
const getUserHistoricalChallenges = readUserAnd((req, res) => {
    return res.status(200).json(req.user.weeklyChallenges)
}, 'weeklyChallenges')

const createListForUser = readUserAnd((req, res) => {
    if(!isValid(listSchema, req, res)) return

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

const newChallengeForUser = readUserAnd(async (req, res) => {

})

module.exports = {
    list: getUserLists,
    createList: createListForUser,
    deleteList: deleteListForUser,
    editList: editListForUser,

    challengesList: getUserHistoricalChallenges,
    newChallenge: newChallengeForUser
}