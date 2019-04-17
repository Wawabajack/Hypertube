<template>
    <div v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div v-if="getData">
            <div class='row movie-container'>
                <div class='col-md-7 movie-background'>
                    <div class='movie-foreground'>
                        <iframe :src='trailer' frameborder='0' allowfullscreen></iframe>
                    </div>
                </div>
                <div class='col-md-5 movie-details'>
                    <div class="row">
                        <div class='col-lg-5'>
                            <ul>
                                <li class="title year">{{ movie.title }} <span>({{ movie.year }})</span></li>
                                <li class="rating"><i class="icon el-icon-star-on"></i>  {{ movie.rating }} <span>/10</span></li>
                                <li class="runtime genres boxoffice">{{ movie.runtime }} | {{ movie.genres }} | {{ movie.boxoffice }}</li>
                                <li class="plot">{{ movie.plot }}</li>
                                <li class="director"><span>{{ $store.state.lang === 'en' ? 'Director' : 'Réalisateur' }}</span>: {{ movie.director }}</li>
                                <li class="writer"><span>{{ $store.state.lang === 'en' ? 'Writers' : 'Scénariste' }}</span>: {{ movie.writer }}</li>
                                <li class="actors"><span>Casting</span>: {{ movie.actors }}</li>
                                <li class="awards">{{ movie.awards }}</li>
                            </ul>
                        </div>
                        <div class='col-lg-7'>
                            <img :src='movie.poster' :alt='movie.name'>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row torrent-container">
                <div class='col-md-5 torrents-details'>
                    <h5>Torrents</h5>
                    <h5 class='yts-title'>Yts.am</h5>
                    <table>
                        <tr>
                            <th class="quality">{{ $store.state.lang === 'en' ? 'Quality' : 'Qualité' }}</th>
                            <th class="size">{{ $store.state.lang === 'en' ? 'Size' : 'Taille' }}</th>
                            <th class="seeds">Seeders</th>
                            <th class="peers">Leechers</th>
                            <th class="dl"></th>
                        </tr>
                        <tr class="item-yts_torrent" v-for="(yts_torrent, index) in yts_torrents" :key="`yts_torrent-${index}`">
                            <td class="quality">{{ yts_torrent.quality }}</td>
                            <td class="size">{{ yts_torrent.size }}</td>
                            <td class="seeds">{{ yts_torrent.seeds }}</td>
                            <td class="peers">{{ yts_torrent.peers }}</td>
                            <td class="dl" :class="'download-yts' + index"><i class="el-icon-download el-icon-right" @click="download(yts_torrent.hash, 'yts', index)"></i></td>
                            <td class="dl" :class="'view-yts' + index" style="display:none"><i class="el-icon-view el-icon-right" @click="watch(yts_torrent)"></i></td>
                            <td class="dl" :class="'loading-yts' + index" style="display:none"><i class="el-icon-loading el-icon-right"></i></td>
                        </tr>
                    </table>
                    <h5 class='yts-title'>Rargb</h5>
                    <table>
                        <tr>
                            <th class="quality">{{ $store.state.lang === 'en' ? 'Quality' : 'Qualité' }}</th>
                            <th class="size">{{ $store.state.lang === 'en' ? 'Size' : 'Taille' }}</th>
                            <th class="seeds">Seeders</th>
                            <th class="peers">Leechers</th>
                            <th class="dl"></th>
                        </tr>
                        <tr class="item-rarbg_torrent" v-for="(rarbg_torrent, index) in rarbg_torrents" :key="`rarbg_torrent-${index}`">
                            <td class="quality">{{ rarbg_torrent.category.split('/').pop() }}</td>
                            <td class="size">{{ getSize(rarbg_torrent.size) }}</td>
                            <td class="seeds">{{ rarbg_torrent.seeders }}</td>
                            <td class="peers">{{ rarbg_torrent.leechers }}</td>
                            <td class="dl" :class="'download-rarbg' + index"><i class="el-icon-download el-icon-right" @click="download(rarbg_torrent.download.split('magnet:?xt=urn:btih:')[1], 'rarbg', index)"></i></td>
                            <td class="dl" :class="'view-rarbg' + index" style="display:none"><i class="el-icon-view el-icon-right" @click="watch(rarbg_torrent)"></i></td>
                            <td class="dl" :class="'loading-rarbg' + index" style="display:none"><i class="el-icon-loading el-icon-right"></i></td>
                        </tr>
                    </table>
                </div>
                <div class='col-md-7 torrent-background'>
                    <div class='torrent-foreground'>
                        <video v-if="available" controls autoplay="true">
                            <source :src="streamFile" type="video/mp4"/>
                            <track v-if="$store.state.lang === 'fr' && movie.languages === 'English'" label="French" kind="subtitles" srclang="fr" :src="subtitles.fr" default>
                            <track v-else label="French" kind="subtitles" srclang="fr" :src="subtitles.fr">
                            <track v-if="$store.state.lang === 'en' && movie.languages !== 'English'" label="English" kind="subtitles" srclang="en" :src="subtitles.en" default>
                            <track v-else label="English" kind="subtitles" srclang="en" :src="subtitles.en">
                        </video>
                    </div>
                </div>
            </div>
            <div class="row chat-container">
                <div class="offset-md-3 col-md-6 chat-background">
                    <ul class="ul-chat">
                        <li v-for="(message, index) in messages" :key="`message-${index}`" class="chats">
                            <div :class="getClass(index, message.exp)">
                                <router-link tag="a" :to="{ path: `/user?name=${message.exp}`}">{{ message.exp }}</router-link>
                                <span>{{ message.msg }}</span>
                            </div>
                        </li>
                    </ul>
                    <div class="chat-send">
                        <form class="form">
                            <input type="search" v-model="input" :placeholder="$store.state.lang === 'en' ? 'Send a message...' : 'Ecrire un message...'"/>
                            <button type="button" class="btn btn--primary btn--inside uppercase" @click="sendMessage()"><i class="fas fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="error" v-else><span>{{ err }}</span></div>
    </div>
