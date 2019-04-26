const express = require('express');
const router = express.Router();
const user = require('../../models/user');
const GithubStrategy = require('passport-github');
const passport = require('passport');

const cors = require('cors');
router.use(cors());

const utils = require('../../models/utils')

const GITHUB_APP_ID = '110843ad92dd3812b85b';
const GITHUB_APP_SECRET = '810dc38d8e17a4a2b1ad1860dee7878cc063372d';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GithubStrategy({
        clientID: GITHUB_APP_ID,
        clientSecret: GITHUB_APP_SECRET,
        callbackURL: "http://localhost:4000/auth/github/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
        mongodb.collection('user').findOne({
            $or: [{
                login: profile._json.login
            }, {
                email: profile._json.email
            }, {
                authGitId: profile.id
            }]
        }).then(user => {
            if (user) {
                //console.log(user);
                if (user.authGitId == profile.id) {
                    //console.log("user exist");
                    //console.log(user);
                    return done(null, user);
                } else
                    return done(null, null);
            } else {
                //console.log("2b");
             //   console.log(profile);
                mongodb.collection('user').insertOne({
                    login: 'Github_' + profile._json.login,
                    email: profile._json.email,
                    password: '',
                    salt: '',
                    lastname: profile._json.name,
                    firstname: '',
                    lang: 'en',
                    tokenVerif: '',
                    authGitId: profile.id
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

router.get('/', passport.authenticate('github'));

router.get('/redirect', passport.authenticate('github', {
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