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
                                {{ (1234567899).toLocaleString('fa-IR' , {useGrouping: false}) }}
                            </li>
                            <li>
                                <i class="fas fa-phone"></i>
                                تلفن همراه :
                                {{ (1234567899).toLocaleString('fa-IR' , {useGrouping: false}) }}
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

        <v-dialog v-model="addressModal" width="500">

            <v-card>
                <v-card-title class="headline grey lighten-2">
                    {{ addressModalTitle }}
                </v-card-title>

                <v-card-text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                    ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                    nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id est laborum.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="primary" text @click="addressModal = false">
                        I accept
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
    </section>
</template>

<script>
    import {mapMutations} from 'vuex';
    export default {
        data() {
            return {
                addressModal: false ,
                addressModalTitle: 'افزودن آدرس جدید' ,
                newAddress: {
                    full_name: '' ,
                    type: '' ,
                    phone_number: '' ,
                    address: '' ,
                    postal_code: '' ,
                    city_id: 0 ,
                    lat: 0 ,
                    lng: 0
                }
            }
        } ,

        methods: {
            openModal(editable_address) {
                if(!editable_address) {
                    this.addressModalTitle = 'افزودن آدرس جدید';
                    this.addressModal = true;
                } else {
                    this.addressModalTitle = editable_address;
                    this.addressModal = true;
                }
            }
        }
    }
</script>