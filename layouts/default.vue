<template>
  <div>
    <no-ssr>

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

      <main id="app" class="position-relative">
        <Header />
        <nuxt class="p-2"/>
      </main>

    </no-ssr>
  </div>
</template>

<script>
  import Header from '~/components/Header.vue';
  import {
    mapState
  } from 'vuex';

  export default {

    components: {
      Header
    } ,

    computed: {
      ...mapState([
        'Url',
        'SiteSetting'
      ])
    }

  }

</script>
