const read = require('./retrieval_helpers')
const validate = require('./validation')

const getBlacklists = read.user((req, res) => {
    return res.status(200).json(req.user.blacklists)
}, 'blacklists')

const createBlacklist = read.user((req, res) => {
    if(!validate.isBlacklist(req, res)) return

    req.user.blacklists.push({
        name: req.body.name,
        language: req.body.language,
        words: req.body.words
    })
    try {
        req.user.save() // this may be a possible bug?
        const newBlacklist = req.user.blacklists.slice(-1).pop()
        return res.status(201).json(newBlacklist)
    }
    catch (err) {
        return res.status(400).json(err)
    }
}, 'blacklists')

const deleteBlacklist = read.blacklist((req, res) => {
    try {
        req.blacklist.remove()
        req.user.save()
        return res.status(204).json(null)
    }
    catch (err) {
        return res.status(404).json(err)
    }
})

const editBlacklist = read.blacklist((req, res) => {
    if(!validate.isBlacklist(req, res)) return
    
    try {
        req.blacklist.name = req.body.name
        req.blacklist.language = req.body.language
        req.blacklist.words = req.body.words
        
        req.user.save()
        return res.status(204).json(null)
    }
    catch (err) {
        return res.status(404).json(err)
    }
})

module.exports = {
    getBlacklists,
    createBlacklist,
    deleteBlacklist,
    editBlacklist
}