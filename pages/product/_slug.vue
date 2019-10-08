<template>
    <section class="single-product p-3">
        <el-card :body-style="{ padding : '20px 0px' }">
            <div class="row mx-0 rtl">
                <div class="col-md-4 pb-3 pb-md-0" :class="[ Res ? 'border-bottom' : 'border-left' ]">
                    <swiper :options="SwiperOption" ref="SwiperBig">
                        <swiper-slide
                            v-for="(img,idx) in Valid_Images" :key="idx"
                            :data-color="img.color_code" :data-index="idx">
                            <v-img
                                :src="img.src"
                                width="100%"
                                class="bg-white"
                                min-height="350px"
                                contain
                            />
                        </swiper-slide>
                    </swiper>

                    <swiper :options="SwiperOptionThumbs" class="gallery-thumbs" ref="SwiperThumbs">
                        <swiper-slide v-for="(img,idx) in Valid_Images" :key="idx">
                            <div class="thumb">
                                <v-img
                                    :src="img.src"
                                    min-height="60"
                                    contain
                                    class="m-auto"
                                />
                            </div>
                        </swiper-slide>
                    </swiper>

                    <ul class="product-options">
                        <li>
                            <el-tooltip class="item" effect="dark" content="علاقه مندی" placement="left">
                                <v-btn color="#9b9b9b" fab text @click="AddFav(Product.id)">
                                    <i class="flaticon-heart"></i>
                                </v-btn>
                            </el-tooltip>
                        </li>
                        <li v-if="false">
                            <el-tooltip class="item" effect="dark" content="مقایسه" placement="left">
                                <v-btn color="#9b9b9b" fab text>
                                    <i class="flaticon-stats"></i>
                                </v-btn>
                            </el-tooltip>
                        </li>
                        <li v-if="false">
                            <el-tooltip class="item" effect="dark" content="اشتراک گذاری" placement="left">
                                <v-btn color="#9b9b9b" fab text>
                                    <i class="flaticon-share"></i>
                                </v-btn>
                            </el-tooltip>
                        </li>
                    </ul>
                </div>

                <div class="col-md-8 d-flex flex-column">
                    <div class="info">
                        <h2 class="title"> {{ Product.name || 'بدون نام' }} </h2>

                        <div class="attributes" :class="{ 'border-top' : !Res }">
                            <span class="second-title" v-if="is_exist(Product.second_name)">
                                {{ Product.second_name }}
                            </span>

                            <div class="row fs-13">
                                <div class="col-md-6 col-lg-7">
                                    <div class="row">
                                        <div class="col-12 col-lg-6 mb-2" v-if="Product.brand">
                                            برند :
                                            <router-link class="web-color" :to="`/brand/${Product.brand.id}`">
                                                {{ Product.brand.name }}
                                            </router-link>
                                        </div>

                                        <div class="col-12 col-lg-6 mb-2" v-if="is_exist(Product.categories)">
                                            دسته بندی :
                                            <nuxt-link class="web-color" :to="`/category/${Product.categories[0].id}`">
                                                {{ Product.categories[0].title }}
                                            </nuxt-link>
                                        </div>

                                        <div class="col-12 col-lg-6 mb-2" v-if="Product.sending_time">
                                            زمان ارسال :
                                            <span class="web-color"> {{ Product.sending_time }} </span>
                                        </div>

                                        <div class="col-12 col-lg-6 mb-2">
                                            وضعیت :
                                            <span class="web-color">
                                                {{ Product.variations && Product.variations.some(el => el.inventory)
                                                    ? 'آماده ارسال'
                                                    : 'نا موجود'
                                                }}
                                            </span>
                                        </div>
                                    </div>

                                    <Variations v-if="is_exist(Product.variations)" :SyncColor="SyncColor"/>

                                    <div class="active-spec">
                                        <p v-html="Product.short_review.slice(0,500) + ' ...'"></p>

                                        <!-- <span> ویژگی های محصول </span> -->
                                        <ul class="mb-0" v-if="false">
                                            <li> حافظه داخلی: 256 گیگابایت </li>
                                            <li> مقدار RAM: 3 گیگابایت </li>
                                            <li> رزولوشن عکس: 12.0 مگاپیکسل </li>
                                            <li> بازه‌ی اندازه صفحه نمایش: 5.5 تا 6.0 اینچ </li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="col-md-6 col-lg-5 box-info web-bg-ultra-fade"
                                    v-if="is_exist(Product.variations) && Product.label == null">
                                    <div class="price web-color-dark">
                                        {{ Product.variations[0].sales_price * Quantity | Num2Fa }}
                                        <span class="fs-13"> تومان </span>
                                    </div>

                                    <p class="product-description" v-if="Product.description">
                                        <i class="flaticon-info bold fs-14 web-color ml-1"></i>
                                        {{ Product.description }}
                                    </p>

                                    <div class="input-number">
                                        <vs-input-number v-model="Quantity" label="عدد" :color="web_color_dark"/>
                                    </div>

                                    <div class="add-to-cart">
                                        <v-btn class="as-btn" large block
                                            @click="addCart">
                                            <!-- <i class="lnr lnr-cart"></i> -->
                                            <!-- <i class="flaticon-shopping-cart"></i> -->
                                            افزودن به سبد خرید
                                        </v-btn>
                                    </div>
                                </div>

                                <div class="col-md-6 col-lg-5 box-info web-bg-ultra-fade" v-else>
                                    <div class="price web-color-dark">
                                        {{ Product.label ? Product.label.title : 'ناموجود !' }}
                                    </div>

                                    <p class="product-description">
                                        <i class="flaticon-info bold fs-14 web-color ml-1"></i>
                                        {{ Product.label && Product.label.description ?
                                            Product.label.description
                                            : 'متاسفانه این کالا در حال حاضر موجود نیست.'
                                        }}
                                    </p>

                                    <div class="add-to-cart">
                                        <v-btn class="as-btn" large block>
                                            موجود شد اطلاع بده
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="features" v-if="false">
                        <div class="border rounded h-100">
                            0
                        </div>
                    </div>
                </div>
            </div>
        </el-card>

        <el-card class="mt-3" :body-style="{ padding : '0px' }">
            <v-app class="remove-app-class">
                <v-tabs v-model="TabValue"
                    :background-color="web_color_ultra_fade"
                    :color="web_color" right show-arrows>
                    <template v-for="tab in Tabs">
                        <v-tab v-if="checkTabs(tab.name)" :key="tab.name" :to="tab.name">
                            {{ tab.title }}
                            <v-icon class="ml-2" small> {{ tab.icon }} </v-icon>
                        </v-tab>
                    </template>
                </v-tabs>

                <v-tabs-items v-model="TabValue">
                    <v-tab-item v-for="tab in Tabs" :key="tab.name" :value="tab.name">
                        <nuxt-child v-if="$route.path.endsWith(tab.name)" class="p-3 p-md-4"/>
                    </v-tab-item>
                </v-tabs-items>
            </v-app>
        </el-card>

        <product-slider class="pt-3"
            :Products="{
                title: 'محصولات جانبی' ,
                data: Accessories ,
                size: 12
            }"
        />
    </section>
