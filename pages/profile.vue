<template>
    <section class="container-fluid profile pt-3">
        <div class="row flex-md-row-reverse">
            <div class="col-lg-3 col-md-4 mb-3 mb-md-0">
                <section id="profile-aside">
                    <el-card class="am-shadow" :body-style="{ padding : '0' }">
                        <div class="box-header web-bg-ultra-fade">
                            <v-avatar size="80">
                                <img :src=" Me.avatar && Me.avatar.small ? $url + Me.avatar.small : '/images/user.png' "
                                    class="mb-n5" alt="avatar">
                            </v-avatar>
                        </div>

                        <div class="box-username">
                            {{ Me.full_name }}
                        </div>

                        <div class="box-actions row">
                            <!-- <v-btn class="col-6 col-sm-12 col-lg-6" text color="#515151">
                                تغییر رمز عبور
                                <i class="lnr lnr-lock"></i>
                            </v-btn> -->

                            <v-btn class="col-12" text color="#dc3545" @click="Logout">
                                خروج از حساب
                                <i class="lnr lnr-exit"></i>
                            </v-btn>
                        </div>
                    </el-card>

                    <el-card class="am-shadow mt-3 profile-menu" :body-style="{ padding : '0px' }">
                        <div slot="header">
                            حساب کاربری شما
                        </div>

                        <el-menu :default-active="$route.path.split('/')[2]" active-text-color="#0ecfc6" text-color="#515151">
                            <el-menu-item
                                v-for="item in itemsMenu"
                                :key="item.index"
                                :index="item.index"
                                @click="RouterMenu">
                                <i :class="item.icon"></i>
                                <span> {{ item.title }} </span>
                            </el-menu-item>
                        </el-menu>
                    </el-card>
                </section>
            </div>

            <div class="col-lg-9 col-md-8 pr-md-0" id="profile-content">
                <nuxt />
            </div>
        </div>
    </section>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import mixin from '~/mixins/mixin';
    import Cookie from '~/plugins/cookie';

    export default {
        // validate({ store }) {
        //     return typeof store.state.Me === 'object' && Object.keys(store.state.Me).length !== 0 ? true : false;
        // } ,

        async fetch({ $axios , store , req }) {
            let JWT = Cookie.get('JWT' , req.headers.cookie);

            $axios.setToken(JWT , 'Bearer');
            if(JWT) $axios.defaults.baseURL = $axios.defaults.baseURL + '/auth';

            let { data } = await $axios({
                method: 'POST' ,
                data: {
                query: `
                    {
                        me {
                            id
                            phones {
                                type
                                phone_number
                            }
                            national_code
                            favorites {
                                id
                                slug
                                name
                                photos {
                                    id
                                    file_name
                                    small
                                }
                                variation {
                                    id
                                    sales_price
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

        mixins: [mixin] ,

        data() {
            return {
                itemsMenu: [
                    { index: '' , title: 'پروفایل' , icon: 'el-icon-user' } ,
                    { index: 'favorites' , title: 'علاقه‌مندی ها' , icon: 'el-icon-star-off' } ,
                    { index: 'orders' , title: 'لیست سفارشات' , icon: 'el-icon-sold-out' } ,
                    { index: 'comments' , title: 'نقد و نظرات' , icon: 'el-icon-s-comment' } ,
                    { index: 'addresses' , title: 'آدرس ها' , icon: 'el-icon-guide' } ,
                    // { index: 'history' , title: 'بازدیدهای اخیر' , icon: 'el-icon-time' } ,
                ]    
            }
        } ,

        mounted() {
            this.$nextTick(function() {
                if(!this.Res) this.DynamicSidebar('#profile-aside' , '#profile-content' , 0)
            })
        } ,

        computed: mapState([
            '$url' ,
            'Me'
        ]) ,

        methods: {
            ...mapActions([
                'Logout'
            ]) ,

            RouterMenu(event) {
                this.$router.push('/profile/' + event.index)
            }
        }
    }
</script>