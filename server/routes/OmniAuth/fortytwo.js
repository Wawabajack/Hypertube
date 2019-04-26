const express = require('express');
const router = express.Router();
const user = require('../../models/user');
const FortyTwoStrategy = require('passport-42').Strategy;
const passport = require('passport');

const cors = require('cors');
router.use(cors());

const utils = require('../../models/utils')

const FORTYTWO_APP_ID = '01dac0c084ae2a6ac29ee0a880d2769e731682b34478bd75a8849dfd1650f08c';
const FORTYTWO_APP_SECRET = '81fa82ff71cb6198ffb878256e9fa43e3eacaf18fac55754dcebdc87293ba056';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new FortyTwoStrategy({
        clientID: FORTYTWO_APP_ID,
        clientSecret:FORTYTWO_APP_SECRET,
        callbackURL: "http://localhost:4000/auth/fortytwo/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
        //console.log("----------- 1 ----------------")
        //console.log(profile);
        mongodb.collection('user').findOne({
            $or: [{
                login: profile._json.login
            }, {
                email: profile._json.email
            }, {
                auth42Id: profile.id
            }]
        }).then(user => {
            if (user) {
                //console.log(user);
                if (user.auth42Id == profile.id) {
                    //console.log("user exist");
                    //console.log(user);
                    return done(null, user);
                } else
                    return done(null, null);
            } else {
                //console.log("2b");
             //   console.log(profile);
                mongodb.collection('user').insertOne({
                    login: '101_' + profile._json.login,
                    email: profile._json.email,
                    password: '',
                    salt: '',
                    lastname: '',
                    firstname: '',
                    lang: 'en',
                    tokenVerif: '',
                    auth42Id: profile.id
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

router.get('/', passport.authenticate('42'));

router.get('/redirect', passport.authenticate('42', {
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