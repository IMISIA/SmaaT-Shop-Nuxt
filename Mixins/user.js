import { mapState , mapActions } from 'vuex';

export default {
    computed: mapState([
        'Shopping_Cart'
    ]) ,

    methods: {
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
                resolverAfter: (state , data) => {
                    if(data.data && data.data.addCart && data.data.addCart.status == 200) {
                        this.Notif(data.data.addCart.message, '#00C853', 'check'); 

                        product.variation.product = product;
                        state.Shopping_Cart.push({
                            id: product.variation.id ,
                            count: count ,
                            variation: product.variation
                        })
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
        } ,
    }
}