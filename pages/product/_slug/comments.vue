<template>
    <section class="row comments">
        <!-- Title -->
        <div class="col-12 mb-4">
            <p class="bold mb-1"> نظرات کاربران </p>
            <span class="fs-13 text-muted"> {{ Product.name }} </span>
        </div>

        <div class="col-md-6 ranks">
            <div class="row">
                <template v-for="(item,idx) in ['کیفیت ساخت','ارزش خرید','نوآوری','امکانات','سرعت']">
                    <div class="col-md-5 mb-0 mb-md-3" :key="idx">
                        {{ item }} :
                    </div>
                    <div class="col-md-7 mb-3" :key="`progress-${idx}`">
                        <el-progress class="mt-2" :percentage="20*(idx+1)" :show-text="false"></el-progress>
                    </div>
                </template>
            </div>
        </div>

        <div class="col-md-6 comments-note">
            <span> شما هم می‌توانید در مورد این کالا نظر بدهید. </span>
            <p> برای ثبت نظر، لازم است ابتدا وارد حساب کاربری خود شوید.  </p>
            <v-btn class="as-btn fs-12" large @click="NewComment.Dialog = true">
                {{ $auth ? 'افزودن نظر جدید' : 'ابتدا وارد شوید' }}
            </v-btn>
        </div>

        <!-- Add CM -->
        <v-dialog v-model="NewComment.Dialog" width="600" :fullscreen="Res">
            <div class="dialog-title web-bg-ultra-fade">
                <v-btn text icon small>
                    <v-icon @click="NewComment.Dialog = false">close</v-icon>
                </v-btn>
                <span> ثبت نظر </span>
            </div>

            <v-divider></v-divider>

            <div class="dialog-content single-product">
                <v-form v-model="NewComment.isValid">
                    <div class="row rtl mx-0">
                        <div class="col-md-12 ranks mb-3">
                            <div class="row">
                                <template v-for="(item,idx) in ['کیفیت ساخت','ارزش خرید','نوآوری','امکانات','سرعت']">
                                    <div class="col-md-5 mb-0 mb-md-3" :key="idx">
                                        {{ item }} :
                                    </div>
                                    <div class="col-md-7 mb-3" :key="`progress-${idx}`">
                                        <el-slider v-model="NewComment.ranks[idx]" :max="5" :step="1" :show-tooltip="false"></el-slider>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div class="col-12 input">
                            <span class="title-input required"> عنوان نظر </span>
                            <v-text-field
                                v-model="NewComment.title"
                                label="عنوان نظر را وارد کنید"
                                reverse
                                single-line
                                :rules="[rules.required]"
                                outlined>
                            </v-text-field>
                        </div>

                        <div class="col-12">
                            <span class="title-input required"> متن نظر </span>
                            <v-textarea
                                v-model="NewComment.content"
                                label="متن نظر را وارد کنید"
                                :rows="3"
                                reverse
                                single-line
                                :rules="[rules.required]"
                                outlined>
                            </v-textarea>
                        </div>

                        <div class="col-md-6 input mb-5 mb-md-0">
                            <span class="title-input">
                                <i class="fas fa-check ml-1 Advantages"></i>
                                نقاط قوت
                            </span>

                            <v-text-field
                                v-model="NewComment.advantages.title"
                                :prepend-inner-icon="NewComment.advantages.title ? 'add_circle_outline' : ''"
                                @click:prepend-inner="Add_Adv(true)"
                                @keyup.native.enter="Add_Adv(true)"
                                reverse
                                hide-details
                                single-line
                                outlined>
                            </v-text-field>

                            <el-alert
                                v-for="(item,idx) in NewComment.advantages.value"
                                :key="idx"
                                :title="item"
                                class="mt-2"
                                type="success"
                                @close="Delete_Adv(true,item)">
                            </el-alert>
                        </div>

                        <div class="col-md-6 input">
                            <span class="title-input">
                                <i class="fas fa-times ml-1 Disadvantages"></i>
                                نقاط ضعف
                            </span>

                            <v-text-field
                                v-model="NewComment.disadvantages.title"
                                :prepend-inner-icon="NewComment.disadvantages.title ? 'add_circle_outline' : ''"
                                @click:prepend-inner="Add_Adv(false)"
                                @keyup.native.enter="Add_Adv(false)"
                                reverse
                                hide-details
                                single-line
                                outlined>
                            </v-text-field>

                            <el-alert
                                v-for="(item,idx) in NewComment.disadvantages.value"
                                :key="idx"
                                :title="item"
                                class="mt-2"
                                type="error"
                                @close="Delete_Adv(false,item)">
                            </el-alert>
                        </div>

                        <div class="col-12 mt-5 text-left">
                            <v-btn class="as-btn" block :disabled="!NewComment.isValid" large> ثبت </v-btn>
                        </div>
                    </div>
                </v-form>
            </div>
        </v-dialog>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {

        async fetch({ $axios , store , params }) {
            if(store.state.product.Requested.comments) return;

            let { data } = await $axios({
                method: 'POST' ,
                data: {
                query: `
                    {
                        product( slug : "${params.slug}" ) {
                            id
                            reviews {
                                id
                                title
                                message
                                is_accept
                                created_at
                                writer {
                                    id
                                    first_name
                                    last_name
                                    full_name
                                    avatar {
                                    small
                                    }
                                }
                                ranks {
                                    id
                                    title
                                    value
                                }
                                advantages
                                disadvantages
                            }
                        }
                    }
                `
                }
            })

            store.commit( 'Set_state' , {
                Module : 'product' ,
                Prop : 'Single_Product' ,
                Val : data.data.product ,
                Obj_Assign: true
            })

            store.state.product.Requested.comments = true;
        } ,

        computed: mapState({
            Product: state => state.product.Single_Product ,
            $auth: '$auth'
        }) ,

        data() {
            return {
                Res : process.client ? this.$nuxt.$el.clientWidth < 770 : false ,

                NewComment: {
                    Dialog: false ,
                    isValid: false ,
                    ranks: [3,3,3,3,3] ,
                    title: '' ,
                    content: '' ,
                    advantages: {
                        title: '' ,
                        value: []
                    } ,
                    disadvantages: {
                        title: '' ,
                        value: []               
                    } ,
                } ,

                rules : {
                    required: value => !!value || 'این فیلد الزامی است',
                }
            }
        } ,

        methods: {
            Add_Adv(isAdvantages) {
                let prop = isAdvantages ? 'advantages' : 'disadvantages';
                if(this.NewComment[prop].title) {
                    this.NewComment[prop].value.push(this.NewComment[prop].title);
                    this.NewComment[prop].title = '';
                }
            } ,

            Delete_Adv(isAdvantages,item) {
                let prop = isAdvantages ? 'advantages' : 'disadvantages';
                _.pull(this.NewComment[prop].value, item)
            }
        }
    }
</script>