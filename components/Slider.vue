<template>
    <section class="slider">
        <swiper :options="SwiperOptions">
            <swiper-slide v-for="(slide,idx) in slides" :key="idx" dir="rtl">
                <a :href="slide.link || '/'">
                    <img
                        :src=" slide.image && slide.image.wide
                            ? $url + slide.image.wide
                            : SiteSetting.logo && SiteSetting.logo.medium ? $url + SiteSetting.logo.medium : '/images/none.png' "
                        class="image-slider"
                        :alt="`slide-${idx}`"
                    />
                </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
            <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
        </swiper>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        props: ['slides'] ,
        
        data() {
            return {
                SwiperOptions: {
                    autoHeight: true ,
                    loop: true ,
                    effect: 'fade',
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false
                    } ,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    } ,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }
                }
            }
        } ,

        computed: {
            ...mapState([
                '$url' ,
                'SiteSetting'
            ])            
        }
    }
</script>