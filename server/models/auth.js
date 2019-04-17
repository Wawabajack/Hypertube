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

module.exports.login42 = (data) => {
    return new Promise((fullfil, reject) => {
        request.post({
            url: 'https://api.intra.42.fr/oauth/token',
            json: true,
            body: {
                grant_type: 'authorization_code',
                client_id: '01dac0c084ae2a6ac29ee0a880d2769e731682b34478bd75a8849dfd1650f08c',
                client_secret: '81fa82ff71cb6198ffb878256e9fa43e3eacaf18fac55754dcebdc87293ba056',
                code: data.params.oauthCode,
                redirect_uri: 'http://localhost:8080/oauth/42'
            }
        }, (error, response, body) => {
            if (error) reject({ res: data.res, en_error: 'Invalid token', fr_error: 'Token invalide' })
            else {
                if (body.error) reject({ res: data.res, en_error: body.error_description, fr_error: body.error_description })
                data.params.oauthToken = body.access_token
                request.get({
                    url: 'https://api.intra.42.fr/v2/me?access_token=' + data.params.oauthToken,
                    json: true
                }, (error, response, body) => {
                    if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
                    else {
                        if (body.error) reject({ res: data.res, en_error: body.error_description, fr_error: body.error_description })
                        data.params.login = 'le101_' + body.login
                        data.params.lastname = body.last_name
                        data.params.firstname = body.first_name
                        data.params.email = body.email
                        data.params.password = ''
                        data.params.salt = ''
                        data.params.avatar = body.image_url
                        data.params.oauthMethod = '42'
                        data.params.api = true
                        fullfil(data)
                    }
                })
            }
        })
    })
}

module.exports.loginGitHub = (data) => {
    return new Promise((fullfil, reject) => {
        request.post({
            url: 'https://github.com/login/oauth/access_token',
            json: true,
            body: {
                client_id: 'a92145361450ff616ae0',
                client_secret: 'f08c1bc322a126ce9ed13cb13acb950dee3aa565',
                code: data.params.oauthCode,
				redirect_uri: 'http://localhost:8080/oauth/github',
            }
        }, (error, response, body) => {
            if (error) reject({ res: data.res, en_error: 'Invalid token', fr_error: 'Token invalide' })
            else {
                if (body.error) reject({ res: data.res, en_error: body.error_description, fr_error: body.error_description })
				data.params.oauthToken = body.access_token
				request.get({
					url: 'https://api.github.com/user?access_token=' + data.params.oauthToken,
					json: true,
					headers: { 'User-Agent': '' }
				}, (error, response, body) => {
					if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
                    else {
                        if (body.error) reject({ res: data.res, en_error: body.error_description, fr_error: body.error_description })
                        data.params.login = 'github_' + body.login
                        data.params.lastname = ''
                        data.params.firstname = ''
                        data.params.email = ''
                        data.params.password = ''
                        data.params.salt = ''
                        data.params.avatar = body.avatar_url
                        data.params.oauthMethod = 'github'
                        data.params.api = true
                        fullfil(data)
                    }
				})
            }
        })
    })
}