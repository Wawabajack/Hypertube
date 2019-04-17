const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Hypertube', { useNewUrlParser: true })
    .then(() => { console.log('Hypertube database connected on port: 27017')})
    .catch(err => { console.error(err) })

global.mongodb = mongoose.connection