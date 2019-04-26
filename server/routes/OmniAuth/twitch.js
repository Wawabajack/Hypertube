const express = require('express');
const router = express.Router();
const user = require('../../models/user');
const TwitchStrategy = require("passport-twitch").Strategy;
const passport = require('passport');

const cors = require('cors');
router.use(cors());

const utils = require('../../models/utils')

const TWITCH_APP_ID = '6dyk1rffx2sq6ger9kk7qpa588bbxn';
const TWITCH_APP_SECRET = 'qo6x7m3z1wemmdol3ydf82k4t691qh';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new TwitchStrategy({
        clientID: TWITCH_APP_ID,
        clientSecret: TWITCH_APP_SECRET,
        scope: "user_read",
        callbackURL: "http://localhost:4000/auth/twitch/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
       console.log("----------- 1 ----------------")
       //console.log(profile)
        mongodb.collection('user').findOne({
            $or: [{
                login: profile._json.display_name
            }, {
                email: profile._json.email
            }, {
                authtwitchId: profile.id
            }]
        }).then(user => {
            if (user) {
                console.log("----------- 2 ----------------")
                console.log(user);
                if (user.authtwitchId == profile.id) 
                    return done(null, user);
                else
                    return done(null, null);
            } else {
             //   console.log(profile);
             console.log("----------- 3 ----------------")
                mongodb.collection('user').insertOne({
                    login: 'Twitch_' + profile._json.display_name,
                    email: profile._json.email,
                    password: '',
                    salt: '',
                    lastname: '',
                    firstname: '',
                    lang: 'en',
                    tokenVerif: '',
                    authtwitchId: profile.id
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

router.get('/', passport.authenticate('twitch'));

router.get('/redirect', passport.authenticate('twitch', {
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