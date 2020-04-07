const Joi = require('@hapi/joi')

const linguatoolsQuerySchema = Joi.object({
    l1: Joi.string().length(2).lowercase().alphanum(),
    l2: Joi.string().length(2).lowercase().alphanum(),
    query: Joi.string(),
    wordClass: Joi.string().alphanum().uppercase()

})

const translationSchema = Joi.object({
    id: Joi.number().min(0),
    l1_text: Joi.string(),
    l2_text: Joi.string(),
    wortart: Joi.string().uppercase(),
    synonyme1: Joi.array().items(Joi.string()),
    synonyme2: Joi.array().items(Joi.string()),
    freq: Joi.number().min(0),
    language1: Joi.string().length(2),
    language2: Joi.string().length(2),
})

function isInvalidQuery(qObj) {
    const { error } = linguatoolsQuerySchema.validate(qObj)
    if(error) {
        return error
    }
    return false
}
function isTranslation(translation) {
    const { error } = translationSchema.validate(translation)
    if(error) {
        console.log(error.details[0].message)
        return false
    }
    return true
}

module.exports = {
    isInvalidQuery,
    isTranslation
}