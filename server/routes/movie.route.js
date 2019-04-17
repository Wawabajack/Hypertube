const express = require('express')
const app = express.Router()
const torrent = require('../models/movie')
const utils = require('../models/utils')
const user = require('../models/user')

/**
 * Allow the user to get top torrents/movies ??
 *      ---> `data` : { `authenticatedToken` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> get top movies/torrents {{ torrent::getRecommandedMovies }}
 *          -----> if multiple sources check for duplicate movies ??
 *          -----> error handling
 */
app.post('/', isUser, (req, res) => {
    utils.checkParams(req, res, [])
        .then(torrent.getRecommandedMovies)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to search movies
 *      ---> `data` : { `authenticatedToken`, `search`, `page`, `lang` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `search` && `page` && `lang` exists and are well-formated {{ utils::checkParams }}
 *          ---> get the movies {{ torrent::getSearchedMovies }}
 *          -----> error handling
 */
// AJOUT DE PARAMS POUR TRIEE LA RECHERCHE
app.post('/search', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'search', 'page', 'lang' ])
        .then(torrent.getSearchedMovies)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Retrieve differents informations for the movie
 *      ---> `data` : { `authenticatedToken`, `movieTitle`, `movieId` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `movieTitle` or `movieId`exists and are well-formated {{ utils::checkParams }}
 *          ---> get all movie's informations via imdb thanks to `movieTitle` or `movieId` {{ torrent::getMovie }}
 *          ---> get list of torrents already downloaded {{ torrent::getDownloadedTorrents }}
 *          ---> get trailer's movie {{ torrent::getTrailer }}
 *          ---> get movieTorrents {{ torrent::getTorrentsByYTS }}
 *          ---> get movieTorrents {{ torrent::getTorrentsByRARBG }}
 *          -----> error handling
 */
app.post('/movie', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'movieTitle', 'movieId' ])
        .then(torrent.getMovie)
        .then(torrent.getDownloadedTorrents)
        .then(torrent.getTrailer)
        .then(torrent.getTorrentsByYTS)
        .then(torrent.getTorrentsByRARBG)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to download and stream the choosen movie
 *      ---> `data` : { `authenticatedToken`, `movieMagnet`, `movieId` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `movieMagnet` && `movieId` exists and are well-formated {{ utils::checkParams }}
 *          ---> download torrent {{ torrent::downloadTorrent }}
 *          ---> save torrent into database's movies collection {{ torrent::saveTorrent }}
 *          ---> update movies collection 'lastSeen' with the current date {{ torrent::saveDate }}
 *          ---> get subtitles {{ torrent::downloadSubtitles }}
 *          -----> error handling
 */
app.post('/download', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'movieMagnet', 'movieId' ])
        .then(torrent.downloadTorrent)
        .then(torrent.saveTorrent)
        .then(torrent.saveDate)
        .then(torrent.downloadSubtitles)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Update the movie seen by the user into the dabatase
 *      ---> `data` : { `authenticatedToken`, `movieTitle`, `movieId`, `movieMagnet` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `movieId` && `movieTitle` && `movieMagnet` exists and are well-formated {{ utils::checkParams }}
 *          ---> stream the movie {{ torrent::streaming }}
 *          ---> save movie into database's user collection {{ user::saveMovie }}
 *          ---> update movies collection 'lastSeen' with the current date {{ torrent::saveDate }}
 *          -----> error handling
 */
app.post('/watch', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'movieTitle', 'movieId', 'movieMagnet' ])
        .then(user.saveMovie)
        .then(torrent.saveDate)
        .then(data => { console.log('success'); data.res.send({ success: true, data: data.params }) })
        .catch(data => { console.log('error'); data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

module.exports = app

/**
 * Check if `authenticatedToken` exists and match to an user
 */
function isUser(req, res, next) {
    if (req.body.authenticatedToken) {
        var data = { res: res, params: req.body }
        user.getUserByAuthToken(data)
            .then(data => { next() })
            .catch(data => { res.status(403).send('You can\'t access this page') })
    } else res.status(403).send('You can\'t access this page')
}