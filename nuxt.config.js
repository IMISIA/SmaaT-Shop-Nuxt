import pkg from './package'

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/Css/Styles.css' ,
    '~/assets/Fonts/Linearicons/style.css' ,
    '~/assets/Fonts/Flaticon/flaticon.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/element-ui' ,
    '~/plugins/vuesax' ,
    { src : '~/plugins/Swiper' , mode : 'client' } ,
    { src : '~/plugins/other' , mode : 'client' } ,
    { src : '~/plugins/jquery-3.4.1.min.js' , mode : 'client' } ,
  ] ,

  devModules: [
    '@nuxtjs/vuetify'
  ],
  vuetify: {
    icons: {
      iconfont: 'mdi' | 'fa',  // default - only for display purposes
    }
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // baseURL : 'http://luxbuystore.ir/graphql' ,
    baseURL : 'http://metro-market.ir/graphql' ,
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
