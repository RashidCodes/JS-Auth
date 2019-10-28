const router = require('express').Router()
const User = require('../model/user')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// validation
router.post('/register', async (req, res) =>{
    // validation
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // check if the user is already in the database
    const emailExists = await User.findOne({ email: req.body.email })
    if(emailExists) return res.status(400).send('Email already exists')

    // Hash passwords
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const user = new User({
        name: req.body.name, 
        email: req.body.email,
        password: hashedPassword
    })

    try {
        await user.save().then(user => res.send(user._id))
    } catch (err){
        res.status(400).send(err)
    }

})


// login
router.post('/login', async (req, res) => {
    // validation
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Check if email exists
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email does not exist')

    // check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid Password')


    // create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.token_secret)
    // add it to the header
    res.header('auth-token', token).send(token)

    res.send('Logged In!')
})


module.exports = router;