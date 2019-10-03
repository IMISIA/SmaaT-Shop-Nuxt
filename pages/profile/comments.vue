<template>
    <section class="user-reviews">
        <template v-if="reviews && reviews.length">
            <span class="headline-info"> نقدها </span>
            <div class="row rtl">
                <div class="col-12 col-lg-6" v-for="review in reviews" :key="review.id">
                    <el-card class="am-shadow mb-3">
                        <h4> {{ review.title }} </h4>
                        <p> {{ review.message }} </p>

                        <div class="d-flex">
                            <span class="alert alert-success" v-if="review.is_accept">تایید شده</span>
                            <span class="alert alert-danger" v-else>تایید نشده</span>
                            <v-spacer></v-spacer>
                            <el-button type="info" plain size="small" @click="removeCM('deleteReview' , review.id)">حذف</el-button>
                        </div>
                    </el-card>
                </div>
            </div>
        </template>

        <template v-if="questions && questions.length">
            <span class="headline-info"> پرسش‌ها </span>
            <div class="row rtl">
                <div class="col-12 col-lg-6" v-for="question in questions" :key="question.id">
                    <el-card class="am-shadow mb-3">
                        <h4> {{ question.title }} </h4>
                        <p> {{ question.message }} </p>

                        <div class="d-flex">
                            <span class="alert alert-success" v-if="question.is_accept">تایید شده</span>
                            <span class="alert alert-danger" v-else>تایید نشده</span>
                            <v-spacer></v-spacer>
                            <el-button type="info" plain size="small" @click="removeCM('deleteQuestionAndAnswer' , review.id)">حذف</el-button>
                        </div>
                    </el-card>
                </div>
            </div>
        </template>

        <template v-if="comments && comments.length && false">
            <span class="headline-info"> نظرات مقالات </span>
            <div class="row rtl">
                <div class="col-12 col-lg-6" v-for="comment in comments" :key="comment">
                    <el-card class="am-shadow mb-3">

                    </el-card>
                </div>
            </div>
        </template>
    </section>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import Cookie from '~/plugins/cookie';
    export default {
        async fetch({ $axios , store , req }) {
            let JWT = Cookie.get('JWT' , req.headers.cookie);

            $axios.setToken(JWT , 'Bearer');
            if(JWT) $axios.defaults.baseURL = $axios.defaults.baseURL + '/auth';

            let { data } = await $axios({
                method: 'POST' ,
                data: {
                query: `
                    {
                        me {
                            id
                            reviews {
                                id
                                title
                                message
                                is_accept
                                product {
                                    id
                                    name
                                    slug
                                    photos {
                                        id
                                        file_name
                                        medium
                                    }
                                }
                            }
                            comments {
                                id
                                title
                                message
                                is_accept
                                article {
                                    id
                                    title
                                    image {
                                        id
                                        file_name
                                        medium
                                    }
                                }
                            }
                            questions: question_and_answers {
                                id
                                title
                                message
                                is_accept
                                product {
                                    id
                                    name
                                    slug
                                    photos {
                                        id
                                        file_name
                                        medium
                                    }
                                }
                            }
                        }
                    }
                `
                }
            })

            if(data.data) store.commit( 'Set_state' , {
                Prop : 'Me' ,
                Val : data.data.me ,
                Obj_Assign: true
            })
        } ,

        computed: mapState({
            reviews: state => state.Me.reviews ,
            comments: state => state.Me.comments ,
            questions: state => state.Me.questions
        }) ,

        methods: {
            ...mapActions([
                'Request'
            ]) ,

            removeCM(el , id) {
                this.Request({
                    type: 'mutation' ,
                    name: el ,
                    params: {
                        id: id
                    } ,
                    resQuery: 'status message' ,
                    resolverAfter: ({store , data}) => {
                        if(data.data && data.data[el] && data.data[el].status == 200) {
                            this.Notif(data.data[el].message, 'primary', 'check'); 
                        } else {
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