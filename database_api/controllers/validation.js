const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)
const isValid = require('./isValid')
const isValidList = require('./isValidList')

const idSchema = Joi.object({
    _id: Joi.objectId()
})
const translationQuerySchema = Joi.object({
    l1: Joi.string().length(2).alphanum(),
    l2: Joi.string().length(2).alphanum(),
})
const listSchema = Joi.object({
    language1: Joi.string().length(2).lowercase().alphanum(),
    language2: Joi.string().length(2).lowercase().alphanum(),
    name: Joi.string().pattern(/^[\w\-\s]+$/),
    public: Joi.boolean()
})
const questionSchema = Joi.object({
    l1Values: Joi.array().items(Joi.string()),
    l2Values: Joi.array().items(Joi.string()),

    wordClass: Joi.string().alphanum(),

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
    name: Joi.string(),
    language: Joi.string().length(2).lowercase().alphanum(),
    words: Joi.array().items(Joi.string())
})

module.exports = {
    isList: isValid(listSchema),
    isQuestion: isValid(questionSchema),
    isBlacklist: isValid(blacklistSchema),
    isQuestionList: isValidList(questionSchema),
    isId: isValid(idSchema),
    isTranslationQuery: isValid(translationQuerySchema)
}