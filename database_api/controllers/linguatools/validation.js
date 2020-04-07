const Joi = require('@hapi/joi')

const linguatoolsQuerySchema = Joi.object({
    l1: Joi.string().length(2).lowercase().alphanum(),
    l2: Joi.string().length(2).lowercase().alphanum(),
    query: Joi.string(),
    wordClass: Joi.string().alphanum().uppercase()

})

function isInvalidQuery(qObj) {
    const { error } = linguatoolsQuerySchema.validate(qObj)
    if(error) {
        return error
    }
    return false
}

module.exports = isInvalidQuery