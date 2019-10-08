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
                    <v-stepper-items>
                        <v-stepper-content step="۱">
                            <span class="headline-info">انتخاب آدرس تحویل سفارش</span>
                            <el-card v-show="!changeAddrElement" class="am-shadow" :body-style="{ padding: 0 }">
                                <template v-if="is_exist(Me.addresses)">
                                    <div class="box-address">
                                        <h4 class="address-fullname">
                                            گیرنده: 
                                            {{ Me.addresses[activeAddress].full_name }}
                                        </h4>

                                        <p class="address-text">
                                            آدرس :
                                            {{ Me.addresses[activeAddress].address }}
                                        </p>

                                        <ul class="address-data">
                                            <li>
                                                شماره تماس :
                                                {{ Me.addresses[activeAddress].phone_number | Num2Fa(false) }}
                                            </li>
                                            <li class="mr-md-4">
                                                کدپستی :
                                                {{ Me.addresses[activeAddress].postal_code | Num2Fa(false) }}
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="box-actions small rtl">
                                        <v-btn class="w-100 border-0" text color="#0ecfc6"
                                            @click="changeAddrElement = true">
                                            <i class="lnr lnr-pencil fs-16"></i>
                                            تغییر آدرس ارسال
                                        </v-btn>
                                    </div>
                                </template>

                                <template v-else>
                                    <el-card class="am-shadow">
                                        <p class="alert alert-warning fs-12">
                                            آدرسی ثبت نشده است
                                        </p>

                                        <button class="add-btn-dashed mb-0" @click="openModal(false)">
                                            ایجاد آدرس جدید
                                        </button>
                                    </el-card>
                                </template>
                            </el-card>

                            <el-card v-show="changeAddrElement" class="am-shadow" :body-style="{ padding: 10 }">
                                <div class="headline-address-group">
                                    <span class="flex-grow-1">آدرس مورد نظر خود را انتخاب فرمایید:</span>
                                    <v-btn fab outlined color="#767676" @click="changeAddrElement = false">
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                </div>

                                <button class="add-btn-dashed" @click="openModal(false)">
                                    ایجاد آدرس جدید
                                </button>

                                <div class="box-address-group"
                                    :class="{ 'active' : idx == activeAddress }"
                                    v-for="(address,idx) in Me.addresses" :key="idx">
                                    <div class="box-address">
                                        <h4 class="address-fullname">
                                            گیرنده: 
                                            {{ address.full_name }}
                                        </h4>

                                        <p class="address-text">
                                            آدرس: 
                                            {{ address.address }}
                                        </p>

                                        <ul class="address-data">
                                            <li>
                                                شماره تماس :
                                                {{ address.phone_number | Num2Fa(false) }}
                                            </li>
                                            <li class="mr-md-4">
                                                کدپستی :
                                                {{ address.postal_code | Num2Fa(false) }}
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="box-actions small row rtl">
                                        <v-btn class="col-3" text @click="openModal(address)">
                                            ویرایش
                                        </v-btn>
                                        <v-btn class="col-9" text color="#0ecfc6"
                                            @click="activeAddress = idx">
                                            {{ idx == activeAddress ? 'سفارش به این آدرس ارسال می‌شود.' : 'ارسال سفارش به این آدرس' }}
                                        </v-btn>
                                    </div>
                                </div>
                            </el-card>

                            <span class="headline-info">انتخاب نحوه ارسال</span>
                            <el-card class="am-shadow">
                                <v-radio-group class="rtl mt-0 pt-0" v-model="sendingType"
                                    :row="!Res" hide-details>
                                    <v-radio v-for="item in shipping_methods" :key="item.id"
                                        :label="item.name + ( item.description ? ` (${item.description})` : '')"
                                        :value="item.id" :color="web_color" :disabled="Total < item.minimum"></v-radio>
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
                                            mini
                                            :truncate="Res ? 25 : 35"
                                            :has-variations="false">
                                            <template #after>
                                                <div class="col-12 product-name mini mb-0">
                                                    {{ product.count | Num2Fa }}
                                                    عدد
                                                </div>
                                            </template>
                                        </mini-card>
                                    </swiper-slide>
                                </swiper>
                            </el-card>

                            <!-- <span class="headline-info">صدور فاکتور</span>
                            <el-card class="am-shadow">
                                <v-checkbox
                                    class="rtl mt-0 pt-0"
                                    v-model="sendReceipt"
                                    :color="web_color"
                                    label="درخواست ارسال فاکتور خرید"
                                    hide-details>
                                </v-checkbox>
                            </el-card> -->
                        </v-stepper-content>

                        <v-stepper-content step="۲">
                            <span class="headline-info">انتخاب شیوه پرداخت</span>
                            <el-card class="am-shadow">
                                <v-radio-group class="rtl mt-0 pt-0" v-model="paymentType" hide-details>
                                    <v-radio v-for="item in gateways" :key="item.id" 
                                        :label="item.payment_gateway.title 
                                        + ( item.payment_gateway.description ? ` (${item.payment_gateway.description})` : '')"
                                        :value="item.id" :color="web_color"></v-radio>
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
                                            block
                                            @click="setPromo">
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
                        </v-stepper-content>
                    </v-stepper-items>
                </div>
            </div>
        </v-stepper>

        <v-snackbar class="rtl" v-model="snackbar" :timeout="0" color="#00C853">
            شما به زودی به درگاه پرداخت منتقل میشوید ...
        </v-snackbar>

        <AddAddress ref="AddAddress" :modal="addressModal" :title="addressModalTitle" :close-modal="() => addressModal = false"/>
    </section>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import mixin from '~/mixins/mixin';
    import cartAside from '~/components/CartAside.vue';
    import miniCard from '~/components/MiniCard.vue';
    import AddAddress from '~/components/AddAddress.vue';

    export default {
        async asyncData({ $axios , req }) {
            let { data } = await $axios({
                method: 'POST' ,
                data: {
                    query: `
                        {
                            provinces(country: 1) {
                                id
                                name
                                coordinates {
                                    lat
                                    lng
                                }
                            }

                            shipping_methods {
                                data {
                                    id
                                    name
                                    description
                                    logo {
                                        id
                                        file_name
                                        small
                                    }
                                    cost
                                    minimum
                                }
                            }

                            gateways {
                                data {
                                    id
                                    payment_gateway {
                                        title
                                        description
                                        logo {
                                            id
                                            file_name
                                        }
                                    }
                                }
                            }
                        }
                    `
                }
            })

            if(data.data) {
                return {
                    provinces: data.data.provinces ,
                    gateways: data.data.gateways.data ,
                    shipping_methods: data.data.shipping_methods.data
                }
            } else {
                return {
                    provinces: [] ,
                    gateways: [] ,
                    shipping_methods: []
                }
            }
        } ,

        async fetch({ $axios , store , req }) {
            let { data } = await $axios({
                method: 'POST' ,
                data: {
                query: `
                    {
                        me {
                            addresses {
                                id
                                full_name
                                phone_number
                                type
                                address
                                postal_code
                                city {
                                    id
                                    name
                                    province {
                                        id
                                        name
                                    }
                                }
                                coordinates {
                                    lat
                                    lng
                                }
                            }
                        }
                    }
                `
                }
            })

            if(data.data && data.data.me) store.commit( 'Set_state' , {
                Prop : 'Me' ,
                Val : data.data.me ,
                Obj_Assign: true
            })
        } ,

        validate({ store , redirect }) {
            if(typeof store.state.Me === 'object' && Object.keys(store.state.Me).length !== 0 &&
                typeof store.state.Shopping_Cart === 'object' && Object.keys(store.state.Shopping_Cart).length) {
                    return true;
            } else {
                redirect('/');
                return false
            }
        } ,

        mixins: [mixin] ,

        components: {
            cartAside ,
            miniCard ,
            AddAddress
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

                snackbar: false ,

                Offer: 0 ,

                activeAddress: 0 ,

                changeAddrElement: false ,
                addressModal: false ,
                addressModalTitle: 'افزودن آدرس جدید' ,

                sendingType: '' ,
                sendReceipt: false ,

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
                } ,   

                paymentType: '' ,
                offCode: ''
            }
        } ,

        computed: {
            ...mapState([
                'Me' ,
                'Shopping_Cart'
            ]) ,

            Total() {
                return this.Shopping_Cart.reduce( (total,el) => total + el.count * el.variation.sales_price , 0 );
            } ,

            Shipping() {
                let obj = this.shipping_methods.find(el => el.id == this.sendingType);
                return obj ? obj.cost : 0;
            } ,

            btn() {
                let title = '';
                let disabled = false;

                if(this.Stepper == '۱') {
                    title = 'تایید و ادامه ثبت سفارش';
                    disabled = !this.is_exist(this.Me.addresses) || !this.sendingType;
                } else if(this.Stepper == '۲') {
                    title = 'نهایی کردن سفارش';
                    disabled = !this.paymentType;
                } else {
                    title = 'در انتظار درگاه پرداخت';
                    disabled = true;
                }

                return {
                    title: title ,
                    disabled: disabled
                }
            }
        } ,

        methods: {
            ...mapActions([
                'Request'
            ]) ,

            StepperMethod() {
                switch(this.Stepper) {
                    case '۱': {
                        this.Stepper = '۲';
                        break;
                    }
                    case '۲': {
                        this.ToPortal();
                        this.Stepper = '۳';
                        break;
                    }
                }
            } ,

            ToPortal() {
                this.snackbar = true;
                this.Request({
                    type: 'mutation' ,
                    name: 'createPayment' ,
                    params: {
                        gateway_id: parseInt(this.paymentType) ,
                        shipping_method_id: parseInt(this.sendingType) ,
                        user_address_id: parseInt(this.Me.addresses[this.activeAddress].id)
                    } ,
                    resQuery: 'code' ,
                    resolverAfter: ({data}) => {
                        if(data.data && data.data.createPayment && data.data.createPayment.code) {
                            location.href = '/api/v1/payment/' + data.data.createPayment.code;
                        } else if(data.status == 400) {
                            this.snackbar = false;
                            this.Stepper = '۱';
                            this.Notif(data.message , 'warning', 'error' , 5000);
                        }
                    }
                })
            } ,
 
            openModal(editable_address) {
                if(!editable_address) {
                    this.addressModalTitle = 'افزودن آدرس جدید';
                    Object.keys(this.$refs.AddAddress.newAddress).map( el => {
                        if(el != 'valid' && el != 'loading') this.$refs.AddAddress.newAddress[el] = '';
                    });
                    this.$refs.AddAddress.province.select = '';
                    this.$refs.AddAddress.city.select = '';                    
                    this.addressModal = true;
                    this.addressModal = true;
                } else {
                    this.addressModalTitle = 'ویرایش آدرس';
                    let clone = { ...editable_address };
                    clone.city = null;
                    clone.coordinates = null;
                    clone.city_id = editable_address.city.id;
                    clone.lat = editable_address.coordinates.lat;
                    clone.lng = editable_address.coordinates.lng;
                    clone.id = eval(clone.id);
                    this.$refs.AddAddress.province.select = editable_address.city.province.id;
                    this.$refs.AddAddress.city.select = editable_address.city.id;
                    this.$refs.AddAddress.newAddress = { ...this.$refs.AddAddress.newAddress , ...clone };
                    this.addressModal = true;
                }
            } ,

            setPromo() {
                setTimeout(() => {
                    this.Notif('کد تخفیف معتبر نمیباشد', 'warning', 'error')                    
                }, 1000);
            } ,

            Notif(msg, color,  icon, time = 3000)  {
                this.$vs.notify({
                    text: `${msg}` ,
                    color: color ,
                    icon: icon ,
                    position: 'top-left',
                    time: time
                })
            }
        }
    }
</script>