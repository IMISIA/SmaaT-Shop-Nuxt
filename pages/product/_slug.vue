<template>
    <section class="single-product p-3">
        <el-card :body-style="{ padding : '20px 0px' }">
            <div class="row mx-0 rtl">
                <div class="col-md-4 pb-3 pb-md-0" :class="[ Res ? 'border-bottom' : 'border-left' ]">
                    <swiper :options="SwiperOption" ref="SwiperBig">
                        <swiper-slide v-for="(img,idx) in Valid_Images" :key="idx">
                            <v-img
                                :src="img"
                                width="100%"
                                max-height="350px"
                                contain
                            />
                        </swiper-slide>
                    </swiper>

                    <swiper :options="SwiperOptionThumbs" class="gallery-thumbs" ref="SwiperThumbs">
                        <swiper-slide v-for="(img,idx) in Valid_Images" :key="idx">
                            <div class="thumb">
                                <v-img
                                    :src="img"
                                    max-width="80"
                                    max-height="80"
                                    contain
                                    class="m-auto"
                                />
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>

                <div class="col-md-8 d-flex flex-column">
                    <div class="info">
                        <h2 class="title"> {{ Product.name || 'بدون نام' }} </h2>

                        <div class="attributes" :class="{ 'border-top' : !Res }">
                            <span class="second-title"> {{ 'سید ایمان اصنافی' || Product.second_name }} </span>

                            <div class="row fs-13">
                                <div class="col-md-6 col-lg-7">
                                    <div class="row">
                                        <div class="col-12 col-lg-6">
                                            برند :
                                            <span class="web-color">
                                                {{ Product.brand ? Product.brand.name : 'ندارد' }}
                                            </span>
                                        </div>

                                        <div class="col-12 col-lg-6 mt-2 mt-lg-0">
                                            دسته بندی :
                                            <span class="web-color">
                                                <template v-if="is_exist(Product.categories)">
                                                    <nuxt-link class="web-color" :to="`/category/${Product.categories[0].id}`">
                                                        {{ Product.categories[0].title }}
                                                    </nuxt-link>
                                                </template>
                                                <template v-else>
                                                    ندارد
                                                </template>
                                            </span>
                                        </div>

                                        <div class="col-12 col-lg-6 mt-2">
                                            زمان ارسال :
                                            <span class="web-color"> {{ Product.sending_time || 'تعریف نشده' }} </span>
                                        </div>

                                        <div class="col-12 col-lg-6 mt-2">
                                            وضعیت :
                                            <span class="web-color"> آماده ارسال </span>
                                        </div>
                                    </div>

                                    <Variations />

                                    <div class="active-spec">
                                        <span> ویژگی های محصول </span>
                                        <ul>
                                            <li> حافظه داخلی: 256 گیگابایت </li>
                                            <li> مقدار RAM: 3 گیگابایت </li>
                                            <li> رزولوشن عکس: 12.0 مگاپیکسل </li>
                                            <li> بازه‌ی اندازه صفحه نمایش: 5.5 تا 6.0 اینچ </li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="col-md-6 col-lg-5 web-bg-ultra-fade box-info">
                                    <div class="price web-color-dark">
                                        {{ Product.variations[0].sales_price | Num2Fa }}
                                        <span class="fs-13"> تومان </span>
                                    </div>

                                    <p class="product-description" v-if="Product.description">
                                        <i class="flaticon-info bold fs-14 web-color ml-1"></i>
                                        {{ Product.description }}
                                    </p>

                                    <div>
                                        <v-btn class="web-grd-form-dark add-to-cart" dark large rounded>
                                            <i class="lnr lnr-cart"></i>
                                            افزودن به سبد خرید
                                        </v-btn>
                                        
                                        <v-btn class="web-grd-form-dark mr-2" fab dark small>
                                            <v-icon dark small>far fa-heart</v-icon>
                                        </v-btn>

                                        <v-btn class="web-grd-form-dark mr-1" fab dark small>
                                            <v-icon dark>sync</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="features pt-2">
                        <div class="border rounded h-100">
                            0
                        </div>
                    </div>
                </div>
            </div>
        </el-card>

        <el-card class="mt-3" :body-style="{ padding : '0px' }">
            <v-app class="remove-app-class">
                <v-tabs v-model="TabValue" :background-color="web_color_ultra_fade" :color="web_color" right show-arrows>
                    <v-tab v-for="tab in Tabs" :key="tab.name" :to="tab.name">
                        {{ tab.title }}
                        <v-icon class="ml-2" small> {{ tab.icon }} </v-icon>
                    </v-tab>
                </v-tabs>

                <v-tabs-items v-model="TabValue">
                    <v-tab-item v-for="tab in Tabs" :key="tab.name" :value="tab.name">
                        <nuxt-child class="p-4"/>
                    </v-tab-item>
                </v-tabs-items>
            </v-app>
        </el-card>
    </section>
