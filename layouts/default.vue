<template>
  <div>

    <div v-if="SiteSetting.header_banner && SiteSetting.header_banner.wide">
      <a :href="SiteSetting.banner_link">
        <v-img
          :src="Url + SiteSetting.header_banner.wide"
          max-height="50"
          max-width="auto"
          aspect-ratio="1"
          cover
        />
      </a>
    </div>

    <nuxt/>

  </div>
</template>

<script>

  import { mapState } from 'vuex';

  export default {

    computed : {
      ...mapState([
        'Url' ,
        'SiteSetting'
      ])
    }

  }
</script>