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
      this.$store.state.session = this.$session.get('user');
      this.$store.state.lang = this.$session.get('lang')
      if (localStorage.getItem('authenticatedToken')) {
        var result = await this.$store.dispatch('getLogin')
        if (result) if (result.data.success) this.$store.state.session = result.data.data.login
      }
    },
    async updated() {
      this.user_session = this.$store.state.session;
    },
    computed: {
      ...Vuex.mapState({
        user: state => state.session
      })
    },
    components: {
      Navbar,
      Footerbar
    }
  }
</script>