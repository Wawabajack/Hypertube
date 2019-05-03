<template>
  <div id="app">
    <navbar v-if="user_session"/>
    <transition name="el-fade-in" mode="out-in">
      <router-view/>
    </transition>
    <footerbar v-if="user_session"/>
  </div>
</template>

<script>
  import Vuex from 'vuex'
  import Navbar from '@/components/nav/Nav.vue'
  import Footerbar from '@/components/nav/Footer.vue'

  export default {
    name: "App",
    data() {
      return {
        user_session: '',
      }
    },
    watch: {
        '$route.meta.title' (to, from) {
          this.title = this.$route.meta.title;
        },
    },
    async created() {
      if (localStorage.getItem('authenticatedToken')) {
        var result = await this.$store.dispatch('getLogin')
        if (result) {
          if (result.data.success) {
            this.$socket.emit('USER_RELOAD', result.data.data.id)
            this.$session.set('user', result.data.data.login)
            this.$session.set('lang', result.data.data.lang)
            this.$store.commit('changeLogin', result.data.data.login)
            this.$store.commit('changeLang', result.data.data.lang)
            this.user_session = this.$session.get('user')
          }
        }
      }
    },
    mounted() {
			this.$options.sockets.DISCONNECTED = (data) => {
        this.$router.push({ name: 'login' })
        this.$store.dispatch('disconnect', this)
      },
      this.$options.sockets.ALREADY_CONNECTED = (data) => {
        this.notify( "Already connected", "Enjoy Hypertube :-)", "success" )
        this.$router.push({ name: "home" })
      },
      this.$options.sockets.CONNECTED = (data) => {
        this.notify( "Login successful", "Welcome and enjoy Hypertube :-)", "success" )
        this.$router.push({ name: "home" })
      },
      this.$options.sockets.CHECK_LOCALSTORAGE = async (data) => {
        if (localStorage.getItem('authenticatedToken') && localStorage.getItem('authenticatedToken') === data) {
          var result = await this.$store.dispatch('getLogin')
          if (result && result.data.success) {
            this.$session.set('user', result.data.data.login)
            this.$session.set('lang', result.data.data.lang)
            this.$store.commit('changeLogin', result.data.data.login)
            this.$store.commit('changeLang', result.data.data.lang)
            this.notify( "Already connected", "Enjoy Hypertube :-)", "success" )
            this.$router.push({ name: "home" })
          }
        }
      }
    },
    async updated() {
      this.user_session = this.$store.state.session
    },
    computed: {
      ...Vuex.mapState({
        user: state => state.session
      })
    },
    methods: {
      notify(title, message, type) {
        this.$notify({
          title: title,
          message: message,
          type: type
        })
      }
    },
    components: {
      Navbar,
      Footerbar
    }
  }
</script>

<style>
#app {
    min-height: 100%;
    position: relative;
}
.container-fluid {
    padding-bottom: 116px;
}
</style>
