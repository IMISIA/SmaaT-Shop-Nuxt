<template>
    <div class="filter-bar p-3">

        <!-- Categories Tree -->
        <el-card>
            <div slot="header"> دسته‌بندی نتایج </div>

            <div>
                <el-tree
                    :data="TreeCtg"
                    :props="TreeDefaultProps"
                    @node-click="NodeClick"
                    accordion
                ></el-tree>
            </div>
        </el-card>

        <!-- Search Input -->
        <el-card>
            <div slot="header"> جستجو در نتایج </div>

            <div>
                <el-input
                    class="rtl"
                    v-model="Params.query"
                    placeholder="نام محصول مورد نظر را بنویسید ...">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </el-card>

        <!-- Available Products -->
        <el-card>
            <div class="available-products">
                <v-app>
                    <v-switch
                        v-model="Available_Products"
                        label="فقط کالاهای موجود"
                        color="#0ECFC6"
                        inset
                    ></v-switch>
                </v-app>
            </div>
        </el-card>


    </div>
</template>

<script>
    // import mixin from '~/Mixins/mixin';
    import { mapState } from 'vuex';

    export default {

        // mixins: [mixin] ,

        data() {
            return {
                Params: {
                    brands: [] ,
                    sizes: [] ,
                    colors: [] ,
                    warranties: [] ,
                    query: '' ,
                } ,
                
                Available_Products: false ,

                TreeDefaultProps: {
                    children: 'childs' ,
                    label: 'title'
                }
            }
        } ,

        computed: {
            ...mapState({
                Categories: 'Categories' ,
                Filters: state => state.Product.Filters
            }) ,

            TreeCtg() {
                if(this.$route.params.slug) {
                    return this.Categories.filter( Ctg => Ctg.slug == this.$route.params.slug );
                } else {
                    return this.Categories;
                }
            }
        } ,

        methods: {
            NodeClick(node) {
                console.log(node);
            }
        }

    }
</script>