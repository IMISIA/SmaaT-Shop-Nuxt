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
      // Cookie.set('JWT' , 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjUzOGVlZDIwZWQ5ZGJkNmFiYWZhNDc0MDNlMDk4OTM2MzRhZGU5MzZkMzk0YjFmMTdmZWM3MmQxZjgwZDVlZDFjZGZhNDg4OTE2NzY4Y2RmIn0.eyJhdWQiOiIxIiwianRpIjoiNTM4ZWVkMjBlZDlkYmQ2YWJhZmE0NzQwM2UwOTg5MzYzNGFkZTkzNmQzOTRiMWYxN2ZlYzcyZDFmODBkNWVkMWNkZmE0ODg5MTY3NjhjZGYiLCJpYXQiOjE1Njc1MTc4MjEsIm5iZiI6MTU2NzUxNzgyMSwiZXhwIjoxNTk5MTQwMjIxLCJzdWIiOiI5YTczMjljMzA0YjQiLCJzY29wZXMiOltdfQ.dCEh-wKQmgDrUvfZFIlhKQFhDO6nojV5u2HZMadnmYHY4RcIMpxK0KSXUgriVZV3NtcfZ9cE0JTxKb-IOGs2_jLefsvuQ4Y2oL3Ppiall6SLHDYHjfprdGWZGg5AA1uW1qRd5IV5KoK_B068mCr50J_IUaoP91xv0obsWIUhHMqbmb_-XOydKviizIkFtYxJ0dpN2vV-S_oURxDyvHHhnPBTcAZmRtyLUJXUMocZaxBuF5CFqgyPGnM2qjIOw6rDILK1mys_RALdZEIvYOq82BrEBXy6jDi9fgiM5PQ-tfWTVLTzeMlVzsXiJly_0wJ2dYdU2rrGUeC5bjH9tT6WajV5p5GM9S4_O4JrPiwSQR24EAS-k_v251EfoiOLj7_OfYXtSCU2Ih3hVLrjh9WE4kAPmIhE2w3_lexJB5QLhmyl56GzhsNib-_BkpvZYP9j9u-IXjIpqZ4gOWOSq140jj-MQGq3ca7YXEm7kZntRkjuI7wgtOQ3Azki8DMfPgpfywGv6rlN_5LWZcz0qP2CdH8gcGxsmVoN9ZYgWQDtW0L0fvx1evcnr1bNIhFxndTZmavFSM7nrvbAGx-pNaDKNNyRXmqasKKShW1GF4ylZxlXLU7wEVQ8-a0GxfKeIubwAGoSyHjpHXEgYJTZ4404kjLc-ugViEr2K7mm38Jt8kg' , 1)
      // Cookie.remove('JWT');
      this.$nuxt.$res = process.client ? this.$nuxt.$el.clientWidth < 770 : false;
      if(process.client && this.$reload) {
        Cookie.remove('JWT');
        location.reload();
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
      '$url',
      'SiteSetting'
    ])
  }

</script>
