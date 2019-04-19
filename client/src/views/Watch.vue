<template>
    <div class="container-fluid">
        <div class='row torrent-background'>
            <div class="offset-md-2 col-md-8">
                <video controls autoplay="true">
                    <source :src="'http://localhost:4000/torrent/watch/' + streamFile" type="video/mp4"/>
                    <track v-if="$route.params.lang === 2" label="French" kind="subtitles" srclang="fr" :src="subtitles.fr" default>
                    <track v-else label="French" kind="subtitles" srclang="fr" :src="subtitles.fr">
                    <track v-if="$route.params.lang === 1" label="English" kind="subtitles" srclang="en" :src="subtitles.en" default>
                    <track label="English" kind="subtitles" srclang="en" :src="subtitles.en">
                </video>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            streamFile: '',
            
            base: '',
            subtitles: {}
        }
    },
    created() {
        this.streamFile = 'movies/' + this.$route.params.path + '/' + this.$route.params.movie
        this.base = this.streamFile.split('.')
        this.base.pop()
        this.base = this.base.join('.')
        this.subtitles.en = '/' + this.base + '-en.vtt'
        this.subtitles.fr = '/' + this.base + '-fr.vtt'
    }
}
</script>

<style>
.torrent-background {
    padding-top: 116px;
}
video {
    outline: 0
}
</style>
