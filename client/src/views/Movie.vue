<template>
    <div class="container-fluid">
        <div class="contain">
            <div class='row movie-container' v-if="getData">
                <div class='col-md-7 movie-background'>
                    <div class='movie-foreground'>
                        <iframe :src='trailer' frameborder='0' allowfullscreen v-if="trailer"></iframe>
                        <p class="trailer_err" v-else>{{ $store.state.lang === 'en' ? 'No trailer available..' : 'Pas de trailer disponible..' }}</p>
                    </div>
                </div>
                <div class='col-md-5 movie-details'>
                    <div class="row">
                        <div class='col-lg-5'>
                            <ul>
                                <li class="title year">{{ movie.Title }} <span>({{ movie.Year }})</span></li>
                                <li class="production">({{ movie.Production }})</li>
                                <li class="rating"><i class="icon el-icon-star-on"></i>  {{ movie.imdbRating }} <span>/10</span></li>
                                <li class="runtime genres boxoffice">{{ movie.Runtime }} | {{ movie.Genre }} | {{ movie.BoxOffice }}</li>
                                <li class="plot">{{ movie.Plot }}</li>
                                <li class="director"><span>{{ $store.state.lang === 'en' ? 'Director' : 'Réalisateur' }}</span>: {{ movie.Director }}</li>
                                <li class="writer"><span>{{ $store.state.lang === 'en' ? 'Writers' : 'Scénariste' }}</span>: {{ movie.Writer }}</li>
                                <li class="actors"><span>Casting</span>: {{ movie.Actors }}</li>
                                <li class="awards">{{ movie.Awards }}</li>
                            </ul>
                        </div>
                        <div class='col-lg-7'>
                            <img :src='movie.Poster' :alt='movie.Title'>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row torrent-container" v-if="getTorrent">
                <div class='offset-md-1 col-md-5 torrents-details'>
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
                            <td v-if="torrents.find(torrent => torrent.hash === yts_torrent.hash)" class="dl" :class="'view-yts' + index"><i class="el-icon-view" @click="watch(yts_torrent, 'yts')"></i></td>
                            <td v-else class="dl" :class="'download-yts' + index"><i class="el-icon-download" @click="download(yts_torrent, 'yts', index)"></i></td>
                            <td class="dl" :class="'view-yts' + index" style="display:none"><i class="el-icon-view" @click="watch(yts_torrent, 'yts')"></i></td>
                            <td class="dl" :class="'loading-yts' + index" style="display:none"><i class="el-icon-loading"></i></td>
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
                            <td v-if="torrents.find(torrent => torrent.hash === rarbg_torrent.download.split('magnet:?xt=urn:btih:')[1].split('&')[0])" class="dl" :class="'view-rarbg' + index"><i class="el-icon-view" @click="watch(rarbg_torrent, 'rarbg')"></i></td>
                            <td v-else class="dl" :class="'download-rarbg' + index"><i class="el-icon-download" @click="download(rarbg_torrent, 'rarbg', index)"></i></td>
                            <td class="dl" :class="'view-rarbg' + index" style="display:none"><i class="el-icon-view" @click="watch(rarbg_torrent, 'rarbg')"></i></td>
                            <td class="dl" :class="'loading-rarbg' + index" style="display:none"><i class="el-icon-loading"></i></td>
                        </tr>
                    </table>
                </div>
                <div class="col-md-5 chat-background">
                    <transition-group name="list" tag="div" id="chat-group" class="chat-group">
                        <p v-for="(message, index) in messages" :key="message.id + '-' + index" :class="message.exp === $store.state.session ? 'me' : 'notme'">
                            <a :href="`/user?name=${message.exp}`"><span>{{ message.exp }}</span></a>
                            {{ message.msg }}
                        </p>
                    </transition-group>
                    <div class="chat-send">
                        <input type="search" v-model="input" :placeholder="$store.state.lang === 'en' ? 'Send a message...' : 'Ecrire un message...'" @keypress.enter="sendMessage()">
                        <i class="fas fa-paper-plane" @click="sendMessage()"></i>
                    </div>
                </div>
            </div>
            <div class="error" v-if='err'><span>{{ err }}</span></div>
            <div class="animation" v-if="loading">
				<box-loading/>
			</div>
        </div>
    </div>
