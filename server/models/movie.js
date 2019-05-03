const Promise = require('promise')
const imdb = require('imdb-api')
const pirabay = require('thepiratebay')
const yts = require('yts-api-pt')
const torrentStream = require('torrent-stream')
const request = require('request')
const fs = require('fs')
const rarbgApi = require('rarbg-api')
const srt2vtt = require('srt-to-vtt')
const FFmpeg = require('fluent-ffmpeg');
const FFmpegPath = require('@ffmpeg-installer/ffmpeg').path;
FFmpeg.setFfmpegPath(FFmpegPath)
const rimraf = require('rimraf')
const OS = require('opensubtitles-api')
const OpenSubtitles = new OS({ useragent: 'TemporaryUserAgent', ssl: true })
const leftpad = require('left-pad')

module.exports.getTopTorrents = (data) => {
    return new Promise((fullfil, reject) => {
        const options = { category: rarbgApi.CATEGORY.MOVIES, sort: 'last' }
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


module.exports.getInfoLast_Torrents = (data) => {
	return new Promise((fullfil, reject) => {
		let index = 0
		data.params.lastTorrents_infos = []
		data.params.lastTorrents.forEach(torrent => {
            if (torrent.size / 1000000000 < 10) {
                if (torrent.episode_info && torrent.episode_info.imdb) {
                    request.get({
                        url: `http://www.omdbapi.com/?apikey=4402369e&plot=short&i=${torrent.episode_info.imdb}`,
                        json: true
                    }, (error, response, body) => {
                        if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
                        else if (body.Response === 'True') {
                            data.params.lastTorrents_infos.push(body)
                            if (index++ === 24) fullfil(data)
                        } else reject({ res: data.res, en_error: 'Movie not found..', fr_error: 'Aucun film n\'a été trouvé..' })
                    })
                } else if (index++ === 24) fullfil(data)
            } else if (index++ === 24) fullfil(data)
		})
	})
}

module.exports.getInfoSeeders_Torrents = (data) => {
	return new Promise((fullfil, reject) => {
		index = 0
		data.params.seedersTorrents_infos = []
		data.params.seedersTorrents.forEach(torrent => {
			if (torrent.size / 1000000000 < 10) {
                if (torrent.episode_info && torrent.episode_info.imdb) {
                    request.get({
                        url: `http://www.omdbapi.com/?apikey=4402369e&plot=short&i=${torrent.episode_info.imdb}`,
                        json: true
                    }, (error, response, body) => {
                        if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
                        else if (body.Response === 'True') {
                            data.params.seedersTorrents_infos.push(body)
                            if (index++ === 24) fullfil(data)
                        } else reject({ res: data.res, en_error: 'Movie not found..', fr_error: 'Aucun film n\'a été trouvé..' })
                    })
                } else if (index++ === 24) fullfil(data)
            } else if (index++ === 24) fullfil(data)
		})
	})
}

module.exports.getInfoLeechers_Torrents = (data) => {
	return new Promise((fullfil, reject) => {
		index = 0
		data.params.leechersTorrents_infos = []
		data.params.leechersTorrents.forEach(torrent => {
			if (torrent.size / 1000000000 < 10) {
                if (torrent.episode_info && torrent.episode_info.imdb) {
                    request.get({
                        url: `http://www.omdbapi.com/?apikey=4402369e&plot=short&i=${torrent.episode_info.imdb}`,
                        json: true
                    }, (error, response, body) => {
                        if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
                        else if (body.Response === 'True') {
                            data.params.leechersTorrents_infos.push(body)
                            if (index++ === 24) fullfil(data)
                        } else reject({ res: data.res, en_error: 'Movie not found..', fr_error: 'Aucun film n\'a été trouvé..' })
                    })
                } else if (index++ === 24) fullfil(data)
            } else if (index++ === 24) fullfil(data)
		})
	})
}

module.exports.getSearchedMoviesByRarbg = (data) => {
    return new Promise((fullfil, reject) => {
        let limit = data.params.page === 1 ? 25 : data.params.page === 2 ? 50 : 100
        let options = { category: rarbgApi.CATEGORY.MOVIES, limit: limit }
        data.params.movies = []
        rarbgApi.search(data.params.search, options)
            .then(results => {
                let index = 0
                let cache = {}
                let tmp = results.filter(element => { if (element.episode_info) return cache[element.episode_info.imdb] ? 0 : cache[element.episode_info.imdb] = 1 })
                tmp.forEach(elt => {
                    data.params.movies.push(elt.episode_info.imdb)
                    if (index++ === tmp.length - 1) fullfil(data)
                })
            })
            .catch(err => {
                if (err.error_code === 10 || err.error_code === 20) fullfil(data)
                else reject({ res: data.res, en_error: err, fr_error: err })
            })
    })
}

module.exports.getSearchedMoviesByYts = (data) => {
    return new Promise((fullfil, reject) => {
        request.get({
            url: `https://yts.am/api/v2/list_movies.json?query_term=${data.params.search}&page=${data.params.page}`
        }, (error, response, body) => {
            if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
            else if (body.search('SQL error') >= 0) fullfil(data)
            else {
                try {
                    let result = JSON.parse(body)
                    if (result.status !== 'ok') reject({ res: data.res, en_error: result.status_message, fr_error: result.status_message })
                    if (result.data.movie_count) {
                        if (result.data.movies) {
                            let index = 0
                            result.data.movies.forEach(movie => {
                                if (data.params.movies.findIndex(imdbID => { return imdbID === movie.imdb_code }) < 0) data.params.movies.push(movie.imdb_code)
                                if (index++ === result.data.movies.length - 1) fullfil(data)
                            })
                        }
                    }
                    fullfil(data)
                } catch (err) {
                    reject({ res: data.res, en_error: 'Wrong input', fr_error: 'Recherche invalide' })
                }
            }
        })
    })
}

module.exports.getInfosSearchedMovies = (data) => {
    return new Promise((fullfil, reject) => {
        if (data.params.movies && data.params.movies.length > 0) {
            index = 0
            data.params.movies_infos = []
            data.params.movies.forEach(imdbID => {
                request.get({
                    url: `http://www.omdbapi.com/?apikey=4402369e&plot=short&i=${imdbID}`,
                    json: true
                }, (error, response, body) => {
                    if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
                    else if (body.Response === 'True') {
                        data.params.movies_infos.push(body)
                        if (index++ === data.params.movies.length - 1) fullfil(data)
                    } else reject({ res: data.res, en_error: 'Movie not found..', fr_error: 'Aucun film n\'a été trouvé..'})
                })
            })  
        } else fullfil(data)
    })
}

module.exports.getMovie = (data) => {
    return new Promise((fullfil, reject) => {
        request.get({
            url: `http://www.omdbapi.com/?apikey=4402369e&plot=full&i=${data.params.movieId}`,
            json: true
        }, (error, response, body) => {
            if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
            else if (body.Response === 'True') { data.params.movie = body; fullfil(data) }
            else reject({ res: data.res, en_error: 'Movie not found..', fr_error: 'Aucun film n\'a été trouvé..'})
        })
    })
}

module.exports.getDownloadedTorrents = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('movies').find({ id: data.params.movie.imdbID }).toArray((err, results) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else if (results) { data.params.torrents = results; fullfil(data) }
            else fullfil(data)
        })
    })
}

