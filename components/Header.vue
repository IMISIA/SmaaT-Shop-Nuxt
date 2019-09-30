<template>
    <header class="smt-header">
        <div class="container-fuild py-2 px-md-3">
            <div class="row rtl py-md-2 mx-0">
                <div class="col-lg-2 col-md-2 col-sm-3 d-flex align-items-center justify-content-center">
                    <div class="hamburger hamburger--spin js-hamburger" v-show="Res"
                         @click="drawerCtg = true">
                        <div class="hamburger-box">
                            <div class="hamburger-inner"></div>
                        </div>
                    </div>

                    <v-spacer v-show="Res"></v-spacer>

                    <nuxt-link to="/" class="d-inline-block link-logo">
                        <img
                            class="site-logo"
                            :src=" SiteSetting.logo && SiteSetting.logo.medium ? $url + SiteSetting.logo.medium : '/images/none.png' "
                            alt="logo">
                    </nuxt-link>
                </div>

                <div class="col-lg-10 col-md-10 ltr col-sm-9 d-flex align-items-center mt-1 mt-md-0">
                    <template v-if="!Res">
                        <!-- Shopping Cart -->
                        <el-badge class="item" :value="Shopping_Cart.length">
                            <vs-button class="cart-btn" :color="web_color" type="filled"
                                icon-pack="lnr lnr-cart" icon="." icon-after
                                @click="Shopping_Cart.length ? drawerCart = true : $router.push('/cart')">
                                سبد خرید    
                            </vs-button>
                        </el-badge>
                            
                        <!-- Login / Register -->
                        <div class="m-auto">
                            <vs-dropdown vs-custom-content vs-trigger-click>
                                <a class="login-text mx-4" href.prevent>
                                    <v-icon light>keyboard_arrow_down</v-icon>
                                    <template v-if="is_exist(Me)">
                                        {{ Me.full_name.trim() || Me.username || Me.email }}
                                        <v-avatar class="ml-2 d-none d-xl-inline-flex" :size="40" :color="web_color">
                                            <img
                                                :src=" Me.avatar && Me.avatar.small ? $url + Me.avatar.small : '/images/user.png' "
                                                alt="avatar">
                                        </v-avatar>
                                    </template>
                                    <template v-else>
                                        ورود / ثبت نام
                                    </template>
                                </a>

                                <vs-dropdown-menu class="rtl">
                                    <v-list dense shaped class="py-0" v-if="is_exist(Me)">
                                        <v-list-item-group :color="web_color">
                                            <v-list-item to="/profile">
                                                <v-list-item-action class="pl-2">
                                                    <i class="fs-18 ml-2 lnr lnr-user"></i>
                                                </v-list-item-action>
                                                <v-list-item-content>
                                                    <v-list-item-title class="fs-12 text-right"> پنل کاربری </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>

                                            <v-list-item @click="Logout">
                                                <v-list-item-action class="pl-2 text-danger">
                                                    <i class="fs-18 ml-2 lnr lnr-exit"></i>
                                                </v-list-item-action>
                                                <v-list-item-content>
                                                    <v-list-item-title class="fs-12 text-right text-danger"> خروج از حساب </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list>
                                    
                                    <div class="py-2 px-3" v-else>
                                        <v-btn
                                            class="as-btn fs-13"
                                            :color="web_color"
                                            block
                                            dark
                                            @click="openModal('login')">
                                            ورود به سایت
                                        </v-btn>

                                        <div class="text-center mt-3">
                                            <span class="text-muted fs-12"> کاربر جدید هستید؟ </span>
                                            <el-link type="primary fs-12 mr-1" @click="openModal('register')">ثبت‌نام</el-link>
                                        </div>
                                    </div>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </div>
                    </template>

                    <template v-else>
                        <el-badge class="res-cart-btn" :value="Shopping_Cart.length">
                            <span class="lnr lnr-cart h2" 
                                @click="Shopping_Cart.length ? drawerCart = true : $router.push('/cart')">
                            </span>
                        </el-badge>
                        <span class="lnr lnr-user" @click="$auth ? $router.push('/profile') : openModal('login')"></span>
                    </template>

                    <div class="search-site d-flex rtl ml-auto" :class=" Res ? 'w-75' : 'w-50' ">
                        <el-select
                            class="w-100"
                            v-model="Search.query"
                            filterable
                            remote
                            no-data-text="متاسفانه محصولی یافت نشد"
                            loading-text="در حال جستجو ..."
                            placeholder="جستجو در فروشگاه ..."
                            :remote-method="Search_Method"
                            :loading="Search.loading">
                            <el-option v-for="item in Search.result" :key="item.id"
                                class="element-search" :value="item.id">
                                <mini-card
                                    :variation="{ product: item , sales_price: item.variation ? item.variation.sales_price : null }"
                                    mini
                                    :has-variations="false"
                                    :has-price="true"
                                    image-class="col-3 pr-0"
                                    :image-size="80"
                                    info-class="col-9 pr-0 py-2">
                                </mini-card>
                            </el-option>
                            <el-option class="fs-13 text-center rtl" v-if="is_exist(Search.result) && Search.total > 10">
                                <nuxt-link class="color-inherit" :to="{path:'/category', query:{query:Search.query}}">
                                    نمایش تمام نتایج برای
                                    <span class="web-color">{{ Search.query }}</span>
                                    <span class="text-muted fs-10"> ( {{ Search.total - 10 | Num2Fa }} نتیجه دیگر ) </span>
                                </nuxt-link>
                            </el-option>
                        </el-select>
                        <el-button class="web-bg-fade text-white" slot="append" icon="el-icon-search"></el-button>
                    </div>
                </div>
            </div>
        </div>

        <nav class="categories" v-if="!Res && is_exist(Categories)">
            <ul class="rtl">
                <span class="ctg-hover web-bg"></span>
                <li class="ctg-item" v-for="ctg in Categories" :key="ctg.id">
                    <nuxt-link :to="`/category/${ctg.id}`">
                        {{ ctg.title }}
                        <i class="lnr lnr-chevron-down mr-2" v-if="is_exist(ctg.childs)"></i>
                    </nuxt-link>

                    <div class="dropdown-menu mega-menu" v-if="is_exist(ctg.childs)">
                        <div class="row mx-0 p-3">
                            <div class="col-md-8">
                                <div class="row flex-column">
                                    <div class="col-4 col-lg-3 mb-1" v-for="sub_1 in ctg.childs" :key="sub_1.id">
                                        <nuxt-link :to="`/category/${sub_1.id}`">
                                            <p class="sub_1 web-color">
                                                <i class="lnr lnr-chevron-left bold"></i>
                                                {{ sub_1.title }}
                                            </p>
                                        </nuxt-link>
                                        <ul class="sub_2" v-if="is_exist(sub_1.childs)">
                                            <li v-for="sub_2 in sub_1.childs" :key="sub_2.id">
                                                <nuxt-link :to="`/category/${sub_2.id}`">
                                                    {{ sub_2.title }}
                                                </nuxt-link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <v-img
                                    :src=" ctg.logo && ctg.logo.medium
                                    ? $url + ctg.logo.medium
                                    : SiteSetting.logo && SiteSetting.logo.medium ? $url + SiteSetting.logo.medium : '/images/none.png' "
                                    class="mr-auto"
                                    max-height="250"
                                    max-width="250"
                                    aspect-ratio="1"
                                    contain
                                />
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>

        <v-app>
            <v-navigation-drawer v-model="drawerCtg" fixed right temporary width="280">
                <div class="user-info-drawer" v-if="is_exist(Me)">
                    <v-avatar :size="55" :color="web_color">
                        <img
                            :src=" Me.avatar && Me.avatar.small ? $url + Me.avatar.small : '/images/user.png' "
                            alt="avatar">
                    </v-avatar>
                    <span>
                        {{ Me.full_name.trim() || Me.username || Me.email }}
                    </span>
                </div>

                <div v-else class="text-center p-3">
                    <img
                        class="site-logo"
                        :src=" SiteSetting.logo && SiteSetting.logo.medium ? $url + SiteSetting.logo.medium : '/images/none.png' "
                        alt="logo">
                </div>

                <span class="d-block border-top w-75 m-auto"></span>

                <v-list class="ctg-list" dense shaped>
                    <template v-for="ctg in Categories">
                        <v-list-group v-if="is_exist(ctg.childs)" :key="ctg.id"
                            :prepend-icon="ctg.icon || 'category'" :color="web_color" no-action>
                            <template v-slot:activator>
                                <v-list-item-title>
                                    {{ ctg.title }}
                                </v-list-item-title>
                            </template>

                            <template v-for="sub_1 in ctg.childs">
                                <v-list-group v-if="is_exist(sub_1.childs)" :key="sub_1.id"
                                    :color="web_color" sub-group no-action>
                                    <template v-slot:activator>
                                        <v-list-item-content>
                                            <v-list-item-title> {{ sub_1.title }} </v-list-item-title>
                                        </v-list-item-content>
                                    </template>

                                    <v-list-item v-for="sub_2 in sub_1.childs" :key="sub_2.id"
                                        :to="`category/${sub_2.id}`">
                                        <v-list-item-title> {{ sub_2.title }} </v-list-item-title>
                                    </v-list-item>
                                </v-list-group>

                                <v-list-item v-else class="sub-1" :key="sub_1.id" :to="`category/${sub_1.id}`">
                                    <v-list-item-title> {{ sub_1.title }} </v-list-item-title>
                                </v-list-item>
                            </template>
                        </v-list-group>

                        <v-list-item v-else :key="ctg.id" :color="web_color" :to="`category/${ctg.id}`">
                            <v-list-item-icon>
                                <v-icon> {{ ctg.icon || 'category' }} </v-icon>
                            </v-list-item-icon>

                            <v-list-item-title>
                                {{ ctg.title }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                </v-list>
            </v-navigation-drawer>

            <v-navigation-drawer v-model="drawerCart" fixed temporary width="340">
                <v-toolbar>
                    <v-btn color="#808695" fab small text @click="drawerCart = false">
                        <v-icon class="fs-20">fas fa-arrow-left</v-icon>
                    </v-btn>

                    <div class="flex-grow-1"></div>

                    <v-btn text :color="web_color" to="/cart">
                        مشاهده سبد خرید
                    </v-btn>
                </v-toolbar>

                <section class="drawer-cart-content web-bg-ultra-fade">
                    <mini-card
                        v-for="item in Shopping_Cart"
                        :key="item.id"
                        :variation="item.variation"
                        :count="item.count"
                        mini
                        :all-small-variations="false"
                        image-class="col-4 pr-0"
                        :image-size="80"
                        info-class="col-8 pr-0 py-2">
                    </mini-card>
                </section>

                <div class="drawer-cart-action">
                    <div class="drawer-final-price">
                        <span class="final-price-text">مبلغ قابل پرداخت</span>

                        <span class="final-price-amount" data-price="تومان">
                            {{ finalPrice | Num2Fa }}
                        </span>
                    </div>

                    <v-btn class="as-btn" large block to="/checkout">
                        نهایی کردن سفارش
                        <v-icon class="ml-3">check</v-icon>
                    </v-btn>
                </div>
            </v-navigation-drawer>
        </v-app>

        <transition name="fade">
            <section v-if="$nuxt.isOffline && !offline_is_ok" id="is-offline">
                <div>
                    <svg height="80px" width="80px" viewBox="0 0 512.00057 512" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink">
                        <linearGradient id="a" gradientUnits="userSpaceOnUse" x1=".00009" x2="512.000075" y1="256.000735" y2="256.000735">
                            <stop offset="0" :stop-color="web_color" />
                            <stop offset=".0208" :stop-color="web_color" />
                            <stop offset=".2931" :stop-color="web_color" />
                            <stop offset=".5538" :stop-color="web_color_dark" />
                            <stop offset=".7956" :stop-color="web_color_dark" />
                            <stop offset="1" :stop-color="web_color_dark" />
                        </linearGradient>
                        <path
                            d="m288 433c0 18.226562-14.773438 33-33 33s-33-14.773438-33-33c0-18.222656 14.773438-33 33-33s33 14.777344 33 33zm-99.589844-340.515625c21.96875-4.964844 44.707032-7.484375 67.59375-7.484375 84.671875 0 163.285156 34.320312 221.367188 96.636719 3.9375 4.226562 9.277344 6.363281 14.632812 6.363281 4.882813 0 9.777344-1.777344 13.632813-5.367188 8.082031-7.53125 8.523437-20.1875.996093-28.269531-65.730468-70.523437-154.738281-109.363281-250.636718-109.363281-25.839844 0-51.546875 2.847656-76.402344 8.46875-10.777344 2.433594-17.535156 13.140625-15.101562 23.914062 2.433593 10.777344 13.144531 17.539063 23.917968 15.101563zm86.910156 88.503906c-1.964843 10.871094 5.25 21.273438 16.121094 23.242188 42.1875 7.628906 81.386719 28.6875 113.359375 60.90625 3.910157 3.9375 9.054688 5.910156 14.195313 5.910156 5.09375 0 10.191406-1.933594 14.089844-5.804687 7.839843-7.78125 7.886718-20.445313.105468-28.285157-37.78125-38.066406-84.335937-62.992187-134.632812-72.089843-10.867188-1.96875-21.273438 5.253906-23.238282 16.121093zm230.820313 296.871094-472-472c-7.808594-7.8125-20.472656-7.8125-28.28125 0-7.8125 7.808594-7.8125 20.472656 0 28.285156l65.078125 65.078125c-23.753906 15.398438-45.746094 33.875-65.566406 55.144532-7.53125 8.078124-7.085938 20.734374.992187 28.265624 3.855469 3.589844 8.75 5.367188 13.632813 5.367188 5.355468 0 10.695312-2.136719 14.636718-6.363281 19.585938-21.015625 41.519532-38.941407 65.308594-53.410157l55.097656 55.097657c-27.894531 12.867187-53.863281 31.085937-76.238281 53.636719-7.78125 7.839843-7.730469 20.503906.109375 28.285156 3.902344 3.871094 8.992188 5.800781 14.085938 5.800781 5.144531 0 10.289062-1.972656 14.199218-5.910156 23.039063-23.222657 49.382813-40.417969 78.40625-51.25l64.21875 64.21875c-32.773437 1.339843-67.949218 17.046875-92.824218 41.6875-7.84375 7.773437-7.902344 20.4375-.128906 28.285156 3.910156 3.945313 9.058593 5.921875 14.207031 5.921875 5.085937 0 10.175781-1.925781 14.078125-5.789062 18.523437-18.351563 45.679687-30.210938 69.191406-30.210938h.007812 1.449219.011719c15.09375 0 31.875 4.847656 47.253906 13.648438.195313.109374.398438.195312.597656.300781l174.195313 174.195312c3.902344 3.902344 9.023437 5.855469 14.140625 5.855469s10.238281-1.953125 14.140625-5.855469c7.8125-7.8125 7.8125-20.476562 0-28.285156zm0 0"
                            fill="url(#a)" />
                    </svg>

                    <p> خطا در اتصال به اینترنت ! </p>
                    <span> لطفا اتصال خود را بررسی کنید </span>

                    <v-btn :color="web_color_dark" text @click="OK"> باشه </v-btn>
                </div>
            </section>
        </transition>
    </header>
</template>

<script>
    import { mapState , mapMutations , mapActions } from 'vuex';
    import mixin from '~/mixins/mixin';
    import MiniCard from '~/components/MiniCard.vue';

    export default {
        mixins : [mixin] ,

        components: {
            MiniCard
        } ,

        created() {
            if(process.client) this.Dynamic_Color();
            if(true && process.client) this.AutoSize();
        } ,

        mounted() {
            $('.categories').ready(function() {
                $('li.ctg-item').hover(
                    function () {
                        let offerFromRight = $(this).parent().width() - ($(this).outerWidth() + $(this).position().left)
                        $('.ctg-hover').css({
                            transform: 'scaleX(1)' ,
                            right: offerFromRight ,
                            width: $(this).outerWidth()
                        })

                        if( $(this).find('i.lnr-chevron-down').length ) {
                            $('#categories-overlay').addClass('show');
                        }
                        $(this).find('div.mega-menu').removeClass('d-block fadeOutDown').addClass('d-block fadeInUp');
                    } ,
                    function () {
                        $('.ctg-hover').css({
                            transform: ''
                        })
                        $('#categories-overlay').removeClass('show');
                        $(this).find('div.mega-menu').addClass('fadeOutDown');
                        setTimeout(() => {
                            if( !$(this).is(':hover') ) {
                                $(this).find('div.mega-menu').removeClass('d-block fadeOutDown');
                            }
                        }, 500);
                    }
                );

                $('div.mega-menu').hover(
                    function () {
                        $(this).addClass('d-block')
                    } ,
                    function () {
                        if( !$(this).parent().is(':hover') ) {
                            $(this).css({ pointerEvents: 'none' });
                            $(this).addClass('fadeOutDown');
                            setTimeout(() => {
                                $(this).removeClass('d-block fadeOutDown');
                                $(this).css({ pointerEvents: '' });
                            }, 500);
                        }
                    }
                );

                $('p.sub_1').hover(
                    function () {
                        $(this).removeClass('web-color').addClass('web-color-dark');
                    } ,
                    function () {
                        $(this).removeClass('web-color-dark').addClass('web-color');
                    }
                );
            })
        } ,

        data() {
            return {
                drawerCtg : false ,
                drawerCart : false ,

                Search: {
                    query: '' ,
                    result: null ,
                    total: 0 ,
                    loading: false ,
                    timeout : null
                } ,

                Login: {
                    dialog: false ,
                    email: '' ,
                    password: ''
                } ,

                Register: {
                    dialog: false ,
                    email: '' ,
                    password: '' ,
                    confirm_password: ''
                } ,

                offline_is_ok: false
            }
        } ,

        computed : {
            ...mapState([
                '$url' ,
                '$auth' ,
                'SiteSetting' ,
                'Me' ,
                'Shopping_Cart' ,
                'Categories'
            ]) ,

            finalPrice() {
                return this.Shopping_Cart.reduce( (total,el) => total + el.count * el.variation.sales_price , 0 )
                + 10000 - 7500;
            }
        } ,

        methods : {
            ...mapMutations([
                'openModal'
            ]) ,

            ...mapActions([
                'Request' ,
                'Logout'
            ]) ,

            Dynamic_Color() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.id = 'web-color'
                style.innerHTML = `

                    /* =============== Colors =============== */

                    .web-color {
                        color : ${this.web_color} !important;
                    }

                    .web-color-light {
                        color : ${this.web_color_light} !important;
                    }

                    .web-color-dark {
                        color : ${this.web_color_dark} !important;
                    }

                    .web-color-fade {
                        color : ${this.web_color_fade} !important;
                    }

                    /* =============== Backgrounds =============== */

                    .web-bg {
                        background: ${this.web_color} !important;
                    }

                    .web-bg-light {
                        background: ${this.web_color_light} !important;
                    }

                    .web-bg-dark {
                        background: ${this.web_color_dark} !important;
                    }

                    .web-bg-fade {
                        background: ${this.web_color_fade} !important;
                    }

                    .web-bg-ultra-fade {
                        background: ${this.web_color_ultra_fade} !important;
                    }

                    /* =============== Gradients =============== */

                    .web-grd-to-light {
                        background: -webkit-linear-gradient(90deg, ${this.web_color_light} 10%, ${this.web_color} 90%) !important;
                        background: -moz-linear-gradient(90deg, ${this.web_color_light} 10%, ${this.web_color} 90%) !important;
                        background: -o-linear-gradient(90deg, ${this.web_color_light} 10%, ${this.web_color} 90%) !important;
                        background: linear-gradient(90deg, ${this.web_color_light} 10%, ${this.web_color} 90%) !important;
                    }

                    .web-grd-from-dark {
                        background: -webkit-linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%) !important;
                        background: -moz-linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%) !important;
                        background: -o-linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%) !important;
                        background: linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%) !important;
                    }

                    .web-grd-text {
                        background: -webkit-linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%);
                        background: -moz-linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%);
                        background: -o-linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%);
                        background: linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%);              
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    /* =============== Borders =============== */

                    .web-border {
                        border : 1px solid ${this.web_color} !important;
                    }

                    /* =============== Other =============== */

                    .as-btn {
                        background: -webkit-linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%);
                        background: -moz-linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%);
                        background: -o-linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%);
                        background: linear-gradient(90deg, ${this.web_color} 10%, ${this.web_color_dark} 90%);
                        color: #fff !important;
                        box-shadow: 0px 2px 5px -2px ${this.web_color};
                        border-radius: 10px !important;
                    }

                    .cart-btn {
                        box-shadow: 0px 2px 5px -2px ${this.web_color} !important;
                        border-radius: 8px !important;
                    }

                    .el-slider__bar ,
                    .vs-dropdown--menu--after {
                        background: ${this.web_color} !important;
                    }

                    .smt-header .el-input--suffix .el-input__inner ,
                    .search-site .el-button ,
                    .el-radio.is-bordered.is-checked {
                        border-color: ${this.web_color} !important;
                    }

                    .vs-dropdown--menu ,
                    .el-card.offer-slider ,
                    .el-card.product-slider  {
                        border-top-color: ${this.web_color} !important;
                    }

                    .products-ctg .el-radio-button__orig-radio:checked+.el-radio-button__inner {
                        box-shadow: 0px 2px 5px -2px ${this.web_color} !important;
                    }

                    .products-ctg .el-radio-button__orig-radio:checked+.el-radio-button__inner:hover {
                        color: #fff !important;
                    }

                    .products-ctg .el-radio-button__inner:hover ,
                    .el-radio__input.is-checked+.el-radio__label ,
                    .products-ctg .el-radio__input.is-checked+.el-radio__label {
                        color: ${this.web_color} !important;
                    }

                    .el-slider__button ,
                    .products-ctg .el-radio.is-bordered.is-checked {
                        border-color: ${this.web_color} !important;
                    }

                    .checkout .v-stepper__step--active .v-stepper__step__step {
                        box-shadow: 0px 2px 5px -2px ${this.web_color};
                    }

                `;
                document.getElementsByTagName('head')[0].appendChild(style);
            } ,

            AutoSize() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
                    .image-slider , .aside-poster , .poster {
                        height: 400px;
                    }

                    @media (min-width: 600px) and (max-width: 1000px) {
                        .image-slider , .aside-poster {
                            height: 300px;
                        }
                    }

                    @media (max-width: 600px) {
                        .image-slider {
                            height: 200px;
                        }
                    }
                `;
                document.getElementsByTagName('head')[0].appendChild(style);
            } ,

            Search_Method(str) {
                this.Search.query = str;

                if(str) {
                    this.Search.loading = true;
                } else {
                    this.Search.result = null;
                    return;
                }

                clearTimeout(this.Search.timeout);
                this.Search.timeout = setTimeout(() => {
                    this.Request({
                        name: 'products' ,
                        params: { query: str } ,
                        resQuery: `
                            data {
                                id
                                name
                                slug
                                photos {
                                    id
                                    file_name
                                    small
                                }
                                variation {
                                    sales_price
                                }
                            }
                            total
                        ` ,
                        resolverAfter: (state , data) => {
                            this.Search.result = data.data.products.data;
                            this.Search.total = data.data.products.total;
                            this.Search.loading = false;
                        } ,
                    })
                }, 1000);
            } ,

            OK() {
                offline_is_ok = true;
                setTimeout(() => {
                    offline_is_ok = false;
                }, 5 * 60 * 1000);
            }
        }
    }
</script>

<style lang="scss">
    .ctg-list {
        transform: scaleX(-1);
        padding: 8px;
        .v-list-item__title {
            transform: scaleX(-1);
            text-align: right;
            font-size: 12px !important;
        }
        .sub-1 {
            padding-left: 58px !important;
        }
    }

    .v-navigation-drawer {
        .v-list-item__icon:first-child {
            margin-right: 10px !important;
            i {
                font-size: 18px !important;
                margin-top: 4px;
            }
        }
    }

    .con-vs-dropdown--menu {
        .vs-dropdown--menu {
            border-top: 2px solid;
            z-index: 11;
        }
    }

    .el-select__input ,
    .el-input--suffix input {
        font-size: 13px;
        text-align: right;
    }

    .smt-header .el-input--suffix .el-input__inner {
        background: #f9f9f9 !important;
        color: #474747;
        &::placeholder {
            color: rgba(71, 71, 71, 0.6);
        }
        border-radius: 0px 8px 8px 0px;
    }

    .el-link.el-link--primary {
        color: #409EFF !important;
    }

    .search-site {
        .el-button {
            border-radius: 8px 0px 0px 8px;
            height: 40px;
            padding: 0px 15px;
            border-right: none;
        }
    }

    .el-badge__content.is-fixed {
        top: 5px !important;
        right: 15px !important;
        @media (max-width:768px) {
            top: 8px !important;
        }
    }
</style>