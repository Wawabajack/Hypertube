const Promise = require('promise')
const imdb = require('imdb-api')
const torrentStream = require('torrent-stream')
const request = require('request')
const OS = require('opensubtitles-api')
const OpenSubtitles = new OS({ useragent: 'TemporaryUserAgent', ssl: true })
const fs = require('fs')
const rarbgApi = require('rarbg-api')
const srt2vtt = require('srt-to-vtt')

module.exports.getRecommandedMovies = (data) => {
    return new Promise((fullfil, reject) => {
        const options = {
            category: rarbgApi.CATEGORY.MOVIES,
            sort: 'last'
        }
        rarbgApi.list(options)
            .then(result => {
                data.params.lastTorrents = result
                options.sort = 'seeders'
                rarbgApi.list(options)
                    .then(result => {
                        data.params.seedersTorrents = result
                        options.sort = 'leechers'
                        rarbgApi.list(options)
                            .then(result => { data.params.leechersTorrents = result; fullfil(data) })
                            .catch(err => { reject({ res: data.res, en_error: err, fr_error: err }) })
                    })
                    .catch(err => { reject({ res: data.res, en_error: err, fr_error: err }) })
            })
            .catch(err => { reject({ res: data.res, en_error: err, fr_error: err }) })
    })
}

module.exports.getSearchedMovies = (data) => {
    return new Promise((fullfil, reject) => {
        var lang = data.params.lang === 'en' ? 'en-US' : 'fr-FR'
        request.get({
            url: 'https://api.themoviedb.org/3/search/movie?api_key=fcddca7f1ed48a172cfd4673adf01e53&language=' + lang + '&query=' + data.params.search + '&page=' + data.params.page + '&include_adult=false',
            json: true
        }, (error, response, body) => {
            if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
            else {
                if (body.error) reject({ res: data.res, en_error: body.status_message, fr_error: body.status_message })
                if (!body.total_results) reject({ res: data.res, en_error: '0 movies found', fr_error: 'Aucun film n\'a été trouvé' })
                else { data.params.movies = body.results; fullfil(data) }
            }
        })
    })
}

module.exports.getMovie = (data) => {
    return new Promise((fullfil, reject) => {
        var params = data.params.movieTitle ? { name: data.params.movieTitle } : { id: data.params.movieId }
        imdb.get(params, { apiKey: '4402369e' })
            .then(result => { data.params.movie = result; fullfil(data) })
            .catch(error => { reject({ res: data.res, en_error: error.message, fr_error: error.message })})
    })
}

module.exports.getDownloadedTorrents = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('movies').findOne({ id: data.params.movie.imdbid }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else if (result) data.params.torrents = result.downloadedTorrents
            fullfil(data)
        })
    })
}

module.exports.getTrailer = (data) => {
    return new Promise((fullfil, reject) => {
        request.get({
            url: 'https://api.themoviedb.org/3/movie/' + data.params.movie.imdbid + '/videos?api_key=fcddca7f1ed48a172cfd4673adf01e53&site=Youtube&type=Trailer',
            json: true
        }, (error, response, body) => {
            if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
            else {
                if (body.error) reject({ res: data.res, en_error: body.status_message, fr_error: body.status_message })
                else { 
                    var tmp = body.results.filter((elmt) => { return elmt.type === 'Trailer' })
                    tmp.sort((a, b) => { return b.size - a.size });
                    if (tmp.length) data.params.trailer = 'https://www.youtube.com/embed/' + tmp[0].key + '?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1'
                    fullfil(data)
                }
            }
        })
    })
}

module.exports.getTorrentsByYTS = (data) => {
    return new Promise((fullfil, reject) => {
        request.get({
            url: 'https://yts.am/api/v2/list_movies.json?query_term='+ data.params.movie.imdbid
        }, (error, response, body) => {
            if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
            var result = JSON.parse(body)
            if (result.status !== 'ok') reject({ res: data.res, en_error: result.status_message, fr_error: result.status_message })
            if (result.data.movie_count) { data.params.yts_torrents = result.data.movies[0].torrents; }
            fullfil(data)
        })
    })
}

