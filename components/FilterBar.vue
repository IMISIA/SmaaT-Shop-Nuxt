<template>
    <div class="filter-bar" :class="{ 'p-3' : Res }">
        <!-- Categories Tree -->
        <el-card class="am-shadow">
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
        <el-card class="am-shadow">
            <div slot="header"> جستجو در نتایج </div>

            <div>
                <el-input
                    v-model="Params.query"
                    @keyup.native.enter="ApplyFilters"
                    class="rtl search-input"
                    placeholder="نام محصول مورد نظر را بنویسید ...">
                    <i slot="prefix" class="el-input__icon el-icon-search" @click="ApplyFilters"></i>
                </el-input>
            </div>
        </el-card>

        <!-- Available Products -->
        <el-card class="am-shadow">
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
        <el-card class="collapsible am-shadow" v-if="is_exist(Filters.brands)">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <span> برند </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <el-input
                            class="rtl search-input mb-3"
                            v-model="Params.brands.query"
                            placeholder="جستجوی نام برند ...">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>

                        <el-checkbox-group v-model="Params.brands.value" @change="ApplyFilters">
                            <transition-group
                                name="staggered-fade"
                                tag="div"
                                :css="false"
                                @before-enter="beforeEnter"
                                @enter="enter"
                                @leave="leave">

                                <el-checkbox
                                    class="filter-list"
                                    v-for="(item,idx) in Brands"
                                    :key="'brand-'+idx"
                                    :label="item.id"
                                    :data-index="'brand-'+idx">
                                    {{ item.name }}
                                </el-checkbox>

                            </transition-group>
                        </el-checkbox-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </el-card>

        <!-- Sizes -->
        <el-card class="collapsible am-shadow" v-if="is_exist(Filters.sizes)">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <span> سایز </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <el-input
                            class="rtl search-input mb-3"
                            v-model="Params.sizes.query"
                            placeholder="جستجوی سایز ...">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>

                        <el-checkbox-group v-model="Params.sizes.value" @change="ApplyFilters">
                            <transition-group
                                name="staggered-fade"
                                tag="div"
                                :css="false"
                                @before-enter="beforeEnter"
                                @enter="enter"
                                @leave="leave">

                                <el-checkbox
                                    class="filter-list"
                                    v-for="(item,idx) in Sizes"
                                    :key="'size-'+idx"
                                    :label="item.id"
                                    :data-index="'size-'+idx">
                                    {{ item.name }}
                                </el-checkbox>

                            </transition-group>
                        </el-checkbox-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </el-card>

        <!-- Colors -->
        <el-card class="collapsible am-shadow" v-if="is_exist(Filters.colors)">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <span> رنگ </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <el-input
                            class="rtl search-input mb-3"
                            v-model="Params.colors.query"
                            placeholder="جستجوی رنگ ...">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>

                        <el-checkbox-group v-model="Params.colors.value" @change="ApplyFilters">
                            <transition-group
                                name="staggered-fade"
                                tag="div"
                                :css="false"
                                @before-enter="beforeEnter"
                                @enter="enter"
                                @leave="leave">

                                <el-checkbox
                                    class="filter-list"
                                    v-for="(item,idx) in Colors"
                                    :key="'color-'+idx"
                                    :label="item.id"
                                    :data-index="'color-'+idx">
                                    <span class="el-color" :style="{ backgroundColor : item.code }"></span>
                                    {{ item.name }}
                                </el-checkbox>

                            </transition-group>
                        </el-checkbox-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </el-card>

        <!-- Warranties -->
        <el-card class="collapsible am-shadow" v-if="is_exist(Filters.warranties)">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <span> گارانتی </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <el-input
                            class="rtl search-input mb-3"
                            v-model="Params.warranties.query"
                            placeholder="جستجوی گارانتی ...">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>

                        <el-checkbox-group v-model="Params.warranties.value" @change="ApplyFilters">
                            <transition-group
                                name="staggered-fade"
                                tag="div"
                                :css="false"
                                @before-enter="beforeEnter"
                                @enter="enter"
                                @leave="leave">

                                <el-checkbox
                                    class="filter-list"
                                    v-for="(item,idx) in Warranties"
                                    :key="'Warranty-'+idx"
                                    :label="item.id"
                                    :data-index="'Warranty-'+idx">
                                    {{ item.title }}
                                </el-checkbox>

                            </transition-group>
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
        props: {
            ApplyFilters: {
                type: Function ,
                required: true
            }
        } ,

        mixins: [mixin] ,

        head: {
            script: [
                { src: 'https://cdn.jsdelivr.net/npm/velocity-animate@2.0/velocity.min.js' } ,
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/velocity/2.0.3/velocity.min.js' }
            ]
        } ,

        created() {
            this.SetParams();
        } ,

        mounted() {
            this.$nextTick(function() {
                if(!this.Res) this.DynamicSidebar('.filter-bar' , $('.products-ctg').parent() , 16);
            })
        } ,

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
                    query: this.$route.query.query ,
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
            SetParams() {
                Object.keys(this.Params).slice(0,4).map( el => {
                    let Val = this.$route.query[el];
                    if(this.is_exist(Val)) {
                        console.log(Val);
                        typeof Val === 'object'
                        ? this.Params[el].value = Val.map( el => parseInt(el) )
                        : this.Params[el].value = [parseInt(Val)]
                    }
                })
            } ,

            NodeClick(node) {
                console.log(node);
            } ,

            beforeEnter(el) {
                el.style.opacity = 0
                el.style.height = 0
            } ,

            enter(el, done) {
                let delay = el.dataset.index * 30
                setTimeout(function () {
                    Velocity(
                        el ,
                        { opacity: 1 , height: '1.6em' } ,
                        { complete: done }
                    )
                }, delay)
            } ,

            leave(el, done) {
                let delay = el.dataset.index * 30
                setTimeout(function () {
                    Velocity(
                        el ,
                        { opacity: 0 , height: 0 } ,
                        { complete: done }
                    )
                }, delay)
            }
        }
    }
</script>