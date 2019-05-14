const Promise = require('promise')
const request = require('request')

module.exports.register = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ $or: [{ login: data.params.login }, { email: data.params.email }]}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            if (result) { data.params.mail = false; fullfil(data) }
            else {
                mongodb.collection('user').insertOne({ login: data.params.login,  email: data.params.email, password: data.params.password, salt: data.params.salt, lastname: data.params.lastname, firstname: data.params.firstname, lang: 'en', tokenVerif: data.params.key }, (err, result) => {
                    if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                    else { data.params.mail = true; fullfil(data) }
                })
            }
        })
    })
}
