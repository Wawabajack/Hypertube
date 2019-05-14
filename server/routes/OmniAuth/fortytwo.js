const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const FortyTwoStrategy = require('passport-42').Strategy
const passport = require('passport')

const cors = require('cors')
router.use(cors())

const utils = require('../../models/utils')

const FORTYTWO_APP_ID = 'XXXXXX'
const FORTYTWO_APP_SECRET = 'XXXXXX'

passport.serializeUser((user, done) => { done(null, user) })

passport.deserializeUser((id, done) => { User.findById(id).then((user) => { done(null, user) }) })

passport.use(new FortyTwoStrategy({
        clientID: FORTYTWO_APP_ID,
        clientSecret:FORTYTWO_APP_SECRET,
        callbackURL: "XXXXXX"
    }, (accessToken, refreshToken, profile, done) => {
        mongodb.collection('user').findOne({ $or: [{ login: profile._json.login }, { email: profile._json.email }, { auth42Id: profile.id }] })
            .then(user => {
                if (user) {
                    if (user.auth42Id == profile.id) return done(null, user)
                    else return done(null, null)
                } else {
                    mongodb.collection('user').insertOne({ login: '101_' + profile._json.login, email: profile._json.email, password: '', salt: '', lastname: profile._json.last_name, firstname: profile._json.first_name, lang: 'en', tokenVerif: '', auth42Id: profile.id, avatar: profile._json.image_url }, (err, result) => {
                        if (err) return (null, null)
                        else return done(null, result.ops[0])
                    })
                }
            })
    }
))

router.get('/', passport.authenticate('42'))

router.get('/redirect', passport.authenticate('42', { failureRedirect: 'http://XXXXXX/login?error=1' }), (req, res) => {
    return new Promise((fullfil, reject) => {
        const data = {}
        data.params = req.user
        fullfil(data)
    })
    .then(utils.generateKey)
    .then(user.updateAuthenticatedToken)
    .then(data => { res.redirect(`http://XXXXXX/login?loggin=${data.params.login}&key=${data.params.key}`) })
})

module.exports = router
