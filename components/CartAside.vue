<template>
    <div class="col-md-4 col-lg-3 pr-md-0 mb-3 mb-md-0">
        <el-card class="am-shadow checkout-box">
            <ul class="checkout-prices">
                <li>
                    مبلغ کل        
                    <span data-price="تومان"> {{ total | Num2Fa }} </span>
                </li>
                <li class="offer web-color">
                    تخفیف        
                    <span data-price="تومان"> {{ offer | Num2Fa }} </span>
                </li>
                <li>
                    هزینه ارسال        
                    <span data-price="تومان"> {{ shipping | Num2Fa }} </span>
                </li>
            </ul>

            <v-divider class="mt-3"></v-divider>
            <v-divider class="mb-3 mt-1"></v-divider>

            <div class="final-price">
                <span class="final-price-title"> : مبلغ قابل پرداخت </span>
                <span class="final-price-topay web-color" data-price="تومان">
                    {{ FinalPrice | Num2Fa }}
                </span>
            </div>

            <div class="checkout-submit">
                <v-btn class="web-grd-form-dark rounded-7"
                    block 
                    large
                    dark
                    :to=" typeof submitBtn === 'string' && submitBtn.startsWith('/') ? submitBtn : null "
                    @click="submitBtn">
                    نهایی کردن سفارش
                    <v-icon class="ml-3">check</v-icon>
                </v-btn>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        props: {
            total: {
                type: Number ,
                required: true
            } ,
            offer: {
                type: Number
            } ,
            shipping: {
                type: Number
            } ,
            submitBtn: {
                type: [Function,String] ,
                required: true
            }
        } ,

        computed: {
            FinalPrice() {
                return this.total + this.shipping - this.offer;
            }
        }
    }
</script>