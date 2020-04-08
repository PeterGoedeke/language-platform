const Joi = require('@hapi/joi')
const isValid = require('../isValid')

const linguatoolsQuerySchema = Joi.object({
    l1: Joi.string().length(2).lowercase().alphanum().required(),
    l2: Joi.string().length(2).lowercase().alphanum().required(),
    query: Joi.string().required(),
    wordClass: Joi.string().alphanum().uppercase()

})

const translationSchema = Joi.object({
    id: Joi.number().min(0).required(),
    l1_text: Joi.string().required(),
    l2_text: Joi.string().required(),
    wortart: Joi.string().uppercase().required(),
    synonyme1: Joi.array().items(Joi.string()).required(),
    synonyme2: Joi.array().items(Joi.string()).required(),
    freq: Joi.number().min(0).required(),
    language1: Joi.string().length(2).required(),
    language2: Joi.string().length(2).required()
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