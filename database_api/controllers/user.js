const mongoose = require('mongoose')
const User = mongoose.model('User')
const List = mongoose.model('List')
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

const idSchema = Joi.object({
    id: Joi.objectId()
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

function readUserAnd(f, fieldsDesired = '') {
    return async function(req, res) {
        // user joi to check whether the provided id is valid
        const { error } = idSchema.validate(req.params)
        if(error) return res.status(400).json(error.details[0].message)

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

const getUserLists = readUserAnd((req, res) => {
    return res.status(200).json(req.user.lists)
}, 'lists')
const getUserHistoricalChallenges = readUserAnd((req, res) => {
    return res.status(200).json(req.user.weeklyChallenges)
}, 'weeklyChallenges')

const createListForUser = readUserAnd(async (req, res) => {
    if(!isValid(listSchema, req, res)) return

    req.user.lists.push({
        language1: req.body.language1,
        language2: req.body.language2,
        name: req.body.name,
        public: req.body.public,
        official: req.payload.official,
    })
    try {
        req.user.save()
        const newList = req.user.lists.slice(-1).pop()
        return res.status(201).json(newList)
    }
    catch (err) {
        return res.status(400).json(err)
    }

}, 'lists')

const newChallengeForUser = readUserAnd(async (req, res) => {

})

module.exports = {
    list: getUserLists,
    createList: createListForUser,

    challengesList: getUserHistoricalChallenges,
    newChallenge: newChallengeForUser
}