module.exports.getTrailer = (data) => {
    return new Promise((fullfil, reject) => {
        request.get({
            url: `https://api.themoviedb.org/3/movie/${data.params.movie.imdbID}/videos?api_key=fcddca7f1ed48a172cfd4673adf01e53&site=Youtube&type=Trailer`,
            json: true
        }, (error, response, body) => {
            if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
            else if (body.error) reject({ res: data.res, en_error: body.status_message, fr_error: body.status_message })
            else if (body.status_code === 34 || body.status_code === 25) fullfil(data)
            else {
                let tmp = body.results.filter((elmt) => { return elmt.type === 'Trailer' })
                tmp.sort((a, b) => { return b.size - a.size });
                if (tmp.length) data.params.trailer = `https://www.youtube.com/embed/${tmp[0].key}?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1`
                fullfil(data)
            }
        })
    })
}

module.exports.getTorrentsByYTS = (data) => {
    return new Promise((fullfil, reject) => {
        request.get({
            url: `https://yts.am/api/v2/list_movies.json?query_term=${data.params.movie.imdbID}`
        }, (error, response, body) => {
            if (error) reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' })
            else if (body.search('SQL error') >= 0) fullfil(data)
            else {
                let result = JSON.parse(body)
                if (result.status !== 'ok') reject({ res: data.res, en_error: result.status_message, fr_error: result.status_message })
                if (result.data.movie_count) data.params.yts_torrents = result.data.movies[0].torrents
                fullfil(data)
            }
        })
    })
}

