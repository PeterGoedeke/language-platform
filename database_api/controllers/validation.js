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

/**
 * Higher order function which produces a validation function which validates the request body against the provided schema.
 * Returned function uses the response object to reject the request if it is not valid
 * @param {Object} schema The schema to be used for validation
 */
function isValid(schema) {
    return function(req, res) {
        const { error } = schema.validate(req.body)
        if(error) {
            res.status(400).json(error.details[0].message)
            return false
        }
        return true
    }
}
/**
 * Validates the _id to make sure that it is a valid mongoose _id. Uses the response object to reject the request if it is not valid
 * @param {String} _id The string to be validated
 * @param {Object} res The response object
 */
function isValidId(_id, res) {
    const { error } = idSchema.validate({ _id })
    if(error) {
        res.status(400).json(error.details[0].message)
        return false
    }
    return true
}

module.exports = {
    /**
     * Validate that the contents of req.body are a question list. Uses the response object to reject the request if it is not valid.
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    isList: isValid(listSchema),
    /**
     * Validate that the contents of req.body is a question. Uses the response object to reject the request if it is not valid.
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    isQuestion: isValid(questionSchema),
    isBlacklist: isValid(blacklistSchema),
    isQuestionList: function(req, res) {
        if(!req.body.questions || !Array.isArray(req.body.questions)) {
            res.status(400).json('Invalid request.')
            return false
        }
        for(const question of req.body.questions) {
            const { error } = questionSchema.validate(question)
            if(error) {
                res.status(400).json(error.details[0].message)
                return false
            }
        }
        return true
    },
    isId: isValidId
}