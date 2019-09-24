import Cookie from '~/plugins/cookie';

export const state = () => ({
    $url: 'http://luxbuystore.ir' ,

    $auth: false ,
    $reload: false ,

    $modals: {
        login: false ,
        register: false ,
        resetPass: false
    } ,

    SiteSetting: {} ,

    Me: {} ,

    // All Categories
    Categories: [] ,

    // All Brands
    Brands: [] ,

    // Manage Shopping Cart
    Shopping_Cart: [] ,

    // Manage Compare List
    Compare_List: [] ,
})

export const mutations = {
    // Payloads : Prop , Val , Module , Obj_Assign
    Set_state(state , payload) {
        if(payload.Module) {
            payload.Obj_Assign
            ? state[payload.Module][payload.Prop] = { ...state[payload.Module][payload.Prop] , ...payload.Val }
            : state[payload.Module][payload.Prop] = payload.Val
        } else {
            payload.Obj_Assign
            ? state[payload.Prop] = { ...state[payload.Prop] , ...payload.Val }
            : state[payload.Prop] = payload.Val
        }
    } ,

    openModal(state , name) {
        $('.con-vs-dropdown--menu').css({ display: 'none' });
        state.$modals[name] = true;
    } ,

    closeModal(state , name) {
        state.$modals[name] = false;
    }
}

export const actions = {
    async nuxtServerInit ({ state } , { req , app }) {
        let JWT = Cookie.get('JWT' , req.headers.cookie);

        let query = {
            me: `
                me {
                    id
                    email
                    first_name
                    last_name
                    full_name
                    avatar {
                        id
                        file_name
                        small
                    }
                    allPermissions {
                        id
                        name
                    }
                }
            ` ,
            init() {
                return `
                    {
                        ${ JWT ? this.me : '' }

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
                                    code
                                }
                                size {
                                    name
                                }
                                product {
                                    id
                                    name
                                    slug
                                    label {
                                        title
                                    }
                                    photos {
                                        id
                                        file_name
                                        small
                                    }
                                    variation {
                                        id
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
                                slug
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
            }
        }

        app.$axios.setToken(JWT , 'Bearer');
        await app.$axios({
            url: JWT ? '/auth' : '' ,
            method : 'POST' ,
            data : {
                query : query.init()
            }
        })
        .then( ({data}) => {
            if( data.data.me && !!Object.keys(data.data.me).length ) {
                state.Me = data.data.me;
                state.$auth = true;
            }
            state.Categories = data.data.categories.data;
            state.Shopping_Cart = data.data.cart;
            state.SiteSetting = data.data.siteSetting;
            state.Brands = data.data.brands.data;
        })
        .catch( Err => {
            if( Err.response && Err.response.status === 401 ) {
                state.$reload = true;
            } else {
                console.error(Err);
            }
        })
    } ,

    // Payloads : type , name , params , resQuery , resolverBefore(state) , resolverAfter(state , data)
    Request(state , pld) {
        if(pld.resolverBefore) pld.resolverBefore(state);

        let params = null;
        if(pld.params && typeof pld.params === 'object') {
            Object.entries(pld.params).map( ([key , val]) => {
                if(val && ( isNaN(val) ? !_.isEmpty(val) : true ) ) {
                    switch(typeof val) {
                        case 'number': {
                            params += `${key} : ${val} , \n`;
                            break;
                        }
                        case 'string': {
                            params += `${key} : "${val}" , \n`;
                            break;
                        }
                        case 'boolean': {
                            params += `${key} : ${val} , \n`;
                            break;
                        }
                        case 'object': {
                            params += `${key} : [${val}] , \n`;
                            break;
                        }
                    }
                }
            })
        }

        let query = `
            ${pld.type || ''} {
                ${pld.name} ${ params ? '( \n'+params+'\n )' : '' } {
                    ${pld.resQuery}
                }
            }
        `;

        console.log(query);
    }
}