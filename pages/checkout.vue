<template>
    <section class="container-fluid py-3 checkout">
        <v-app>
            <v-stepper v-model="Stepper" alt-labels>
                <v-stepper-header class="am-shadow">
                    <v-stepper-step
                        step="۱"
                        :complete="Stepper == '۲' || Stepper == '۳'"
                        :color="web_color"
                        complete-icon="flaticon-correct">
                        اطلاعات ارسال
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step
                        step="۲"
                        :complete="Stepper == '۳'"
                        :color="web_color"
                        complete-icon="flaticon-correct">
                        تکمیل اطلاعات پرداخت
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step
                        step="۳"
                        :color="web_color">
                        اتمام خرید و ارسال
                    </v-stepper-step>
                </v-stepper-header>

                <div class="row mx-md-0 pt-4">
                    <cart-aside
                        :total="Total"
                        :offer="Offer"
                        :shipping="Shipping"
                        :submit-btn="StepperMethod"
                        :btn-title="btn.title"
                        :btn-disabled="btn.disabled">
                    </cart-aside>

                    <div class="col-md-8 col-lg-9">
                        <v-stepper-items>
                            <v-stepper-content step="۱">
                                <span class="headline-info">انتخاب نحوه ارسال</span>
                                <el-card class="am-shadow">
                                    <v-radio-group class="rtl mt-0 pt-0" v-model="sendingType" row hide-details>
                                        <v-radio label="پیک موتوری" value="1" :color="web_color"></v-radio>
                                        <v-radio label="جت شخصی" value="2" :color="web_color"></v-radio>
                                        <v-radio label="پست" value="3" :color="web_color"></v-radio>
                                    </v-radio-group>
                                </el-card>

                                <span class="headline-info">مرسوله</span>
                                <el-card class="am-shadow rtl" v-show="showSlider">
                                    <swiper :options="SwiperOption">
                                        <swiper-slide v-for="product in Shopping_Cart" :key="product.id">
                                            <mini-card
                                                :variation="product.variation"
                                                :image-size="100"
                                                image-class="col-12"
                                                info-class="col-12"
                                                small
                                                :truncate="Res ? 30 : 40"
                                                :has-variations="false">
                                                <template #after>
                                                    <div class="col-12 product-name small">
                                                        {{ product.count | Num2Fa }}
                                                        عدد
                                                    </div>
                                                </template>
                                            </mini-card>
                                        </swiper-slide>
                                    </swiper>
                                </el-card>

                                <span class="headline-info">صدور فاکتور</span>
                                <el-card class="am-shadow">
                                    <v-checkbox
                                        class="rtl mt-0 pt-0"
                                        v-model="sendReceipt"
                                        :color="web_color"
                                        label="درخواست ارسال فاکتور خرید"
                                        hide-details>
                                    </v-checkbox>
                                </el-card>
                            </v-stepper-content>

                            <v-stepper-content step="۲">
                                2
                            </v-stepper-content>

                            <v-stepper-content step="۳">
                                3
                            </v-stepper-content>
                        </v-stepper-items>
                    </div>
                </div>
            </v-stepper>
        </v-app>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    import mixin from '~/Mixins/mixin';
    import cartAside from '~/components/CartAside.vue';
    import miniCard from '~/components/MiniCard.vue';

    export default {
        validate({ store }) {
            return typeof store.state.Me === 'object' && Object.keys(store.state.Me).length !== 0 ? true : false;
        } ,

        mixins: [mixin] ,

        components: {
            cartAside ,
            miniCard
        } ,

        mounted() {
            this.$nextTick(function() {
                this.showSlider = true;
                if(!this.Res) this.DynamicSidebar('.checkout-box', '.v-stepper__items', 16)
            })
        } ,

        data() {
            return {
                Stepper: '۱' ,

                Offer: 7500 ,
                Shipping: 10000 ,
                Total: 2500000 ,

                sendingType: '1' ,
                sendReceipt: false ,

                btn: {
                    title: 'تایید و ادامه ثبت سفارش' ,
                    disabled: false
                } ,

                showSlider: false ,
                SwiperOption: {
                    slidesPerView: 5 ,
                    spaceBetween: 5 ,
                    breakpoints: {
                        1400: {
                            slidesPerView: 4
                        } ,
                        1200: {
                            slidesPerView: 3
                        } ,
                        800: {
                            slidesPerView: 2
                        } ,
                        500: {
                            slidesPerView: 2
                        }
                    }
                }                
            }
        } ,

        computed: {
            ...mapState([
                'Shopping_Cart'
            ])
        } ,

        methods: {
            StepperMethod() {
                switch(this.Stepper) {
                    case '۱': {
                        this.Stepper = '۲';
                        break;
                    }
                    case '۲': {
                        this.Stepper = '۳';
                        break;
                    }
                }
            }
        }
    }
</script>