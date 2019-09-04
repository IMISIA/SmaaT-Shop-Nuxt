<template>
    <section class="favorites">
        <span class="headline-info"> لیست علاقه‌مندی ها </span>

        <div class="row rtl">
            <div class="col-lg-6 mb-3" v-for="{variation} in Shopping_Cart" :key="variation.id">
                <el-card class="am-shadow" :body-style="{ padding: 0 }">
                    <mini-card
                        :variation="variation"
                        imageClass="col-4 py-1"
                        infoClass="col-8 py-3 pr-0"
                        small
                        :imageSize="110"
                        :hasPrice="true"
                        :hasVariations="false">
                    </mini-card>

                    <div class="box-actions small row mx-0">
                        <v-btn class="col-4" text color="#dc3545">
                            حذف
                        </v-btn>
                        <v-btn class="col-8" text color="#0ecfc6">
                            مشاهده محصول
                        </v-btn>
                    </div>
                </el-card>
            </div>
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

        computed: mapState([
            'Shopping_Cart'
        ])
    }
</script>