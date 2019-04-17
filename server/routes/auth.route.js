const express = require('express')
const app = express.Router()
const auth = require('../models/auth')
const user = require('../models/user')
const utils = require('../models/utils')

/**
 * Allow the user to register
 *      ---> `data` : { `login`, `password`, `passwordConfirmation`, `email`, `firstname`, `lastname`, `avatar` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isGuest }}
 *          ---> check if `login` && `password` && `email` && `firstname` && `lastname` && `avatar` exists and are well-formated {{ utils::checkParams }}
 *          ---> check if `login` isn't already used {{ user::checkLogin }}
 *          ---> check if `email` isn't already used {{ user::checkEmail }}
 *          ---> check if `password` === `passwordConfirmation` {{ user::matchPassword }}
 *          ---> generate random salt {{ utils::generateSalt }}
 *          ---> encrypt password {{ utils::encryptPassword }}
 *          ---> generate a valid key {{ utils::generateKey }}
 *          ---> add user to the database {{ auth::register }}
 *          ---> send a mail to validate account {{ utils::sendActivateAccountMail }}
 *          -----> error handling
 */
app.post('/register', isGuest, (req, res) => {
    utils.checkParams(req, res, [ 'login', 'password', 'passwordConfirmation', 'email', 'firstname', 'lastname', 'avatar' ])
        .then(user.checkLogin)
        .then(user.checkEmail)
        .then(user.matchPassword)
        .then(utils.generateSalt)
        .then(utils.encryptPassword)
        .then(utils.generateKey)
        .then(auth.register)
        .then(utils.sendActivateAccountMail)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to activate his account
 *      ---> `data` : { `tokenVerif` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isGuest }}
 *          ---> check if `tokenVerif` existe {{ utils::checkParams }}
 *          ---> check if `tokenVerif` isn't already used {{ user::checkTokenVerif }}
 *          ---> set `key` to 'null' {{ utils::resetKey }}
 *          ---> update user\'s `tokenLost` {{ user::updateTokenVerif }}
 *          -----> error handling
 */
app.post('/activate', isGuest, (req, res) => {
    utils.checkParams(req, res, [ 'tokenVerif' ])
        .then(user.checkTokenVerif)
        .then(utils.resetKey)
        .then(user.updateTokenVerif)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to retrieve his password
 *      ---> `data` : { `email` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isGuest }}
 *          ---> check if `email` exists and are well-formated {{ utils::checkParams }}
 *          ---> check if `email` isn't already used {{ user::getuserByEmail }}
 *          ---> generate a valid key {{ utils::generateKey }}
 *          ---> update tokenLost's user {{ user::updateTokenLost }}
 *          ---> send a mail to reset password {{ utils::sendForgotPassMail }}
 *          -----> error handling
 */
app.post('/forgot', isGuest, (req, res) => {
    utils.checkParams(req, res, [ 'email' ])
        .then(user.getUserByEmail)
        .then(utils.generateKey)
        .then(user.updateTokenLost)
        .then(utils.sendForgotPassMail)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to reset his password
 *      ---> `data` : { `tokenLost`, `password`, `passwordConfirmation` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isGuest }}
 *          ---> check if `tokenLost` && `password` && `passwordConfirmation`  existe {{ utils::checkParams }}
 *          ---> check if `tokenLost` isn't already used {{ user::checkTokenLost }}
 *          ---> check if `password` === `passwordConfirmation` {{ user::matchPassword }}
 *          ---> generate a new salt for encryption {{ utils::generateSalt }}
 *          ---> update user's `password` {{ user::updatePassword }}
 *          ---> update user's 'salt' {{ user::updateSalt }}
 *          ---> set `key` to 'null' {{ utils::resetKey }}
 *          ---> update user\'s `tokenLost` {{ user::updateTokenLost }}
 *          -----> error handling
 */
app.post('/reset', isGuest, (req, res) => {
    utils.checkParams(req, res, [ 'tokenLost', 'password', 'passwordConfirmation' ])
        .then(user.checkTokenLost)
        .then(user.matchPassword)
        .then(utils.generateSalt)
        .then(user.updatePassword)
        .then(user.updateSalt)
        .then(utils.resetKey)
        .then(user.updateTokenLost)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to logged in via basic form
 *      ---> `data` : { `login`, `password` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isGuest }}
 *          ---> check if `login` && `password` exists and are well-formated {{ utils::checkParams }}
 *          ---> check if `password` match an user {{ user::checkPassword }}
 *          ---> generate a valid key {{ utils::generateKey }}
 *          ---> add/update an `authenticatedToken` to the user {{ user::updateAuthenticatedToken }}
 *          ---> get user's language {{ user::getLang }}
 *          -----> error handling
 */
app.post('/login', isGuest, (req, res) => {
    utils.checkParams(req, res, [ 'login', 'password' ])
        .then(user.checkPassword)
        .then(utils.generateKey)
        .then(user.updateAuthenticatedToken)
        .then(user.getLang)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to logged in via basic form
 *      ---> `data` : { `authenticatedToken` }
 *          ---> check if `authenticatedToken` exists and are well-formated {{ utils::checkParams }}
 *          ---> check if `authenticatedToken` match an user {{ user::getUserByAuthToken }}
 *          -----> error handling
 */
app.post('/getLogin', (req, res) => {
    utils.checkParams(req, res, [ 'authenticatedToken' ])
        .then(user.getUserByAuthToken)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to logged in via 42
 *      ---> `data` : { `oauthCode` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isGuest }}
 *          ---> check if `oauthCode` existe {{ utils:checkParams }}
 *          ---> request to 42_api {{ auth::login42 }}
 *          ---> connect || register + connect {{ auth::login }} || {{ auth::register }}
 *          ---> generate a valid key {{ utils::generateKey }}
 *          ---> add/update an `authentificatedToken` to the user {{ user::updateAuthenticatedToken }}
 *          ---> get user's language {{ user::getLang }}
 *          ---> send a mail to validate account {{ utils::sendActivateAccountMail }}
 *          -----> error handling
 */
app.post('/42', isGuest, (req, res) => {
    utils.checkParams(req, res, [ 'oauthCode' ])
        .then(auth.login42)
        .then(auth.register)
        .then(utils.generateKey)
        .then(user.updateAuthenticatedToken)
        .then(user.getLang)
        .then(utils.sendActivateAccountMail)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
});

/**
 * Allow the user to logged in via github
 *      ---> `data` : { `oauthCode` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isGuest }}
 *          ---> check if `oauthCode` existe {{ utils:checkParams }}
 *          ---> request to github_api {{ auth::logingithub }}
 *          ---> connect || register + connect {{ auth::login }} || {{ auth::register }}
 *          ---> generate a valid key {{ utils::generateKey }}
 *          ---> add/update an `authentificatedToken` to the user {{ user::updateAuthenticatedToken }}
 *          ---> get user's language {{ user::getLang }}
 *          ---> send a mail to validate account {{ utils::sendActivateAccountMail }}
 *          -----> error handling
 */
app.post('/github', isGuest, (req, res) => {
    utils.checkParams(req, res, [ 'oauthCode' ])
        .then(auth.loginGitHub)
        .then(auth.register)
        .then(utils.generateKey)
        .then(user.updateAuthenticatedToken)
        .then(user.getLang)
        .then(utils.sendActivateAccountMail)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
});

module.exports = app;

/**
 * Check if `authenticatedToken` doesn't exist
 */
function isGuest(req, res, next) {
    if (req.body.authenticatedToken)
        res.status(403).send('You can\'t access this page')
    else next()
}