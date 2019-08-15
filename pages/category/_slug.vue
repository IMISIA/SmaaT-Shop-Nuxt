<template>
    <section>
        <div class="row">

            <div class="col-md-9">

            </div>

            <div class="col-md-3">
                <FilterBar />
            </div>

        </div>
    </section>
</template>

<script>
    import FilterBar from '~/components/FilterBar.vue';

    export default {

        async fetch({ $axios , store , params , query }) {

            let ObjectParams = {
                categories: [params.slug] ,
                brands: [query.brands] ,
                sizes: [query.sizes] ,
                colors: [query.colors] ,
                warranties: [query.warranties] ,
                query: query.query ,
                ordering: query.ordering
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
                category(slug:"${params.slug}") {
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
                                }
                            }
                        }
                        ${ !!params.slug ? QueryFilters : '' }
                    }
                `
                }
            })

            store.commit( 'Set_state' , {
                Module : 'Product' ,
                Prop : 'Products_Ctg' ,
                Val : data.data.products.data
            })

            store.commit( 'Set_state' , {
                Module : 'Product' ,
                Prop : 'Filters' ,
                Val : data.data.category ,
                Obj_Assign: true
            })

        } ,

        components: {
            FilterBar
        }
    }
</script>