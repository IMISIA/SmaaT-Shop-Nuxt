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
                :loading="NewQuestion.actions.loading"
                @click="Question_Answer(false)">
                ثبت پرسش
            </v-btn>
        </v-form>

        <section class="list-comments" v-if="Product.questions && Product.questions.length">
            <div class="list-comments-header">
                پرسش ها و پاسخ ها
                <span>
                    ( {{ Product.questions.length | Num2Fa }} پرسش )
                </span>
            </div>

            <ul>
                <template  v-for="question in Product.questions">
                    <li class="row web-bg-ultra-fade" :key="question.id">
                        <div class="col-md-3 col-lg-2 comment-writer">
                            <v-avatar size="70">
                                <img :src="question.writer.avatar && question.writer.avatar.small
                                    ? $url + question.writer.avatar.small : '/images/user.png'"
                                    alt="avatar">
                            </v-avatar>

                            <p>
                                {{ question.writer && question.writer.full_name ? question.writer.full_name : 'ناشناس' }}
                                <el-tooltip effect="dark" :content="question.created_at | created" placement="top">
                                    <span> {{ question.created_at | ago }} </span>
                                </el-tooltip>
                            </p>
                        </div>

                        <div class="col-md-9 col-lg-10 comment-content">
                            <span> {{ question.title }} </span>

                            <p> {{ question.message }} </p>

                            <div class="comment-actions">
                                <div class="alert alert-danger" v-if="!question.is_accept">تایید نشده</div>

                                <v-spacer></v-spacer>

                                <v-btn class="web-color-dark" text @click="answerModal(question.id)">
                                    به این پرسش پاسخ دهید
                                </v-btn>
                            </div>
                        </div>
                    </li>

                    <!-- Answers -->
                    <li class="row answer" v-for="answer in question.aswers" :key="answer.id">
                        <div class="col-md-3 col-lg-2 comment-writer" :key="'answer-'+question.id">
                            <v-avatar size="70">
                                <img :src="answer.writer.avatar && answer.writer.avatar.small
                                    ? $url + answer.writer.avatar.small : '/images/user.png'"
                                    alt="avatar">
                            </v-avatar>

                            <p>
                                {{ answer.writer && answer.writer.full_name ? answer.writer.full_name : 'ناشناس' }}
                                <el-tooltip effect="dark" :content="answer.created_at | created" placement="top">
                                    <span> {{ answer.created_at | ago }} </span>
                                </el-tooltip>
                            </p>
                        </div>

                        <div class="col-md-9 col-lg-10 comment-content">
                            <span> {{ answer.title }} </span>

                            <p> {{ answer.message }} </p>

                            <div class="comment-actions">
                                <div class="alert alert-danger" v-if="!answer.is_accept">تایید نشده</div>
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
                        large @click="Question_Answer(true)"> 
                        ثبت پاسخ
                    </v-btn>
                </v-form>
            </div>
        </v-dialog>
    </section>
</template>

<script>
    import { mapState, mapActions, mapMutations } from 'vuex';
    import moment from '~/mixins/moment';
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
                            }
                        }
                    }
                `
                }
            })

            console.log(data);

            store.commit( 'Set_state' , {
                Module : 'product' ,
                Prop : 'Single_Product' ,
                Val : data.data.product ,
                Obj_Assign: true
            })

            store.commit('Requested' , 'qa');
        } ,

        mixins: [moment] ,

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
                    parent_id: '' ,
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
            $auth: '$auth' ,
            $url: '$url'
        }) ,

        methods: {
            ...mapMutations([
                'openModal'
            ]) ,

            ...mapActions([
                'Request'
            ]) ,

            answerModal(id) {
                this.NewAnswer.actions.modal = true;
                this.NewAnswer.parent_id = id;
            } ,

            Question_Answer(isAnswer) {
                if(!this.$auth) {
                    this.openModal('login');
                    setTimeout(() => {
                        $('#alert-login').removeClass('d-none');
                    }, 50);
                    return;
                }

                isAnswer ? this.NewAnswer.actions.loading = true : this.NewQuestion.actions.loading = true;

                this.Request({
                    type: 'mutation' ,
                    name: 'createQuestionAndAnswer' ,
                    params: {
                        product_id: this.Product.id ,
                        title: isAnswer ? this.NewAnswer.title : this.NewQuestion.title ,
                        message: isAnswer ? this.NewAnswer.content : this.NewQuestion.content ,
                        question_id: isAnswer ? this.NewAnswer.parent_id : null
                    } ,
                    resQuery: 'id' ,
                    resolverAfter: ({data}) => {
                        if(data.errors && data.errors.length) {
                            Object.keys(data.errors[0].validation).map( el => {
                                this.Notif(data.errors[0].validation[el], 'warning', 'error');
                            })
                            isAnswer ? this.NewAnswer.actions.loading = false : this.NewQuestion.actions.loading = false;
                        } else if(data.data && data.data.createQuestionAndAnswer && data.data.createQuestionAndAnswer.id) {
                            if(isAnswer) this.NewAnswer.actions.modal = false;
                            isAnswer ? this.NewAnswer.actions.loading = false : this.NewQuestion.actions.loading = false;
                            this.Notif(`${isAnswer ? 'پاسخ' : 'پرسش'} شما با موفقیت ثبت و در انتظار تایید میباشد`
                            , 'success', 'check');
                        } else {
                            isAnswer ? this.NewAnswer.actions.loading = false : this.NewQuestion.actions.loading = false;
                            this.Notif('متاسفانه عملیات با موفقیت انجام نشد', 'warning', 'error');
                        }
                    }
                })
            } ,

            Notif(msg, color,  icon, time = 3000)  {
                this.$vs.notify({
                    text: `${msg}` ,
                    color: color ,
                    icon: icon ,
                    position: 'top-left',
                    time: time
                })
            }
        }
    }
</script>