</template>

<script>
    import mixin from '~/mixins/mixin';
    import user from '~/mixins/user';
    import { mapState } from 'vuex';
    import Variations from '~/components/Variations.vue';
    import ProductSlider from '~/components/ProductSlider.vue';

    export default {
        head() {
            return {
                title: this.Product.name
            }
        } ,

        mixins: [mixin,user] ,

        validate({ params }) {
            return params.slug ? true : false;
        } ,

        async fetch({ $axios , store , params , error }) {
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
                                slug
                            }
                            categories {
                                id
                                title
                                slug
                            }
                            description
                            aparat_video
                            photos {
                                id
                                file_name
                                watermark
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
                            spec {
                                id
                                headers {
                                    id
                                }
                            }
                        }
                    }
                `
                }
            })

            if(!data.data.product) error({ statusCode: 404, message: 'محصول مورد نظر پیدا نشد' });

            store.commit( 'Set_state' , {
                Module : 'product' ,
                Prop : 'Single_Product' ,
                Val : data.data.product
            })
        } ,

        components: {
            Variations ,
            ProductSlider
        } ,

        created() {
            if(!this.Tabs.some(el => this.$route.path.endsWith(el.name))) {
                if(this.hasReview || this.hasSpec) {
                    this.hasReview
                    ? this.$router.replace({ path: this.$route.path + '/review' })
                    : this.$router.replace({ path: this.$route.path + '/spec' })
                } else {
                    this.$router.replace({ path: this.$route.path + '/comments' })
                }
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
                    effect: 'fade'
                } ,
                SwiperOptionThumbs: {
                    spaceBetween: 10 ,
                    centeredSlides: true ,
                    slidesPerView: 'auto' ,
                    touchRatio: 0.2 ,
                    slideToClickedSlide: true
                } ,

                Quantity: 1 ,

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
                Accessories: state => state.product.Single_Product.accessories ,
                Product: state => state.product.Single_Product ,
                Variations_Select: state => state.product.Variations_Select ,
                Validate_Price: state => state.product.Validate_Price
            }) ,

            Valid_Images() {
                if(this.is_exist(this.Product.photos)) {
                    return this.Product.photos.map( img => {
                        if(img.medium) return {
                            src: this.$url + img.medium ,
                            color_code : img.custom_properties.color 
                        }; 
                    });
                } else {
                    return [{
                        src: '/images/none.png' ,
                        color_code: null
                    }];
                }
            } ,

            hasReview() {
                return !!this.Product.short_review
                || !!this.Product.expert_review
                || this.is_exist(this.Product.advantages)
                || this.is_exist(this.Product.disadvantages);
            } ,

            hasSpec() {
                return this.is_exist(this.Product.spec)
                && this.is_exist(this.Product.spec.headers);
            }
        } ,

        methods: {
            SyncColor(value) {
                let idx = $(`[data-color='${value}']`).attr('data-index');
                this.$refs.SwiperBig.swiper.slideTo(idx , 500);
            } ,

            checkTabs(tab) {
                switch(tab) {
                    case 'review': {
                        return this.hasReview;
                        break;
                    };
                    case 'spec': {
                        return this.hasSpec;
                        break;
                    };
                    default: {
                        return true;
                    }
                } 
            } ,

            addCart() {
                let Product = this.Product;
                Product.variation = this.Product.variations[this.Variations_Select];
                this.AddToCart(Product , this.Quantity);
            }
        }
    }
</script>