<template>
    <div id="card-component">
        <div class="product-card">
            
            <nuxt-link to="/">
                <v-img
                    :src=" is_exist(Product.photos) ? Url + Product.photos[0].medium : '/images/none.png' "
                    height="220"
                    max-width="auto"
                    aspect-ratio="1"
                    contain
                />
            </nuxt-link>
            
            <div class="image-overlay web-bg"></div>

            <div>
                <div class="product-info text-center" v-if="is_exist(Product.variation) && Product.label == null">

                    <nuxt-link to="/">
                        <div class="product-name mb-1"> {{ Product.name | truncate(50) }} </div>
                    </nuxt-link>

                    <div class="product-price web-color">
                        <span class="offer-price"> {{ 1500000 | Num2Fa }} </span>
                        {{ Product.variation.sales_price | Num2Fa }}
                        <span class="fs-13"> تومان </span>
                    </div>

                    <div class="pt-1 text-center mt-4" v-if="is_exist(Product.colors)">
                        <div class="text-color"> رنگ ها </div>
                        <div class="colors d-flex justify-content-center">
                            <div v-for="(color,idx) in Product.colors.slice(0,4)" :key="idx">
                                <span :style="{ background : color.code + '!important' }"></span>
                            </div>
                            <span class="pr-2 fs-20" v-if="Product.colors.length > 4"> + </span>
                        </div>
                    </div>

                    <div class="product-actions ltr d-flex justify-content-center">
                        
                        <button class="addCart-btn mr-1">
                            <i class="flaticon-shopping-cart"></i>
                            <span> افزودن به سبد خرید </span>
                        </button>

                        <button class="wishlist-btn mr-1">
                            <i class="flaticon-heart"></i>
                        </button>

                        <button class="compare-btn">
                            <i class="flaticon-stats"></i>
                        </button>

                    </div>

                </div>

                <div class="product-info labled text-center" v-else>

                    <nuxt-link to="/">
                        <div class="product-name mb-3"> {{ Product.name | truncate(50) }} </div>
                    </nuxt-link>

                    <div class="product-price">
                        <!-- Unavailable Label -->
                        <div class="d-flex align-center">
                            <vs-alert class="col-12 text-center d-inline-block" 
                                :color=" Product.label ? Product.label.color : 'rgb(231, 154, 23)' " active="true">
                                <span class="mx-3"> {{ Product.label ? Product.label.title : 'ناموجود !' }} </span>
                            </vs-alert>
                        </div>
                    </div>

                    <div class="product-actions ltr d-flex justify-content-center">
                        
                        <button class="wishlist-btn mr-1">
                            <i class="flaticon-heart"></i>
                        </button>

                        <button class="compare-btn">
                            <i class="flaticon-stats"></i>
                        </button>

                    </div>

                </div>
            </div>

        </div>
    </div>  
</template>

<script>
    import { mapState } from 'vuex';
    import mixin from '~/Mixins/mixin';

    export default {
        props: ['Product'] ,

        mixins: [mixin] ,

        mounted() {
            $(document).ready(function () {

                $('.product-info').hover(function () {
                    let product_card = $(this).parent().parent();
                    $(product_card).addClass('animate');
                } , function () {
                    let product_card = $(this).parent().parent();
                    $(product_card).removeClass('animate');
                });

            });
        } ,

        computed : {
            ...mapState([
                'Url'
            ]) ,
        } ,

    }
</script>