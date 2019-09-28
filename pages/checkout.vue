<template>
    <section class="container-fluid py-3 checkout">
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

            <div class="row mx-md-0 pt-3">
                <cart-aside
                    :total="Total"
                    :offer="Offer"
                    :shipping="Shipping"
                    :submit-btn="StepperMethod"
                    :btn-title="btn.title"
                    :btn-disabled="btn.disabled">
                </cart-aside>

                <div class="col-md-8 col-lg-9">
                    <nuxt />
                </div>
            </div>
        </v-stepper>
    </section>
</template>

<script>
    import mixin from '~/mixins/mixin';
    import cartAside from '~/components/CartAside.vue';

    export default {
        validate({ store }) {
            return typeof store.state.Me === 'object' && Object.keys(store.state.Me).length !== 0 ? true : false;
        } ,

        mixins: [mixin] ,

        components: {
            cartAside
        } ,

        mounted() {
            this.$nextTick(function() {
                if(!this.Res) this.DynamicSidebar('.checkout-box', '.v-stepper__items', 16)
            })
        } ,

        data() {
            return {
                Offer: 7500 ,
                Shipping: 10000 ,
                Total: 2500000 ,

                btn: {
                    title: 'تایید و ادامه ثبت سفارش' ,
                    disabled: false
                }
            }
        } ,

        computed: {
            Stepper() {
                switch(this.$route.path) {
                    case '/checkout/shipping': {
                        return '۱';
                        break;
                    }
                    case '/checkout/payment': {
                        return '۲';
                        break;
                    }
                    case '/checkout/portal': {
                        return '۳';
                        break;
                    }
                }
            }
        } ,

        methods: {
            StepperMethod() {
                switch(this.Stepper) {
                    case '۱': {
                        this.$router.push({path : 'payment'});
                        break;
                    }
                    case '۲': {
                        this.$router.push({path : 'portal'});
                        break;
                    }
                }
            }
        }
    }
</script>