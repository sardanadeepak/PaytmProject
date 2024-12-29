const express = require('express')
const router = express.Router()
const zod = require('zod')
const jwt = require('jsonwebtoken')

const dotenv = require('dotenv')
const { User } = require('../db')
dotenv.config()

const signUpBody = zod.object({
    firstName: zod.string().max(50),
    lastName: zod.string().max(50),
    password: zod.string().min(6),
    email: zod.string().email()
})

const signInBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
})

router.post('/signup', async (req, res) => {

    const { success } = signUpBody.safeParse(req.body)

    if (!success) {
        res.send(411).json({
            message: 'Invalid inputs'
        })
    }

    const existingUser = await User.findOne({
        email: req.body.email
    })

    if (existingUser) {
        res.send(411).json({
            message: 'User email already exist'
        })
    }

    const user = await User.create({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })

    const userId = user._id

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })

})

router.post('/signin', async (req, res) => {
    const { success } = signInBody.safeParse(req.body)

    if (!success) {
        res.send(411).json({
            message: 'Invalid inputs'
        })
    }

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.json({
            token: token
        })
        return
    }

    res.status(411).json({
        message: 'Error while logging in'
    })
})
module.exports = router