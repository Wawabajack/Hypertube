const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors');
const rimraf = require('rimraf')
const passport = require('passport');

const auth = require('./routes/auth.route')
const movie = require('./routes/movie.route')
const user = require('./routes/user.route')
const msg = require('./routes/message.route')
require('./database')
require('./engine')

express.static.mime.define({'text/vtt': ['vtt']})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', auth)
app.use('/torrent', movie)
app.use('/user', user)
app.use('/msg', msg)

setInterval(() => {
    mongodb.collection('movies').find().toArray((err, result) => {
        if (err) console.error('An error occured with the database')
        else if (result) {
            result.forEach(element => {
                var date = ((new Date().getTime() / 86400000) - (new Date(element.lastSeen).getTime() / 86400000)).toFixed(0)
                if (date >= 30) {
                    rimraf(`../client/public/movies/${element.path}`, (err) => {
                        if (err) console.error(err)
                        else {
                            mongodb.collection('movies').deleteOne({ magnet: element.magnet }, (err, result) => {
                                if (err) console.error('An error occured with the database')
                                else console.error('Dossier' + element.path + 'supprimé.')
                            })
                        }
                    })
                }
            });
        }
    })
}, 86400000)

app.listen(4000, () => { console.info('Hypertube server online on port:', 4000) })