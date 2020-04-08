function isValid(schema) {
    return function(source, res) {
        const { error } = schema.validate(source)
        if(error) {
            if(res) res.status(400).json(error.details[0].message)
            return false
        }
        return true
    }
}

module.exports = isValid