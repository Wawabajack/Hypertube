const express = require('express');
const router = express.Router();
const user = require('../../models/user');
const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');

const cors = require('cors');
router.use(cors());

const utils = require('../../models/utils')

const DISCORD_APP_ID = '569901989304205357';
const DISCORD_APP_SECRET = 'C9EVpywxZeCOmPDiEvN0615W8Q6gO7Cb';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new DiscordStrategy({
        clientID: DISCORD_APP_ID,
        clientSecret: DISCORD_APP_SECRET,
        scope: "identify email",
        callbackURL: "http://localhost:4000/auth/discord/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
        //console.log("1");
        console.log(profile);
        mongodb.collection('user').findOne({
            $or: [{
                login: profile.username
            }, {
                email: profile.email
            }, {
                authDiscordId: profile.id
            }]
        }).then(user => {
            if (user) {
                //console.log(user);
                if (user.authDiscordId == profile.id) {
                    //console.log("user exist");
                    //console.log(user);
                    return done(null, user);
                } else
                    return done(null, null);
            } else {
                console.log("2b");
                mongodb.collection('user').insertOne({
                    login: 'Discord_' + profile.username,
                    email: profile.email,
                    password: '',
                    salt: '',
                    lastname: '',
                    firstname: '',
                    lang: 'en',
                    tokenVerif: '',
                    authDiscordId: profile.id
                }, (err, result) => {
                    if (err) {
                        //console.log(err);
                        return (null, null);
                    }
                    //console.log(result.ops[0]);
                    return done(null, result.ops[0]);
                })
            }
        })
    }));

router.get('/', passport.authenticate('discord'));

router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: 'http://localhost:8080/login?error=1'
}), (req, res) => {
 //   console.log("redirect")
    return new Promise((fullfil, reject) => {
        //     console.log(req.user);
        const data = {};
        data.params = req.user;
        fullfil(data);
    })
    .then(utils.generateKey)
    .then(user.updateAuthenticatedToken)
    .then(data => { /*res.send({ success: true, data: data.params })*/
                    res.redirect('http://localhost:8080/login?loggin='+data.params.login+'&key='+data.params.key)
})
  //      res.status(200).redirect('http://localhost:8080/login?logged');
});
module.exports = router;