<template>
    <section class="container-fluid py-3 cart">
        <div class="row">
            <cart-aside
                :total="Total"
                :offer="Offer"
                :shipping="Shipping"
                submit-btn="/checkout">
            </cart-aside>

            <div class="col-md-8 col-lg-9 carts">
                <el-card class="am-shadow mb-3" v-for="{variation} in Cart" :key="variation.id"
                    :body-style="{ padding : Res ? '10px 0px 0px' : '10px' }">
                    <mini-card
                        :variation="variation"
                        :small="Res"
                        image-class="col-5 col-md-2"
                        :image-size="Res ? 130 : 150"
                        info-class="col-7 col-sm-6 col-md-4 py-3 pr-0">
                        <template #before v-if="!Res">
                            <div class="col-sm-1 col-md-1 px-0 flex-center">
                                <vs-button color="danger" type="border" size="small" icon="close" radius></vs-button>
                            </div>                                    
                        </template>

                        <template #after>
                            <div class="col-6 col-md-2 input-number my-2 mt-lg-0">
                                <div class="d-inline-block">
                                    <el-input-number v-model="Quantities[variation.id]" :min="1" size="small"></el-input-number>
                                </div>
                            </div>

                            <div class="col-6 col-md-3 flex-center my-2 mt-lg-0">
                                <span class="product-price" data-price="تومان">
                                    {{ variation.sales_price * Quantities[variation.id] | Num2Fa }}
                                </span>
                            </div>

                            <div class="box-actions row mt-3" v-show="Res">
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
    import mixin from '~/mixins/mixin';
    import { mapState } from 'vuex';
    import cartAside from '~/components/CartAside.vue';
    import miniCard from '~/components/MiniCard.vue';
    
    export default {
        mixins: [mixin] ,

        components: {
            cartAside ,
            miniCard
        } ,

        mounted() {
            this.$nextTick(function() {
                this.Cart.map( el => {
                    this.Quantities[el.variation.id] = el.count;
                })

                if(!this.Res) this.DynamicSidebar('.checkout-box', '.carts', 16)
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
                $url: '$url'
            }) ,

            Total() {
                let total = 0;
                this.Cart.map( ({variation}) => {
                    total += variation.sales_price * this.Quantities[variation.id]
                })

                return total;
            } ,
        }
    }
</script>