<template>
    <section id="error-page">
        <div class="web-grd-text">
            <h2> {{ error.statusCode }} </h2>
            <h1> {{ error.statusCode == 404 ? 'صفحه مورد نظر پیدا نشد!' : error.message }} </h1>
        </div>
        <v-btn class="as-btn" large to="/"> صفحه اصلی </v-btn>
    </section>
</template>

<script>
    export default {
        props: ['error']
    }
</script>
