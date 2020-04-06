const Joi = require('@hapi/joi')

function validateUser(data) {
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    })
    return schema.validate(data)
}

module.exports = validateUser