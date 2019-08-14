<template>
    <footer>
        <div class="container">
            <div class="row rtl">

                <div class="col-md-2 d-flex align-items-center justify-content-center">
                    <nuxt-link to="/">
                        <img
                            class="footer-logo"
                            :src=" SiteSetting.logo && SiteSetting.logo.medium ? Url + SiteSetting.logo.medium : '/images/none.png' "
                            alt="logo">
                    </nuxt-link>
                </div>

                <div class="col-md-10 mt-4 mt-md-0">
                    <h1> فروشگاه اینترنتی {{ SiteSetting.title }} </h1>
                    <p class="description"> {{ SiteSetting.description }} </p>
                </div>

                <hr>

                <div class="col-12 col-sm-6 col-md-4">
                    
                    <div class="col-header mt-2">
                        اطلاعات
                        {{ SiteSetting.title }}
                    </div>

                    <ul class="col-list">
                        <li>
                            <a :href="`tel:${SiteSetting.phone || '09105009868'}`">
                                شماره تماس :
                                {{ SiteSetting.phone || '۰۹۱۰۵۰۰۹۸۶۸' }} 
                            </a>
                        </li>
                        <li>
                            <address class="d-inline-block m-0">
                                آدرس :
                                {{ SiteSetting.address || '۰۹۱۰۵۰۰۹۸۶۸' }} 
                            </address>
                        </li>
                        <li>
                            <a :href="`mailto:${SiteSetting.phone || 'AmirKhadangi920@Gmail.com'}`">
                                آدرس ایمیل :
                                {{ SiteSetting.email || 'AmirKhadangi920@Gmail.com' }} 
                            </a>
                        </li>
                    </ul>

                </div>

                <div class="col-6 col-sm-3 col-md-2">
                    
                    <div class="col-header mt-2">
                        دیگر صفحات
                    </div>

                    <ul class="col-list">
                        <li v-for="(item,idx) in Other_Pages" :key="idx">
                            <nuxt-link :to="item.link">
                                {{ item.title }}
                            </nuxt-link>
                        </li>
                    </ul>

                </div>

                <div class="col-6 col-sm-3 col-md-2">
                    
                    <div class="col-header mt-2">
                        دیگر صفحات
                    </div>

                    <ul class="col-list">
                        <li v-for="(item,idx) in Other_Pages" :key="idx">
                            <nuxt-link :to="item.link">
                                {{ item.title }}
                            </nuxt-link>
                        </li>
                    </ul>

                </div>

                <div class="col-12 col-md-4">
                    <div class="trust-symbol">
                        <div v-for="idx in 3" :key="idx">
                            <img :src="`/images/TrustSymbol/ts${idx}.png`" alt="trust-symbol">
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </footer>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        data() {
            return {
                Other_Pages: [
                    { title: 'وبلاگ' , link: '/' } ,
                    { title: 'سوالات متداول' , link: '/' } ,
                    { title: 'حریم خصوصی' , link: '/' }
                ]
            }
        } ,

        computed: {
            ...mapState([
                'Url' ,
                'SiteSetting'
            ])
        }
    }
</script>