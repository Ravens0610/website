const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'universal',
  jwtKey: '__CHANGE_ME__',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - NeroVi',
    title: 'NeroVi',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/auth', 'nuxt-izitoast'],
  /*
   * Nuxt.js Axios
   */
  axios: {},
  /*
   * Nuxt.js Auth
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/v1/auth/login',
            method: 'post',
            propertyName: 'data.token'
          },
          user: {
            url: '/api/v1/auth/user',
            method: 'get',
            propertyName: 'data'
          },
          logout: false
        }
      }
    }
  },
  /*
   * Notification library
   */
  izitoast: {
    position: 'topRight',
    transitionIn: 'bounceInLeft',
    transitionOut: 'fadeOutRight'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
