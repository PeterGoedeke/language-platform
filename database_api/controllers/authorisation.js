const jwt = require('jsonwebtoken')

/**
 * Middleware which rejects a request if there is no jwt attached or if the attached jwt is not valid.
 * Adds the payload of the jwt to the req.user property if the jwt is valid.
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next Next
 */
function authorise(req, res, next) {
    const token = req.header('auth-token')

    if(!token) return res.status(401).send('Access denied.')

    try {
        const authorised = jwt.verify(token, process.env.TOKEN_SECRET)

        req.user = authorised
        next()
    }
    catch(err) {
        return res.status(400).send('Invalid token.')
    }
}

module.exports = authorise