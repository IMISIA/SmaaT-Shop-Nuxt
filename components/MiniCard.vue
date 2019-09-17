<template>
    <div id="mini-card-component" class="row mx-0 rtl">
        <slot name="before"></slot>

        <div :class="imageClass">
            <nuxt-link :to="`/product/${variation.product.slug}/review`">
                <v-img
                    :src=" is_exist(variation.product.photos)
                        ? URL + variation.product.photos[0].small
                        : '/images/none.png' "
                    :height="imageSize"
                    :width="imageSize"
                    class="m-auto"
                    aspect-ratio="1"
                    contain
                />
            </nuxt-link>
        </div>

        <div :class="infoClass" class="d-flex flex-column justify-content-between">
            <nuxt-link :to="`/product/${variation.product.slug}/review`">
                <h3 class="product-name" :class="{ 'small':small , 'mini':mini }">
                    {{ variation.product.name | truncate(truncate) }}
                </h3>
            </nuxt-link>

            <template v-if="hasPrice">
                <span class="web-color fs-13 text-right">
                    {{ variation.sales_price | Num2Fa }} تومان
                </span>
            </template>

            <template v-if="hasVariations">
                <ul class="variations" v-if="!small && !mini">
                    <li v-if="variation.warranty">
                        <i class="fas fa-shield-alt ml-1"></i>
                        گارانتی {{ variation.warranty.title }}
                    </li>
                    <li v-if="variation.color">
                        <i class="fas fa-palette ml-1"></i>
                        رنگ {{ variation.color.name }}
                        <span class="el-color" :style="{ backgroundColor : variation.color.code }"></span>
                    </li>
                    <li v-if="variation.size">
                        <i class="fas fa-chart-line ml-1"></i>
                        سایز {{ variation.size.name }}
                    </li>
                </ul>

                <ul class="variations-small" :class="{ 'mini':mini }" v-else>
                    <li v-if="variation.warranty">
                        گارانتی {{ variation.warranty.title }}
                    </li>
                    <li v-if="variation.color">
                        رنگ {{ variation.color.name }}
                    </li>
                    <li v-if="variation.size">
                        سایز {{ variation.size.name }}
                    </li>
                </ul>
            </template>
        </div>

        <slot name="after"></slot>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
        props: {
            variation: {
                required: true ,
                type: Object
            } ,
            hasPrice: {
                type: Boolean ,
                default: false
            } ,
            hasVariations: {
                type: Boolean ,
                default: true
            } ,
            small: {
                type: Boolean ,
                default: false
            } ,
            mini: {
                type: Boolean ,
                default: false
            } ,
            imageClass: {
                type: String ,
                default: 'col-sm-5 col-md-2'
            } ,
            infoClass: {
                type: String ,
                default: 'col-sm-6 col-md-4 py-3'
            } ,
            imageSize: {
                type: [Number,String] ,
                default: '100%'
            } ,
            truncate: {
                type: Number ,
                default: 200
            }
        } ,

        computed: mapState([
            'URL'
        ]) ,

        methods: {
            is_exist(val) {
                if( !!val && typeof val == 'number' ) {
                    return true;
                } else if(process.client) {
                    return typeof val === 'string' ? !(_.isEmpty(val.trim())) : !(_.isEmpty(val)); 
                }
            }
        }    
    }
</script>