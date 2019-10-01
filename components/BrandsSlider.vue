<template>
    <section class="row m-0 rtl">
        <div class="col-12">
            <el-card class="product-slider">
                <div slot="header" class="text-right bold">
                    <span> برند های ویژه </span>
                    <div :style="{ display: 'contents !important' }">
                        <vs-button
                            class="next-product"
                            color="#BDBDBD"
                            type="relief"
                            icon="chevron_left"
                            size="small">
                        </vs-button>
                        <vs-button
                            class="prev-product ml-1"
                            color="#BDBDBD"
                            type="relief"
                            icon="chevron_right"
                            size="small">
                        </vs-button>
                    </div>
                </div>

                <swiper :options="SwiperOption">
                    <swiper-slide class="py-2" v-for="brand in Brands" :key="brand.id">
                        <nuxt-link :to="`/brand/${brand.id}`">
                            <v-img
                                class="m-auto"
                                :src="$url + brand.logo.small"
                                height="120"
                                width="120"
                                aspect-ratio="1"
                                contain
                            />          
                        </nuxt-link>
                    </swiper-slide>
                </swiper>
            </el-card>
        </div>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        data() {
            return {
                SwiperOption: {
                    slidesPerView: 6 ,
                    spaceBetween: 5 ,
                    slideBy: 2 ,
                    navigation: {
                        nextEl: '.next-product',
                        prevEl: '.prev-product'
                    } ,
                    breakpoints: {
                        1400: {
                            slidesPerView: 5
                        } ,
                        1200: {
                            slidesPerView: 4
                        } ,
                        800: {
                            slidesPerView: 3
                        } ,
                        500: {
                            slidesPerView: 2
                        }
                    }
                }
            }
        } ,

        computed: mapState({
            $url: '$url' ,
            Brands: state => state.Brands.filter( item => item.logo && item.logo.small )
        })
    }
</script>

<style lang="scss">
    .next-product , .prev-product {
        height: 23px !important;
        width: 24px !important;
        padding: 3px !important;
        i {
            font-size: 19px !important;
        }
    }
</style>