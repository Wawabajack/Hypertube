const Promise = require('promise')
const crypto = require('crypto')
const fs = require('fs')

module.exports.checkLogin = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ login: data.params.login }, (err, result) => {
            if (result) reject({ res: data.res, en_error: 'This login is already used', fr_error: 'Ce login est déjà utilisé' })
            else {
                if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                else fullfil(data)
            }
        })
    })
}

module.exports.checkEmail = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ email: data.params.email }, (err, result) => {
            if (result) reject({ res: data.res, en_error: 'This email is already used', fr_error: 'Cet email est déjà utilisé' })
            else {
                if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                else fullfil(data)
            }
        })
    })
}

module.exports.getUserByEmail = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ email: data.params.email }, (err, result) => {
            if (result) { data.params.login = result.login; fullfil(data) }
            else {
                if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                else reject({ res: data.res, en_error: 'Unknown email', fr_error: 'Email inconnu' })
            }
        })
    })
}

module.exports.getUserByAuthToken = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ authenticatedToken: data.params.authenticatedToken }, (err, result) => {
            if (result) { data.params.login = result.login; fullfil(data) }
            else {
                if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                else reject({ res: data.res, en_error: 'This token isn\'t valid anymore', fr_error: 'Ce token n\'est plus valide' })
            }
        })
    })
}

module.exports.matchPassword = (data) => {
    return new Promise((fullfil, reject) => {
        if (data.params.password === data.params.passwordConfirmation) fullfil(data)
        else reject({ res: data.res, en_error: 'Password doesn\'t match', fr_error: 'Les mots de passes ne correspondent pas' })
    })
}

module.exports.checkPassword = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ login: data.params.login }, (err, result) => {
            if (result) {
                if (result.password === crypto.createHash('whirlpool').update(data.params.password + result.salt).digest('hex')) {
                    if (result.tokenVerif !== null) reject({ res: data.res, en_error: 'Your account isn\'t validated', fr_error: 'Vous devez d\'abord valider votre compte' })
                    else fullfil(data)
                } else reject({ res: data.res, en_error: 'Password doesn\'t match', fr_error: 'Les mots de passes ne correspondent pas' })
            } else {
                if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                else reject({ res: data.res, en_error: 'Unknown login', fr_error: 'Login inconnu' })
            }
        })
    })
}

module.exports.updatePassword = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { password: crypto.createHash('whirlpool').update(data.params.password + data.params.salt).digest('hex') }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.checkTokenVerif = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ tokenVerif: data.params.tokenVerif }, (err, result) => {
            if (result) { data.params.login = result.login; fullfil(data) }
            else {
                if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                else reject({ res: data.res, en_error: 'This token isn\'t valid anymore', fr_error: 'Ce token n\'est plus valide' })
            }
        })
    })
}

module.exports.updateTokenVerif = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { tokenVerif: data.params.key }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.checkTokenLost = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ tokenLost: data.params.tokenLost }, (err, result) => {
            if (result) { data.params.login = result.login; fullfil(data) }
            else {
                if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                else reject({ res: data.res, en_error: 'This token isn\'t valid anymore', fr_error: 'Ce token n\'est plus valide' })
            }
        })
    })
}

module.exports.updateTokenLost = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { tokenLost: data.params.key }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.checkAuthenticatedToken = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ AuthenticatedToken: data.params.authenticatedToken }, (err, result) => {
            if (result) { data.params.user = result; fullfil(data) }
            else {
                if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                else reject({ res: data.res, en_error: 'You can\'t access to this page without being connected', ft_error: 'Vous ne pouvez pas accéder à cette page sans être connecté' })
            }
        })
    })
}

module.exports.updateAuthenticatedToken = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { authenticatedToken: data.params.key }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.updateSalt = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { salt: data.params.salt }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.updateLang = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { lang: data.params.lang }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.getLang = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ login: data.params.login }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else { data.params.lang = result.lang; fullfil(data) }
        })
    })
}

module.exports.updateLastname = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { lastname: data.params.lastname }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.updateFirstname = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { firstname: data.params.firstname }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.updateEmail = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { email: data.params.email }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.updateAvatar = (data) => {
    return new Promise((fullfil, reject) => {
        if (data.params.user) data.params.login = data.params.user
        var extension =  data.params.avatar.originalname.split('.').pop()
        var path = '../client/public/img/uploads/' + data.params.login + '.' + extension
        fs.rename(data.params.avatar.path, path, (err) => { if (err) reject({ res: data.res, en_error: err, fr_error: err }) })
        var newPath = '/img/uploads/' + data.params.login + '.' + extension
        mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { avatar: newPath }}, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else fullfil(data)
        })
    })
}

module.exports.getInfos = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ login: data.params.user }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else {
                data.params.avatar = result.avatar
                data.params.lastname = result.lastname
                data.params.firstname = result.firstname
                data.params.lang = result.lang
                fullfil(data)
            }
        })
    })
}

module.exports.getMyInfos = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ login: data.params.login }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else {
                data.params.avatar = result.avatar
                data.params.lastname = result.lastname
                data.params.firstname = result.firstname
                data.params.email = result.email
                data.params.password = result.password
                fullfil(data)
            }
        })
    })
}

module.exports.getMovies = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ login: data.params.login }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else {
                data.params.movies = result.viewedMovies
                fullfil(data)
            }
        })
    })
}

module.exports.saveMovie = (data) => {
    console.log(data.params)
    return new Promise((fullfil, reject) => {
        mongodb.collection('user').findOne({ login: data.params.login }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else if (result.viewedMovies) {
                var viewedMovies = result.viewedMovies
                if (viewedMovies.findIndex( movie => { return movie === data.params.tmpId }) >= 0) fullfil(data)
                else {
                    viewedMovies.push(data.params.tmpId)
                    mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { viewedMovies: viewedMovies }}, (err, result) => {
                        if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                        else fullfil(data)
                    })
                }
            } else {
                mongodb.collection('user').updateOne({ login: data.params.login }, { $set : { viewedMovies: [ data.params.tmpId ] }}, (err, result) => {
                    if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                    else fullfil(data)
                })
            }
        })
    })
}