<template>
    <div id="mini-card-component" class="row mx-0 rtl">
        <slot name="before"></slot>

        <div :class="imageClass">
            <nuxt-link :to="`/product/${variation.product.slug}`">
                <v-img
                    :src=" is_exist(variation.product.photos)
                        ? $url + variation.product.photos[0][imageProperty]
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
            <nuxt-link :to="`/product/${variation.product.slug}`">
                <h3 class="product-name" :class="{ 'small':small , 'mini':mini }">
                    {{ variation.product.name | truncate(truncate) }}
                </h3>
            </nuxt-link>

            <template v-if="hasPrice">
                <template v-if="is_exist(variation.product.variation) && !variation.product.label">
                    <div class="offer-price">
                        <span> {{ 110000 | Num2Fa }} </span>
                    </div>
                    <span class="product-price web-color" data-price="تومان">
                        {{ variation.sales_price | Num2Fa }}
                    </span>
                </template>

                <template v-else>
                    <vs-alert class="text-center" 
                        :color=" variation.product.label ? variation.product.label.color : 'rgb(231, 154, 23)' " active="true">
                        <span> {{ variation.product.label ? variation.product.label.title : 'ناموجود !' }} </span>
                    </vs-alert>
                </template>
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

                <ul class="variations-small" :class="{ 'mini':mini , 'flex-column' : allSmallVariations }" v-else>
                    <li v-if="count">
                        {{ count | Num2Fa }} عدد
                    </li>
                    <li class="d-inline-flex" v-if="variation.color">
                        <span class="el-color-small" :style="{ backgroundColor : variation.color.code }"></span>
                        {{ variation.color.name }}
                    </li>
                    <li v-if="variation.warranty && allSmallVariations">
                        گارانتی {{ variation.warranty.title }}
                    </li>
                    <li v-if="variation.size && allSmallVariations">
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
            } ,
            hasVariations: {
                type: Boolean ,
                default: true
            } ,
            allSmallVariations: {
                type: Boolean ,
                default: true
            } ,
            small: {
                type: Boolean ,
            } ,
            mini: {
                type: Boolean ,
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
            imageProperty: {
                type: String ,
                default: 'small'
            } ,
            count: {
                type: [Number,String]
            } ,
            truncate: {
                type: Number ,
                default: 200
            }
        } ,

        computed: mapState([
            '$url'
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