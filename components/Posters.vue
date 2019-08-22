<template>
    <section class="row mx-2 rtl">
        <div class="col-md-3 mb-3 px-2" v-for="(poster,idx) in Valid_Posters" :key="idx">
            <nuxt-link to="/">
                <img
                    :src="URL + poster.image.large"
                    class="poster"
                    :alt="`poster-${idx}`"
                >
            </nuxt-link>
        </div>
    </section>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        props: ['Posters'] ,

        computed: {

            ...mapState([
                'URL'
            ]) ,

            Valid_Posters() {
                return this.Posters.filter( poster => !!poster.image && !!poster.image.large );
            }
        }
    }
</script>