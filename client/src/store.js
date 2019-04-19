import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const ip = "localhost:4000";

Vue.use(Vuex);

const state = {
  session: null,
  search: '',
  lang: ''
};

const mutations = {
  changeLogin (state, login) {
    state.session = login
  },
  changeLang (state, lang) {
    state.lang = lang
  }
};

const actions = {
  login: (store, vue) => {
    let uri = `http://${ip}/auth/login`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { login: vue.user.login, password: vue.user.password, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => {
          if (result.data.success) {
            localStorage.setItem('authenticatedToken', result.data.data.key)
            vue.$session.set('user', result.data.data.login)
            vue.$session.set('lang', result.data.data.lang)
            store.commit('changeLogin', result.data.data.login )
            store.commit('changeLang', result.data.data.lang )
          }
          fullfil(result) 
        })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  loginOauth: (store, vue) => {
    let uri = `http://${ip}/auth/` + vue.oauthMethod
    return new Promise((fullfil, reject) => {
      axios.post(uri, { oauthCode: vue.oauthCode, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => {
          if (result.data.success) {
            localStorage.setItem('authenticatedToken', result.data.data.key)
            vue.$session.set('user', result.data.data.login)
            vue.$session.set('lang', result.data.data.lang)
            store.commit('changeLogin', result.data.data.login )
            store.commit('changeLang', result.data.data.lang )
          }
          fullfil(result) 
        })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  getLogin: (store) => {
    let uri = `http://${ip}/auth/getLogin`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  register: (store, user) => {
    let formData = new FormData()
    formData.append('file', user.avatar)
    formData.append('login', user.login)
    formData.append('password', user.password)
    formData.append('passwordConfirmation', user.passwordConfirmation)
    formData.append('email', user.email)
    formData.append('firstname', user.firstname)
    formData.append('lastname', user.lastname)
    formData.append('authenticatedToken', localStorage.getItem('authenticatedToken'))
    let uri = `http://${ip}/auth/register`
    return new Promise((fullfil, reject) => {
      axios.post(uri, formData, { headers: { 'Content-Type' : 'multipart/form-data' }})
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  activate: (store, token) => {
    let uri = `http://${ip}/auth/activate`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { tokenVerif: token, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  forgotPass: (store, email) => {
    let uri = `http://${ip}/auth/forgot`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { email: email, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  reset: (store, vue) => {
    let uri = `http://${ip}/auth/reset`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { tokenLost: vue.$route.params.token, password: vue.password, passwordConfirmation: vue.passwordConfirmation, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  disconnect: (store, vue) => {
    vue.$session.remove('user')
    vue.$session.set('lang')
    localStorage.removeItem('authenticatedToken')
    store.commit('changeLogin', '' )
  },


  recommanded: (store, vue) => {
    let uri = `http://${ip}/torrent/`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  search: (store, vue) => {
    let uri = `http://${ip}/torrent/search`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { search: store.state.search, page: vue.page, lang: store.state.lang, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  discover: (store, vue) => {
    let uri = `http://${ip}/torrent/discover`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { with_genres: vue.genre, with_original_language: vue.language, vote_average: vue.disc_vote_average, release_date_min: vue.disc_release_date_min, release_date_max: vue.disc_release_date_max, page: vue.page, lang: store.state.lang, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  movie: (store, vue) => {
    let uri = `http://${ip}/torrent/movie`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { movieTitle: vue.title, movieId: vue.id, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  download: (store, vue) => {
    let uri = `http://${ip}/torrent/download`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { movieMagnet: vue.hash, movieId: vue.movie.imdbID, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  update: (store, vue) => {
    let uri = `http://${ip}/torrent/update`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { movieTitle: vue.movie.Title, movieId: vue.movie.imdbID, movieMagnet: vue.hash, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  watch: (store, streamFile) => {
    let uri = `http://${ip}/torrent/watch`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { streamFile: streamFile, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },



  watchedMovie: (store, vue) => {
    let uri = `http://${ip}/user/movies`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  lang: (store, vue) => {
    let uri = `http://${ip}/user/lang`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { lang: vue.lang, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { store.commit('changeLang', result.data.data.lang); vue.$session.set('lang', result.data.data.lang); fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  getMyInfos: (store) => {
    let uri = `http://${ip}/user/me`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  getInfos: (store, login) => {
    let uri = `http://${ip}/user/visit`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { user: login, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  updateLastname: (store, lastname) => {
    let uri = `http://${ip}/user/updateLastname`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { lastname: lastname, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  updateFirstname: (store, firstname) => {
    let uri = `http://${ip}/user/updateFirstname`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { firstname: firstname, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  updateEmail: (store, email) => {
    let uri = `http://${ip}/user/updateEmail`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { email: email, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  updateAvatar: (store, avatar) => {
    let uri = `http://${ip}/user/updateAvatar`
    let formData = new FormData()
    formData.append('file', avatar)
    formData.append('user', store.state.session)
    formData.append('authenticatedToken', localStorage.getItem('authenticatedToken'))
    return new Promise((fullfil, reject) => {
      axios.post(uri, formData, { headers: { 'Content-Type' : 'multipart/form-data' }})
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  updatePassword: (store, vue) => {
    let uri = `http://${ip}/user/updatePassword`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { password: vue.password, passwordConfirmation: vue.passwordConfirmation, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },


  getMessages: (store, movieId) => {
    let uri = `http://${ip}/msg/get`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { movieId: movieId, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  },
  sendMessage: (store, vue) => {
    let uri = `http://${ip}/msg/send`
    return new Promise((fullfil, reject) => {
      axios.post(uri, { message: vue.input, movieId: vue.movie.imdbID, authenticatedToken: localStorage.getItem('authenticatedToken') })
        .then(result => { fullfil(result) })
        .catch(err => { console.log(err); reject({ error: err })})
    })
  }
}

let store = new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
})

export default store