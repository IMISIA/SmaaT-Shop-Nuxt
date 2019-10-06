<template>
    <section class="row rtl">
        <div class="col-12" :class="{ 'col-lg-6' : Me.favorites && Me.favorites.length }">
            <span class="headline-info"> اطلاعات شخصی </span>

            <el-card class="am-shadow" :body-style="{ padding : '0' }">
                <div class="row user-info">
                    <div class="col-md-6" v-for="item in information_keys" :key="item.key">
                        <span> {{ item.title }} : </span>
                        <p> {{ Me[item.key] || '---' }} </p>
                    </div>
                </div>

                <div class="box-actions">
                    <v-btn class="w-100 border-0" text color="#0ecfc6" @click="editUser.actions.modal = true">
                        <i class="lnr lnr-pencil fs-16"></i>
                        ویرایش اطلاعات شخصی
                    </v-btn>
                </div>
            </el-card>
        </div>

        <div class="col-12 col-lg-6 col-even" v-if="Me.favorites && Me.favorites.length">
            <span class="headline-info"> لیست آخرین علاقه‌مندی‌ها </span>

            <el-card class="am-shadow" :body-style="{ padding : '0' }">
                <div class="recent-fav" v-for="(fav,idx) in Me.favorites.slice(0,3)" :key="idx">
                    <mini-card
                        :variation="{ product: fav , sales_price: fav.variation ? fav.variation.sales_price : null }"
                        imageClass="col-3 col-md-2 px-2"
                        infoClass="col-7 col-md-8 py-3 pr-0"
                        mini
                        :imageSize="89"
                        :hasPrice="true"
                        :hasVariations="false">

                        <template #after>
                            <div class="col-2 flex-center">
                                <vs-button color="danger" type="border" size="small"
                                    icon="close" radius @click="DelFav(fav.id , idx)">
                                </vs-button>
                            </div>
                        </template>
                    </mini-card>
                </div>

                <div class="box-actions">
                    <v-btn class="w-100 border-0" text color="#0ecfc6">
                        <i class="lnr lnr-pencil fs-16"></i>
                         ویرایش لیست علاقه‌مندی ها
                    </v-btn>
                </div>
            </el-card>
        </div>

        <div class="col-12" v-if="false">
            <span class="headline-info"> آخرین سفارشات </span>

            <el-card v-if="valid_orders && valid_orders.length" class="am-shadow">
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
                        {{ item.created_at | created }}
                    </template>
                    <span v-else>---</span>
                </template>
                <template #item.paid_at="{item}">
                    <template v-if="item.paid_at">
                        {{ item.paid_at | created }}
                    </template>
                    <span v-else>---</span>
                </template>
            </v-data-table>
            </el-card>
            <no-data v-else :buttonTitle="null" message="سفارشی ثبت نشده است"></no-data>
        </div>

        <!-- Edit User Info -->
        <v-dialog
            v-model="editUser.actions.modal"
            width="600"
            :fullscreen="$nuxt.$res">
            <div class="dialog-title web-bg-ultra-fade">
                <v-btn text icon small @click="editUser.actions.modal = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <span> ویرایش اطلاعات شخصی </span>
            </div>

            <v-divider></v-divider>

            <div class="dialog-content">
                <v-form class="row rtl" v-model="editUser.actions.valid">
                    <div :class="item.size" v-for="item in information_keys" :key="item.key">
                        <span class="title-field required"> {{ item.title }} </span>
                        <v-text-field
                            v-if="item.key != 'gender'"
                            v-model="editUser[item.key]"
                            :label="`${item.title} خود را وارد نمایید`"
                            reverse
                            :rules="[rules[item.rule]]"
                            single-line
                            outlined
                        ></v-text-field>

                        <v-select
                            v-else
                            v-model="editUser[item.key]"
                            :items="genders"
                            item-text="name"
                            item-value="value"
                            :label="`${item.title} خود را وارد نمایید`"
                            outlined
                            single-line>
                        </v-select>
                    </div>

                    <div class="col-12">
                        <v-btn
                            class="as-btn"
                            block
                            large
                            :loading="editUser.actions.loading"
                            :disabled="!editUser.actions.valid || editUser.actions.loading"
                            @click="updateUser">
                            ثبت اطلاعات کاربری
                        </v-btn>
                    </div>
                </v-form>
            </div>
        </v-dialog>
    </section>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import miniCard from '~/components/MiniCard.vue';
    import user from '~/mixins/user';
    export default {
        mixins: [user] ,

        components: {
            miniCard
        } ,

        created() {
            this.information_keys.map( el => {
                this.editUser[el.key] = this.Me[el.key];
            })
        } ,

        data() {
            return {
                information_keys: [
                    { key: 'first_name' , title: 'نام' , rule: 'required' , size: 'col-md-6' } ,
                    { key: 'last_name' , title: 'نام خانوداگی' , rule: 'required' , size: 'col-md-6' } ,
                    // { key: 'phone_number' , title: 'شماره تلفن همراه' , size: 'col-md-6' } ,
                    { key: 'national_code' , title: 'کد ملی' , rule: 'maxCode' , size: 'col-md-6' } ,
                    { key: 'gender' , title: 'جنسیت' , rule: '' , size: 'col-md-6' } ,
                    { key: 'email' , title: 'پست الکترونیک' , rule: 'email' , size: 'col-12' } ,
                ] ,

                editUser: {
                    full_name: '' ,
                    username: '' ,
                    phone_number: '' ,
                    national_code: '' ,
                    email: '' ,
                    gender: '' ,
                    actions: {
                        modal: false ,
                        valid: false ,
                        loading: false
                    }
                } ,

                genders: [
                    { name: 'مرد' , value: true } ,
                    { name: 'زن' , value: false } ,
                    { name: 'غیره' , value: null }
                ] ,

                rules : {
                    required: value => !!value || 'این فیلد الزامی است',
                    maxCode: value => value ? value.length <= 10 || 'رمز عبور حداکثر باید 10 کاراکتر باشد' : true,
                    email: value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'پست الکترونیک نامعتبر است'
                    }
                } ,

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
                        value: 'paid_at'
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
                        text: 'وضعیت سفارش',
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
            ...mapState({
                Me: state => state.Me ,
                orders: state => state.Me.orders
            }) ,

            valid_orders() {
                let arr = [];

                this.orders.map( (el,idx) => {
                    arr.push({
                        id: el.id ,
                        index: idx.toLocaleString('fa-IR') ,
                        order_number: el.id ,
                        created_at: el.created_at ,
                        paid_at: el.paid_at ,
                        offer: el.offer.toLocaleString('fa-IR') || '---' ,
                        total_price: el.total.toLocaleString('fa-IR') || '---' ,
                        operation: el.order_status.title || '---' ,
                    })
                })

                return arr;
            }
        } ,

        methods: {
            ...mapActions([
                'Request'
            ]) ,

            updateUser() {
                this.editUser.actions.loading = true;
                
                this.Request({
                    type: 'mutation' ,
                    name: 'updateUser' ,
                    params: {
                        id: this.Me.id ,
                        first_name: this.editUser.first_name ,
                        last_name: this.editUser.last_name ,
                        email: this.editUser.email ,
                        national_code: this.editUser.national_code ,
                    } ,
                    resQuery: 'id first_name last_name email national_code' ,
                    resolverAfter: ({store , data}) => {
                        if(data.errors && data.errors.length) {
                            Object.keys(data.errors[0].validation).map( el => {
                                this.Notif(data.errors[0].validation[el], 'warning', 'error');
                            })
                            this.editUser.actions.loading = false;
                        } else if(data.data && data.data.updateUser && data.data.updateUser.id) {
                            this.editUser.actions.loading = false;
                            this.editUser.actions.modal = false;

                            this.Notif('اطلاعات شما باموفقیت بروزرسانی شد', 'primary', 'check'); 

                            store.commit('Set_state' , {
                                Prop: 'Me' ,
                                Val: data.data.updateUser ,
                                Obj_Assign: true
                            })
                        } else {
                            this.Notif('متاسفانه عملیات با موفقیت انجام نشد', 'warning', 'error');
                            this.editUser.actions.modal = false;
                        }
                    }
                })
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