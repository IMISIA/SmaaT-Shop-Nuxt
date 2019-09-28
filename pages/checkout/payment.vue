<template>
    <section>
        <span class="headline-info">انتخاب شیوه پرداخت</span>
        <el-card class="am-shadow">
            <v-radio-group class="rtl mt-0 pt-0" v-model="paymentType" :row="!Res" hide-details>
                <v-radio label="پرداخت اینترنتی هوشمند " value="1" :color="web_color"></v-radio>
                <v-radio label="پرداخت در محل با کارت بانکی" value="2" :color="web_color"></v-radio>
            </v-radio-group>
        </el-card>

        <span class="headline-info">استفاده از کد تخفیف</span>
        <el-card class="am-shadow">
            <p class="fs-14">با ثبت کد کارت هدیه، مبلغ کارت هدیه از “مبلغ قابل پرداخت” کسر می‌شود.</p>

            <div class="row mx-0">
                <div class="col-4 col-md-3 pl-0">
                    <v-btn
                        class="h-100 text-white"
                        :color="web_color"
                        :disabled="!(!!offCode)"
                        block>
                        {{ Res ? 'ثبت' : 'ثبت کد تخفیف' }}
                    </v-btn>
                </div>

                <v-text-field
                    v-model="offCode"
                    label="کد تخفیف"
                    class="col-8 col-md-9"
                    outlined
                    single-line
                    reverse
                    hide-details>
                </v-text-field>
            </div>
        </el-card>

        <div class="text-right mt-3">
            <el-link class="fs-12" type="primary" @click="Stepper = '۱'">
                بازگشت به اطلاعات ارسال
                <i class="el-icon-right"></i>
            </el-link>
        </div>
    </section>
</template>

<script>
    import mixin from '~/mixins/mixin';
    export default {
        mixins: [mixin] ,

        data() {
            return {
                paymentType: '1' ,
                offCode: ''     
            }
        }
    }
</script>