module.exports.getTorrentsByRARBG = (data) => {
    return new Promise((fullfil, reject) => {
        rarbgApi.search(data.params.movie.imdbID, null, 'imdb')
            .then(result => { data.params.rarbg_torrents = result; fullfil(data) })
            .catch(err => {
                if (err.error_code === 10 || err.error_code === 20) fullfil(data)
                else reject({ res: data.res, en_error: err, fr_error: err })
            })
    })
}

module.exports.downloadTorrent = (data) => {
    return new Promise((fullfil, reject) => {
        let engine = torrentStream(`magnet:?xt=urn:btih:${data.params.torrent.hash}`, { tmp: './movies/', verify: true })
        let started = false
        engine.on('ready', () => {
            let index = engine.files.indexOf(engine.files.reduce((a, b) => (a.length > b.length ? a : b)))
            engine.files.forEach((file, ind) => {
                if (ind === index) { file.select(); console.info(`Chosen file: ${file.name}`) } 
                else file.deselect()
            })
            data.params.file = engine.files[index]
            data.params.fileInfo = { fullPath: `${engine.path}/${data.params.file.path}`, partialPath: `${engine.path}/${engine.torrent.name}`, folder: engine.torrent.name, file: data.params.file.name }
            data.params.state = 'waiting'
            torrent_engine.push({ hash: data.params.torrent.hash, file: data.params.file, engine: engine })
            fullfil(data)
        })
        engine.on('download', piece => {
            started = true
            if (started) {
                data.params.state = 'downloading'
                try { this.saveTorrent(data)
                } catch (err) { reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' }) }
            }
        })
        engine.on('idle', fn => {
            data.params.state = 'over'
            try { this.saveTorrent(data); let ind = torrent_engine.findIndex(engine => { return engine.hash === data.params.torrent.hash }); torrent_engine.splice(ind, 1)
            } catch (err) { reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' }) }
        });
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
                let language = [ 'fr', 'en', 'ru', 'it', 'de', 'ja', 'pt', 'es' ]
                let items = 0 
                language.forEach(lang => {
                    if (results[lang]) {
                        request.get({
                            url: results[lang].utf8
                        }, (error, response, body) => {
                            if (error) reject({ res: data.res, en_error: error, fr_error: error })
                            else {
                                let path = data.params.fileInfo.partialPath
                                let name = data.params.fileInfo.folder + '-' + lang
                                fs.writeFile(path + '/' + name + '.srt', body, "utf-8", (err) => {
                                    if (err) reject({ res: data.res, en_error: err, fr_error: err })
                                    else {
                                        fs.createReadStream(path + '/' + name + '.srt')
                                            .pipe(srt2vtt())
                                            .pipe(fs.createWriteStream(path + '/' + name + '.vtt'))
                                        data.params.subtitles.push({ lang: lang, fullPath:  path + '/' + name + '.vtt', file: name + '.vtt' })
                                        rimraf(path + '/' + name + '.srt', (err) => { if (err) reject({ res: data.res, en_error: 'An error occured when deleting .srt files', fr_error: 'Un problème est survenu lors de la suppression des fichiers .srt' }) })
                                        if (++items === language.length) fullfil(data)
                                    } 
                                })
                            }
                        })
                    } else if (++items === language.length) fullfil(data)
                })
            })
            .catch(error => { reject({ res: data.res, en_error: 'API issues', fr_error: 'Un problème est survenu avec l\'API' }) })
        })
}

