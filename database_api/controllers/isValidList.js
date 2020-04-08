function isValidList(schema) {
    return function(source, res) {
        if(!source || !Array.isArray(source)) {
            res.status(400).json('Invalid request.')
            return false
        }
        for(const s of source) {
            const { error } = schema.validate(s)
            if(error) {
                if(res) res.status(400).json(error.details[0].message)
                return (res ? false : error)
            }
        }
        return true
    }
}

module.exports = isValidList