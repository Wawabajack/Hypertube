const Promise = require('promise')

module.exports.send = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('msg').insertOne({ id: data.params.movieId, exp: data.params.login, msg: data.params.message.trim(), time: new Date() }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.get = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('msg').find({ id: data.params.movieId }).toArray((err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else { data.params.messages = result, fullfil(data) }
        })
    })
}