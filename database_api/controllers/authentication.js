const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validate = require('./validation')

async function login(req, res) {
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email not found.')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid password.')

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).send(token)
}

async function register(req, res) {
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const emailInUse = await User.findOne( { email: req.body.email })
    if(emailInUse) return res.status(400).send('Email already exists.')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        email: req.body.email,
        password: hashedPassword
    })

    try {
        await user.save()

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        res.header('auth-token', token).send()
    }
    catch (err) {
        res.status(400).send(err)
    }
}

module.exports = {
    login,
    register
}