module.exports.saveTorrent = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('movies').findOne({ id: data.params.movieId, hash: data.params.torrent.hash }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else if (result) {
                if (data.params.state) {
                    mongodb.collection('movies').updateOne({ id: data.params.movieId, hash: data.params.torrent.hash }, { $set : { lastSeen: new Date(), state: data.params.state }}, (err, result) => {
                        if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                        else fullfil(data)
                    })
                } else {
                    mongodb.collection('movies').updateOne({ id: data.params.movieId, hash: data.params.torrent.hash }, { $set : { lastSeen: new Date() }}, (err, result) => {
                        if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                        else fullfil(data)
                    })
                }
            } else {
                mongodb.collection('movies').insertOne({ id: data.params.movieId, hash: data.params.torrent.hash, lastSeen: new Date(), fullPath: data.params.fileInfo.fullPath, partialPath: data.params.fileInfo.partialPath, folder: data.params.fileInfo.folder, file: data.params.fileInfo.file, size: data.params.torrent.nsize, quality: data.params.torrent.nquality, state: data.params.state, subtitles: data.params.subtitles }, (err, result) => {
                    if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
                    else fullfil(data)
                })
            }
        })
    })
}

module.exports.getInfos = (data) => {
    return new Promise((fullfil, reject) => {
        mongodb.collection('movies').findOne({ hash: data.params.hash }, (err, result) => {
            if (err) reject({ res: data.res, en_error: 'An error occured with the database', fr_error: 'Un problème est survenu avec la base de donnée' })
            else if (result) { data.params.info = result; fullfil(data) }
            else reject({ res: data.res, en_error: 'This hash doesn\'t match any torrent, sorry', fr_error: 'Ce magnet ne correspond à aucun torrent, désolé' })
        })
    })
}

module.exports.convert = (data) => {
    return new Promise((fullfil, reject) => {
        if (data.params.quality === 'x264' || data.params.quality === 'XVID') data.params.quality = '480'
        if (data.params.quality.search('BD') >= 0) data.params.quality = '1080'
        if (data.params.quality === '240' || data.params.quality === '360' || data.params.quality === '480' || data.params.quality === '720' || data.params.quality === '1080') {
            options = [{ '240' : { size: '426x240', bitrate_video: '365k', bitrate_audio: '128k' } },
                { '360' : { size: '640x360', bitrate_video: '730k', bitrate_audio: '196k' } },
                { '480' : { size: '854x480', bitrate_video: '2000k', bitrate_audio: '196k' } },
                { '720' : { size: '1280x720', bitrate_video: '3000k', bitrate_audio: '196k' } },
                { '1080' : { size: '1920x1080', bitrate_video: '4500k', bitrate_audio: '196k' } }]
            let settings = options.find(setting => { return setting[data.params.quality] })[data.params.quality.toString()]
            let convert = FFmpeg(`http://localhost:4000/torrent/stream/${data.params.hash}`)
            .format('webm')
                .size(settings.size)
                .videoCodec('libvpx')
                .videoBitrate(settings.bitrate_video)
                .audioCodec('libopus')
                .audioBitrate(settings.bitrate_audio)
                .outputOptions([ '-quality realtime' ])
                .audioChannels(2)
                .on('error', (err) => {
                    convert.kill()
                    if (err !== 'Output stream closed') reject({ err: data.res, en_error: err })
                });
            convert.pipe(data.res)
            fullfil(data)
        } else reject({ res: data.res, en_error: 'This quality isn\'t available', fr_error: 'Cette qualité n\'est pas disponible' })
    })
}

