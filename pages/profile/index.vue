<template>
    <section class="row rtl">
        <div class="col-12 col-lg-6">
            <span class="headline-info"> اطلاعات شخصی </span>

            <el-card class="am-shadow" :body-style="{ padding : '0' }">
                <div class="row user-info">
                    <div class="col-md-6" v-for="item in information_keys" :key="item.key">
                        <span> {{ item.title }} : </span>
                        <p> {{ Me[item.key] || '---' }} </p>
                    </div>
                </div>

                <div class="box-actions">
                    <v-btn class="w-100 border-0" text color="#0ecfc6">
                        <i class="lnr lnr-pencil fs-16"></i>
                        ویرایش اطلاعات شخصی
                    </v-btn>
                </div>
            </el-card>
        </div>

        <div class="col-12 col-lg-6 col-even">
            <span class="headline-info"> لیست آخرین علاقه‌مندی‌ها </span>

            <el-card class="am-shadow" :body-style="{ padding : '0' }">
                <div class="recent-fav" v-for="{variation} in Shopping_Cart.slice(0,3)" :key="variation.id">
                    <mini-card
                        :variation="variation"
                        imageClass="col-3 col-md-2 px-2"
                        infoClass="col-7 col-md-8 py-3 pr-0"
                        small
                        :imageSize="89"
                        :hasPrice="true"
                        :hasVariations="false">

                        <template #after>
                            <div class="col-2 flex-center">
                                <vs-button color="danger" type="border" size="small" icon="close" radius>
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

            <el-card class="am-shadow"></el-card>
        </div>
    </section>
</template>

<script>
    import {mapState} from 'vuex';
    import miniCard from '~/components/MiniCard.vue';
    export default {
        components: {
            miniCard
        } ,

        data() {
            return {
                information_keys: [
                    { key: 'full_name' , title: 'نام و نام خانوداگی' } ,
                    { key: 'username' , title: 'نام کاربری' } ,
                    { key: 'phone_number' , title: 'شماره تلفن همراه' } ,
                    { key: 'national_code' , title: 'کد ملی' } ,
                    { key: 'email' , title: 'پست الکترونیک' } ,
                    { key: 'gender' , title: 'جنسیت' } ,
                ]
            }
        } ,

        computed: mapState([
            'Me' ,
            'Shopping_Cart'
        ])
    }
</script>