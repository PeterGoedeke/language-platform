const router = require('express').Router()

const authentication = require('../controllers/security/authentication')

router.post('/login', authentication.login)
router.post('/register', authentication.register)

module.exports = router