module.exports.stream = (data) => {
    return new Promise((fullfil, reject) => {
        if (data.params.info.state === 'over') {
            let path = data.params.info.fullPath
            fs.stat(path, (err, stats) => {
                if (err) reject({ res: data.res, error: 'Unavailable path' })
                else {
                    let fileSize = stats.size
                    if (data.params.range) {
                        let parts = data.params.range.replace(/bytes=/, '').split('-')
                        let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
                        let start = parseInt(parts[0], 10) < end ? parseInt(parts[0], 10) : 0 
                        let chunksize = (end - start) + 1
                        let file = fs.createReadStream(path, { start, end })
                        let headers = { 'Content-Range': `bytes ${start}-${end}/${fileSize}`, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/webm' }
                        data.res.writeHead(206, headers)
                        file.pipe(data.res)
                    } else {
                        let file = fs.createReadStream(path)
                        let headers = { 'Content-Length': fileSize, 'Content-Type': 'video/webm' }
                        data.res.writeHead(200, headers)
                        file.pipe(data.res)
                    }
                    fullfil(data)
                }
            })
        } else {
            let path = torrent_engine.find(torrent => torrent.hash === data.params.hash).file
            let fileSize = path.length
            if (data.params.range) {
                let parts = data.params.range.replace(/bytes=/, '').split('-')
                let start = parseInt(parts[0], 10)
                let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
                let chunksize = (end - start) + 1
                let file = path.createReadStream({ start, end })
                let headers = { 'Content-Range': `bytes ${start}-${end}/${fileSize}`, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/webm' }
                data.res.writeHead(206, headers)
                file.pipe(data.res)
            } else {
                let file = path.createReadStream()
                let headers = { 'Content-Length': fileSize, 'Content-Type': 'video/webm' }
                data.res.writeHead(200, headers)
                file.pipe(data.res)
            }
            fullfil(data)
        }
    })
}

module.exports.getSubtitles = (data) => {
    return new Promise((fullfil, reject) => {
        let tmp = data.params.info.subtitles.find(subtitle => subtitle.lang === data.params.language)
        let path = tmp.fullPath
        fs.stat(path, (err, stats) => {
            if (err) reject({ res: data.res, error: 'Unavailable path' })
            else {
                let fileSize = stats.size
                let file = fs.createReadStream(path)
                let headers = { 'Content-Length': fileSize, 'Content-Type': 'text/vtt' }
                data.res.writeHead(200, headers)
                file.pipe(data.res)
                fullfil(data)
            }
        })
    })
}

module.exports.getPercentage = (data) => {
    return new Promise((fullfil, reject) => {
        if (data.params.info.state !== 'over') {
            let tmp = torrent_engine.find(torrent => torrent.hash === data.params.hash)
            let tmp_engine = tmp.engine
            let tmp_file = tmp.file

            let firstPiece = Math.floor(tmp_file.offset / tmp_engine.torrent.pieceLength)
            let lastPiece = Math.floor((tmp_file.offset + tmp_file.length - 1) / tmp_engine.torrent.pieceLength)
            let progress = Array.from(tmp_engine.bitfield.buffer)
                .map(n => leftpad(n.toString(2), 8, "0"))
                .join("")
                .split("")
                .slice(firstPiece, lastPiece - firstPiece)
                .filter(bits => bits == 1)
                .length
            
            data.params.percentage = (progress / (lastPiece - firstPiece) * 100).toFixed(2)
            fullfil(data)
        } else fullfil(data)
    })
}
