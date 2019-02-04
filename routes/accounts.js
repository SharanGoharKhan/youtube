const express = require('express')
const router = express.Router()

//api reponse model 
const ApiResponse = require('../utilities/ApiResponse')
//models
const User = require('../models/users')

router.get('/', (req, res) => {
    let response = new ApiResponse()
    res.json(response.success())
})

router.post('/', (req, res) => {
    let response = new ApiResponse()
    const user = new User({
        userid: req.body.userid,
        email: req.body.email,
        name: req.body.name,
        imageUrl: req.body.imageUrl
    })
    User.countDocuments({ email: req.body.email }, (err, count) => {
        if (count > 0) {
            res.json(response.failure(count, 'email already exists'))
            return
        }
        user.save((err, newUser) => {
            if (err) {
                res.json(response.failure(err, 'an error occured while saving user'))
                return
            }
            res.json(response.success(newUser, 'user saved'))
        })
    })


})

module.exports = router

