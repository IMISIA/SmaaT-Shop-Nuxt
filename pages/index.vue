<template>
  <div>

    <div class="row m-0 pt-3">
      <div class="col-md-9 pr-md-0">
        <Slider :slides="SiteSetting.slider" />
      </div>

      <div class="col-md-3 pt-3 pt-md-0">
        <img class="aside-poster"
          src="https://dkstatics-public.digikala.com/digikala-adservice-banners/1000007945.gif" alt="پوستر" />
      </div>
    </div>

    <div class="pt-3">
      <ProductSlider :Products="{
        title: 'محصولات' ,
        data: Products ,
        size: 12
      }"/>
    </div>

    <div class="pt-3 pb-5">
      <Posters :Posters="SiteSetting.posters"/>
    </div>

  </div>
</template>

<script>
  import Slider from '~/components/Slider.vue';
  import ProductSlider from '~/components/ProductSlider.vue';
  import Posters from '~/components/Posters.vue';
  import {
    mapState
  } from 'vuex';

  export default {
    async fetch({ $axios , store }) {

      let { data } = await $axios({
        method: 'POST' ,
        data: {
          query: `
            {
              products {
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
              }
            }
          `
        }
      })

      store.commit( 'Set_state' , {
        Module : 'Product' ,
        Prop : 'Products' ,
        Val : data.data.products.data
      })

    } ,

    components: {
      Slider ,
      ProductSlider ,
      Posters
    } ,

    computed: {
      ...mapState({
        SiteSetting: 'SiteSetting' ,
        Products: state => state.Product.Products
      })
    }
  }
</script>
