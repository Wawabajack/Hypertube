<template>
    <div class="container-fluid">
        <p>Si vous n'êtes pas automatiquement redirigé, cliquez <router-link :to='url'>ici</router-link>.</p>
    </div>
</template>

<script>
	export default {
		data () {
			return {
                url: ''
			}
		},
        created() {
            if (this.$store.state.session) this.$router.push({ name: 'home'})
            if (this.$route.query.code) {
                var oauthCode = this.$route.query.code
                var oauthMethod = this.$route.path.substring(7)
                this.url = '/login/' + oauthMethod + '/' + oauthCode
                var self = this
                setTimeout((self, oauthMethod, oauthCode) => {
                    self.$router.push({ name: 'loginOauth', params: { oauthMethod: oauthMethod, oauthCode: oauthCode } })
                }, 2000, self, oauthMethod, oauthCode)
            }
        }
	}
</script>

<style scoped>
p {
    margin-top: 50vh;
    transform: translateY(-50%);
    text-align: center;
    color: white;
}
a {
    color: #bebebe;
    text-decoration: underline
}
</style>

