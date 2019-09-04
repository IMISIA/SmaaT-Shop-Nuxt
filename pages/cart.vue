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
                    :body-style="{ padding : Res ? '10px 0px 0px' : '10px' }">
                    <mini-card
                        :variation="variation"
                        :imageSize="150">
                        <template #before v-if="!Res">
                            <div class="col-sm-1 col-md-1 px-0 flex-center">
                                <vs-button color="danger" type="border" size="small" icon="close" radius>
                                </vs-button>
                            </div>                                    
                        </template>

                        <template #after>
                            <div class="col-6 col-md-2 input-number my-2 mt-lg-0">
                                <div class="d-inline-block">
                                    <!-- <vs-input-number v-model="Quantities[variation.id]" :color="web_color"/> -->
                                    <el-input-number v-model="Quantities[variation.id]" :min="1" size="small"></el-input-number>
                                </div>
                            </div>

                            <div class="col-6 col-md-3 flex-center my-2 mt-lg-0">
                                <span class="product-price" data-price="تومان">
                                    {{ variation.sales_price * Quantities[variation.id] | Num2Fa }}
                                </span>
                            </div>

                            <div class="box-actions row mx-0 mt-3" v-if="Res">
                                <v-btn class="col-5" text color="#dc3545">
                                    حذف
                                </v-btn>
                                <v-btn class="col-7" text color="#0ecfc6">
                                    مشاهده محصول
                                </v-btn>
                            </div>
                        </template>
                    </mini-card>
                </el-card>
            </div>
        </div>
    </section>
</template>

<script>
    import mixin from '~/Mixins/mixin';
    import {mapState} from 'vuex';
    import miniCard from '~/components/MiniCard.vue';
    export default {
        mixins: [mixin] ,

        components: {
            miniCard
        } ,

        mounted() {
            this.$nextTick(function() {
                this.Cart.map( el => {
                    this.Quantities[el.variation.id] = el.count;
                })

                if(!this.Res) this.DynamicSidebar('.checkout-box' , '.carts' , 16)
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