const auth = require('../controllers/security/authorisation')
const router = require('express').Router()
const blacklistCtrl = require('../controllers/blacklist')
const importerCtrl = require('../controllers/importer')

router.route('/')
    .get(auth, blacklistCtrl.getBlacklists)
    .post(auth, blacklistCtrl.createBlacklist)

router.route('/:_id')
    .delete(auth, blacklistCtrl.deleteBlacklist)
    .put(auth, blacklistCtrl.editBlacklist)

router.post('/translate/:l1-:l2', auth, importerCtrl.translateText)

module.exports = router