</template>

<script>
import translate from 'translate'
translate.engine = 'google'
translate.key = 'AIzaSyAECIfL6JoLrIcSGjsWHtONieQdXbcwLhI'

export default {
    data() {
        return {
            title: '',
            id: '',
            movie: {},
            trailer: '',
            yts_torrents: {},
            rarbg_torrents: {},
            torrents: [],
            err: '',
            getData: false,
            hash: '',
            available: false,
            streamFile: '',
            subtitles: {},
            loading: true,
            messages: [],
            input: ''
        }
    },
    watch: {
        '$store.state.lang' (o, n) {
            translate(this.movie.plot, { from: n, to: o }).then(res => { this.movie.plot = res })
            translate(this.movie.awards, { from: n, to: o }).then(res => { this.movie.awards = res })
        }
    },
    async beforeCreate() {
        if (!this.$store.state.session) this.$router.push({ name: 'login' })
        else {
            if (this.$route.query.id) this.id = this.$route.query.id
            else this.title = this.$route.query.name
            var result = await this.$store.dispatch('movie', this)
            if (result) {
                if (result.data.success) {
                    this.loading = false
                    this.movie = result.data.data.movie
                    if (this.$store.state.lang === 'fr') translate(result.data.data.movie.plot, { from: 'en', to: 'fr' }).then(res => { this.movie = result.data.data.movie; this.movie.plot = res })
                    if (this.$store.state.lang === 'fr') translate(result.data.data.movie.awards, { from: 'en', to: 'fr' }).then(res => { this.movie.awards = res })
                    this.trailer = result.data.data.trailer
                    this.yts_torrents = result.data.data.yts_torrents
                    this.rarbg_torrents = result.data.data.rarbg_torrents
                    this.torrents = result.data.data.torrents
                    this.getData = true
                    var result2 = await this.$store.dispatch('getMessages', this.movie.imdbid)
                    if (result2) if (result2.data.success) this.messages = result2.data.data.messages
                } else this.err = result.data.error
            }
        }
    },
    methods: {
        async download(hash, src, index) {
            this.hash = hash
            var result = await this.$store.dispatch('download', this)
            if (result) {
                if (result.data.success) {
                    var download = '.download-' + src + index
                    var loading = '.loading-' + src + index
                    var view = '.view-' + src + index
                    $(download).hide()
                    $(loading).show()
                    setTimeout(() => { $(loading).hide(); $(view).show() }, 20000)
                    if (src === 'yts') { this.yts_torrents[index].torrentFilename = result.data.data.torrentFilename; this.yts_torrents[index].torrentPath = result.data.data.torrentPath }
                    else { this.rarbg_torrents[index].torrentFilename = result.data.data.torrentFilename; this.rarbg_torrents[index].torrentPath = result.data.data.torrentPath }
                    this.subtitles.fr = result.data.data.subtitles[0].lang === 'fr' ? result.data.data.subtitles[0].name : result.data.data.subtitles[1].name
                    this.subtitles.en = result.data.data.subtitles[0].lang === 'en' ? result.data.data.subtitles[0].name : result.data.data.subtitles[1].name
                }
            }
        },
        getSize(size) {
            if (size / 1000000000 > 1) return (size / 1000000000).toFixed(2) + ' GB'
            else return (size / 100000000).toFixed(2) + ' MB'
        },
        async watch(torrent) {
            var result = await this.$store.dispatch('watch', this)
            this.available = true
            this.streamFile = '/movies/' + torrent.torrentPath
        },
        async sendMessage() {
            var result = await this.$store.dispatch('sendMessage', this)
            if (result) if (!result.data.success) this.$store.state.lang === 'en' ? this.notify('Error!', result.data.en_error, 'error') : this.notify('Erreur!', result.data.fr_error, 'error')
            this.input = ''
            var result2 = await this.$store.dispatch('getMessages', this.movie.imdbid)
            if (result2) if (result2.data.success) this.messages = result2.data.data.messages
        },
        notify(title, message, type) {
			this.$notify({
				title: title,
				message: message,
				type: type
			})
        },
        getClass(index, login) {
            var classs = ''
            classs += !(index % 2) ? 'pair ' : 'impair '
            classs += login === this.$store.state.session ? 'me' : 'notme'
            return classs
        }
    }
}
</script>

