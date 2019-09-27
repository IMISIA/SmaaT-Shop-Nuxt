<template>
    <section class="orders">
        <div class="d-flex rtl">
            <v-btn class="my-auto" color="#767676" text @click="$router.push('/profile/orders')">
                <v-icon right>fas fa-arrow-right</v-icon>
                <span class="fs-13"> بازگشت </span>
            </v-btn>
            <span class="headline-info border-right"> سفارش DKC-69453565 </span>
        </div>

        <el-card class="am-shadow" :body-style="{ padding : '0' }">
            <div class="row order-info">
                <div class="col-md-6" v-for="item in order_keys" :key="item.key">
                    <span> {{ item.title }} : </span>
                    <p> {{ false || '---' }} </p>
                </div>
            </div>
        </el-card>

        <span class="headline-info"> مرسوله </span>
        <el-card class="am-shadow rtl" :body-style="{ padding: 0 }">
            <v-data-table
                v-if="$vuetify.breakpoint.lgAndUp"
                :headers="tableOrderHeaders"
                :items="orderProducts"
                hide-default-footer>
                <template #item.product="{item: {index}}">
                    <mini-card
                        :variation="Shopping_Cart[index].variation"
                        mini
                        all-small-variations
                        image-class="col-4 pr-0"
                        :image-size="80"
                        info-class="col-8 pr-0 py-2"
                        :truncate="30">
                    </mini-card>
                </template>

                <template #item.actions="{item}">
                    <div class="d-flex flex-column">
                        <v-btn class="fs-10" small outlined color="#85b3be"
                            :to="`/product/${item.slug}`">
                            خرید مجدد
                        </v-btn>
                        <v-btn class="fs-10 mt-2" small outlined color="#85b3be"
                            :to="`/product/${item.slug}/comments#add`">
                            ثبت نظر
                        </v-btn>
                    </div>
                </template>
            </v-data-table>

            <swiper v-else class="checkout p-3" :options="SwiperOption">
                <swiper-slide v-for="product in Shopping_Cart" :key="product.id">
                    <mini-card
                        :variation="product.variation"
                        :image-size="100"
                        image-class="col-12"
                        info-class="col-12"
                        variations-class="text-center my-1"
                        mini
                        :truncate="$nuxt.$res ? 25 : 35">
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
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    import MiniCard from '~/components/MiniCard.vue';
    export default {
        components: {
            MiniCard
        } ,

        data() {
            return {
                order_keys: [
                    { key: 'user' , title: 'تحویل گیرنده' , size: 'col-md-6' } ,
                    { key: 'phone_number' , title: 'شماره تماس تحویل گیرنده' , size: 'col-md-6' } ,
                    { key: 'address' , title: 'آدرس تحویل گیرنده' , size: 'col-md-6' } ,
                    { key: 'count' , title: 'تعداد مرسوله' , size: 'col-md-6' } ,
                    { key: 'price' , title: 'مبلغ قابل پرداخت' , size: 'col-md-6' } ,
                    { key: 'مبلغ کل' , title: 'مبلغ کل' , size: 'col-md-6' } ,
                ] ,

                tableOrderHeaders: [
                    {
                        text: '#',
                        value: 'index_fa'
                    } ,
                    {
                        text: 'نام محصول',
                        value: 'product',
                        sortable: false
                    } ,
                    {
                        text: 'تعداد',
                        value: 'count'
                    } ,
                    {
                        text: 'قیمت واحد',
                        value: 'sales_price'
                    } ,
                    {
                        text: 'قیمت کل',
                        value: 'total'
                    } ,
                    {
                        text: 'تخفیف',
                        value: 'offer'
                    } ,
                    {
                        text: 'قیمت نهایی',
                        value: 'final_price',
                    } ,
                    {
                        text: 'عملیات',
                        value: 'actions',
                        sortable: false ,
                    }
                ] ,

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
            ]) ,

            orderProducts() {
                let arr = [];

                this.Shopping_Cart.map( (item,idx) => {
                    arr.push({
                        index: idx ,
                        index_fa: idx.toLocaleString('fa-IR') ,
                        slug: item.variation.product.slug ,
                        count: (item.count).toLocaleString('fa-IR') ,
                        sales_price: (item.variation.sales_price).toLocaleString('fa-IR') + ' تومان' ,
                        total: (item.variation.sales_price * item.count).toLocaleString('fa-IR') + ' تومان' ,
                        offer: (0).toLocaleString('fa-IR') ,
                        final_price: (item.variation.sales_price * item.count).toLocaleString('fa-IR') + ' تومان'
                    })
                })

                return arr;
            }
        } ,
    }
</script>