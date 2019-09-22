<template>
    <header class="smt-header">
        <div class="container-fuild py-2 px-md-3">
            <div class="row rtl py-md-2 mx-0">
                <div class="col-lg-2 col-md-2 col-sm-3 text-left text-md-center">
                    <div class="hamburger hamburger--spin js-hamburger" v-show="Res"
                        :class="{ 'is-active' : Ctg_drawer }" @click="Ctg_drawer = true">
                        <div class="hamburger-box">
                            <div class="hamburger-inner"></div>
                        </div>
                    </div>

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
                            <vs-button class="cart-btn" to="/cart" :color="web_color" type="filled"
                                icon-pack="lnr lnr-cart" icon="." icon-after>
                                سبد خرید    
                            </vs-button>
                        </el-badge>
                            
                        <!-- Login / Register -->
                        <div class="mx-5">
                            <vs-dropdown vs-custom-content vs-trigger-click>
                                <a class="login-text mx-4" href.prevent>
                                    <v-icon light>keyboard_arrow_down</v-icon>
                                    <template v-if="is_exist(Me)">
                                        {{ Me.full_name.trim() || Me.username || Me.email }}
                                        <v-avatar class="ml-2" :size="40" :color="web_color">
                                            <img :src=" Me.avatar && Me.avatar.small ? $url + Me.avatar.small : '/images/user.png' " alt="avatar">
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

                                            <v-list-item>
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
                        <el-badge class="item mr-2" :value="Shopping_Cart.length">
                            <span class="lnr lnr-cart h2"></span>
                        </el-badge>
                        <span class="lnr lnr-user h2 ml-2 mr-3" @click="openModal('login')"></span>
                    </template>

                    <div class="el-search d-flex rtl ml-auto" :class=" Res ? 'w-75' : 'w-50' ">
                        <el-select
                            class="w-100"
                            v-model="Search"
                            filterable
                            remote
                            placeholder="جستجو در فروشگاه ..."
                            :remote-method="Search_Method"
                            :loading="Loading_Search">
                            <el-option
                                value="IMISIA">
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
                    <nuxt-link :to="`/category/${ctg.slug}`">
                        {{ ctg.title }}
                        <i class="lnr lnr-chevron-down mr-2" v-if="is_exist(ctg.childs)"></i>
                    </nuxt-link>

                    <div class="dropdown-menu mega-menu" v-if="is_exist(ctg.childs)">
                        <div class="row mx-0 p-3">
                            <div class="col-md-8">
                                <div class="row flex-column">
                                    <div class="col-4 col-lg-3 mb-1" v-for="sub_1 in ctg.childs" :key="sub_1.id">
                                        <nuxt-link :to="`/category/${sub_1.slug}`">
                                            <p class="sub_1 web-color">
                                                <i class="lnr lnr-chevron-left bold"></i>
                                                {{ sub_1.title }}
                                            </p>
                                        </nuxt-link>
                                        <ul class="sub_2" v-if="is_exist(sub_1.childs)">
                                            <li v-for="sub_2 in sub_1.childs" :key="sub_2.id">
                                                <nuxt-link :to="`/category/${sub_2.slug}`">
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
            <v-navigation-drawer v-model="Ctg_drawer" mobile-break-point fixed temporary width="300">
                <div class="text-center p-3">
                    <img
                        class="site-logo"
                        :src=" SiteSetting.logo && SiteSetting.logo.medium ? $url + SiteSetting.logo.medium : '/images/none.png' "
                        alt="logo">
                </div>

                <span class="d-block border-top w-75 m-auto"></span>

                <v-list class="Ctg-list" dense shaped>
                    <template v-for="ctg in Categories">

                        <v-list-group
                            v-if="is_exist(ctg.childs)"
                            :key="ctg.id"
                            prepend-icon="fas fa-gem"
                            :color="web_color"
                            no-action>

                            <template v-slot:activator>
                                <v-list-item-title>
                                    {{ ctg.title }}
                                </v-list-item-title>
                            </template>

                            <template v-for="sub_1 in ctg.childs">

                                <v-list-group
                                    v-if="is_exist(sub_1.childs)"
                                    :key="sub_1.id"
                                    :color="web_color"
                                    sub-group
                                    no-action>

                                    <template v-slot:activator>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ sub_1.title }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </template>

                                    <v-list-item v-for="sub_2 in sub_1.childs" :key="sub_2.id">
                                        <v-list-item-title>
                                            {{ sub_2.title }}
                                        </v-list-item-title>
                                    </v-list-item>

                                </v-list-group>

                                <v-list-item
                                    v-else
                                    :key="sub_1.id"
                                    @click="Ctg_drawer = Ctg_drawer">
                                    <v-list-item-title class="fs-12">
                                        {{ sub_1.title }}
                                    </v-list-item-title>
                                </v-list-item>

                            </template>

                        </v-list-group>

                        <v-list-item
                            v-else
                            :key="ctg.id"
                            :color="web_color"
                            @click="Ctg_drawer = Ctg_drawer">

                            <v-list-item-icon>
                                <v-icon>fas fa-gem</v-icon>
                            </v-list-item-icon>

                            <v-list-item-title>
                                {{ ctg.title }}
                            </v-list-item-title>

                        </v-list-item>

                    </template>

                </v-list>
            </v-navigation-drawer>
        </v-app>
    </header>
</template>

<script>
    import { mapState , mapMutations } from 'vuex';
    import mixin from '~/mixins/mixin'

    export default {
        mixins : [mixin] ,

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
                        $(this).find('div.mega-menu').addClass('d-block');
                    } ,
                    function () {
                        $('.ctg-hover').css({
                            transform: ''
                        })
                        $('#categories-overlay').removeClass('show');
                        $(this).find('div.mega-menu').removeClass('d-block')
                    }
                );

                $('div.mega-menu').hover(
                    function () {
                        $(this).addClass('d-block')
                    } ,
                    function () {
                        $(this).removeClass('d-block')
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
                Ctg_drawer : false ,
                Cart_drawer : false ,

                Search : '' ,
                Loading_Search : false ,

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
            }
        } ,

        computed : {
            ...mapState([
                '$url' ,
                'SiteSetting' ,
                'Me' ,
                'Shopping_Cart' ,
                'Categories'
            ])
        } ,

        methods : {
            ...mapMutations([
                'openModal'
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
                    .el-search .el-button {
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

                    .image-slider , .aside-poster {
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

            Search_Method(Str) {
                console.log(Str);
            }
        }
    }
</script>

<style lang="scss">
    .Ctg-list.v-list {
        transform: scaleX(-1);
        padding: 8px;
        .v-list-item__title {
            transform: scaleX(-1);
            text-align: right;
            font-size: 12px !important;
        }
    }

    .v-navigation-drawer {
        .v-icon {
            font-size: 18px !important;
            margin-top: 4px;
        }
        .v-list-item__icon {
            margin-right: 18px !important;
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

    .el-search {
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
    }
</style>