<template>
    <ul class="variations">
        <!-- Warranties -->
        <template v-if="is_exist(Warranties)">
            <li class="warranties">
                <i class="fas fa-shield-alt web-color"></i>

                <template v-if="Warranties.length === 1">
                    <span class="variation-title"> گارانتی {{ Warranties[0].title }} </span>
                </template>

                <template v-else>
                    <span class="variation-title"> انتخاب گارانتی : </span>
                    <el-radio-group class="mr-2" v-model="Warranty_Select" size="mini">
                        <swiper :options="SwiperVariationOption">
                            <swiper-slide v-for="item in Warranties" :key="item.id">
                                <el-radio :label="item.id" border>
                                    {{ item.title }}
                                </el-radio>
                            </swiper-slide>
                        </swiper>
                    </el-radio-group>
                </template>
            </li>
        </template>

        <!-- Colors -->
        <template v-if="is_exist(Colors)">
            <li>
                <i class="fas fa-palette web-color"></i>

                <template v-if="Colors.length === 1">
                    <span class="variation-title"> رنگ {{ Colors[0].name }} </span>
                </template>

                <template v-else>
                    <span class="variation-title"> انتخاب رنگ : </span>
                    <el-radio-group class="mr-2" v-model="Color_Select" size="small" @change="SyncColor">
                        <swiper :options="SwiperVariationOption">
                            <swiper-slide v-for="item in Colors" :key="item.id">
                                <el-radio :label="item.id" border>
                                    <span class="el-color el-radio__input" :style="{ backgroundColor : item.code }"></span>
                                    {{ item.name }}
                                </el-radio>
                            </swiper-slide>
                        </swiper>
                    </el-radio-group>
                </template>
            </li>
        </template>

        <!-- Sizes -->
        <template v-if="is_exist(Sizes)">
            <li>
                <i class="fas fa-chart-line web-color"></i>

                <template v-if="Sizes.length === 1">
                    <span class="variation-title"> سایز {{ Sizes[0].name }} </span>
                </template>

                <template v-else>
                    <span class="variation-title"> انتخاب سایز : </span>
                    <el-radio-group class="mr-2" v-model="Size_Select" size="mini">
                        <swiper :options="SwiperVariationOption">
                            <swiper-slide v-for="item in Sizes" :key="item.id">
                                <el-radio :label="item.id" border>
                                    {{ item.name }}
                                </el-radio>
                            </swiper-slide>
                        </swiper>
                    </el-radio-group>
                </template>
            </li>
        </template>
    </ul>
</template>

<script>
    import mixin from '~/mixins/mixin';
    import { mapState } from 'vuex';

    export default {
        props: {
            SyncColor: {
                type: Function ,
                required: true
            }
        } ,

        mixins: [mixin] ,

        data() {
            return {
                SwiperVariationOption: {
                    slidesPerView: 'auto' ,
                    // freeMode: true
                } ,

                Size_Select: {} ,   
                Color_Select: {} ,   
                Warranty_Select: {}
            }
        } ,

        computed: {
            ...mapState({
                Variations: state => state.product.Single_Product.variations
            }) ,

            Sizes() {
                if(process.client) {
                    let arr = _.compact(_.uniqBy( this.Variations.map( item => item.size ) , 'id' ));
                    this.Size_Select = this.is_exist(arr) ? arr[0].id : {};
                    return  arr;
                } else {
                    return []
                }
            } ,

            Colors() {
                if(process.client) {
                    let arr = _.compact(_.uniqBy( this.Variations.map( item => item.color ) , 'id' ));
                    this.Color_Select = this.is_exist(arr) ? arr[0].id : {};
                    return arr;
                } else {
                    return []
                }
            } ,

            Warranties() {
                if(process.client) {
                    let arr = _.compact(_.uniqBy( this.Variations.map( item => item.warranty ) , 'id' ));
                    this.Warranty_Select = this.is_exist(arr) ? arr[0].id : {};
                    return arr;
                } else {
                    return []
                }
            }
        }
    }
</script>