</template>

<script>
import BoxLoading from '@/components/BoxLoading.vue'
import translate from 'translate'
translate.engine = 'google'
translate.key = 'AIzaSyAECIfL6JoLrIcSGjsWHtONieQdXbcwLhI'

export default {
    data() {
        return {
            loading: true,

            title: '',
            tmpId: '',
            release: '',

            id: '',
            movie: {},
            trailer: '',
            yts_torrents: {},
            rarbg_torrents: {},
            torrents: [],
            torrent: {},

            getData: false,
            getTorrent: false,

            hash: '',
            subtitles: {},

            messages: [],
            input: '',

            available: false,
            player: '',
            subtitles: '',
            
            err: '',
        }
    },
    watch: {
        '$store.state.lang' (o, n) {
            translate(this.movie.Plot, { from: n, to: o }).then(res => { this.movie.Plot = res })
            translate(this.movie.Awards, { from: n, to: o }).then(res => { this.movie.Awards = res })
        }
    },
    async beforeCreate() {
        if (!this.$store.state.session) this.$router.push({ name: 'login' })
        else {
            if (this.$route.query.id && this.$route.query.tmp) {
                if (this.$route.query.release) this.$router.push({ name: 'home' })
                this.id = this.$route.query.id; this.tmpId = this.$route.query.tmp
            } else if (this.$route.query.name && this.$route.query.tmp) { 
                if (!this.$route.query.release) this.$router.push({ name: 'home' })
                this.title = this.$route.query.name
                this.tmpId = this.$route.query.tmp
                this.release = this.$route.query.release
            } else this.$router.push({ name: 'home' })
            var result = await this.$store.dispatch('movie', this)
            if (result) {
                this.loading = false
                if (result.data.success) {
                    this.getData = true
                    this.movie = result.data.data.movie
                    if (this.$store.state.lang === 'fr') translate(result.data.data.movie.Plot, { from: 'en', to: 'fr' }).then(res => { this.movie = result.data.data.movie; this.movie.Plot = res })
                    if (this.$store.state.lang === 'fr') translate(result.data.data.movie.Awards, { from: 'en', to: 'fr' }).then(res => { this.movie.Awards = res })
                    this.trailer = result.data.data.trailer
                    if (result.data.data.yts_torrents) this.yts_torrents = result.data.data.yts_torrents.filter(torrent => { return torrent.size_bytes / 1000000000 < 10 && torrent.quality !== '3D' })
                    if (result.data.data.rarbg_torrents) this.rarbg_torrents = result.data.data.rarbg_torrents.filter(torrent => { return torrent.size / 1000000000 < 10 && torrent.category.split('/').pop() !== '3D' })
                    if (!result.data.data.yts_torrents && !result.data.data.rarbg_torrents) this.err = this.$store.state.lang === 'en' ? 'No torrents found for this movie, sorry..' : 'Aucun torrent n\'a été trouvé pour ce film, désolé..'
                    else this.getTorrent = true
                    if (result.data.data.tmpId) this.tmpId = result.data.data.tmpId
                    this.torrents = result.data.data.torrents
                    var result2 = await this.$store.dispatch('getMessages', this.movie.imdbID)
                    if (result2) if (result2.data.success) this.messages = result2.data.data.messages
                } else this.err = this.$store.state.lang === 'en' ? result.data.en_error : result.data.fr_error
            }
        }
    },
	updated() {
        if (this.getTorrent) { var element = document.getElementById('chat-group'); element.scrollTop = element.scrollHeight }
	},
    methods: {
        async download(torrent, src, index) {
            this.torrent = torrent
            this.torrent.hash = src === 'yts' ? torrent.hash : torrent.download.split('magnet:?xt=urn:btih:')[1].split('&')[0]
            this.torrent.nquality = src === 'yts' ? torrent.quality.split('p')[0] : torrent.category.split('/').pop()
            this.torrent.nsize = src === 'yts' ? torrent.size_bytes : torrent.size
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
                }
            }
        },
        getSize(size) {
            if (size / 1000000000 > 1) return (size / 1000000000).toFixed(2) + ' GB'
            else return (size / 100000000).toFixed(2) + ' MB'
        },
        async watch(torrent, src) {
            if (this.$store.state.lang === 'en') var lang = this.movie.Language.search('English') >= 0 ? -1 : 1
            else var lang = this.movie.Language.search('French') >= 0 ? -1 : 2
            this.torrent.hash = src === 'yts' ? torrent.hash : torrent.download.split('magnet:?xt=urn:btih:')[1].split('&')[0]
            this.torrent.nquality = src === 'yts' ? torrent.quality.split('p')[0] : torrent.category.split('/').pop()
            if (this.torrent.nquality === 'x264' || this.torrent.nquality === 'XVID') this.torrent.nquality = '480'
            if (this.torrent.nquality.search('BD') >= 0) this.torrent.nquality = '1080'
            var result = await this.$store.dispatch('watch', this)
            this.$router.push({ name: 'watch', params: { hash: this.torrent.hash, quality: this.torrent.nquality } })
        },
        async sendMessage() {
            var result = await this.$store.dispatch('sendMessage', this)
            if (result) if (!result.data.success) this.$store.state.lang === 'en' ? this.notify('Error!', result.data.en_error, 'error') : this.notify('Erreur!', result.data.fr_error, 'error')
            this.input = ''
            var result2 = await this.$store.dispatch('getMessages', this.movie.imdbID)
            if (result2) if (result2.data.success) this.messages = result2.data.data.messages
        },
        notify(title, message, type) {
			this.$notify({
				title: title,
				message: message,
				type: type
			})
        }
    },
    components: {
        BoxLoading
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
    padding-top: 400px;
}
.error span {
    color:lightcoral;
}
video {
    outline: 0;
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
.inner-chat input {
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
.chat-background {
    overflow: inherit;
    height: 50vh;
    width: 100%;
    margin-top: 116px;
}
.chat-background > .chat-send {
    margin: 20px 0;
    width: 100%;
    padding: 0px 30px;
    border-radius: 8px;
    color:lightcoral;
    border-bottom: 1px solid lightcoral;
    border-left: 1px solid lightcoral;
}
.chat-background > .chat-send > i {
    color: lightcoral;
}
.chat-send > input {
    border: none;
    height: 40px;
    width: 80%;
    color: white;
    background: none;
}
.chat-send > input::-webkit-input-placeholder {
    color: white;
}
.chat-send > input:-ms-input-placeholder {
    color: white;
}
.chat-send > input::-ms-input-placeholder {
    color: white;
}
.chat-send > input::placeholder {
    color: white;
}
.chat-send > input:focus {
    outline: none;
}
.chat-send > .fas {
    margin-top: 10px;
    float: right;
    color: #bebebe;
    font-size: 22px;
}
.chat-group {
    height: 40vh;
    overflow-y: scroll;
    padding-right: 15px;
    font-size: 14px;
    padding-top: 15px;
}
.chat-group > .notme {
    background: #f8f8f8;
    width: auto;
    max-width: 250px;
    padding: 5px 20px;
    border-radius: 30px;
    color: #454545;
    clear: both;
    float: left;
}
.chat-group > .me {
    background-color: lightcoral;
    display: block;
    width: auto;
    max-width: 600px;
    padding: 5px 20px;
    border-radius: 30px;
    color: white;
    clear: both;
    float: right;
}
::-webkit-scrollbar {
    width: 12px;
}
::-webkit-scrollbar-track {
    -webkit-border-radius: 10px;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: rgba(240,128,128,0.4); 
}
.me a {
    color: white;
    text-decoration: none;
    position: relative;
}
.me span {
    display: none;
}
.notme a {
    color: white;
    text-decoration: none;
    position: relative;
}
p.notme span {
    font-size: x-small;
    top: -22px;
    color: white;
    left: -19px;
    position: absolute;
}
p.trailer_err {
    text-align: center;
    height: 100%;
    margin-top: 25%;
    font-size: small;
    font-style: italic;
}
.contain {
    text-align: center;
    padding-top: 116px;
    min-height: 600px;
}
</style>