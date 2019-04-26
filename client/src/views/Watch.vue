<template>
    <div class="container-fluid">
        <div class='videojs'>
            <div class="video-inner-container" v-show="available">
                <video id="myPlayer" autoplay preload="auto" controls width="640" height="264" class="video-js vjs-fluid vjs-default-skin vjs-big-play-centered">
                    <source :src="`http://localhost:4000/torrent/convert/${this.$route.params.hash}/${this.$route.params.quality}`" type="video/webm" :label="this.$route.params.quality" :res="this.$route.params.quality">
                    <source v-if="this.$route.params.quality !== '144'" :src="`http://localhost:4000/torrent/convert/${this.$route.params.hash}/144`" type="video/webm" label="144" res="144">
                    <source v-if="this.$route.params.quality !== '240'" :src="`http://localhost:4000/torrent/convert/${this.$route.params.hash}/240`" type="video/webm" label="240" res="240">
                    <source v-if="this.$route.params.quality !== '360'" :src="`http://localhost:4000/torrent/convert/${this.$route.params.hash}/360`" type="video/webm" label="360" res="360">
                    <source v-if="this.$route.params.quality !== '480'" :src="`http://localhost:4000/torrent/convert/${this.$route.params.hash}/480`" type="video/webm" label="480" res="480">
                    <source v-if="this.$route.params.quality !== '720'" :src="`http://localhost:4000/torrent/convert/${this.$route.params.hash}/720`" type="video/webm" label="720" res="720">
                    <source v-if="this.$route.params.quality !== '1080'" :src="`http://localhost:4000/torrent/convert/${this.$route.params.hash}/1080`" type="video/webm" label="1080" res="1080">
                </video>
            </div>
            <div class='err' v-show="err">
                <h3>{{ err }}</h3>
            </div>
            <div class="animation" v-show="!available">
                
            </div>
        </div>
    </div>
</template>

<script>
import "video.js/dist/video-js.css";
import videojs from 'video.js'
import "videojs-resolution-switcher/lib/videojs-resolution-switcher.css"
import videoJsResolutionSwitcher from 'videojs-resolution-switcher'

export default {
    data() {
        return {
            info: {},

            available: false,

            player: '',
            subtitles: [],

            err: ''
        }
    },
    beforeCreate() {
        if (!this.$store.state.session) this.$router.push({ name: 'login' })
    },
    created() {
        setInterval(vue => { if (!vue.available) vue.isAvailable() }, 4000, this)
    },
    beforeDestroy() {
        if (this.player) this.player.dispose()
    },
    methods: {
        async isAvailable() {
            var result = await this.$store.dispatch('initialize', this)
            if (result) {
                if (result.data.success) {
                    this.info = result.data.data.info
                    this.subtitles = this.info.subtitles
                    if (this.info.state === 'waiting') console.log('waiting')
                    else {
                        this.available = true
                        if (!this.player) this.playerInitialize()
                    }
                } else this.err = this.$store.state.lang === 'en' ? result.data.en_error : result.data.fr_error
            }
        },
        playerInitialize() {
            this.player = videojs('myPlayer', {
                html5: {
                    nativeTextTracks: false
                },
                plugins: {
                    videoJsResolutionSwitcher: {
                        default: this.$route.params.quality,
                        dynamicLabel: true
                    }
                }
            })
            this.subtitles.forEach(subtitle => {
                this.player.addRemoteTextTrack({
                    kind: 'captions',
                    label: subtitle.lang,
                    language: subtitle.lang,
                    src: `http://localhost:4000/torrent/subtitles/${this.$route.params.hash}/${subtitle.lang}`,
                }, true)
            })
            this.player.play()
        }
    }
}
</script>

<style>
.video-inner-container {
    padding-top: 116px;
}
video {
    outline: 0
}
.err {
    width: 100%;
    text-align: center;
}
.err h3 {
    color: white;
    padding: 150px
}
</style>
