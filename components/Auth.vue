<template>
    <v-app>
        <!-- Login -->
        <v-dialog
            v-model="$modals.login"
            @click:outside="closeModal('login')"
            width="370"
            :fullscreen="$nuxt.$res">
            <div class="dialog-title web-bg-ultra-fade">
                <v-btn text icon small @click="closeModal('login')">
                    <v-icon>close</v-icon>
                </v-btn>
                <span> ورود به سایت </span>
            </div>

            <v-divider></v-divider>

            <div class="dialog-content">
                <p class="alert alert-warning fs-12 d-none" id="alert-login">
                    ابتدا باید وارد حساب کاربری خود شوید
                </p>

                <v-form v-model="login.valid">
                    <span class="title-field required"> ایمیل </span>
                    <v-text-field
                        v-model="login.email"
                        label="ایمیل خود را وارد نمایید"
                        reverse
                        single-line
                        outlined
                        @keyup.enter="LoginMethod"
                        :rules="[rules.required,rules.email]"
                    ></v-text-field>

                    <span class="title-field required"> رمز عبور </span>
                    <v-text-field
                        v-model="login.password"
                        label="رمز عبور خود را وارد نمایید"
                        :type="login.showPass ? 'text' : 'password'"
                        :append-icon=" login.showPass ? 'visibility' : 'visibility_off' "
                        @click:append="login.showPass = !login.showPass"
                        reverse
                        single-line
                        outlined
                        @keyup.enter="LoginMethod"
                        :rules="[rules.required,rules.minPass]"
                    ></v-text-field>

                    <v-btn
                        class="as-btn"
                        block
                        large
                        :loading="login.loading"
                        :disabled="!login.valid || login.loading"
                        @click="LoginMethod">
                        ورود به سایت
                    </v-btn>

                    <div class="text-center mt-4">
                        <el-link type="primary fs-12 mr-1" @click="changeModal('login' , 'register')">ثبت‌نام در سایت</el-link>
                        <span class="text-muted fs-12"> کاربر جدید هستید؟ </span>
                    </div>
                </v-form>
            </div>
        </v-dialog>

        <!-- Register -->
        <v-dialog
            v-model="$modals.register"
            @click:outside="closeModal('register')"
            width="370"
            :fullscreen="$nuxt.$res">
            <div class="dialog-title web-bg-ultra-fade">
                <v-btn text icon small @click="closeModal('register')">
                    <v-icon>close</v-icon>
                </v-btn>
                <span> ثبت‌نام در سایت </span>
            </div>

            <v-divider></v-divider>

            <div class="dialog-content">
                <v-form v-model="register.valid">
                    <span class="title-field required"> ایمیل </span>
                    <v-text-field
                        v-model="register.email"
                        label="ایمیل خود را وارد نمایید"
                        reverse
                        single-line
                        outlined
                        @keyup.enter="RegisterMethod"
                        :rules="[rules.required,rules.email]"
                    ></v-text-field>

                    <span class="title-field required"> رمز عبور </span>
                    <v-text-field
                        v-model="register.password"
                        label="رمز عبور خود را وارد نمایید"
                        :type="register.showPass ? 'text' : 'password'"
                        :append-icon=" register.showPass ? 'visibility' : 'visibility_off' "
                        @click:append="register.showPass = !register.showPass"
                        reverse
                        single-line
                        outlined
                        @keyup.enter="RegisterMethod"
                        :rules="[rules.required,rules.minPass]"
                    ></v-text-field>

                    <span class="title-field required"> تکرار رمز عبور </span>
                    <v-text-field
                        v-model="register.confirm_password"
                        label="رمز عبور خود را تکرار نمایید"
                        type="password"
                        reverse
                        single-line
                        outlined
                        @keyup.enter="RegisterMethod"
                        :rules="[rules.required,matchPass]"
                    ></v-text-field>

                    <v-btn
                        class="as-btn"
                        large
                        block
                        :loading="register.loading"
                        :disabled="!register.valid || register.loading"
                        @click="RegisterMethod">
                        ثبت‌ نام
                    </v-btn>

                    <div class="text-center mt-4">
                        <el-link type="primary fs-12 mr-1" @click="changeModal('register' , 'login')">وارد شوید</el-link>
                        <span class="text-muted fs-12"> قبلا ثبت‌نام کرده‌اید؟ </span>
                    </div>
                </v-form>
            </div>
        </v-dialog>

        <!-- Change Pass -->
        <v-dialog v-if="false"
            v-model="$modals.resetPass"
            @click:outside="closeModal('resetPass')"
            width="370"
            :fullscreen="$nuxt.$res">
            <div class="dialog-title web-bg-ultra-fade">
                <v-btn text icon small @click="closeModal('resetPass')">
                    <v-icon>close</v-icon>
                </v-btn>
                <span> تغییر رمز عبور </span>
            </div>

            <v-divider></v-divider>

            <div class="dialog-content">
                <v-form v-model="resetPass.valid">
                    <span class="title-field required"> رمز عبور </span>
                    <v-text-field
                        v-model="resetPass.password"
                        label="رمز عبور خود را وارد نمایید"
                        :type="resetPass.showPass ? 'text' : 'password'"
                        :append-icon=" resetPass.showPass ? 'visibility' : 'visibility_off' "
                        @click:append="resetPass.showPass = !resetPass.showPass"
                        reverse
                        single-line
                        outlined
                        :rules="[rules.required,rules.minPass]"
                    ></v-text-field>

                    <span class="title-field required"> تکرار رمز عبور </span>
                    <v-text-field
                        v-model="resetPass.confirm_password"
                        label="رمز عبور خود را تکرار نمایید"
                        type="password"
                        reverse
                        single-line
                        outlined
                        :rules="[rules.required,matchResetPass]"
                    ></v-text-field>

                    <v-btn
                        class="as-btn"
                        large
                        block
                        :loading="resetPass.loading"
                        :disabled="!resetPass.valid || resetPass.loading">
                        تغییر رمز عبور
                    </v-btn>
                </v-form>
            </div>
        </v-dialog>
    </v-app>
