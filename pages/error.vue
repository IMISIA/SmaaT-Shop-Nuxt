<template>
    <section class="container pt-3">
        <no-data :message="$route.query.message" src="/svg/error.svg">
            <template #before>
                <h4 class="rtl mb-4 text-danger"> متاسفانه خطایی رخ داده !!! </h4>
            </template>
            <template #after>
                <v-btn class="as-btn px-5" large to="/checkout">
                    بازگشت به صفحه پرداخت
                </v-btn>
            </template>
        </no-data>
    </section>
</template>

<script>
    export default {
        // validate({ query }) {
        //     return query.message ? true : false;
        // }    
    }
</script>