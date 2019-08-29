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
    Shopping_Cart : [
        {
            "id": "2b070f9f3ef6",
            "count": 1,
            "variation": {
                "id": "2b070f9f3ef6",
                "sales_price": 420000,
                "inventory": 30,
                "warranty": {
                    "title": "اصالت کالا و سلامت فیزیکی"
                },
                "color": null,
                "size": null,
                "product": {
                    "id": "b5d03c6122b2",
                    "name": "ادو پرفیوم زنانه لالیک مدل Le Parfum ",
                    "slug": "ادو-پرفیوم-زنانه-لالیک-مدل-Le-Parfum",
                    "photos": [{
                        "id": 766,
                        "file_name": "1.jpg",
                        "small": "/uploads/images/766/conversions/1-small.jpg"
                    }, {
                        "id": 767,
                        "file_name": "2.jpg",
                        "small": "/uploads/images/767/conversions/2-small.jpg"
                    }]
                }
            }
        }, {
            "id": "91a1da24af56",
            "count": 1,
            "variation": {
                "id": "91a1da24af56",
                "sales_price": 3700000,
                "inventory": 30,
                "warranty": null,
                "color": {
                    "name": "مشکی"
                },
                "size": null,
                "product": {
                    "id": "33597657b3fb",
                    "name": "گوشی موبایل سامسونگ مدل Galaxy A50 SM-A505F/DS",
                    "slug": "گوشی-موبایل-سامسونگ-مدل-Galaxy-A50-SM-A505F-DS",
                    "photos": [{
                        "id": 760,
                        "file_name": "1.jpg",
                        "small": "/uploads/images/760/conversions/1-small.jpg"
                    }, {
                        "id": 761,
                        "file_name": "2.jpg",
                        "small": "/uploads/images/761/conversions/2-small.jpg"
                    }, {
                        "id": 762,
                        "file_name": "3.jpg",
                        "small": "/uploads/images/762/conversions/3-small.jpg"
                    }]
                }
            }
        }, {
            "id": "e734a3411d6c",
            "count": 1,
            "variation": {
                "id": "e734a3411d6c",
                "sales_price": 69000,
                "inventory": 25,
                "warranty": {
                    "title": "اصالت کالا و سلامت فیزیکی"
                },
                "color": null,
                "size": null,
                "product": {
                    "id": "5c42c64299c6",
                    "name": "رژلب جامد مات لوسمنت حاوی روغن آرگان شماره L403",
                    "slug": "رژلب-جامد-مات-لوسمنت-حاوی-روغن-آرگان-شماره-L403",
                    "photos": [{
                        "id": 747,
                        "file_name": "1.jpg",
                        "small": "/uploads/images/747/conversions/1-small.jpg"
                    }]
                }
            }
        }, {
            "id": "f166e3e8bd7a",
            "count": 1,
            "variation": {
                "id": "f166e3e8bd7a",
                "sales_price": 16000000,
                "inventory": 25,
                "warranty": {
                    "title": " ۱۸ ماهه آواژنگ"
                },
                "color": null,
                "size": null,
                "product": {
                    "id": "643fc1d26d21",
                    "name": "گوشی موبایل اپل مدل iPhone X ظرفیت 256 گیگابایت",
                    "slug": "گوشی-موبایل-اپل-مدل-iPhone-X-ظرفیت-256-گیگابایت",
                    "photos": [{
                        "id": 757,
                        "file_name": "1.jpg",
                        "small": "/uploads/images/757/conversions/1-small.jpg"
                    }, {
                        "id": 758,
                        "file_name": "2.jpg",
                        "small": "/uploads/images/758/conversions/2-small.jpg"
                    }, {
                        "id": 759,
                        "file_name": "3.jpg",
                        "small": "/uploads/images/759/conversions/3-small.jpg"
                    }]
                }
            }
        }
    ] ,

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
        // state.Shopping_Cart = data.data.cart;
        state.SiteSetting = data.data.siteSetting;
        state.Brands = data.data.brands.data;

    }
}