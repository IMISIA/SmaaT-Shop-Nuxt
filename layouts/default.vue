<template>
  <div>
    <!-- <no-ssr> -->

      <div v-if="SiteSetting.header_banner && SiteSetting.header_banner.wide">
        <a :href="SiteSetting.banner_link">
          <v-img
            :src="Url + SiteSetting.header_banner.wide"
            max-height="50"
            max-width="auto"
            aspect-ratio="20"
            cover
          />
        </a>
      </div>

      <Header />

      <main id="app">
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

    components: {
      Header ,
      Footer
    } ,

    computed: {
      ...mapState([
        'Url',
        'SiteSetting'
      ])
    }

  }

</script>
