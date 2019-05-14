const mongoose = require('mongoose')
mongoose.connect('mongodb://XXXXXX/Hypertube', { useNewUrlParser: true })
    .then(() => { console.info('Hypertube database connected on port: XXXXXX')})
    .catch(err => { console.error(err) })

global.mongodb = mongoose.connection
