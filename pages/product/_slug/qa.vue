<template>
    <section class="row questions">
        <!-- Title -->
        <div class="col-12 mb-4">
            <p class="bold mb-1"> پرسش و پاسخ </p>
            <span class="fs-13 text-muted"> {{ Product.name }} </span>
        </div>

        <v-form class="col-12" v-model="NewQuestion.actions.valid">
            <span class="title-input text-muted"> پرسش خود را در مورد محصول مطرح نمایید </span>
            <v-text-field
                v-model="NewQuestion.title"
                label="عنوان پرسش را وارد کنید"
                reverse
                hide-details
                single-line
                :rules="[rules.required]"
                outlined>
            </v-text-field>

            <v-textarea
                class="mt-3"
                v-model="NewQuestion.content"
                label="متن پرسش را وارد کنید"
                :rows="3"
                hide-details
                reverse
                single-line
                :rules="[rules.required]"
                outlined>
            </v-textarea>

            <v-btn
                class="as-btn mt-3 px-5"
                large
                :disabled="!NewQuestion.actions.valid || NewQuestion.actions.loading"
                :loading="NewQuestion.actions.loading">
                ثبت پرسش
            </v-btn>
        </v-form>

        <section class="list-comments">
            <div class="list-comments-header">
                پرسش ها و پاسخ ها
                <span>
                    ( {{ 80 | Num2Fa }} پرسش )
                </span>
            </div>

            <ul>
                <template  v-for="n in 3">
                    <li class="row web-bg-ultra-fade" :key="n">
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

                                <v-btn class="web-color-dark" text @click="NewAnswer.actions.modal = true">
                                    به این پرسش پاسخ دهید (۱ پاسخ)
                                </v-btn>
                            </div>
                        </div>
                    </li>

                    <li class="row answer" :key="'answer-'+n">
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
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
        </section>

        <!-- Add Answer -->
        <v-dialog v-model="NewAnswer.actions.modal" width="600" :fullscreen="$nuxt.$res">
            <div class="dialog-title web-bg-ultra-fade">
                <v-btn text icon small>
                    <v-icon @click="NewAnswer.actions.modal = false">close</v-icon>
                </v-btn>
                <span> ثبت پاسخ </span>
            </div>

            <v-divider></v-divider>

            <div class="dialog-content single-product">
                <v-form v-model="NewAnswer.actions.valid">
                    <span class="title-input required"> عنوان پاسخ </span>
                    <v-text-field
                        v-model="NewAnswer.title"
                        label="عنوان پاسخ را وارد کنید"
                        reverse
                        single-line
                        :rules="[rules.required]"
                        outlined>
                    </v-text-field>

                    <span class="title-input required"> متن پاسخ </span>
                    <v-textarea
                        v-model="NewAnswer.content"
                        label="متن پاسخ را وارد کنید"
                        :rows="3"
                        reverse
                        single-line
                        :rules="[rules.required]"
                        outlined>
                    </v-textarea>

                    <v-btn class="as-btn"
                        block
                        :loading="NewAnswer.actions.loading"
                        :disabled="!NewAnswer.actions.valid || NewAnswer.actions.loading"
                        large> 
                        ثبت پاسخ
                    </v-btn>
                </v-form>
            </div>
        </v-dialog>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        async fetch({ $axios , store , params }) {
            if(store.state.product.Requested.qa) return;

            let { data } = await $axios({
                method: 'POST' ,
                data: {
                query: `
                    {
                        product( slug : "${params.slug}" ) {
                            id
                            questions {
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
                                answers {
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
                                }
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

            store.state.product.Requested.qa = true;
        } ,

        data() {
            return {
                NewQuestion: {
                    title: '' ,
                    content: '' ,
                    actions: {
                        valid: false ,
                        loading: false
                    }
                } ,

                NewAnswer: {
                    title: '' ,
                    content: '' ,
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

        computed: mapState({
            Product: state => state.product.Single_Product ,
            $auth: '$auth'
        })
    }
</script>