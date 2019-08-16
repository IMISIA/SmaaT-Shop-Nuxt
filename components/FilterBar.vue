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
                    class="rtl search"
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
                        :color="web_color"
                        inset
                    ></v-switch>
                </v-app>
            </div>
        </el-card>

        <!-- Brands -->
        <el-card class="collapsible" v-if="is_exist(Brands)">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <span> برند </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <el-input
                            class="rtl search mb-3"
                            v-model="Params.brands.query"
                            placeholder="جستجوی نام برند ...">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>

                        <el-checkbox-group v-model="Params.brands.value">
                            <el-checkbox
                                class="filter-list"
                                v-for="item in Brands"
                                :key="item.id"
                                :label="item.id"
                            >
                                {{ item.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </el-card>

        <!-- Sizes -->
        <el-card class="collapsible" v-if="is_exist(Sizes)">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <span> سایز </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <el-input
                            class="rtl search mb-3"
                            v-model="Params.sizes.query"
                            placeholder="جستجوی سایز ...">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>

                        <el-checkbox-group v-model="Params.sizes.value">
                            <el-checkbox
                                class="filter-list"
                                v-for="item in Sizes"
                                :key="item.id"
                                :label="item.id"
                            >
                                {{ item.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </el-card>

        <!-- Colors -->
        <el-card class="collapsible" v-if="is_exist(Colors)">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <span> رنگ </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <el-input
                            class="rtl search mb-3"
                            v-model="Params.colors.query"
                            placeholder="جستجوی رنگ ...">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>

                        <el-checkbox-group v-model="Params.colors.value">
                            <el-checkbox
                                class="filter-list"
                                v-for="item in Colors"
                                :key="item.id"
                                :label="item.id"
                            >
                                <span class="el-color" :style="{ backgroundColor : item.code }"></span>
                                {{ item.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </el-card>

        <!-- Warranties -->
        <el-card class="collapsible" v-if="is_exist(Warranties)">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <span> گارانتی </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <el-input
                            class="rtl search mb-3"
                            v-model="Params.warranties.query"
                            placeholder="جستجوی گارانتی ...">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>

                        <el-checkbox-group v-model="Params.warranties.value">
                            <el-checkbox
                                class="filter-list"
                                v-for="item in Warranties"
                                :key="item.id"
                                :label="item.id"
                            >
                                {{ item.title }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </el-card>

    </div>
</template>

<script>
    import mixin from '~/Mixins/mixin';
    import { mapState } from 'vuex';

    export default {

        mixins: [mixin] ,

        data() {
            return {
                Params: {
                    brands: {
                        query: '' ,
                        value: []
                    } ,
                    sizes: {
                        query: '' ,
                        value: []
                    } ,
                    colors: {
                        query: '' ,
                        value: []
                    } ,
                    warranties: {
                        query: '' ,
                        value: []
                    } ,
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
            } ,

            Brands() {
                return this.Filters.brands.filter( el => el.name.search(this.Params.brands.query) !== -1 );
            } ,

            Sizes() {
                return this.Filters.sizes.filter( el => el.name.search(this.Params.sizes.query) !== -1 );
            } ,

            Colors() {
                return this.Filters.colors.filter( el => el.name.search(this.Params.colors.query) !== -1 );
            } ,

            Warranties() {
                return this.Filters.warranties.filter( el => el.title.search(this.Params.warranties.query) !== -1 );
            }
        } ,

        methods: {
            NodeClick(node) {
                console.log(node);
            }
        }

    }
</script>