<template>
    <section class="favorites" v-if="Me.favorites && Me.favorites.length">
        <span class="headline-info"> لیست علاقه‌مندی ها </span>

        <div class="row rtl">
            <div class="col-lg-6 mb-3" v-for="fav in Me.favorites" :key="fav.id">
                <el-card class="am-shadow" :body-style="{ padding: 0 }">
                    <mini-card
                        :variation="{ product: fav , sales_price: fav.variation ? fav.variation.sales_price : null }"
                        imageClass="col-4 py-1"
                        infoClass="col-8 py-3 pr-0"
                        small
                        :imageSize="110"
                        :hasPrice="true"
                        :hasVariations="false">
                    </mini-card>

                    <div class="box-actions small row">
                        <v-btn class="col-4" text color="#dc3545" >
                            حذف
                        </v-btn>
                        <v-btn class="col-8" text color="#0ecfc6" :to="`/product/${fav.slug}`">
                            مشاهده محصول
                        </v-btn>
                    </div>
                </el-card>
            </div>
        </div>
    </section>

    <no-data v-else :buttonTitle="null" message="لیست علاقه‌مندی‌های شما خالیست ..."></no-data>
</template>

<script>
    import {mapState} from 'vuex';
    import miniCard from '~/components/MiniCard.vue';
    export default {
        components: {
            miniCard
        } ,

        computed: mapState([
            'Me'
        ])
    }
</script>