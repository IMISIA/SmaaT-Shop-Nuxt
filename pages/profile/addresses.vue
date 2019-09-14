<template>
    <section class="addresses">
        <div class="d-flex justify-content-between rtl">
            <span class="headline-info"> آدرس ها </span>
            <v-btn class="my-auto" color="#767676" text @click="openModal(false)">
                <v-icon right>fas fa-map-marker-alt</v-icon>
                <span class="fs-13"> افزودن آدرس جدید </span>
            </v-btn>
        </div>

        <div class="row rtl">
            <div class="col-12 col-lg-6 mb-3" v-for="n in 3" :key="n">
                <el-card class="am-shadow" :body-style="{ padding: 0 }">
                    <div class="box-address">
                        <h4 class="address-fullname"> سید ایمان اصنافی </h4>
                        <p class="address-text"> استان خراسان رضوی، ‌شهر مشهد، سناباد 44 ، ساختمان 52 ، واحد 7 </p>

                        <ul class="address-data">
                            <li>
                                <i class="far fa-envelope"></i>
                                کدپستی :
                                {{ 1234567899 | Num2Fa(false) }}
                            </li>
                            <li>
                                <i class="fas fa-phone"></i>
                                تلفن همراه :
                                {{ 1234567899 | Num2Fa(false) }}
                            </li>
                        </ul>
                    </div>

                    <div class="box-actions small row mx-0">
                        <v-btn class="col-4" text color="#dc3545">
                            حذف
                        </v-btn>
                        <v-btn class="col-8" text color="#0ecfc6" @click="openModal( 'edit-' + n )">
                            ویرایش
                        </v-btn>
                    </div>
                </el-card>
            </div>
        </div>

        <AddAddress :modal="addressModal" :title="addressModalTitle" :close-modal="() => addressModal = false"/>
    </section>
</template>

<script>
    import AddAddress from '~/components/AddAddress.vue';
    export default {
        async asyncData({ $axios }) {
            let { data } = await $axios({
                baseURL: '' ,
                url: 'http://maskanshow.com/graphql' ,
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
                cities: data.data.cities
            }
        } ,

        data() {
            return {
                addressModal: false ,
                addressModalTitle: 'افزودن آدرس جدید' ,
            }
        } ,

        components: {
            AddAddress
        } ,

        methods: {
            openModal(editable_address) {
                if(!editable_address) {
                    this.addressModalTitle = 'افزودن آدرس جدید';
                    this.addressModal = true;
                } else {
                    this.addressModalTitle = 'ویرایش آدرس';
                    this.addressModal = true;
                }
            }
        }
    }
</script>