</template>

<script>
    import { mapState , mapMutations , mapActions } from 'vuex';
    import Cookie from '~/plugins/cookie';
    export default {
        data() {
            return {
                login: {
                    valid: false ,
                    loading: false ,
                    email: '' ,
                    password: '' ,
                    showPass: false
                } ,

                register: {
                    valid: false ,
                    loading: false ,
                    email: '' ,
                    password: '' ,
                    confirm_password: '' ,
                    showPass: false
                } ,

                resetPass: {
                    valid: false ,
                    loading: false ,
                    password: '' ,
                    confirm_password: '' ,
                    showPass: false
                } ,

                rules : {
                    required: value => !!value || 'این فیلد الزامی است',
                    minPass: value => value.length >= 6 || 'رمز عبور حداقل باید 6 کاراکتر باشد',
                    // phone_number: value => value.length == 11 || 'شماره همراه باید 11 رقم باشد',
                    email: value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'پست الکترونیک نامعتبر است'
                    }
                }
            }
        } ,

        computed: {
            ...mapState([
                '$modals'
            ]) ,

            matchPass() {
                if(this.register.password) {
                    return v => (!!v && v) === this.register.password || 'رمز عبور با تاییدیه آن مطابقت ندارد'
                } else {
                    return true
                }
            } ,

            matchResetPass() {
                if(this.resetPass.password) {
                    return v => (!!v && v) === this.resetPass.password || 'رمز عبور با تاییدیه آن مطابقت ندارد'
                } else {
                    return true
                }
            }
        } ,

        methods: {
            ...mapMutations([
                'openModal' ,
                'closeModal'
            ]) ,

            ...mapActions([
                'Request'
            ]) ,

            changeModal(from , to) {
                this.closeModal(from);
                setTimeout(() => {
                    this.openModal(to)
                }, 300);
            } ,

            LoginMethod() {
                if(!this.login.valid) return;

                this.Request({
                    type: 'mutation' ,
                    name: 'login' ,
                    params: {
                        email: this.login.email ,
                        password: this.login.password
                    } ,
                    resQuery: 'id token' ,
                    resolverBefore: () => {
                        this.login.loading = true;
                    } ,
                    resolverAfter: ({data}) => {
                        if(data.errors && data.errors.length) {
                            Object.keys(data.errors[0].validation).map( el => {
                                this.Notif(data.errors[0].validation[el], 'warning', 'error');
                            })
                            this.login.loading = false;
                        } else if(data && data.status == 400) {
                            this.Notif('ایمیل یا رمز عبور اشتباه است' , 'warning', 'error');
                            this.login.loading = false;
                        } else {
                            Cookie.set('JWT' ,  data.data.login.token);
                            location.reload();
                        }
                    }
                })
            } ,

            RegisterMethod() {
                if(!this.register.valid) return;

                this.Request({
                    type: 'mutation' ,
                    name: 'register' ,
                    params: {
                        email: this.register.email ,
                        password: this.register.password ,
                        password_confirmation: this.register.confirm_password
                    } ,
                    resQuery: 'id token' ,
                    resolverBefore: () => {
                        this.register.loading = true;
                    } ,
                    resolverAfter: ({data}) => {
                        if(data.errors && data.errors.length) {
                            Object.keys(data.errors[0].validation).map( el => {
                                this.Notif(data.errors[0].validation[el], 'warning', 'error');
                            })
                            this.register.loading = false;
                        } else {
                            Cookie.set('JWT' ,  data.data.register.token);
                            location.reload();
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