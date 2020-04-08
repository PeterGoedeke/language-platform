const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)
const isValid = require('./isValid')
const isValidList = require('./isValidList')

const idSchema = Joi.object({
    _id: Joi.objectId().required()
})
const translationQuerySchema = Joi.object({
    l1: Joi.string().length(2).alphanum().required(),
    l2: Joi.string().length(2).alphanum().required(),
})
const listSchema = Joi.object({
    language1: Joi.string().length(2).lowercase().alphanum().required(),
    language2: Joi.string().length(2).lowercase().alphanum().required(),
    name: Joi.string().pattern(/^[\w\-\s]+$/).required(),
    public: Joi.boolean()
})
const questionSchema = Joi.object({
    l1Values: Joi.array().items(Joi.string()).required(),
    l2Values: Joi.array().items(Joi.string()).required(),

    wordClass: Joi.string().alphanum().required(),

    l1Weight: Joi.number().min(0),
    l2Weight: Joi.number().min(0),

    l1Streak: Joi.number().min(0),
    l2Streak: Joi.number().min(0),

    l1Downtime: Joi.number().min(0),
    l2Downtime: Joi.number().min(0),

    l1LastFinish: Joi.number().min(0),
    l2LastFinish: Joi.number().min(0),

    l1RecentWrongAnswers: Joi.number().min(0),
    l2RecentWrongAnswers: Joi.number().min(0)
})
const blacklistSchema = Joi.object({
    name: Joi.string().required(),
    language: Joi.string().length(2).lowercase().alphanum().required(),
    words: Joi.array().items(Joi.string()).required()
})

const stringSchema = Joi.object({
    str: Joi.string().required()
})
const stringArrSchema = Joi.object({
    arr: Joi.array().items(Joi.string()).required()
})

module.exports = {
    isList: isValid(listSchema),
    isQuestion: isValid(questionSchema),
    isBlacklist: isValid(blacklistSchema),
    isBlacklistList: isValidList(blacklistSchema),
    isQuestionList: isValidList(questionSchema),
    isId: isValid(idSchema),
    isTranslationQuery: isValid(translationQuerySchema),
    isString: isValid(stringSchema),
    isStringArr: isValid(stringArrSchema),
    
    isImporterRequest: function(req, res) {
        if(!this.isString({ str: req.body.text }, res)) return
        if(!this.isStringArr({ arr: req.body.words }, res)) return
        if(!this.isTranslationQuery(req.params, res)) return
        if(!this.isBlacklistList(req.body.blacklists, res)) return

        return true
    }
}