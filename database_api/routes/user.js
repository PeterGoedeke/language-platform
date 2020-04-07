const auth = require('../controllers/authorisation')
const router = require('express').Router()
const userCtrl = require('../controllers/user')

router.get('/list', auth, userCtrl.list)
router.get('/challenges', auth, userCtrl.list)
router.post('/createlist', auth, userCtrl.createList)


module.exports = router