const express = require('express')
const app = express.Router()
const torrent = require('../models/movie')
const utils = require('../models/utils')
const user = require('../models/user')
const fs = require('fs')

/**
 * Allow the user to get top torrents/movies ??
 *      ---> `data` : { `authenticatedToken` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> get top movies/torrents {{ torrent::getTopTorrents }}
 *          -----> if multiple sources check for duplicate movies ??
 *          -----> error handling
 */
app.post('/', isUser, (req, res) => {
    utils.checkParams(req, res, [])
        .then(torrent.getTopTorrents)
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
app.post('/search', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'search', 'page', 'lang' ])
        .then(torrent.getSearchedMovies)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Allow the user to discover movies
 *      ---> `data` : { `authenticatedToken`, `with_genres`, `with_original_language`, `vote_average`, `release_date_min`, `release_date_max`, `page`, `lang` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `with_genres` && `with_original_language` && `vote_average` && `release_date_min` && `release_date_max` && `page` && `lang` exists and are well-formated {{ utils::checkParams }}
 *          ---> get the movies {{ torrent::getRecommandedMovies }}
 *          -----> error handling
 */
app.post('/discover', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'with_genres', 'with_original_language', 'vote_average', 'release_date_min', 'release_date_max', 'page', 'lang' ])
        .then(torrent.getRecommandedMovies)
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
 *      ---> `data` : { `authenticatedToken`, `torrent`, `movieId` }
 *          ---> use a middleware to see if `authenticatedToken` exist and match an user {{ isUser }}
 *          ---> check if `torrent` && `movieId` exists and are well-formated {{ utils::checkParams }}
 *          ---> download torrent {{ torrent::downloadTorrent }}
 *          ---> get subtitles {{ torrent::downloadSubtitles }}
 *          -----> error handling
 */
app.post('/download', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'torrent', 'movieId' ])
        .then(torrent.downloadTorrent)
        //.then(torrent.downloadSubtitles)
        .then(torrent.saveTorrent)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

app.post('/watch', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'movieId', 'torrent' ])
        .then(user.saveMovie)
        .then(torrent.saveTorrent)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

app.post('/check', isUser, (req, res) => {
    utils.checkParams(req, res, [ 'hash' ])
        .then(torrent.getInfos)
        .then(data => { data.res.send({ success: true, data: data.params }) })
        .catch(data => { data.res.send({ success: false, en_error: data.en_error, fr_error: data.fr_error }) })
})

/**
 * Update the movie seen by the user into the database and stream it
 *          ---> convert into the right quality {{ torrent:convert }}
 *          ---> stream it {{ torrent::stream }}
 *          ---> save movie into database's user collection {{ user::saveMovie }}
 *          ---> update movies collection 'lastSeen' with the current date {{ torrent::saveTorrent }}
 *          -----> error handling
 */
app.get('/convert/:hash', (req, res) => {
    data = { res: res, params: req.params }
    torrent.getInfos(data)
        .then(torrent.convert)
})

app.get('/stream/:hash', (req, res) => {
    data = { res: res, params: req.params, headers: req.headers }
    torrent.getInfos(data)
        .then(torrent.stream)
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