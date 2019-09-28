<template>
    <section>
        <span class="headline-info">انتخاب آدرس تحویل سفارش</span>
        <el-card v-show="!changeAddrElement" class="am-shadow" :body-style="{ padding: 0 }">
            <div class="box-address">
                <h4 class="address-fullname">
                    گیرنده: 
                    سید ایمان اصنافی
                </h4>

                <p class="address-text">
                    آدرس :
                    استان خراسان رضوی، ‌شهر مشهد، سناباد 44 ، ساختمان 52 ، واحد 7
                </p>

                <ul class="address-data">
                    <li>
                        شماره تماس :
                        {{ 1234567899 | Num2Fa(false) }}
                    </li>
                    <li class="mr-md-4">
                        کدپستی :
                        {{ 1234567899 | Num2Fa(false) }}
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
        </el-card>

        <el-card v-show="changeAddrElement" class="am-shadow" :body-style="{ padding: 10 }">
            <div class="headline-address-group">
                <span class="flex-grow-1">آدرس مورد نظر خود را انتخاب فرمایید:</span>
                <v-btn fab outlined color="#767676" @click="changeAddrElement = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </div>

            <button class="add-btn-dashed" @click="addressModal = true">
                ایجاد آدرس جدید
            </button>

            <div class="box-address-group"
                :class="{ 'active' : n == 2 }"
                v-for="n in 3" :key="n">
                <div class="box-address">
                    <h4 class="address-fullname">
                        گیرنده: 
                        سید ایمان اصنافی
                    </h4>

                    <p class="address-text">
                        آدرس: 
                        استان خراسان رضوی، ‌شهر مشهد، سناباد 44 ، ساختمان 52 ، واحد 7
                    </p>

                    <ul class="address-data">
                        <li>
                            شماره تماس :
                            {{ 1234567899 | Num2Fa(false) }}
                        </li>
                        <li class="mr-md-4">
                            کدپستی :
                            {{ 1234567899 | Num2Fa(false) }}
                        </li>
                    </ul>
                </div>

                <div class="box-actions small row rtl">
                    <v-btn class="col-3" text >
                        ویرایش
                    </v-btn>
                    <v-btn class="col-9" text color="#0ecfc6"
                        @click="changeAddrElement = true">
                        {{ n == 2 ? 'سفارش به این آدرس ارسال می‌شود.' : 'ارسال سفارش به این آدرس' }}
                    </v-btn>
                </div>
            </div>
        </el-card>

        <span class="headline-info">انتخاب نحوه ارسال</span>
        <el-card class="am-shadow">
            <v-radio-group class="rtl mt-0 pt-0" v-model="sendingType" :row="!Res" hide-details>
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

        <AddAddress :modal="addressModal" :title="addressModalTitle" :close-modal="() => addressModal = false"/>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    import mixin from '~/mixins/mixin';
    import miniCard from '~/components/MiniCard.vue';
    import AddAddress from '~/components/AddAddress.vue';
    export default {
        async asyncData({ $axios }) {
            let { data } = await $axios({
                base$url: '' ,
                url: 'http://maskanshow.com/graphql' ,
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

                            cities(province: 11) {
                                id
                                name
                                coordinates {
                                    lat
                                    lng
                                }   
                            }
                        }
                    `
                }
            })

            return {
                provinces: data.data.provinces ,
                cities: data.data.cities
            }
        } ,

        mixins: [mixin] ,

        components: {
            miniCard ,
            AddAddress
        } ,

        mounted() {
            this.$nextTick(function() {
                this.showSlider = true;
            })
        } ,

        data() {
            return {
                changeAddrElement: false ,
                addressModal: false ,
                addressModalTitle: 'افزودن آدرس جدید' ,

                sendingType: '1' ,
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
                }   
            }
        } ,

        computed: {
            ...mapState([
                'Shopping_Cart'
            ])
        }
    }
</script>