const jwt = require('jsonwebtoken')

function authorise(req, res, next) {
    const token = req.header('auth-token')

    if(!token) return res.status(401).send('Access denied.')

    try {
        console.log(token)
        const authorised = jwt.verify(token, process.env.TOKEN_SECRET)

        req.user = authorised
        next()
    }
    catch(err) {
        return res.status(400).send('Invalid token.')
    }
}

module.exports = authorise