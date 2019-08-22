export const state = () => ({

    URL : 'http://luxbuystore.ir' ,

    Auth : false ,

    Login_Modal : false ,
    Register_Modal : false ,

    SiteSetting : {} ,

    Me : {} ,

    Provinces : [] ,
    Cities : [] ,

    // All Categories
    Categories : [] ,

    // All Brands
    Brands : [] ,

    // Manage Shopping Cart
    Shopping_Cart : [] ,

    // Manage Compare List
    Compare_List : [] ,

})

export const mutations = {
    // Payloads : Prop , Val , Module , Obj_Assign
    Set_state( state , payload ) {
        if(payload.Module) {
            payload.Obj_Assign
            ? state[payload.Module][payload.Prop] = { ...state[payload.Module][payload.Prop] , ...payload.Val }
            : state[payload.Module][payload.Prop] = payload.Val
        } else {
            payload.Obj_Assign
            ? state[payload.Prop] = { ...state[payload.Prop] , ...payload.Val }
            : state[payload.Prop] = payload.Val
        }
    }
}

export const actions = {
    async nuxtServerInit ({ state } , { app }) {

        let query = [
            `
                {
                    categories {
                        data {
                            id
                            title
                            slug
                            icon
                            logo {
                                id
                                file_name
                                medium
                            }
                            childs {
                                id
                                title
                                slug
                                childs {
                                    id 
                                    title
                                    slug
                                    childs {
                                        id
                                        title
                                        slug
                                        childs {
                                            id
                                            title
                                            slug
                                        }
                                    }
                                }
                            }
                        }
                    }
                    cart {
                        id
                        count
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
                            product {
                                id
                                name
                                slug
                                photos {
                                    id
                                    file_name
                                    small
                                }
                            }
                        }
                    }
                    siteSetting {
                        title
                        theme_color
                        is_enabled
                        description
                        phone
                        address
                        banner_link
                        logo {
                            id
                            name
                            medium
                        }
                        banner {
                            id
                            name
                            wide
                        }
                        header_banner {
                            id
                            name
                            wide
                        }
                        slider {
                            image {
                                id
                                name
                                wide
                            }
                            title
                            description
                            button
                            link
                        }
                        posters {
                            image {
                                id
                                name
                                large
                            }
                            title
                            description
                            button
                            link
                        }
                    }
                    brands {
                        data {
                            id
                            name
                            logo {
                                id
                                file_name
                                small
                            }
                        }
                    }
                }
            
            `
        ]

        let { data } = await app.$axios({
            method : 'POST' ,
            data : {
                query : query[0]
            }
        })

        state.Categories = data.data.categories.data;
        state.Shopping_Cart = data.data.cart;
        state.SiteSetting = data.data.siteSetting;
        state.Brands = data.data.brands.data;

    }
}