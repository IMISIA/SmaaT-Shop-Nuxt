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
            <v-btn class="as-btn fs-12" large @click="NewComment.actions.modal = true">
                {{ $auth ? 'افزودن نظر جدید' : 'ابتدا وارد شوید' }}
            </v-btn>
        </div>

        <section class="list-comments">
            <div class="list-comments-header">
                نظرات کاربران
                <span>
                    ( {{ 40 | Num2Fa }} نظر )
                </span>
            </div>

            <ul>
                <li class="row web-bg-ultra-fade" v-for="n in 3" :key="n">
                    <div class="col-md-3 col-lg-2 comment-writer">
                        <v-avatar size="70">
                            <img src="/images/user.png" alt="avatar">
                        </v-avatar>

                        <p>
                            سید ایمان اصنافی
                            <el-tooltip effect="dark" content="در روز فلان" placement="top">
                                <span> 23 ساعت پیش </span>
                            </el-tooltip>
                        </p>
                    </div>

                    <div class="col-md-9 col-lg-10 comment-content">
                        <span> سایت بسیلر خوبیه اتفاقا </span>

                        <p> لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. </p>

                        <div class="comment-actions">
                            <div class="alert alert-danger">تایید نشده</div>

                            <v-spacer></v-spacer>

                            <v-btn class="web-color-dark" text>
                                به این پرسش پاسخ دهید (۱ پاسخ)
                            </v-btn>
                        </div>
                    </div>
                </li>
            </ul>
        </section>

        <!-- Add CM -->
        <v-dialog v-model="NewComment.actions.modal" width="600" :fullscreen="$nuxt.$res">
            <div class="dialog-title web-bg-ultra-fade">
                <v-btn text icon small>
                    <v-icon @click="NewComment.actions.modal = false">close</v-icon>
                </v-btn>
                <span> ثبت نظر </span>
            </div>

            <v-divider></v-divider>

            <div class="dialog-content single-product">
                <v-form v-model="NewComment.actions.valid">
                    <div class="row ranks mb-4">
                        <template v-for="(item,idx) in ['کیفیت ساخت','ارزش خرید','نوآوری','امکانات','سرعت']">
                            <div class="col-md-5 mb-0 mb-md-3" :key="idx">
                                {{ item }} :
                            </div>
                            <div class="col-md-7 mb-3" :key="`progress-${idx}`">
                                <el-slider v-model="NewComment.ranks[idx]" :max="5" :step="1" :show-tooltip="false"></el-slider>
                            </div>
                        </template>
                    </div>

                    <span class="title-input required"> عنوان نظر </span>
                    <v-text-field
                        v-model="NewComment.title"
                        label="عنوان نظر را وارد کنید"
                        reverse
                        single-line
                        :rules="[rules.required]"
                        outlined>
                    </v-text-field>

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

                    <div class="row rtl">
                        <div class="col-md-6">
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

                        <div class="col-md-6">
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
                    </div>

                    <v-btn class="as-btn" block
                        :disabled="!NewComment.actions.valid" :loading="NewComment.actions.loading" large> ثبت </v-btn>
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
                NewComment: {
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
                    actions: {
                        modal: false ,
                        valid: false ,
                        loading: false
                    }
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