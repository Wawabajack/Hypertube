const Promise = require('promise')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: 'solarys02@gmail.com', pass: '50Cent50' }})

module.exports.checkParams = (req, res, params) => {
    return new Promise((fullfil, reject) => {
        params.forEach(param => {
            if (!req.body[param]) reject({ res: res, en_error: 'Fields missing', fr_error: 'Vous n\'avez pas fourni toutes les informations nécessaires' })
            else {
                if (param === 'login') {
                    var regex = /^([a-zA-Z0-9-_. ]){6,20}$/
                    if (!regex.test(req.body[param])) reject({ res: res, en_error: 'Login isn\'t well formated', fr_error: 'Le login n\'est pas correctement formaté' }) }
                else if (param === 'password' || param === 'passwordConfirmation') { 
                    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
                    if (!regex.test(req.body[param])) reject({ res: res, en_error: 'Password isn\'t well formated', fr_error: 'Le mot de passe n\'est pas correctement formaté' }) }
                else if (param === 'email') {
                    var regex = /^([a-zA-Z0-9-_.]){3,40}@([a-zA-Z0-9-_.]){3,40}\.([a-zA-Z0-9-_.]){1,40}$/
                    if (!regex.test(req.body[param])) reject({ res: res, en_error: 'Email isn\'t well formated', fr_error: 'L\'email n\'est pas correctement formaté' }) }
                else if (param === 'lang') {
                    var regex = /^(fr|en)$/
                    if (!regex.test(req.body[param])) reject({ res: res, en_error: 'Unavailable language', fr_error: 'Langue indisponible' }) }
                else if (param === 'avatar') {
                    if (req.body[param].mimetype !== 'image/jpeg' && req.body[param].mimetype !== 'image/png') reject({ res: res, en_error: 'Your picture must be jpg or png', fr_error: 'Votre photo doit être png/jpg' })
                    if (req.body[param].size > 250000) reject({ res: res, en_error: 'The size of the picture must be < 250kb', fr_error: 'Votre photo est trop grande (>250kb)' }) }
                else if (param === 'with_genres') {
                    var regex = /^(-1|28|12|16|35|80|99|18|10751|14|27|10749|878|53|10752|37)$/
                    if (!regex.test(req.body[param])) reject({ res: res, en_error: 'Unavailable genre', fr_error: 'Genre indisponible' }) }
                else if (param === 'language') {
                    var regex = /^(fr|en|ru|it|de|ja|pt|es)$/
                    if (!regex.test(req.body[param])) reject({ res: res, en_error: 'Unavailable language', fr_error: 'Langue indisponible' }) }
                else if (param === 'vote_average') {
                    var regex = /^([0-9]|10)$/
                    if (!regex.test(req.body[param][0]) || !regex.test(req.body[param][1])) reject({ res: res, en_error: 'Average vote must be >= 0 && <= 10', fr_error: 'La popularité doit être >= 0 && <= 10' }) }
                else if (param === 'release_date_min' || param === 'release_date_max') {
                    var regex = /^(19[8-9][0-9]|20[0-1][0-8])$/
                    if (!regex.test(req.body[param])) reject({ res: res, en_error: 'Release date must be >= 1950 && <= 2019', fr_error: 'La date de sortie doit être >= 1950 && <= 2019' }) }
                else if (param === 'page') {
                    var regex = /^(1|[0-9]{0,2})$/
                    if (!regex.test(req.body[param])) reject({ res: res, en_error: 'Unavailable page', fr_error: 'Page indisponible/invalide' }) }
                else if (param === 'hash') {
                    var regex = /^([a-zA-Z0-9]){40}$/
                    if (!regex.test(req.body[param])) reject({ res: res, en_error: 'Torrent\'s magnet isn\'t well formated', fr_error: 'Le magnet du torrent n\'est pas correctement formaté'})
                }
            }
        })
        fullfil({ res: res, params: req.body })
    })
}

module.exports.sendActivateAccountMail = (data) => {
    return new Promise((fullfil, reject) => {
        if (data.params.mail && data.params.email) {
            var content = data.params.api ? 'Vous venez de lier votre compte avec ' + data.params.oauthMethod : '<a href=\'http://localhost:8080/activate/' + data.params.key + '\'>Cliquez ici</a> pour confirmer le compte'
            var mailOptions = { from: 'solarys02@gmail.com', to: data.params.email, subject: 'Confirmation de compte Hypertube', html: content }
            transporter.sendMail(mailOptions, (err, result) => {
                if (err) reject({ res: data.res, en_error: 'An error occured when sending an email', fr_error: 'Un problème est survenue lors de l\'envoie du mail' })
                else fullfil(data)
            })
        } else fullfil(data)
    })
}

module.exports.sendForgotPassMail = (data) => {
    return new Promise((fullfil, reject) => {
        var content = '<a href=\'http://localhost:8080/reset/' + data.params.key + '\'>Cliquez ici</a> pour modifier votre mot de passe'
        var mailOptions = { from: 'solarys02@gmail.com', to: data.params.email, subject: 'Changement de mot de passe Hypertube', html: content }
        transporter.sendMail(mailOptions, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured when sending an email', fr_error: 'Un problème est survenue lors de l\'envoie du mail' })
            else fullfil(data)
        })
    })
}

module.exports.generateSalt = (data) => {
    return new Promise((fullfil, reject) => {
        var salt = '',
		chaine = 'abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (var i = 0; i < 18; i++) salt += chaine[Math.floor(Math.random() * Math.floor(64)) % chaine.length];
        data.params.salt = salt
        fullfil(data)
    })
}

module.exports.generateKey = (data) => {
    return new Promise((fullfil, reject) => {
        var key = '',
		chaine = 'abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (var i = 0; i < 36; i++) key += chaine[Math.floor(Math.random() * Math.floor(64)) % chaine.length];
        data.params.key = key
        fullfil(data)
    })
}

module.exports.encryptPassword = (data) => {
    return new Promise((fullfil, reject) => {
        data.params.password = crypto.createHash('whirlpool').update(data.params.password + data.params.salt).digest('hex');
        fullfil(data)
    })
}

module.exports.resetKey = (data) => {
    return new Promise((fullfil, reject) => {
        data.params.key = null
        fullfil(data)
    })
}