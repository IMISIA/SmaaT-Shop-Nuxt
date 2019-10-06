<template>
    <category-page>
        <template #brand-info v-if="brandInfo && !!Object.keys(brandInfo).length">
            <div class="el-card am-shadow mb-3">
                <div class="brand-info web-bg-ultra-fade">
                    <div class="brand-logo"
                        :style="{ backgroundImage : `url('${brandInfo.logo ? $url + brandInfo.logo.large : '/images/none.png'}')` }">
                    </div>

                    <span class="brand-title"> برند {{ brandInfo.name || 'بدون نام' }} </span>

                    <p v-show="brandInfo.description"> {{ brandInfo.description }} </p>
                </div>
            </div>
        </template>
    </category-page>
</template>

<script>
    import CategoryPage from '~/components/CategoryPage.vue';
    import { mapState } from 'vuex';

    export default {
        watchQuery: true ,

        async fetch({ $axios , store , params , query }) {
            let ObjectParams = {
                categories: [params.categories] ,
                brands: [params.slug] ,
                sizes: [query.sizes] ,
                colors: [query.colors] ,
                warranties: [query.warranties] ,
                query: query.query ? `"${query.query}"` : false ,
                ordering: query.ordering ? `"${query.ordering}"` : false ,
                page: parseInt(query.page) || 1 ,
                per_page: 20
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
            if(query.min || query.max) {
                QueryParams += `
                    sales_price : {
                        min : "${query.min || ''}" ,
                        max : "${query.max || ''}"
                    } ,
                `
            }

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

                brand(id:${params.slug}) {
                    id
                    name
                    description
                    logo {
                        id
                        file_name
                        large
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
                                        code
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

            store.commit( 'Set_state' , {
                Module : 'product' ,
                Prop : 'Brand_Info' ,
                Val : data.data.brand ,
            })
        } ,

        components: {
            CategoryPage
        } ,

        computed: mapState({
            $url: '$url' ,
            brandInfo: state => state.product.Brand_Info
        })
    }
</script>