</template>

<script>
    import mixin from '~/Mixins/mixin';
    import { mapState } from 'vuex';
    import Variations from '~/components/Variations.vue';

    export default {
        mixins: [mixin] ,

        validate({ params }) {
            return params.slug ? true : false;
        } ,

        async fetch({ $axios , store , params }) {
            let { data } = await $axios({
                method: 'POST' ,
                data: {
                query: `
                    {
                        product( slug : "${params.slug}" ) {
                            id
                            name
                            slug
                            second_name
                            label {
                                id
                                title
                                description
                                color
                            }
                            brand {
                                id
                                name
                            }
                            categories {
                                id
                                title
                            }
                            description
                            aparat_video
                            photos {
                                id
                                file_name
                                medium
                                custom_properties {
                                    color
                                }
                            }
                            votes {
                                likes
                                dislikes
                            }
                            unit {
                                id
                                title
                            }
                            variations {
                                id
                                sales_price
                                sending_time
                                inventory
                                color {
                                    id
                                    name
                                    code
                                }
                                size {
                                    id
                                    name
                                }
                                warranty {
                                    id
                                    title
                                }
                            }
                            short_review
                            expert_review
                            advantages
                            disadvantages
                            accessories {
                                id
                                name
                                slug
                                colors {
                                    id
                                    code
                                }
                                photos {
                                    id
                                    file_name
                                    medium
                                }
                                variation {
                                    id
                                    inventory
                                    sales_price
                                }
                            }
                        }
                    }
                `
                }
            })

            store.commit( 'Set_state' , {
                Module : 'Product' ,
                Prop : 'Single_Product' ,
                Val : data.data.product
            })
        } ,

        components: {
            Variations
        } ,

        beforeCreate() {
            if(
                !(this.$route.path.endsWith('review') ||
                this.$route.path.endsWith('spec') ||
                this.$route.path.endsWith('comments') ||
                this.$route.path.endsWith('qa'))
            ) {
                this.$router.replace({ path: this.$route.path + '/review' })
            }
        } ,

        mounted() {
            this.$nextTick(() => {
                const SwiperBig = this.$refs.SwiperBig.swiper
                const SwiperThumbs = this.$refs.SwiperThumbs.swiper
                SwiperBig.controller.control = SwiperThumbs
                SwiperThumbs.controller.control = SwiperBig

                $('.single-product').ready(function() {
                    $('.remove-app-class').each(function() {
                        $(this).removeClass('v-application');
                    })
                })
            })
        } ,

        data() {
            return {
                SwiperOption: {
                    // effect: 'fade'
                } ,
                SwiperOptionThumbs: {
                    spaceBetween: 10 ,
                    centeredSlides: true ,
                    slidesPerView: 'auto' ,
                    touchRatio: 0.2 ,
                    slideToClickedSlide: true
                } ,

                TabValue: null ,
                Tabs: [
                    { name: 'qa' , title: 'پرسش و پاسخ' , icon: 'far fa-question-circle' } ,
                    { name: 'comments' , title: 'نظرات کاربران' , icon: 'far fa-comments' } ,
                    { name: 'spec' , title: 'مشخصات فنی' , icon: 'fas fa-list' } ,
                    { name: 'review' , title: 'نقد و بررسی' , icon: 'fas fa-glasses' } ,
                ]
            }
        } ,

        computed: {
            ...mapState({
                $url: '$url' ,
                Product: state => state.Product.Single_Product ,
            }) ,

            Valid_Images() {
                if(this.is_exist(this.Product.photos)) {
                    return this.Product.photos.map( img => {
                        if(img.medium) return this.$url + img.medium; 
                    });
                } else {
                    return '/images/none.png';
                }
            }
        }
    }
</script>