module.exports.getTorrentsByRARBG = (data) => {
    return new Promise((fullfil, reject) => {
        rarbgApi.search(data.params.movie.imdbid, null, 'imdb')
            .then(result => { data.params.rarbg_torrents = result; fullfil(data) })
            .catch(err => { reject({ res: data.res, en_error: err, fr_error: err }) })
    })
}

module.exports.downloadTorrent = (data) => {
    return new Promise((fullfil, reject) => {
        var engine = torrentStream('magnet:?xt=urn:btih:' + data.params.movieMagnet, { path: '../client/public/movies/', verify: true })
        engine.on('ready', () => {
            console.log('ready to download')
            engine.files.forEach(file => {
                if (file.name.search('mp4') >= 0 || file.name.search('webm') >= 0) {
                    var stream = file.createReadStream();
                    data.params.torrentPath = file.path
                    data.params.torrentFilename = file.name
                    fullfil(data);
                }
            })
        })
        engine.on('download', (piece) => {
            console.log(piece)
        })
        engine.on('idle', (data) => {
            console.log('download over')
            fullfil(data)
        });
    })
}

module.exports.saveTorrent = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('movies').findOne({ id: data.params.movieId, magnet: data.params.movieMagnet, path: data.params.torrentPath.split('/')[0], file: data.params.torrentFilename }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else if (result) {
                mongodb.collection('movies').updateOne({ id: data.params.movieId, magnet: data.params.movieMagnet, path: data.params.torrentPath.split('/')[0], file: data.params.torrentFilename }, { $set : { lastSeen: new Date() }}, (err, result) => {
                    if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                    else fullfil(data)
                })
            } else {
                mongodb.collection('movies').insertOne({ id: data.params.movieId, magnet: data.params.movieMagnet, path: data.params.torrentPath.split('/')[0], file: data.params.torrentFilename, lastSeen: new Date() }, (err, result) => {
                    if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                    else fullfil(data)
                })
            }
        })
    })
}

module.exports.downloadSubtitles = (data) => {
    return new Promise((fullfil, reject) => {
        data.params.subtitles = []
        OpenSubtitles.search({
            sublanguageid: 'all',
            imdbid: data.params.movieId
        })
            .then(results => {
                var language = [ 'fr', 'en' ]
                var items = 0 
                language.forEach(lang => {
                    request.get({
                        url: results[lang].utf8
                    }, (error, response, body) => {
                        if (error) reject({ res: data.res, en_error: error, fr_error: error })
                        else {
                            var path = data.params.torrentPath.split('/')[0]
                            var name = data.params.torrentFilename.split('.')
                            name.pop()
                            var tmp = path + '/' + name.join('.') + '-' + lang
                            var path1 = '../client/public/movies/' + tmp + '.srt'
                            var path2 = '../client/public/movies/' + tmp + '.vtt'
                            fs.writeFile(path1, body, "utf-8", (err) => {
                                if (err) reject({ res: data.res, en_error: err, fr_error: err })
                                else {
                                    fs.createReadStream(path1)
                                        .pipe(srt2vtt())
                                        .pipe(fs.createWriteStream(path2))
                                    data.params.subtitles.push({ lang: lang, name: '/movies/' + tmp + '.vtt' })
                                    if (++items === language.length) fullfil(data)
                                } 
                            })
                        }
                    })
                })
            })
            .catch(error => { reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' }) })
    })
}

module.exports.saveDate = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('movies').findOne({ id: data.params.movieId, magnet: data.params.movieMagnet }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else if (result) {
                mongodb.collection('movies').updateOne({ id: data.params.movieId, magnet: data.params.movieMagnet }, { $set : { lastSeen: Date('Y-m-j') }}, (err, result) => {
                    if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                    else fullfil(data)
                })
            } else reject({ res: data.res, en_error: 'This movie has not been downloaded', fr_error: 'Ce film n\'a jamais été téléchargé' })
        })
    })
}
