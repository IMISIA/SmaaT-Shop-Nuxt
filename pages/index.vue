<template>
  <div>
    <div class="row m-0 pt-3">
      <div class="col-md-9 pr-md-0">
        <slider :slides="SiteSetting.slider" />
      </div>

      <div class="col-md-3 pt-3 pt-md-0">
        <img class="aside-poster"
          src="https://dkstatics-public.digikala.com/digikala-adservice-banners/1000007945.gif" alt="پوستر" />
      </div>
    </div>

    <product-slider class="pt-3"
      :Products="{
        title: 'محصولات' ,
        data: Products ,
        size: 12
      }"
    />

    <posters class="pt-3" :Posters="SiteSetting.posters"/>
    
    <brands-slider />
  </div>
</template>

<script>
  import Slider from '~/components/Slider.vue';
  import ProductSlider from '~/components/ProductSlider.vue';
  import Posters from '~/components/Posters.vue';
  import BrandsSlider from '~/components/BrandsSlider.vue';
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
        Module : 'product' ,
        Prop : 'Products' ,
        Val : data.data.products.data
      })
    } ,

    components: {
      Slider ,
      ProductSlider ,
      Posters ,
      BrandsSlider
    } ,

    computed: {
      ...mapState({
        SiteSetting: 'SiteSetting' ,
        Products: state => state.product.Products
      })
    }
  }
</script>
