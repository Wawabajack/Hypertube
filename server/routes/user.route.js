const express = require('express')
const app = express.Router()
const user = require('../models/user')
const utils = require('../models/utils')
const multer  = require('multer')
const upload = multer({ dest: '../client/public/img/uploads/' })

/**
 * Allow the user to update his informations in his account
 *      ---> `data` : { `authenticatedToken`, `firstname` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `login` && `email` && `firstname` && `lastname` && `avatar` exists and are well-formated {{ utils::checkParams }}
 *          ---> update user's firstname {{ user::updateFirstname }}
 *          -----> error handling
 */
app.post('/updateFirstname', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'firstname' ])
        .then(user.updateFirstname)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to update his informations in his account
 *      ---> `data` : { `authenticatedToken`, `lastname` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `lastname` exists and are well-formated {{ utils::checkParams }}
 *          ---> update user's lastname {{ user::updateLastname }}
 *          -----> error handling
 */
app.post('/updateLastname', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'lastname' ])
        .then(user.updateLastname)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to update his informations in his account
 *      ---> `data` : { `authenticatedToken`, `email` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `email` exists and are well-formated {{ utils::checkParams }}
 *          ---> update user's email {{ user::updateEmail }}
 *          -----> error handling
 */
app.post('/updateEmail', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'email' ])
        .then(user.checkEmail)
        .then(user.updateEmail)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to update his informations in his account
 *      ---> `data` : { `authenticatedToken`, `avatar` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `avatar` exists and are well-formated {{ utils::checkParams }}
 *          ---> update user's avatar {{ user::updateAvatar }}
 *          -----> error handling
 */
app.post('/updateAvatar', upload.single('file'), (req, res) => {
    req.body.avatar = req.file
    utils.checkParams(req, res, [ 'avatar' ])
        .then(user.updateAvatar)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to update his informations in his account
 *      ---> `data` : { `authenticatedToken`, `password`, `passwordConfirmation` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `password` && `passwordConfirmation` exists and are well-formated {{ utils::checkParams }}
 *          ---> check if `password` && `passwordConfirmation` match {{ user::matchPassword }}
 *          ---> generate a new salt {{ user::generateSalt }}
 *          ---> update user's password {{ user::updatePassword }}
 *          -----> error handling
 */
app.post('/updatePassword', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'password', 'passwordConfirmation' ])
        .then(user.matchPassword)
        .then(utils.generateSalt)
        .then(user.updatePassword)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to update his language in navbar
 *      ---> `data` : { `authenticatedToken`, `login`, `lang` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `login` && `lang` exists and are well-formated {{ utils::checkParams }}
 *          ---> update user's language {{ user::updateLang }}
 *          -----> error handling
 */
app.post('/lang', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'lang' ])
        .then(user.updateLang)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Retrieve user's informations
 *      ---> `data` : { `authenticatedToken`, `user` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `user` exists and are well-formated {{ utils::checkParams }}
 *          ---> get user's informations {{ user::getInfos }}
 *          -----> error handling
 */
app.post('/visit', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'user' ])
        .then(user.getInfos)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Retrieve our own informations
 *      ---> `data` : { `authenticatedToken` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `user` exists and are well-formated {{ utils::checkParams }}
 *          ---> get user's informations {{ user::getMyInfos }}
 *          -----> error handling
 */
app.post('/me', isUser, (req, res) => {
    utils.checkParams(req, res, [])
        .then(user.getMyInfos)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Retrieve user's movies informations
 *      ---> `data` : { `authenticatedToken` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `user` exists and are well-formated {{ utils::checkParams }}
 *          ---> get user's movies informations {{ user::getMovies }}
 *          -----> error handling
 */
app.post('/movies', isUser, (req, res) => {
    utils.checkParams(req, res, [])
        .then(user.getMovies)
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