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

        <div class="col-12">
            <span class="headline-info"> آخرین سفارشات </span>

            <el-card v-if="false" class="am-shadow"></el-card>
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
                            v-model="editUser[item.key]"
                            :label="`${item.title} خود را وارد نمایید`"
                            reverse
                            single-line
                            outlined
                        ></v-text-field>
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
                console.log(this.Me , el);
                this.editUser[el.key] = this.Me[el.key];
            })
        } ,

        data() {
            return {
                information_keys: [
                    { key: 'first_name' , title: 'نام' , size: 'col-md-6' } ,
                    { key: 'last_name' , title: 'نام خانوداگی' , size: 'col-md-6' } ,
                    // { key: 'phone_number' , title: 'شماره تلفن همراه' , size: 'col-md-6' } ,
                    { key: 'national_code' , title: 'کد ملی' , size: 'col-md-6' } ,
                    { key: 'gender' , title: 'جنسیت' , size: 'col-md-6' } ,
                    { key: 'email' , title: 'پست الکترونیک' , size: 'col-12' } ,
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
                }
            }
        } ,

        computed: mapState([
            'Me'
        ]) ,

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