const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const TwitchStrategy = require("passport-twitch").Strategy
const passport = require('passport')

const cors = require('cors')
router.use(cors())

const utils = require('../../models/utils')

const TWITCH_APP_ID = 'XXXXXX'
const TWITCH_APP_SECRET = 'XXXXXX'

passport.serializeUser((user, done) => { done(null, user) })

passport.deserializeUser((id, done) => { User.findById(id).then((user) => { done(null, user) }) })

passport.use(new TwitchStrategy({
        clientID: TWITCH_APP_ID,
        clientSecret: TWITCH_APP_SECRET,
        scope: "user_read",
        callbackURL: "XXXXXX"
    }, (accessToken, refreshToken, profile, done) => {
        mongodb.collection('user').findOne({ $or: [{ login: profile._json.display_name }, { email: profile._json.email }, { authtwitchId: profile.id }] })
            .then(user => {
                if (user) {
                    if (user.authtwitchId == profile.id) return done(null, user)
                    else return done(null, null)
                } else {
                    mongodb.collection('user').insertOne({ login: 'Twitch_' + profile._json.display_name, email: profile._json.email, password: '', salt: '', lastname: '', firstname: '', lang: 'en', tokenVerif: '', authtwitchId: profile.id, avatar: profile._json.logo }, (err, result) => {
                        if (err) return (null, null)
                        else return done(null, result.ops[0])
                    })
                }
            })
    }
))

router.get('/', passport.authenticate('twitch'))

router.get('/redirect', passport.authenticate('twitch', { failureRedirect: 'http://XXXXXX/login?error=1' }), (req, res) => {
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
