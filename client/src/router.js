import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      title: 'Hypertube - Home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      title: 'Hypertube - Login',
      component: () => import('./views/auth/Login.vue')
    },
    {
      path: '/login/:oauthMethod/:oauthCode',
      name: 'loginOauth',
      title: 'Hypertube - Oauth',
      component: () => import('./views/auth/Login.vue')
    },
    {
      path: '/oauth/:oauthMethod',
      name: 'Oauth',
      title: 'Hypertube - Oauth',
      component: () => import('./views/Oauth.vue')
    },
    {
      path: '/register',
      name: 'register',
      title: 'Hypertube - Register',
      component: () => import('./views/auth/Register.vue')
    },
    {
      path: '/disconnect',
      name: 'disconnect',
      title: 'Hypertube - Disconnect',
      component: () => import('./views/auth/Disconnect.vue')
    },
    {
      path: '/activate/:token',
      name: 'activate',
      title: 'Hypertube - Activate',
      component: () => import('./views/auth/Activate.vue')
    },
    {
      path: '/forgotPass',
      name: 'forgotPass',
      title: 'Hypertube - Forgotten password',
      component: () => import('./views/auth/ForgotPass.vue')
    },
    {
      path: '/reset/:token',
      name: 'reset',
      title: 'Hypertube - Reset password',
      component: () => import('./views/auth/Reset.vue')
    },
    {
      path: '/account',
      name: 'account',
      title: 'Hypertube - Account',
      component: () => import('./views/Account.vue')
    },
    {
      path: '/user',
      name: 'user',
      title: 'Hypertube - User',
      component: () => import('./views/User.vue')
    },
    {
      path: '/search',
      name: 'search',
      title: 'Hypertube - Search',
      component: () => import('./views/Search.vue')
    },
    {
      path: '/movie',
      name: 'movie',
      title: 'Hypertube - Movie',
      component: () => import('./views/Movie.vue')
    },
    {
      path: '/watch/:lang/:path/:movie',
      name: 'watch',
      title: 'Hypertube - Watching',
      component: () => import('./views/Watch.vue')
    },
    {
      path: '*',
      name: 'p404',
      title: 'Hypertube - page not found',
      component: () => import('./views/p404.vue')
    }
  ]
})
