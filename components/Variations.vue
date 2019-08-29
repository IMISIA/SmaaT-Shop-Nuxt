<template>
    <ul class="variations my-3">

        <!-- Warranties -->
        <template v-if="is_exist(Warranties)">
            <li>
                <i class="fas fa-shield-alt web-color"></i>

                <template v-if="Warranties.length === 1">
                    گارانتی
                    {{ Warranties[0].title }}
                </template>

                <template v-else>
                    انتخاب گارانتی :
                    <el-radio-group class="mr-2" v-model="Warranty_Select" size="mini">
                        <el-radio v-for="item in Warranties" :key="item.id" :label="item.id" border>
                            {{ item.title }}
                        </el-radio>
                    </el-radio-group>
                </template>
            </li>
        </template>

        <!-- Colors -->
        <template v-if="is_exist(Colors)">
            <li>
                <i class="fas fa-palette web-color"></i>

                <template v-if="Colors.length === 1">
                    رنگ
                    {{ Colors[0].name }}
                </template>

                <template v-else>
                    انتخاب رنگ :
                    <el-radio-group class="mr-2" v-model="Color_Select" size="mini">
                        <el-radio v-for="item in Colors" :key="item.id" :label="item.id" border>
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </template>
            </li>
        </template>

        <!-- Sizes -->
        <template v-if="is_exist(Sizes)">
            <li>
                <i class="fas fa-chart-line web-color"></i>

                <template v-if="Sizes.length === 1">
                    سایز
                    {{ Sizes[0].name }}
                </template>

                <template v-else>
                    انتخاب سایز :
                    <el-radio-group class="mr-2" v-model="Size_Select" size="mini">
                        <el-radio v-for="item in Sizes" :key="item.id" :label="item.id" border>
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </template>
            </li>
        </template>

    </ul>
</template>

<script>
    import mixin from '~/Mixins/mixin';
    import { mapState } from 'vuex';

    export default {
        mixins: [mixin] ,

        data() {
            return {
                Size_Select: {} ,   
                Color_Select: {} ,   
                Warranty_Select: {}   
            }
        } ,

        computed: {
            ...mapState({
                Variations: state => state.Product.Single_Product.variations
            }) ,

            Sizes() {
                if(process.client) {
                    let arr = _.compact(_.uniqBy( this.Variations.map( item => item.color ) , 'id' ));
                    this.Size_Select = this.is_exist(arr) ? arr[0].id : {};
                    return  arr;
                } else {
                    return []
                }
            } ,

            Colors() {
                if(process.client) {
                    let arr = _.compact(_.uniqBy( this.Variations.map( item => item.size ) , 'id' ));
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