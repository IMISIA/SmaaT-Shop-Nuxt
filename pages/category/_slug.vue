<template>
    <section class="category">
        <div class="row mx-0 pt-3">
            <div class="col-12 col-md-9" :class="{ 'pr-0' : !Res }">
                <div class="filter-btn row mx-0 pb-0 justify-content-around" v-show="Res">
                    <div class="col-5" @click="SortDialog = true">
                        <span>
                            مرتب سازی
                            <i class="flaticon-stats"></i>
                        </span>
                    </div>
                    <div class="col-5" @click="FilterDialog = true">
                        <span>
                            جستجوی پیشرفته
                            <i class="flaticon-settings"></i>
                        </span>
                    </div>
                </div>

                <el-card class="products-ctg am-shadow" :body-style="{ padding : '0px' }">
                    <div slot="header" class="header" v-if="!Res">
                        <i class="flaticon-settings bold text-muted ml-3"></i>
                        <span>مرتب سازی ب اساس :</span>

                        <el-radio-group
                            v-model="Ordering"
                            @change="ApplyFilters"
                            class="rtl mr-3"
                            size="mini"
                            :fill="web_color">
                            <el-radio-button
                                v-for="item in OrderingItems"
                                :key="item.label"
                                :label="item.label">
                                {{ item.title }}
                            </el-radio-button>
                        </el-radio-group>

                        <!-- Products Length -->
                        <span class="text-muted mr-auto">
                            {{ Total | Num2Fa }}
                            کالا
                        </span>
                    </div>

                    <div class="row mx-0 rtl">
                        <div
                            v-show="!Res"
                            class="col-md-4 col-lg-3 col-sm-6 product"
                            v-for="(product,idx) in Products_Ctg"
                            :key="idx">
                            <Card :Product="product" :Hover="false" :Info="false"/>
                        </div>

                        <div
                            v-show="Res"
                            class="col-md-4 col-lg-3 col-sm-6 product"
                            v-for="(product,idx) in Products_Ctg"
                            :key="`res-${idx}`">
                            <MiniCard
                                :variation="{ product , sales_price: product.variation.sales_price }"
                                small
                                image-property="medium"
                                image-class="col-5"
                                :image-size="130"
                                info-class="col-7 py-2 pr-0"
                                :has-variations="false"
                                :has-price="true"
                                :truncate="50"
                            />
                        </div>
                    </div>
                </el-card>

                <div class="pagination-ctg" v-show="Math.ceil(Total/8) > 1">
                    <v-pagination
                        v-model="Page"
                        @input="ApplyFilters"
                        :length="Math.ceil(Total/8)"
                        :total-visible=" Res ? 4 : 10 "
                        :color="web_color"
                        next-icon="navigate_before"
                        prev-icon="navigate_next"
                    ></v-pagination>
                </div>
            </div>

            <div class="col-md-3" v-if="!Res">
                <FilterBar
                    :ApplyFilters="ApplyFilters"
                    :DeleteFilters="DeleteFilters"
                    ref="FilterBar"
                />
            </div>
        </div>

        <v-app v-if="Res">
            <v-dialog v-model="FilterDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card color="#f9f9f9" class="FilterDialog">
                    <v-toolbar dark :color="web_color">
                        <v-btn icon dark @click="FilterDialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-toolbar-title class="fs-14">جستجوی پیشرفته</v-toolbar-title>
                    </v-toolbar>

                    <div class="category">
                        <FilterBar
                            :ApplyFilters="ApplyFilters"
                            :DeleteFilters="DeleteFilters"
                            ref="FilterBar"
                        />
                    </div>
                </v-card>
            </v-dialog>

            <v-dialog v-model="SortDialog" max-width="300">
                <v-card color="#f9f9f9" class="SortDialog">
                    <v-toolbar dark :color="web_color">
                        <v-btn icon dark @click="SortDialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-toolbar-title class="fs-14">مرتب سازی</v-toolbar-title>
                    </v-toolbar>

                    <div class="rtl">
                        <v-radio-group v-model="Ordering" @change="ApplyFilters">
                            <v-radio
                                v-for="item in OrderingItems"
                                :key="item.label"
                                :label="item.title"
                                :value="item.label"
                                :color="web_color"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                </v-card>
            </v-dialog>
        </v-app>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    import mixin from '~/mixins/mixin';
    import FilterBar from '~/components/FilterBar.vue';
    import Card from '~/components/Card.vue';
    import MiniCard from '~/components/MiniCard.vue';

    export default {
        // watchQuery: true ,

        async fetch({ $axios , store , params , query }) {
            let ObjectParams = {
                categories: [params.slug] ,
                brands: [query.brands] ,
                sizes: [query.sizes] ,
                colors: [query.colors] ,
                warranties: [query.warranties] ,
                query: query.query ? `"${query.query}"` : false ,
                ordering: query.ordering ? `"${query.ordering}"` : false ,
                page: parseInt(query.page) || 1 ,
                per_page: 8
            }

            let QueryParams = ''
            Object.keys(ObjectParams).map( el => {
                if(
                    typeof ObjectParams[el] === 'object'
                    ? !!ObjectParams[el][0]
                    : !!ObjectParams[el]
                ) {
                    typeof ObjectParams[el] === 'object'
                    ? QueryParams += `${el}: [${ObjectParams[el]}] , \n`
                    : QueryParams += `${el}: ${ObjectParams[el]} , \n`
                }
            })

            let QueryFilters = `
                category(id:${params.slug}) {
                    id
                    brands { id name }
                    sizes { id name }
                    colors { id name code }
                    warranties { id title }
                    spec {
                        id
                        filters {
                            id
                            title
                            postfix
                            prefix
                            defaults {
                                id
                                value
                            }
                        }
                    }
                }
            `

            let { data } = await $axios({
                method: 'POST' ,
                data: {
                query: `
                    {
                        products(${QueryParams}) {
                            data {
                                id
                                name
                                slug
                                photos {
                                    id
                                    file_name
                                    medium
                                }
                                colors {
                                    id
                                    code
                                }
                                label {
                                    id
                                    title
                                    description
                                    color
                                }
                                variation {
                                    id
                                    sales_price
                                    inventory
                                    warranty {
                                        title
                                    }
                                    color {
                                        name
                                    }
                                    size {
                                        name
                                    }
                                }
                            }
                            total
                            current_page
                        }
                        ${ !!params.slug ? QueryFilters : '' }
                    }
                `
                }
            })

            console.log(data);

            store.commit( 'Set_state' , {
                Module : 'product' ,
                Prop : 'Products_Ctg' ,
                Val : data.data.products.data
            })

            store.commit( 'Set_state' , {
                Module : 'product' ,
                Prop : 'Total' ,
                Val : data.data.products.total
            })

            store.commit( 'Set_state' , {
                Module : 'product' ,
                Prop : 'Filters' ,
                Val : data.data.category ,
                Obj_Assign: true
            })
        } ,

        mixins: [mixin] ,

        components: {
            FilterBar ,
            Card ,
            MiniCard
        } ,

        data() {
            return {
                FilterDialog: false ,
                SortDialog: false ,

                Ordering: 'latest' ,
                OrderingItems: [
                    { title: 'جدیدترین' , label: 'latest' } ,
                    { title: 'قدیمی‌ترین' , label: 'oldest' } ,
                    { title: 'ارزان‌ترین' , label: '1' } ,
                    { title: 'گران‌ترین' , label: '2' } ,
                ] ,

                Page: parseInt(this.$route.query.page) || 1 ,
            }
        } ,

        computed: {
            ...mapState({
                Products_Ctg: state => state.product.Products_Ctg ,
                Total: state => state.product.Total
            })
        } ,

        methods: {
            ApplyFilters() {
                let FilterParams = this.$refs.FilterBar ? this.$refs.FilterBar.Params : {};
                let QueryStr = {};

                QueryStr.page = this.Page;
                QueryStr.ordering = this.Ordering;

                if(FilterParams.query) QueryStr.query = FilterParams.query; 

                Object.keys(FilterParams).slice(0,4).map( el => {
                    if( this.is_exist(FilterParams[el].value) ) {
                        QueryStr[el] = FilterParams[el].value;
                    }
                })

                if( !_.isEqual(QueryStr , this.$route.query) ) {
                    this.$router.replace({ query : QueryStr });
                }
            } ,

            DeleteFilters(name , value) {
                let QueryStr = JSON.parse(JSON.stringify(this.$route.query));
                // Used JSON Function Becuase Modifying Changes Cloned And Original Objects

                if( typeof QueryStr[name] === 'object' && !!QueryStr[name].length ) {
                    QueryStr[name].length === 1
                    ? QueryStr = _.omit(QueryStr , name)
                    : _.pull(QueryStr[name] , value.toString())
                } else {
                    QueryStr = _.omit(QueryStr , name);
                }

                if( !_.isEqual(QueryStr , this.$route.query) ) {
                    this.$router.replace({ query : QueryStr })
                    .then( () => this.$refs.FilterBar.SetParams() );
                }
            }
        }
    }
</script>