<template>
    <section class="row m-0 rtl mb-3">
        <div v-if="Products.data && Products.data.length && Products.size"
            :class="[ `col-md-${Products.size}` , dual ? (!firstOffers ? 'order-1' : 'order-2 pr-md-0 pt-3 pt-md-0') : '' ]">
            <el-card class="product-slider">
                <div slot="header" class="text-right bold">
                    <span> {{ Products.title }} </span>
                    <nuxt-link v-if="Link" :to="Link.to" class="fs-10 mr-2 web-color">
                        ( {{ Link.title }} )
                    </nuxt-link>
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
                    <swiper-slide class="py-2" v-for="(porduct,idx) in Products.data" :key="idx">
                        <Card :Product="porduct" :Hover="!$nuxt.$res"
                            :Info="!$nuxt.$res" :absolute-colors="$nuxt.$res"/>
                    </swiper-slide>
                </swiper>
            </el-card>
        </div>

        <div v-if="Offers.data && Offers.size"
            :class="[ `col-md-${Offers.size}` , dual ? (firstOffers ? 'order-1' : 'order-2 pr-md-0 pt-3 pt-md-0') : '' ]">
            <el-card class="offer-slider">
                <div slot="header" class="text-right web-color bold">
                    <span> {{ Offers.title }} </span>
                </div>

            </el-card>
        </div>
    </section>
</template>

<script>
    import Card from '~/components/Card.vue';
    export default {
        props: {
            Products: {
                type: Object ,
                default() {
                    return {
                        title: 'محصولات' ,
                        data: null ,
                        size: 9
                    }
                }
            } ,
            Offers: {
                type: Object ,
                default() {
                    return {
                        title: 'تخفیف ها' ,
                        data: null ,
                        size: 3
                    }
                }
            } ,
            firstOffers: {
                default: null
            } ,
            Link: {
                type: Object
                // Props : title , to
            }
        } ,

        components: {
            Card
        } ,

        data() {
            return {
                dual: !!this.Products.data && !!this.Offers.data ,

                SwiperOption: {
                    slidesPerView: this.Products.size / 2.4 ,
                    spaceBetween: 5 ,
                    // autoplay: {
                    //     delay: 10000,
                    // } ,
                    navigation: {
                        nextEl: '.next-product',
                        prevEl: '.prev-product'
                    } ,
                    breakpoints: {
                        1400: {
                            slidesPerView: this.Products.size / 3
                        } ,
                        1200: {
                            slidesPerView: this.Products.size / 3.5
                        } ,
                        1000: {
                            slidesPerView: this.Products.size / 4
                        } ,
                        800: {
                            slidesPerView: this.Products.size / 6
                        } ,
                        600: {
                            slidesPerView: this.Products.size / 6.5
                        } ,
                        500: {
                            slidesPerView: 1
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .el-card {
        &.product-slider , &.offer-slider {
            border-top: 2px solid;
            border-radius: 7px !important;
            .el-card__header {
                padding: 12px 20px !important;
            }
            .el-card__body {
                padding: 5px 10px !important;
            }
        } 
    }

    .includeIconOnly.small.next-product , .includeIconOnly.small.prev-product {
        height: 21px !important;
        width: 22px !important;
        padding: 3px !important;
        i {
            font-size: 16px !important;
        }
    }
</style>