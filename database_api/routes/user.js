const auth = require('../controllers/security/authorisation')
const router = require('express').Router()
const userCtrl = require('../controllers/user')

router.get('/challenges', auth, userCtrl.list)
router.get('/list', auth, userCtrl.list)
router.post('/list', auth, userCtrl.createList)

router.delete('/list/:list_id', auth, userCtrl.deleteList)
router.put('/list/:list_id', auth, userCtrl.editList)

module.exports = router