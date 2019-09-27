<template>
    <div class="filter-bar" :class="{ 'p-3' : Res }">
        <!-- Categories Tree -->
        <el-card class="am-shadow" v-if="is_exist(ApplyedFilters)">
            <div class="position-relative" slot="header">
                <span>فیلتر های اعمال شده:</span>
                <v-btn
                    class="del-all-filters"
                    text
                    small
                    color="#ff5252"
                    @click="DeleteAllFilters">
                    حذف
                </v-btn>
            </div>

            <ul class="applyed-filters">
                <li v-for="(item,idx) in ApplyedFilters" :key="idx">
                    {{ item.title +' '+ item.displayName }}
                    <i class="lnr lnr-cross" @click="DeleteFilters(item.name , item.value)"></i>
                </li>
            </ul>
        </el-card>

        <!-- Categories Tree -->
        <el-card class="am-shadow ltr">
            <div slot="header"> دسته‌بندی نتایج </div>

            <el-tree
                :data="TreeCtg ? [TreeCtg] : Categories"
                :props="TreeDefaultProps"
                @node-click="NodeClick"
                node-key="id"
                accordion
                highlight-current
                :default-expanded-keys="[TreeCtg ? parseInt($route.params.slug) : null]"
                :current-node-key="TreeCtg ? parseInt($route.params.slug) : null"
            ></el-tree>
        </el-card>

        <!-- Search Input -->
        <el-card class="am-shadow">
            <div slot="header"> جستجو در نتایج </div>

            <el-input
                v-model="Params.query"
                @keyup.native.enter="ApplyFilters"
                class="rtl search-input"
                placeholder="نام محصول مورد نظر را بنویسید ...">
                <i slot="prefix" class="el-input__icon el-icon-search" @click="ApplyFilters"></i>
            </el-input>
        </el-card>

        <!-- Available Products -->
        <el-card class="am-shadow">
            <v-app class="available-products">
                <v-switch
                    v-model="Available_Products"
                    label="فقط کالاهای موجود"
                    :color="web_color"
                    inset
                    hide-details
                ></v-switch>
            </v-app>
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
                                    :key="'warranty-'+idx"
                                    :label="item.id"
                                    :data-index="'warranty-'+idx">
                                    {{ item.title }}
                                </el-checkbox>
                            </transition-group>
                        </el-checkbox-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </el-card>

        <!-- Price Range -->
        <el-card class="collapsible am-shadow" v-if="is_exist(Filters.warranties)">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <span> محدوده قیمت </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="price-range">
                        <el-slider
                            class="px-1"
                            v-model="PriceRange"
                            range
                            :show-tooltip="false"
                            :step="10"
                            :max="1000">
                        </el-slider>

                        <div class="row">
                            <div class="col-6" data-label="از" data-currency=" تومان">
                                <el-input
                                    :value="PriceRange[0] * 1000 | Num2Fa"
                                    readonly
                                    class="search-input">
                                </el-input>
                            </div>
                            <div class="col-6" data-label="از" data-currency=" تومان">
                                <el-input
                                    :value="PriceRange[1] * 1000 | Num2Fa"
                                    readonly
                                    class="search-input">
                                </el-input>
                            </div>
                        </div>

                        <v-btn class="as-btn mt-3" large block>
                            اعمال محدوده قیمت
                        </v-btn>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </el-card>
    </div>
</template>

<script>
    import mixin from '~/mixins/mixin';
    import { mapState } from 'vuex';

    export default {
        props: {
            ApplyFilters: {
                type: Function ,
                required: true
            } ,
            DeleteFilters: {
                type: Function ,
                required: true
            }
        } ,

        mixins: [mixin] ,

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
                        title: 'برند' ,
                        query: '' ,
                        value: []
                    } ,
                    sizes: {
                        title: 'سایز' ,
                        query: '' ,
                        value: []
                    } ,
                    colors: {
                        title: 'رنگ' ,
                        query: '' ,
                        value: []
                    } ,
                    warranties: {
                        title: 'گارانتی' ,
                        query: '' ,
                        value: []
                    } ,
                    query: this.$route.query.query ,
                } ,

                ApplyedFilters: [] ,
                
                Available_Products: false ,

                PriceRange: [100,800] ,

                TreeDefaultProps: {
                    children: 'childs' ,
                    label: 'title'
                }
            }
        } ,

        computed: {
            ...mapState({
                Categories: 'Categories' ,
                Filters: state => state.product.Filters ,
                TreeCtg: state => state.product.TreeCtg
            }) ,

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
                let QueryStr = JSON.parse(JSON.stringify(this.$route.query));
                // Used JSON Function Becuase Modifying Changes Cloned And Original Objects
                this.ApplyedFilters = [];

                Object.keys(this.Params).slice(0,4).map( el => {
                    let Val = QueryStr[el];
                    this.Params[el].value = [];

                    if(this.is_exist(Val)) {
                        typeof Val === 'object'
                        ? this.Params[el].value = Val.map( el => parseInt(el) )
                        : this.Params[el].value = [parseInt(Val)]

                        this.Params[el].value.map( item => {
                            this.ApplyedFilters.push({
                                title: this.Params[el].title ,
                                value: item ,
                                name: el ,
                                displayName: this.Filters[el]
                                    .find( element => element.id == item )[el != 'warranties' ? 'name' : 'title']
                            })
                        })
                    }
                })
            } ,

            DeleteAllFilters() {
                this.$router.replace({ query: { page: 1 } })
                .then( () => this.SetParams() )
            } ,

            NodeClick(node) {
                console.log(node);
            } ,

            beforeEnter(el) {
                el.style.opacity = 0
                el.style.height = 0
            } ,

            enter(el, done) {
                let delay = el.dataset.index.split('-')[1] * 30
                setTimeout(function () {
                    $(el).css({
                        opacity: 1 ,
                        height: '33.2px'
                    })
                }, delay)
            } ,

            leave(el, done) {
                let delay = el.dataset.index.split('-')[1] * 30
                setTimeout(function () {
                    $(el).css({
                        opacity: 0 ,
                        height: 0 ,
                        padding: 0 ,
                        marginBottom: 0
                    })
                }, delay)
            }
        }
    }
</script>