<style scoped>
h5 {
    color: white;
    margin: auto;
    text-align: center;
    font-size: x-large;
}
.movie-container{
    color: white;
    padding-top: 50px;
    padding-bottom: 50px;
    background: linear-gradient(to right, black, #141414);
    border-bottom: 1px solid #141414;
    margin-top: 58px;
}
@media only screen and (max-width:765px) { 
    .movie-container{
        background: linear-gradient( black, #141414);
    }
}
.movie-foreground,
.movie-background iframe, .torrent-foreground, .torrent-background video {
    width: 100%;
    height: 100%;
}
ul {
    list-style: none;
    text-align: center;
}
.title.year {
    font-size: x-large;
}
.rating {
    font-size: x-small;
}
.rating i {
    color: lightcoral;
}
.rating span {
    font-size: xx-small;
}
.runtime.genres.boxoffice {
    font-size: x-small;
}
.plot {
    font-size: small;
    text-align: justify;
    padding-top: 10px
}
.director, .writer, .actors {
    font-size: x-small;
    text-align: justify;
    padding-top: 10px;
}
.director span, .writer span, .actors span {
    text-decoration: underline;
    color:lightcoral;
}
.awards {
    font-size: xx-small;
    padding-top: 10px;
}
.movie-details {
    text-align: center;
}
.torrent-container {
    padding-top: 50px;
    padding-bottom: 50px;
    color: white;
    background: linear-gradient(to left, black, #141414);
}
.yts-title {
    color: lightcoral;
    padding-top: 60px;
    font-size: medium;
}
.torrents-details th {
    color: #bebebe;
    font-size: small;
    font-style: italic;
}
.torrents-details tr {
    color: white;
    font-size: small;
}
.torrents-details table {
    width: 100%;
    text-align: center;
    margin-top: 20px;
}
.dl i {
    cursor:pointer;
    color:lightcoral;
}
.error {
    text-align: center;
    margin-top: 50vh;
    transform: translateY(-50%);
}
.error span {
    color:lightcoral;
}
video {
    outline: 0;
}
.row.chat-container {
    padding-top: 65px;
    height: 30rem;
    margin: auto;
}
.chat-background {
    border: 1px solid #bebebe;
    padding: 0;
    position: relative;
    display: table;
    float: left;
    width: 20rem;
    height: 25rem;
    overflow: hidden;
}
.chat-send {
    position: absolute;
    bottom: 0;
    width: 100%;
}
.btn {
    display: inline-block;
    background: transparent;
    color: inherit;
    font: inherit;
    border: 0;
    outline: 0;
    padding: 0;
    transition: all 200ms ease-in;
    cursor: pointer;
}
.btn--primary[data-v-cb822534] {
    background: lightcoral;
    color: #fff;
    -webkit-box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 5px 20px;
}
.btn--primary:hover {
    background: #6c7ff2;
}
.btn--primary:active {
    background: #7f8ff4;
    box-shadow: inset 0 0 10px 2px rgba(0, 0, 0, 0.2);
}
.btn--inside {
    margin-left: -100px;
}
form input {
    width: 100%;
    background: #141414;
    color: white;
    font: inherit;
    -webkit-box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
    border: 0;
    outline: 0;
    padding: 14px 14px;
    border-top: 1px solid #bebebe;
}
.btn--primary:hover {
    background: #bebebe;
}
.row {
    margin-right: 0
}
.chats > div {
    display: grid;
}
.chat-background ul {
    overflow: scroll;
    height: 22.5rem;
    padding-inline-start: 0
}
.chats a {
    color: #bebebe;
    text-decoration: none;
    font-size: small;
    padding: 5px 5px 0 5px;
}
.chats span {
    color: white;
    font-size: medium;
    padding: 5px 30px 0 30px;
}
.pair {
    background: rgba(128, 128, 128, 0.05);
}
.me {
    text-align: right;
}
.notme {
    text-align: left;
}
</style>
