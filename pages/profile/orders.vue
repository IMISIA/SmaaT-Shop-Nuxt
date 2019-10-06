<template>
    <section class="orders" v-if="valid_orders && valid_orders.length">
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
                <template #item.created_at="{item}">
                    <template v-if="item.created_at">
                        {{ item.created_at | created('') }}
                    </template>
                    <span v-else>---</span>
                </template>
                <template #item.paid_at="{item}">
                    <template v-if="item.paid_at">
                        <span class="text-success">
                            {{ item.paid_at | created('') }}
                        </span>
                    </template>
                    <el-tag v-else type="danger">پرداخت نشده</el-tag>
                </template>
            </v-data-table>
        </el-card>
    </section>

    <no-data v-else :buttonTitle="null" message="سفارشی ثبت نشده است"></no-data>
</template>

<script>
    import { mapState } from 'vuex';
    import moment from '~/mixins/moment';
    export default {
        mixins: [moment] ,

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
                        text: 'تاربخ پرداخت',
                        value: 'paid_at'
                    } ,
                    {
                        text: 'تخفیف',
                        value: 'offer'
                    } ,
                    {
                        text: 'مبلغ قابل پرداخت',
                        value: 'total'
                    } ,
                    {
                        text: 'وضعیت سفارش',
                        value: 'order_status',
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
            ...mapState({
                orders: state => state.Me.orders
            }) ,

            valid_orders() {
                return this.orders.map( (el,idx) => {
                    return {
                        index: (idx + 1).toLocaleString('fa-IR') ,
                        id: el.id ,
                        order_number: el.id.toUpperCase() + '#' ,
                        created_at: el.created_at ,
                        paid_at: el.paid_at ,
                        offer: el.offer ? el.offer.toLocaleString('fa-IR') + ' تومان' : '---' ,
                        total: el.total ? el.total.toLocaleString('fa-IR') + ' تومان' : '---' ,
                        order_status: el.order_status
                    }
                })
            }
        }
    }
</script>