import { mapState , mapMutations , mapActions } from 'vuex';

export default {
    computed: mapState([
        '$auth' ,
        'Shopping_Cart'
    ]) ,

    methods: {
        ...mapMutations([
            'openModal'
        ]) ,

        ...mapActions([
            'Request'
        ]) ,

        AddToCart(product , count = 1) {
            if(!count) count = 1;

            if(this.Shopping_Cart.find( el => el.variation.id == product.variation.id )) {
                this.Notif('محصول مورد نظر در سبد خرید موجود می‌باشد', 'warning', 'error');
                return;
            }

            this.Request({
                type: 'mutation' ,
                name: 'addCart' ,
                params: {
                    variation: product.variation.id ,
                    quantity: count
                } ,
                resQuery: 'status message' ,
                resolverAfter: ({store , data}) => {
                    if(data.data && data.data.addCart && data.data.addCart.status == 200) {
                        this.Notif(data.data.addCart.message, '#00C853', 'check'); 

                        product.variation.product = product;
                        store.commit('Set_state' , {
                            Prop: 'Shopping_Cart' ,
                            Val: {
                                id: product.variation.id ,
                                count: count ,
                                variation: product.variation
                            } ,
                            Push: true
                        })
                    } else {
                        this.Notif('متاسفانه عملیات با موفقیت انجام نشد', 'warning', 'error');
                    }
                }
            })
        } ,

        RemoveCart(id , idx , event) {
            $(event.target).removeClass('lnr-cross').addClass('disabled');

            this.Request({
                type: 'mutation' ,
                name: 'removeCart' ,
                params: { variation: id } ,
                resQuery: 'status message' ,
                resolverAfter: ({store , data}) => {
                    if(data.data && data.data.removeCart && data.data.removeCart.status == 200) {
                        this.Notif(data.data.removeCart.message, 'danger', 'close'); 

                        store.commit('Pop_state' , {
                            Prop: 'Shopping_Cart' ,
                            Idx: idx
                        })

                        $(event.target).removeClass('disabled').addClass('lnr-cross');
                    } else {
                        this.Notif('متاسفانه عملیات با موفقیت انجام نشد', 'warning', 'error');
                    }
                }
            })
        } ,

        AddFav(id) {
            if(!this.$auth) {
                this.openModal('login');
                setTimeout(() => {
                    $('#alert-login').removeClass('d-none');
                }, 50);
                return;
            }

            this.Request({
                type: 'mutation' ,
                name: 'addFavorite' ,
                params: { product: id } ,
                resQuery: 'status message' ,
                resolverAfter: ({data}) => {
                    if(data.data && data.data.addFavorite && data.data.addFavorite.status == 200) {
                        this.Notif(data.data.addFavorite.message, 'danger', 'favorite'); 
                    } else {
                        this.Notif('متاسفانه عملیات با موفقیت انجام نشد', 'warning', 'error');
                    }
                }
            })
        } ,

        DelFav(id , idx) {
            this.Request({
                type: 'mutation' ,
                name: 'removeFavorite' ,
                params: { product: id } ,
                resQuery: 'status message' ,
                resolverAfter: ({store , data}) => {
                    if(data.data && data.data.removeFavorite && data.data.removeFavorite.status == 200) {
                        this.Notif(data.data.removeFavorite.message, 'danger', 'close'); 

                        store.commit('Pop_state' , {
                            Prop: 'favorites' ,
                            Module: 'Me' ,
                            Idx: idx
                        })
                    } else {
                        this.Notif('متاسفانه عملیات با موفقیت انجام نشد', 'warning', 'error');
                    }
                }
            })
        } ,

        Notif(msg, color,  icon, time = 3000)  {
            this.$vs.notify({
                text: `${msg}` ,
                color: color ,
                icon: icon ,
                position: 'top-left',
                time: time
            })
        }
    }
}