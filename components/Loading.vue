<template>
    <transition name="fade" mode="in-out">
        <div id="loading" v-if="loading">
            <div v-show="init">
                <img
                    class="loading-logo"
                    :src=" SiteSetting.logo && SiteSetting.logo.medium ? $url + SiteSetting.logo.medium : '/images/none.png' "
                    alt="logo"
                >
            </div>

            <div class="gooey">
                <span class="dot"></span>
                <div class="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        data() {
            return {
                loading: true ,
                init: false ,
            }
        } ,

        methods: {
            start() {
                this.loading = true;
            } ,

            finish() {
                setTimeout(() => {
                    this.loading = false;
                    this.init = true;
                }, 500);
            }
        } ,

        computed: mapState([
            '$url' ,
            'SiteSetting'
        ])
    }
</script>