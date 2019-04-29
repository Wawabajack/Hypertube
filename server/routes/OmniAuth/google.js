const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const passport = require('passport')

const cors = require('cors')
router.use(cors())

const utils = require('../../models/utils')

const GOOGLE_APP_ID = '63971582197-jljq44mimmtrpd6t6rat6gcbf6qe4qi8.apps.googleusercontent.com'
const GOOGLE_APP_SECRET = 'gGE-ScIgjS9oVXMibldhsNnx'

passport.serializeUser((user, done) => { done(null, user) })

passport.deserializeUser((id, done) => { User.findById(id).then((user) => { done(null, user) }) })

passport.use(new GoogleStrategy({
        clientID: GOOGLE_APP_ID,
        clientSecret: GOOGLE_APP_SECRET,
        callbackURL: "http://localhost:4000/auth/google/redirect",
    }, (accessToken, refreshToken, profile, done) => {
        mongodb.collection('user').findOne({ $or: [{ login: profile._json.name }, { email: profile._json.email }, { authgoogleId: profile._json.sub }] })
            .then(user => {
                if (user) {
                    if (user.authgoogleId == profile.id) return done(null, user)
                    else return done(null, null)
                } else {
                    mongodb.collection('user').insertOne({ login: 'google_' + profile._json.name, email: profile._json.email, password: '', salt: '', lastname: profile._json.family_name, firstname: profile._json.given_name, lang: profile._json.locale, tokenVerif: '', authgoogleId: profile.id, avatar: profile._json.picture }, (err, result) => {
                        if (err) return (null, null)
                        else return done(null, result.ops[0])
                    })
                }
            })
    }
))

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/redirect', passport.authenticate('google', { failureRedirect: 'http://localhost:8080/login?error=1' }), (req, res) => {
    return new Promise((fullfil, reject) => {
        const data = {}
        data.params = req.user
        fullfil(data)
    })
    .then(utils.generateKey)
    .then(user.updateAuthenticatedToken)
    .then(data => { res.redirect(`http://localhost:8080/login?loggin=${data.params.login}&key=${data.params.key}`) })
})

module.exports = router