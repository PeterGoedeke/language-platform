const router = require('express').Router()

const auth = require('../controllers/authorisation')
const listActions = require('../controllers/list')

router.post('/', auth, listActions.add)

module.exports = router