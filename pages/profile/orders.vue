<template>
    <section class="orders">
        <span class="headline-info"> همه سفارش‌ها </span>

        <el-card class="am-shadow rtl" :body-style="{ padding: 0 }">
            <v-data-table
                :headers="tableHeaders"
                :items="valid_orders"
                :disable-sort="$nuxt.$res"
                hide-default-footer>
                <template #item.order-more="{item}">
                    <nuxt-link :to="'/profile/order/' + item.id">
                        <v-icon :small="$nuxt.$res">fas fa-chevron-left</v-icon>
                    </nuxt-link>
                </template>
                </v-data-table>
        </el-card>
    </section>
</template>

<script>
    export default {
        async asyncData({ $axios , params }) {
            let { data } = await $axios({
                method: 'POST' ,
                data: {
                    query: `
                        {   
                            me {
                                orders {
                                    id
                                    offer
                                    total
                                    shipping_cost
                                    paid_at
                                    created_at
                                    order_status {
                                        id
                                        title
                                        color
                                    }
                                    shipping_method {
                                        name
                                    }
                                }
                            }
                        }
                    `
                }
            })

            return {
                orders: data.data.me.orders
            }
        } ,


        data() {
            return {
                tableHeaders: [
                    {
                        text: '#',
                        value: 'index'
                    } ,
                    {
                        text: 'شماره سفارش',
                        value: 'order_number',
                        sortable: false
                    } ,
                    {
                        text: 'تاریخ ثبت سفارش',
                        value: 'created_at'
                    } ,
                    {
                        text: 'زمان تحویل سفارش',
                        value: 'order_delivery_date'
                    } ,
                    {
                        text: 'تخفیف',
                        value: 'offer'
                    } ,
                    {
                        text: 'مبلغ قابل پرداخت',
                        value: 'total_price'
                    } ,
                    {
                        text: 'عملیات پرداخت',
                        value: 'operation',
                        sortable: false
                    } ,
                    {
                        text: 'جزییات',
                        value: 'order-more',
                        sortable: false ,
                    }
                ]
            }
        } ,

        computed: {
            valid_orders() {
                let arr = [];

                this.orders.map( (el,idx) => {
                    arr.push({
                        id: el.id ,
                        index: idx.toLocaleString('fa-IR') ,
                        order_number: el.id ,
                        created_at: el.created_at || '---' ,
                        order_delivery_date: el.paid_at || '---' ,
                        offer: el.offer.toLocaleString('fa-IR') || '---' ,
                        total_price: el.total.toLocaleString('fa-IR') || '---' ,
                        operation: el.order_status.title || '---' ,
                    })
                })

                return arr;
            }
        }
    }
</script>