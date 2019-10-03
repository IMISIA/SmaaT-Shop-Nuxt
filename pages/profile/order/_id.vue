<template>
    <section class="orders">
        <p class="alert alert-success" v-if="from_gateway">
            سفارش شما با موفقیت ثبت شد
        </p>

        <div class="d-flex rtl">
            <v-btn class="my-auto" color="#767676" text @click="$router.push('/profile/orders')">
                <v-icon right>fas fa-arrow-right</v-icon>
                <span class="fs-13"> بازگشت </span>
            </v-btn>
            <span class="headline-info border-right"> سفارش {{ order.id }} </span>
        </div>

        <el-card class="am-shadow" :body-style="{ padding : '0' }">
            <div class="row order-info">
                <div class="col-md-6" v-for="item in order_keys" :key="item.key">
                    <span> {{ item.title }} : </span>
                    <p> {{ item.prop ? order[item.key][item.prop] : order[item.key] || '---' }} </p>
                </div>
                <div class="col-md-6">
                    <span> درگاه پرداخت : </span>
                    <p> {{ order.gateway && order.gateway.payment_gateway ? order.gateway.payment_gateway.title : '---' }} </p>
                </div>
                <div class="col-md-6">
                    <span> تاریخ پرداخت : </span>
                    <p> {{ (order.paid_at || '---') | created }} </p>
                </div>
                <div class="col-md-6">
                    <span> تاریخ سفارش : </span>
                    <p> {{ (order.created_at || '---') | created }} </p>
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
                        :variation="order.items[index].variation"
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
                <swiper-slide v-for="product in order.items" :key="product.id">
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
    import MiniCard from '~/components/MiniCard.vue';
    import moment from '~/mixins/moment'
    export default {
        async asyncData({ $axios , params }) {
            let { data } = await $axios({
                method: 'POST' ,
                data: {
                    query: `
                        {
                            myOrder( id:"${params.id}" ) {
                                id
                                destination
                                phone_number
                                postal_code
                                offer
                                total
                                shipping_cost
                                paid_at
                                created_at
                                user_address {
                                    address
                                    full_name
                                }
                                order_status {
                                    id
                                    title
                                    color
                                }
                                shipping_method {
                                    name
                                }
                                gateway {
                                    id
                                    payment_gateway {
                                        title
                                    }
                                }
                                payment {
                                    tracking_code
                                }
                                items {
                                    price
                                    offer
                                    count
                                    variation {
                                        id
                                        color {
                                            name
                                            code
                                        }
                                        size {
                                            name
                                        }
                                        warranty {
                                            title
                                        }
                                        product {
                                            slug
                                        }
                                    }
                                }
                            }
                        }
                    `
                }
            })

            return {
                order: data.data.myOrder
            }
        } ,

        mixins: [moment] ,

        created() {
            if(this.$route.query.from_gateway) {
                this.from_gateway = true;
                this.$router.replace({query:null});
            }
        } ,

        components: {
            MiniCard
        } ,

        data() {
            return {
                from_gateway: false ,

                order_keys: [
                    { key: 'user_address' , prop: 'full_name' , title: 'تحویل گیرنده' , size: 'col-md-6' } ,
                    { key: 'phone_number' , title: 'شماره تماس تحویل گیرنده' , size: 'col-md-6' } ,
                    { key: 'destination' , title: 'آدرس تحویل گیرنده' , size: 'col-md-6' } ,
                    { key: 'payment' , prop: 'tracking_code' , title: 'کد رهگیری' , size: 'col-md-6' } ,
                    { key: 'shipping_method' , prop: 'name' , title: 'روش ارسال' , size: 'col-md-6' } ,
                    { key: 'shipping_cost' , title: 'هزینه ارسال' , size: 'col-md-6' } ,
                    { key: 'offer' , title: 'تخفیف' , size: 'col-md-6' } ,
                    { key: 'total' , title: 'مبلغ کل' , size: 'col-md-6' } ,
                    { key: 'order_status' , prop: 'title' , title: 'وضعیت سفارش' , size: 'col-md-6' } ,
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
            orderProducts() {
                let arr = [];

                this.order.items.map( (item,idx) => {
                    arr.push({
                        index: idx ,
                        index_fa: idx.toLocaleString('fa-IR') ,
                        slug: item.variation.product.slug ,
                        count: (item.count).toLocaleString('fa-IR') ,
                        sales_price: (item.price).toLocaleString('fa-IR') + ' تومان' ,
                        total: (item.price * item.count).toLocaleString('fa-IR') + ' تومان' ,
                        offer: (item.offer).toLocaleString('fa-IR') ,
                        final_price: ((item.price * item.count) - item.offer ).toLocaleString('fa-IR') + ' تومان'
                    })
                })

                return arr;
            }
        } ,
    }
</script>