const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const FortyTwoStrategy = require('passport-42').Strategy
const passport = require('passport')

const cors = require('cors')
router.use(cors())

const utils = require('../../models/utils')

const FORTYTWO_APP_ID = '01dac0c084ae2a6ac29ee0a880d2769e731682b34478bd75a8849dfd1650f08c'
const FORTYTWO_APP_SECRET = '81fa82ff71cb6198ffb878256e9fa43e3eacaf18fac55754dcebdc87293ba056'

passport.serializeUser((user, done) => { done(null, user) })

passport.deserializeUser((id, done) => { User.findById(id).then((user) => { done(null, user) }) })

passport.use(new FortyTwoStrategy({
        clientID: FORTYTWO_APP_ID,
        clientSecret:FORTYTWO_APP_SECRET,
        callbackURL: "http://localhost:4000/auth/fortytwo/redirect"
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

router.get('/redirect', passport.authenticate('42', { failureRedirect: 'http://localhost:8080/login?error=1' }), (req, res) => {
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