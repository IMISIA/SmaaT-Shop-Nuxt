<template>
    <section class="orders" v-if="!$route.params.id">
        <span class="headline-info"> همه سفارش‌ها </span>

        <el-card class="am-shadow rtl" :body-style="{ padding: 0 }">
            <v-data-table
                :headers="tableHeaders"
                :items="Orders"
                :disable-sort="$nuxt.$res"
                hide-default-footer>
                <template #item.order-more="{item}">
                    <nuxt-link :to="$route.path + '/' + item.id">
                        <v-icon :small="$nuxt.$res">fas fa-chevron-left</v-icon>
                    </nuxt-link>
                </template>
                </v-data-table>
        </el-card>
    </section>

    <nuxt v-else/>
</template>

<script>
    export default {
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
                        text: 'مبلغ قابل پرداخت',
                        value: 'final_price'
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
            Orders() {
                let arr = [];

                for (let idx = 1; idx <= 5; idx++) {
                    arr.push({
                        id: 'order-' + idx ,
                        index: idx.toLocaleString('fa-IR') ,
                        order_number: 'DKC-69453565' ,
                        created_at: '۲۶ شهریور ۱۳۹۸' ,
                        order_delivery_date: 'لغو شده' ,
                        final_price: (idx * 10000).toLocaleString('fa-IR') ,
                        total_price: (idx * 10000).toLocaleString('fa-IR') ,
                        operation: 'لغو شده' ,
                    })
                }

                return arr;
            }
        }
    }
</script>