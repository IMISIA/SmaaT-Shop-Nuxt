<template>
    <section class="row m-0 rtl">

        <div v-if="Product.data && Product.size"
            :class="[ `col-md-${Product.size}` , dual ? (!firstOffers ? 'order-1' : 'order-2 pr-md-0 pt-3 pt-md-0') : '' ]">
            <el-card class="product-slider">
                <div slot="header" class="text-right bold">
                    <span> {{ Product.title }} </span>
                    <div class="d-inline">
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
                    <swiper-slide class="py-2" v-for="(porduct,idx) in Product.data" :key="idx">
                        <Cart :Product="porduct"/>
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
    import Cart from '~/components/Cart.vue';

    export default {

        props: {
            Product: {
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
            }
        } ,

        components: {
            Cart
        } ,

        data() {
            return {
                dual: !!this.Product.data && !!this.Offers.data ,

                OfferSlider: {
                    Start: false ,
                    End: false
                } ,

                SwiperOption: {
                    slidesPerView: this.Product.size / 2.4 ,
                    spaceBetween: 5 ,
                    autoplay: {
                        delay: 5000,
                    } ,
                    navigation: {
                        nextEl: '.next-product',
                        prevEl: '.prev-product'
                    } ,
                    breakpoints: {
                        1400: {
                            slidesPerView: this.Product.size / 3
                        } ,
                        1200: {
                            slidesPerView: this.Product.size / 3.5
                        } ,
                        1000: {
                            slidesPerView: this.Product.size / 4
                        } ,
                        800: {
                            slidesPerView: this.Product.size / 6
                        } ,
                        600: {
                            slidesPerView: this.Product.size / 6.5
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
                padding: 10px !important;
            }
        } 
    }

    .next-product , .prev-product {
        height: 24px !important;
        width: 25px !important;
        padding: 3px !important;
        i {
            font-size: 19px !important;
        }
    }

</style>