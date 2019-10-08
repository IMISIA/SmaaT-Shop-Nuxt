<template>
    <section class="addresses">
        <div class="d-flex justify-content-between rtl">
            <span class="headline-info"> آدرس ها </span>
            <v-btn class="my-auto" color="#767676" text @click="openModal(false)">
                <v-icon right>fas fa-map-marker-alt</v-icon>
                <span class="fs-13"> افزودن آدرس جدید </span>
            </v-btn>
        </div>

        <div class="row rtl" v-if="Me.addresses && Me.addresses.length">
            <div class="col-12 col-lg-6 mb-3" v-for="address in Me.addresses" :key="address.id">
                <el-card class="am-shadow" :body-style="{ padding: 0 }">
                    <div class="box-address">
                        <h4 class="address-fullname"> {{ address.full_name }} </h4>
                        <p class="address-text"> {{ address.address }} </p>

                        <ul class="address-data">
                            <li>
                                <i class="far fa-envelope"></i>
                                کدپستی :
                                {{ address.postal_code | Num2Fa(false) }}
                            </li>
                            <li>
                                <i class="fas fa-phone"></i>
                                تلفن همراه :
                                {{ address.phone_number | Num2Fa(false) }}
                            </li>
                        </ul>
                    </div>

                    <div class="box-actions small row">
                        <v-btn class="col-4" text color="#dc3545">
                            حذف
                        </v-btn>
                        <v-btn class="col-8" text color="#0ecfc6" @click="openModal(address)">
                            ویرایش
                        </v-btn>
                    </div>
                </el-card>
            </div>
        </div>

        <no-data v-else :buttonTitle="null" message="آدرسی ثبت نشده است"></no-data>

        <AddAddress ref="AddAddress" :modal="addressModal" :title="addressModalTitle" :close-modal="() => addressModal = false"/>
    </section>
</template>

<script>
    import AddAddress from '~/components/AddAddress.vue';
    import { mapState } from 'vuex';
    export default {
        async asyncData({ $axios }) {
            let { data } = await $axios({
                method: 'POST' ,
                data: {
                    query: `
                        {
                            provinces(country: 1) {
                                id
                                name
                                coordinates {
                                    lat
                                    lng
                                }
                            }

                            cities(province: 11) {
                                id
                                name
                                coordinates {
                                    lat
                                    lng
                                }   
                            }
                        }
                    `
                }
            })

            return {
                provinces: data.data.provinces ,
            }
        } ,

        async fetch({ $axios , store }) {
            let { data } = await $axios({
                method: 'POST' ,
                data: {
                query: `
                    {
                        me {
                            addresses {
                                id
                                full_name
                                phone_number
                                type
                                address
                                postal_code
                                city {
                                    id
                                    name
                                    province {
                                        id
                                        name
                                    }
                                }
                                coordinates {
                                    lat
                                    lng
                                }
                            }
                        }
                    }
                `
                }
            })

            store.commit( 'Set_state' , {
                Prop : 'Me' ,
                Val : data.data.me ,
                Obj_Assign: true
            })
        } ,

        data() {
            return {
                addressModal: false ,
                addressModalTitle: 'افزودن آدرس جدید' ,
            }
        } ,

        computed: {
            ...mapState([
                'Me'
            ])
        } ,

        components: {
            AddAddress
        } ,

        methods: {
            openModal(editable_address) {
                if(!editable_address) {
                    this.addressModalTitle = 'افزودن آدرس جدید';
                    Object.keys(this.$refs.AddAddress.newAddress).map( el => {
                        if(el != 'valid' && el != 'loading') this.$refs.AddAddress.newAddress[el] = '';
                    });
                    this.$refs.AddAddress.province.select = '';
                    this.$refs.AddAddress.city.select = '';                    
                    this.addressModal = true;
                } else {
                    this.addressModalTitle = 'ویرایش آدرس';
                    let clone = { ...editable_address };
                    clone.city = null;
                    clone.coordinates = null;
                    clone.city_id = editable_address.city.id;
                    clone.lat = editable_address.coordinates.lat;
                    clone.lng = editable_address.coordinates.lng;
                    clone.id = eval(clone.id);
                    this.$refs.AddAddress.province.select = editable_address.city.province.id;
                    this.$refs.AddAddress.city.select = editable_address.city.id;
                    this.$refs.AddAddress.newAddress = { ...this.$refs.AddAddress.newAddress , ...clone };
                    this.addressModal = true;
                }
            }
        }
    }
</script>