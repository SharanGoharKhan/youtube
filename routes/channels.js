const express = require('express')
const router = express.Router()


//api response model
const ApiResponse = require('../utilities/ApiResponse')

//models
const User = require('../models/users')

router.get('/', (req, res) => {
    res.render('youtube')
})

router.get('/:id', (req, res) => {
    "use strict"
    let response = new ApiResponse()
    let userid = req.params.id
    User.findOne({ userid }, (err, user) => {
        if (err) {
            res.json(response.failure(err, 'an error occured while looking for userid'))
            return
        }
        if (!user) {
            res.json(response.failure(userid, 'no user found against this userid'))
            return
        }
        console.log(user.name)
        console.log(user.channels)
        res.render('channels', { name: user.name, channels: user.channels })
    })
})

router.post('/', (req, res) => {
    "use strict"
    let response = new ApiResponse()
    User.findOne({ userid: req.body.userid }, (err, user) => {
        if (err) {
            res.json(response.failure(err, 'an error occured while looking for user'))
            return
        }
        if (!user) {
            res.json(response.failure(null, 'no user found against this userid'))
            return
        }
        user.channels = req.body.channelsList
        user.save((err, updatedUser) => {
            if (err) {
                res.json(response.failure(err, 'an error occured while updating user'))
                return
            }
            res.json(response.success(updatedUser, 'channels saved'))
        })
    })
})

module.exports = router

