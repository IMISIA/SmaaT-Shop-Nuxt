<template>
    <article>
        <!-- Title -->
        <div class="col-12 mb-4">
            <p class="bold mb-1"> مشخصات فنی </p>
            <span class="fs-13 text-muted"> {{ Product.name }} </span>
        </div>

        <div v-if="is_exist(Product.spec) && is_exist(Product.spec.headers)">
            <template v-for="(spec,idx) in Product.spec.headers">
                <div class="mt-4" v-if="is_exist(spec.rows)" :key="idx">
                    <div>
                        <el-popover v-if="spec.description" placement="bottom-start"
                            class="text-right" width="300" trigger="hover"
                            :disabled="typeof spec.description === 'string' ? spec.description.length < 80 : false"
                            :content="spec.description">
                            <span slot="reference" class="fs-10 mr-2">
                                {{ spec.description | truncate(80) }}
                            </span>
                        </el-popover>

                        <h3 class="spec-title web-color">
                            {{ spec.title }}
                            <i class="fas fa-chevron-left ml-1 web-color"></i>
                        </h3>
                    </div>

                    <div class="row w-100 mx-0 rtl" v-for="( item , index ) in spec.rows" :key="index">
                        <template v-if=" is_exist(item.data)
                            ? ( is_exist(item.data.values) || is_exist(item.data.data) )
                            : false ">

                            <div class="col-md-3 row-title">
                                <el-popover placement="top-end" width="300" trigger="hover"
                                    :disabled="!item.help" :content="item.help">
                                    <span slot="reference">
                                        {{ item.title }}
                                        <v-icon class="fs-20 float-left"> {{ item.icon }} </v-icon>
                                    </span>
                                </el-popover>
                            </div>

                            <template v-if="is_exist(item.data.values)">
                                <div class="col-md-9 row-value" v-for="val in item.data.values" :key="val.id">
                                    {{ item.prefix +' '+ val.value +' '+ item.postfix }}
                                </div>
                            </template>

                            <template v-else-if="is_exist(item.data.data) && item.is_multiple && is_json(item.data.data)">
                                <div class="col-md-9 row-value" v-for="val in Json_parse(item.data.data)" :key="val.id">
                                    {{ item.prefix +' '+ val +' '+ item.postfix }}
                                </div>
                            </template>

                            <template v-else-if="is_exist(item.data.data)">
                                <div class="col-md-9 row-value">
                                    {{ item.prefix +' '+ item.data.data +' '+ item.postfix }}
                                </div>
                            </template>

                        </template>
                    </div>
                </div>
            </template>
        </div>
    </article>
</template>

<script>
    import { mapState } from 'vuex';
    
    export default {

        async fetch({ $axios , store , params }) {

            if(store.state.Product.Requested.spec) return;

            let { data } = await $axios({
                method: 'POST' ,
                data: {
                query: `
                    {
                        product( slug : "${params.slug}" ) {
                            id
                            spec {
                                id
                                title
                                headers {
                                    id
                                    title
                                    description
                                    rows {
                                        id
                                        title
                                        description
                                        icon
                                        is_multiple
                                        prefix
                                        postfix
                                        data {
                                            id
                                            data
                                            values {
                                                id
                                                value
                                            }
                                        }
                                        help
                                    }
                                }
                            }
                        }
                    }
                `
                }
            })

            store.commit( 'Set_state' , {
                Module : 'Product' ,
                Prop : 'Single_Product' ,
                Val : data.data.product ,
                Obj_Assign: true
            })

            store.state.Product.Requested.spec = true;

        } ,

        computed: mapState({
            Product: state => state.Product.Single_Product
        }) ,

        methods: {
            is_exist(val) {
                if( !!val && typeof val == 'number' ) {
                    return true;
                } else if(process.client) {
                    return typeof val === 'string' ? !(_.isEmpty(val.trim())) : !(_.isEmpty(val)); 
                }
            } ,

            join_props( values , prefix , postfix ) {
                let arr = [];
                
                if(!prefix) prefix = '';
                if(!postfix) postfix = '';

                values.map( el => {
                    arr.push( prefix +' '+  el.value +' '+ postfix );
                })

                return arr.join(' ، ');
            } ,

            Json_parse(val) {
                return JSON.parse(val);
            } ,

            is_json(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }
        }

    }
</script>