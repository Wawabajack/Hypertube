const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors');

const auth = require('./routes/auth.route')
const movie = require('./routes/movie.route')
const user = require('./routes/user.route')
const msg = require('./routes/message.route')
require('./database')

express.static.mime.define({'text/vtt': ['vtt']})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

app.use('/auth', auth)
app.use('/torrent', movie)
app.use('/user', user)
app.use('/msg', msg)

app.listen(4000, () => { console.log('Hypertube server online on port:', 4000) })