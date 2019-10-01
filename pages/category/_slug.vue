<template>
    <CategoryPage />
</template>

<script>
    import CategoryPage from '~/components/CategoryPage.vue';

    export default {
        watchQuery: true ,

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
                    parent {
                        id
                        slug
                        title
                        childs {
                            id
                            slug
                            title
                            childs {
                                id
                                slug
                                title
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

            if(data.data.category) store.commit( 'Set_state' , {
                Module : 'product' ,
                Prop : 'TreeCtg' ,
                Val : data.data.category.parent ,
            })
        } ,

        components: {
            CategoryPage
        }
    }
</script>