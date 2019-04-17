const express = require('express')
const app = express.Router()
const utils = require('../models/utils')
const msg = require('../models/message')
const user = require('../models/user')

/**
 * Allow the user to send a message
 *      ---> `data` : { `authenticatedToken`, `message` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `message` exists and are well-formated {{ utils::checkParams }}
 *          ---> insert `message` into msg collection {{ msg::send }}
 *          -----> error handling
 */
app.post('/send', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'message', 'movieId' ])
        .then(msg.send)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Retrieve all the movie's messages
 *      ---> `data` : { `authenticatedToken`, `movieId` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `movieId` exists and are well-formated {{ utils::checkParams }}
 *          ---> get all message thanks to `movieId` {{ msg::get }}
 *          -----> error handling
 */
app.post('/get', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'movieId' ])
        .then(msg.get)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

module.exports = app;

/**
 * Check if `authenticatedToken` exists and match to an user
 */
function isUser(req, res, next) {
    if (req.body.authenticatedToken) {
        var data = { res: res, params: req.body }
        user.getUserByAuthToken(data)
            .then(data => { next() })
            .catch(data => { res.status(403).send('You can\'t access this page') })
    } else res.status(403).send('You can\'t access this page')
}