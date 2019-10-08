import Cookie from '~/plugins/cookie';

export const state = () => ({
    $url: 'http://metro-market.ir' ,
    // $url: '' ,

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
    Compare_List: []
})

export const mutations = {
    // Payloads : Prop , Val , Module , Obj_Assign , Push
    Set_state(state , payload) {
        if(payload.Push) {
            if(payload.Module) {
                state[payload.Module][payload.Prop].push(payload.Val);
            } else {
                state[payload.Prop].push(payload.Val);
            }

            return;
        }

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

    // Payloads : Prop , Module , Val Or Idx
    Pop_state(state , pld) {
        if(pld.Module) {
            pld.Val
            ? _.pull(state[pld.Module][pld.Prop], pld.Val)
            : state[pld.Module][pld.Prop].splice(pld.Idx , 1)
        } else {
            pld.Val
            ? _.pull(state[pld.Prop], pld.Val)
            : state[pld.Prop].splice(pld.Idx, 1)
        }
    } ,

    Resolver(state , pld) {
        pld.resolver(state);
    } ,

    openModal(state , name) {
        $('.con-vs-dropdown--menu').css({ display: 'none' });
        state.$modals[name] = true;
    } ,

    closeModal(state , name) {
        state.$modals[name] = false;
    } ,

    Requested(state , name) {
        state.product.Requested[name] = true;
    }
}

export const actions = {
    async nuxtServerInit ({ state } , { req , app }) {
        return;

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
                                thumb
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
        if(JWT) app.$axios.defaults.baseURL = app.$axios.defaults.baseURL + '/auth';

        await app.$axios({
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
            if( Err.response && Err.response.status == 401 ) {
                state.$reload = true;
            } else {
                console.error(Err);
            }
        })
    } ,

    // Payloads : type , name , params , resQuery
    // resolverBefore(store) , resolverAfter({store , data}) , resolverCatch(Err)
    Request(store , pld) {
        if(pld.resolverBefore) pld.resolverBefore(store);

        let params = '';
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

        // console.log(query);

        this.$axios({
            method: 'POST' ,
            data : { query }
        })
        .then( ({data}) => {
            console.log(data);
            if(data.errors) {
                data.errors.map( Err => console.error(Err.message) )
            }
            if(pld.resolverAfter) pld.resolverAfter({store, data});
        })
        .catch( Err => {
            if(pld.resolverCatch) pld.resolverCatch(Err);
            console.log(Err);
        })
    } ,

    Logout() {
        Cookie.remove('JWT');
        localStorage.removeItem('JWT');
        location.href = '/';
    }
}