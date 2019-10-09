<template>
    <footer>
        <section class="container">
            <div class="row rtl">
                <div class="col-md-2 d-flex align-items-center justify-content-center">
                    <nuxt-link to="/">
                        <img
                            class="footer-logo"
                            :src=" SiteSetting.logo && SiteSetting.logo.medium ? $url + SiteSetting.logo.medium : '/images/none.png' "
                            alt="logo">
                    </nuxt-link>
                </div>

                <div class="col-md-10 mt-4 mt-md-0">
                    <h1> فروشگاه اینترنتی {{ SiteSetting.title }} </h1>
                    <p class="description"> {{ SiteSetting.description }} </p>
                </div>

                <hr>

                <div class="col-12 col-md-6 col-lg-4 mb-3 mb-md-0">
                    <div class="col-header">
                        اطلاعات
                        {{ SiteSetting.title }}
                    </div>

                    <ul class="col-list">
                        <li>
                            <a v-if="SiteSetting.phone" :href="`tel:${SiteSetting.phone}`">
                                شماره تماس :
                                {{ SiteSetting.phone | Num2Fa(false) }} 
                            </a>
                            <span v-else>
                                شماره تماس : تعریف نشده
                            </span>
                        </li>
                        <li>
                            <address class="d-inline-block m-0">
                                آدرس :
                                {{ SiteSetting.address || 'تعریف نشده' }} 
                            </address>
                        </li>
                    </ul>
                </div>

                <div class="col-6 col-md-3 col-lg-2">
                    <div class="col-header"> دسته‌بندی ها </div>

                    <ul class="col-list">
                        <li>
                            <nuxt-link to="/category">
                                تمام محصولات
                            </nuxt-link>
                        </li>                        
                        <li v-for="(item,idx) in Categories.slice(0,2)" :key="idx">
                            <nuxt-link :to="`/category/${item.id}`">
                                {{ item.title }}
                            </nuxt-link>
                        </li>
                    </ul>
                </div>

                <div class="col-6 col-md-3 col-lg-2">
                    <ul class="col-list">
                        <li v-for="(item,idx) in Categories.slice(2,6)" :key="idx">
                            <nuxt-link :to="`/category/${item.id}`">
                                {{ item.title }}
                            </nuxt-link>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-md-12 col-lg-4 mt-3 mt-lg-0">
                    <div class="trust-symbol">
                        <div v-for="idx in 3" :key="idx">
                            <img :src="`/images/TrustSymbol/ts${idx}.png`" alt="trust-symbol">
                        </div>
                    </div>
                </div>
            </div>

        </section>
        
        <div class="footer-info">
            <div class="row container">
                <div class="col-lg-6">
                    © 2017 - 2019
                    <p class="d-inline-block mr-3">
                        طراحی و توسعه توسط     
                        <a href="https://www.smaat.ir">
                            SmaaT Co
                        </a>
                    </p>
                </div>
                <div class="col-lg-6">
                    <a class="" href="tel:+989105009868">
                        <i class="fas fa-laptop"></i>
                        تماس با تیم توسعه دهنده
                    </a>
                    <a class=" mr-lg-5" :href="'tel:'+SiteSetting.phone">
                        <i class="fas fa-life-ring"></i>
                        تماس با پشتیبانی
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        computed: mapState([
            '$url' ,
            'SiteSetting' ,
            'Categories'
        ])
    }
</script>