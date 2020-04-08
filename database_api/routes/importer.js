const auth = require('../controllers/security/authorisation')
const router = require('express').Router()
const importCtrl = require('../controllers/importer')

router.route('/')
    .get(auth, importCtrl.getBlacklists)
    .post(auth, importCtrl.createBlacklist)
router.route('/:blacklist_id')
    .delete(auth, importCtrl.deleteBlacklist)
    .put(auth, importCtrl.editBlacklist)

module.exports = router