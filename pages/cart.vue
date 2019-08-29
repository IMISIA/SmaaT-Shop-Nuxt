<template>
    <section class="container-fluid py-3 cart">
        <div class="row">
            <div class="col-md-4 col-lg-3 pr-md-0 mb-3 mb-md-0">
                <el-card class="am-shadow checkout-box">
                    <ul class="checkout-prices">
                        <li>
                            مبلغ کل        
                            <span data-price="تومان"> {{ Total | Num2Fa }} </span>
                        </li>
                        <li class="offer web-color">
                            تخفیف        
                            <span data-price="تومان"> {{ Offer | Num2Fa }} </span>
                        </li>
                        <li>
                            هزینه ارسال        
                            <span data-price="تومان"> {{ Shipping | Num2Fa }} </span>
                        </li>
                    </ul>

                    <v-divider></v-divider>

                    <div>
                        <span class="final-price-title"> : مبلغ قابل پرداخت </span>
                        <span class="final-price web-color" data-price="تومان">
                            {{ FinalPrice | Num2Fa }}
                        </span>
                    </div>

                    <v-btn class="web-grd-form-dark" block rounded large dark>
                        نهایی کردن سفارش
                        <v-icon class="ml-3">check</v-icon>
                    </v-btn>
                </el-card>
            </div>

            <div class="col-md-8 col-lg-9 carts">
                <el-card class="am-shadow mb-3" v-for="{variation} in Cart" :key="variation.id"
                    :body-style="{ padding : '10px' }">
                    <div class="row rtl">
                        <div class="col-sm-6 col-md-3">
                            <vs-button color="danger" type="border" size="small" icon="close" radius>
                            </vs-button>

                            <nuxt-link :to="`/product/${variation.product.slug}/review`">
                                <v-img
                                    :src=" is_exist(variation.product.photos)
                                        ? URL + variation.product.photos[0].small
                                        : '/images/none.png' "
                                    height="150"
                                    width="150"
                                    class="m-auto"
                                    aspect-ratio="1"
                                    contain
                                />
                            </nuxt-link>
                        </div>

                        <div class="col-sm-6 col-md-4 py-3 d-flex flex-column justify-content-between">
                            <h3 class="product-name"> {{ variation.product.name }} </h3>

                            <ul class="variations">
                                <li v-if="variation.warranty">
                                    <i class="fas fa-shield-alt ml-1"></i>
                                    گارانتی {{ variation.warranty.title }}
                                </li>
                                <li v-if="variation.color">
                                    <i class="fas fa-palette ml-1"></i>
                                    رنگ {{ variation.color.name }}
                                </li>
                                <li v-if="variation.size">
                                    <i class="fas fa-chart-line ml-1"></i>
                                    سایز {{ variation.size.name }}
                                </li>
                            </ul>
                        </div>

                        <div class="col-sm-6 col-md-2 input-number mt-3 mt-lg-0">
                            <div class="d-inline-block">
                                <!-- <vs-input-number v-model="Quantities[variation.id]" :color="web_color"/> -->
                                <el-input-number v-model="Quantities[variation.id]" :min="1" size="small"></el-input-number>
                            </div>
                        </div>

                        <div class="col-sm-6 col-md-3 flex-center mt-3 mt-lg-0">
                            <span class="product-price" data-price="تومان">
                                {{ variation.sales_price * Quantities[variation.id] | Num2Fa }}
                            </span>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </section>
</template>

<script>
    import mixin from '~/Mixins/mixin';
    import { mapState } from 'vuex';
    export default {
        mixins: [mixin] ,

        mounted() {
            this.$nextTick(function() {
                this.Cart.map( el => {
                    this.Quantities[el.variation.id] = el.count;
                })

                if(!this.Res) this.Dynamic_SideBar('.checkout-box' , '.carts' , 16)
            })
        } ,

        data() {
            return {
                Offer: 7500 ,
                Shipping: 10000 ,

                Quantities: {}
            }
        } ,

        computed: {
            ...mapState({
                Cart: 'Shopping_Cart' ,
                URL: 'URL'
            }) ,

            Total() {
                let total = 0;
                this.Cart.map( ({variation}) => {
                    total += variation.sales_price * this.Quantities[variation.id]
                })

                return total;
            } ,

            FinalPrice() {
                return this.Total + this.Shipping - this.Offer;
            }
        }
    }
</script>