<template>
    <v-dialog class="add-address" v-model="modal" width="1000" :fullscreen="Res" persistent>
        <div class="dialog-title web-bg-ultra-fade">
            <v-btn text icon small @click="closeModal()">
                <v-icon>close</v-icon>
            </v-btn>
            <span class="title-address-dialog">
                {{ title || 'افزودن آدرس جدید' }}
                <v-icon>fas fa-map-marked-alt</v-icon>
            </span>
        </div>

        <v-divider></v-divider>

        <div class="dialog-content">
            <v-form class="row mx-0 py-4" v-model="newAddress.valid">
                <div class="col-md-6">
                    <div class="row rtl">
                        <div class="col-md-6">
                            <span class="title-field required"> استان </span>
                            <v-select
                                v-model="province.select"
                                :items="provinces"
                                item-text="name"
                                item-value="id"
                                @change="(id) => setCenterMap( this.provinces.find(el => el.id == id).coordinates )"
                                no-data-text="موردی وجود ندارد"
                                label="استان مورد نظر خود را انتخاب کنید"
                                outlined
                                single-line>
                                <template #prepend-item>
                                    <div class="text-right mb-1 px-2">
                                        <el-input
                                            class="rtl search-input"
                                            v-model="province.query"
                                            placeholder="جستجوی نام استان ...">
                                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                                        </el-input>
                                    </div>
                                </template>
                            </v-select>
                        </div>

                        <div class="col-md-6">
                            <span class="title-field required"> شهر </span>
                            <v-select
                                v-model="city.select"
                                :items="cities"
                                item-text="name"
                                item-value="id"
                                @change="(id) => setCenterMap( this.cities.find(el => el.id == id).coordinates )"
                                :no-data-text=" this.province.select ? 'موردی وجود ندارد' : 'ابتدا استان را انتخاب کنید' "
                                label="شهر مورد نظر خود را انتخاب کنید"
                                outlined
                                single-line>
                                <template #prepend-item>
                                    <div class="text-right mb-1 px-2">
                                        <el-input
                                            class="rtl search-input"
                                            v-model="city.query"
                                            placeholder="جستجوی نام شهر ...">
                                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                                        </el-input>
                                    </div>
                                </template>
                            </v-select>
                        </div>
                    </div>

                    <div class="new-address-map">
                        <l-map class="web-border" :zoom="12" :center="map.center">
                            <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>

                            <l-circle-marker :lat-lng="map.locationUser" :radius="6" color="#304FFE">
                                <l-tooltip>موقعیت مکانی شما</l-tooltip>
                            </l-circle-marker>

                            <l-marker 
                                :draggable="true"
                                :lat-lng.sync="map.marker">
                                <l-icon
                                    :icon-size="[40,50]"
                                    :icon-anchor="[20,50]"
                                    icon-url="/svg/location_marker.svg" >
                                </l-icon>
                                <l-tooltip>موقعیت مکانی تحویل گیرنده</l-tooltip>
                            </l-marker>
                        </l-map>  
                    </div>
                </div>

                <div class="col-md-6 mt-4 mt-md-0">
                    <span class="title-field required"> نام و نام خانوادگی گیرنده </span>
                    <v-text-field
                        v-model="newAddress.full_name"
                        label="نام و نام خانوادگی گیرنده را وارد کنید"
                        reverse
                        single-line
                        outlined
                        :rules="[rules.required]"
                    ></v-text-field>

                    <span class="title-field required"> شماره موبایل </span>
                    <v-text-field
                        class="rtl"
                        v-model="newAddress.phone_number"
                        type="number"
                        label="09XXXXXXXXX"
                        reverse
                        single-line
                        outlined
                        :rules="[rules.required,rules.phone_number]"
                    ></v-text-field>

                    <span class="title-field required"> آدرس پستی </span>
                    <v-textarea
                        v-model="newAddress.address"
                        label="آدرس پستی تحویل گیرنده را وارد کنید"
                        reverse
                        rows="3"
                        single-line
                        outlined
                        :rules="[rules.required]"
                    ></v-textarea>

                    <span class="title-field required"> کدپستی </span>
                    <v-text-field
                        class="rtl"
                        v-model="newAddress.postal_code"
                        type="number"
                        label="کدپستی را بدون خط تیره وارد کنید"
                        reverse
                        single-line
                        outlined
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-btn class="text-white" :disabled="!newAddress.valid || newAddress.loading"
                        color="#00B0FF" large block :loading="newAddress.loading">
                        ثبت
                        <i class="flaticon-correct ml-2 bold fs-16"></i>
                    </v-btn>
                </div>
            </v-form>
        </div>
    </v-dialog>
</template>

<script>
    const {
        LMap ,
        LTileLayer ,
        LMarker ,
        LIcon ,
        LCircleMarker ,
        LTooltip ,
    } = process.client ? require('vue2-leaflet'): {};
    import 'leaflet/dist/leaflet.css';

    export default {
        props: {
            modal: {
                type: Boolean ,
                required: true
            } ,
            title: {
                type: String
            } ,
            closeModal: {
                type: Function ,
                required: true
            }
        } ,

        components: {
            LMap ,
            LTileLayer ,
            LMarker ,
            LIcon ,
            LCircleMarker ,
            LTooltip
        } ,

        data() {
            return {
                Res : process.client ? this.$nuxt.$el.clientWidth < 770 : false ,
                newAddress: {
                    valid: false ,
                    loading: false ,
                    full_name: '' ,
                    type: '' ,
                    phone_number: '' ,
                    address: '' ,
                    postal_code: '' ,
                    city_id: 0 ,
                    lat: 0 ,
                    lng: 0
                } ,

                rules : {
                    required: value => !!value || 'این فیلد الزامی است',
                    phone_number: value => value.length == 11 || 'شماره همراه باید 11 رقم باشد',
                } ,

                map: {
                    center: [36.310699, 59.599457] ,
                    marker: [36.310699, 59.599457] ,
                    locationUser: [36.310699, 59.599457]
                } ,

                province: {
                    select: '' ,
                    query: ''
                } ,

                city: {
                    select: '' ,
                    query: ''
                }
            }
        } ,

        computed: {
            provinces() {
                return this.$parent.provinces.filter( el => el.name.search(this.province.query) !== -1 );
            } ,

            cities() {
                return this.$parent.cities.filter( el => el.name.search(this.city.query) !== -1 );
            }
        } ,

        methods: {
            setCenterMap(coordinates) {
                this.map.center = [coordinates.lat , coordinates.lng];
                this.map.marker = [coordinates.lat , coordinates.lng];
            }
        }
    }
</script>