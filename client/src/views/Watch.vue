<template>
    <div class="container-fluid">
        <div class='row torrent-background'>
            <div class="offset-md-2 col-md-8" v-if='available'>
                <video controls autoplay="true" >
                    <source :src="'http://localhost:4000/torrent/convert/' + $route.params.hash" type="video/webm"/>
                    <!--<track v-if="$route.params.lang === 2" label="French" kind="subtitles" srclang="fr" :src="subtitles.fr" default>
                    <track v-else label="French" kind="subtitles" srclang="fr" :src="subtitles.fr">
                    <track v-if="$route.params.lang === 1" label="English" kind="subtitles" srclang="en" :src="subtitles.en" default>
                    <track label="English" kind="subtitles" srclang="en" :src="subtitles.en">-->
                </video>
            </div>
            <div class='err' v-else>
                <h3>{{ err }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            available: false,

            err: ''
        }
    },
    beforeCreate() {
        if (!this.$store.state.session) this.$router.push({ name: 'login' })
    },
    created() {
        setInterval(vue => { if (!vue.available) vue.isAvailable() }, 1000, this)
    },
    methods: {
        async isAvailable() {
            var result = await this.$store.dispatch('check', this.$route.params.hash)
            if (result) {
                if (result.data.success) {
                    if (result.data.data.info.state === 'waiting') console.log('waiting')
                    else this.available = true
                } else this.err = this.$store.state.lang === 'en' ? result.data.en_error : result.data.fr_error
            }
        }
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
.err {
    width: 100%;
    text-align: center;
}
.err h3 {
    color: white;
    padding: 150px
}
</style>
