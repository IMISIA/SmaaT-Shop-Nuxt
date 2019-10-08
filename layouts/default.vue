<template>
  <div v-if="SITE">
    <div class="header-banner" v-if="SiteSetting.header_banner && SiteSetting.header_banner.wide">
      <a :href="SiteSetting.banner_link">
        <v-img
          :src="$url + SiteSetting.header_banner.wide"
          max-height="50"
          max-width="auto"
          aspect-ratio="20"
          cover
        />
      </a>
    </div>

    <Header />

    <main id="app">
      <div id="categories-overlay"></div>
      <nuxt />
    </main>

    <Footer />

    <Auth />

    <v-btn id="back-to-top" class="web-grd-from-dark hidden" small
      fab dark @click="$vuetify.goTo(0 , { duration : 1000 })">
      <v-icon>expand_less</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import Header from '~/components/Header.vue';
  import Footer from '~/components/Footer.vue';
  import Auth from '~/components/Auth.vue';
  import Cookie from '~/plugins/cookie';
  import { mapState, mapMutations } from 'vuex';

  export default {
    head () {
      return {
        title: this.SiteSetting.title,
        meta: [
          { hid: 'description', name: 'description', content: this.SiteSetting.description } ,
          { name: 'theme-color', content: this.SiteSetting.theme_color } ,
        ]
      }
    } ,

    created() {
      // this.$nuxt.$axios.defaults.baseURL = 'https://cors-anywhere.herokuapp.com/' + this.$nuxt.$axios.defaults.baseURL;
      this.$nuxt.$res = process.client ? this.$nuxt.$el.clientWidth < 770 : false;
      // if(process.client) {
      //   if(this.$reload) {
      //     Cookie.remove('JWT');
      //     location.reload();
      //   };
      //   if(this.$auth) {
      //     this.$nuxt.$axios.defaults.baseURL = this.$nuxt.$axios.defaults.baseURL + '/auth';
      //     this.$nuxt.$axios.setToken(Cookie.get('JWT') , 'Bearer');
      //   };
      // }
      if(process.client) this.ClientInit();

    } ,

    components: {
      Header ,
      Footer ,
      Auth
    } ,

    data() {
      return {
        SITE: false  
      }
    } ,

    computed: mapState([
      '$reload',
      '$auth' ,
      '$url',
      'SiteSetting'
    ]) ,

    methods: {
      ...mapMutations([
        'Set_state'
      ]) ,

      ClientInit() {
        // let JWT = Cookie.parser(document.cookie).JWT;
        let JWT = localStorage.getItem('JWT');

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
                            watermark {
                              id
                              file_name
                              small
                            }
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

        this.$nuxt.$axios.setToken(JWT , 'Bearer');
        if(JWT) this.$nuxt.$axios.defaults.baseURL = this.$nuxt.$axios.defaults.baseURL + '/auth';

        this.$nuxt.$axios({
            method : 'POST' ,
            data : {
                query : query.init()
            }
        })
        .then( ({data}) => {
            if( data.data.me && !!Object.keys(data.data.me).length ) {
                // state.Me = data.data.me;
                // state.$auth = true;
                this.Set_state({ Prop: 'Me' , Val: data.data.me });
                this.Set_state({ Prop: '$auth' , Val: true });
            }
            this.Set_state({ Prop: 'Categories' , Val: data.data.categories.data });
            this.Set_state({ Prop: 'Shopping_Cart' , Val: data.data.cart });
            this.Set_state({ Prop: 'SiteSetting' , Val: data.data.siteSetting });
            this.Set_state({ Prop: 'Brands' , Val: data.data.brands.data });
            // state.Categories = data.data.categories.data;
            // state.Shopping_Cart = data.data.cart;
            // state.SiteSetting = data.data.siteSetting;
            // state.Brands = data.data.brands.data;
        })
        .then( () => {
          this.SITE = true;
          this.paddingTop();
          this.$root.$loading.finish();
        })
        .catch( Err => {
            if( Err.response && Err.response.status == 401 ) {
              // Cookie.remove('JWT');
              localStorage.removeItem('JWT');
              location.reload();
            } else {
                console.error(Err);
            }
        })
      } ,

      paddingTop() {
          setTimeout(() => {
            $('main').css({ paddingTop: $('.smt-header').outerHeight() })
          }, 300);

          window.addEventListener('resize', () => {
            setTimeout(() => {
              $('main').css({ paddingTop: $('.smt-header').outerHeight() })
            }, 300);
          });

          window.onscroll = function () {
            if ( $(window).scrollTop() > 150 ) {
              $('#back-to-top').removeClass('hidden');  
            } else {
              $('#back-to-top').addClass('hidden');
            }
          };
      }
    }
  }

</script>
