const auth = require('../controllers/security/authorisation')
const router = require('express').Router()
const userCtrl = require('../controllers/user')

router.get('/challenges', auth, userCtrl.list)
router.get('/list', auth, userCtrl.list)
router.post('/list', auth, userCtrl.createList)

router.post('/list/:_id', auth, userCtrl.createQuestion)
router.delete('/list/:_id', auth, userCtrl.deleteList)
router.put('/list/:_id', auth, userCtrl.editList)

router.post('/list/:_id/m', auth, userCtrl.createQuestions)
router.delete('/list/:_id/:_id', auth, userCtrl.deleteQuestion)
router.put('/list/:_id/:_id', auth, userCtrl.editQuestion)

module.exports = router