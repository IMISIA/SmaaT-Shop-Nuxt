<template>
  <div>
    <!-- <no-ssr> -->

      <div class="header-banner" v-if="SiteSetting.header_banner && SiteSetting.header_banner.wide">
        <a :href="SiteSetting.banner_link">
          <v-img
            :src="URL + SiteSetting.header_banner.wide"
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

    <!-- </no-ssr> -->
  </div>
</template>

<script>
  import Header from '~/components/Header.vue';
  import Footer from '~/components/Footer.vue';
  import {
    mapState
  } from 'vuex';

  export default {
    mounted() {
      this.$nextTick(() => {
        if(process.client) {
          setTimeout(() => {
            $('main').css({ paddingTop: $('.smt-header').outerHeight() })
          }, 200);
          window.addEventListener('resize', () => {
            setTimeout(() => {
              $('main').css({ paddingTop: $('.smt-header').outerHeight() })
            }, 200);
          });
        }
      })
    } ,

    components: {
      Header ,
      Footer
    } ,

    computed: {
      ...mapState([
        'URL',
        'SiteSetting'
      ])
    }
  }

</script>
