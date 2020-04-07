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
    isId: isValidId
}