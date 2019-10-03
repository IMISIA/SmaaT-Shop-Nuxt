<template>
  <div>
    <div class="header-banner" v-if="SiteSetting.header_banner && SiteSetting.header_banner.wide">
      <a :href="SiteSetting.banner_link">
        <v-img
          :src="$url + SiteSetting.header_banner.wide"
          max-height="50"
          max-width="auto"
          aspect-ratio="20"
          cover
        />
      </a>
    </div>

    <Header />

    <main id="app">
      <div id="categories-overlay"></div>
      <nuxt />
    </main>

    <Footer />

    <Auth />

    <v-btn id="back-to-top" class="web-grd-from-dark hidden" small
      fab dark @click="$vuetify.goTo(0 , { duration : 1000 })">
      <v-icon>expand_less</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import Header from '~/components/Header.vue';
  import Footer from '~/components/Footer.vue';
  import Auth from '~/components/Auth.vue';
  import Cookie from '~/plugins/cookie';
  import { mapState } from 'vuex';

  export default {
    head () {
      return {
        title: this.SiteSetting.title,
        meta: [
          { hid: 'description', name: 'description', content: this.SiteSetting.description } ,
          { name: 'theme-color', content: '#e91e63' } ,
        ]
      }
    } ,

    created() {
      // this.$nuxt.$axios.defaults.baseURL = 'https://cors-anywhere.herokuapp.com/' + this.$nuxt.$axios.defaults.baseURL;
      this.$nuxt.$res = process.client ? this.$nuxt.$el.clientWidth < 770 : false;
      if(process.client) {
        if(this.$reload) {
          Cookie.remove('JWT');
          location.reload();
        };
        if(this.$auth) {
          this.$nuxt.$axios.defaults.baseURL = this.$nuxt.$axios.defaults.baseURL + '/auth';
          this.$nuxt.$axios.setToken(Cookie.get('JWT') , 'Bearer');
        };
      }
    } ,

    mounted() {
      this.$nextTick(() => {
        this.$root.$loading.finish();
        if(process.client) {
          setTimeout(() => {
            $('main').css({ paddingTop: $('.smt-header').outerHeight() })
          }, 300);

          window.addEventListener('resize', () => {
            setTimeout(() => {
              $('main').css({ paddingTop: $('.smt-header').outerHeight() })
            }, 300);
          });

          window.onscroll = function () {
            if ( $(window).scrollTop() > 150 ) {
              $('#back-to-top').removeClass('hidden');  
            } else {
              $('#back-to-top').addClass('hidden');
            }
          };
        }
      })
    } ,

    components: {
      Header ,
      Footer ,
      Auth
    } ,

    computed: mapState([
      '$reload',
      '$auth' ,
      '$url',
      'SiteSetting'
    ])
  }

</script>
