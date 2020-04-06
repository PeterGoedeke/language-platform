const Joi = require('@hapi/joi')

/**
 * Validates the properties of the object given, ensuring that it matches the specifications laid out for the
 * user schema.
 * @param {Object} data The user object to validate
 */
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