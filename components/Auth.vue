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
                <v-form v-model="login.valid">
                    <span class="title-field required"> ایمیل یا شماره موبایل </span>
                    <v-text-field
                        v-model="login.email"
                        label="ایمیل یا شماره موبایل خود را وارد نمایید"
                        reverse
                        single-line
                        outlined
                        :rules="[rules.required]"
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
                        :rules="[rules.required,rules.minPass]"
                    ></v-text-field>

                    <v-btn
                        class="as-btn"
                        block
                        large
                        :loading="login.loading"
                        :disabled="!login.valid || login.loading">
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
                    <span class="title-field required"> ایمیل یا شماره موبایل </span>
                    <v-text-field
                        v-model="register.email"
                        label="ایمیل یا شماره موبایل خود را وارد نمایید"
                        reverse
                        single-line
                        outlined
                        :rules="[rules.required]"
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
                        :rules="[rules.required,matchPass]"
                    ></v-text-field>

                    <v-btn
                        class="as-btn"
                        large
                        block
                        :loading="register.loading"
                        :disabled="!register.valid || register.loading">
                        ثبت‌ نام
                    </v-btn>

                    <div class="text-center mt-4">
                        <el-link type="primary fs-12 mr-1" @click="changeModal('register' , 'login')">وارد شوید</el-link>
                        <span class="text-muted fs-12"> قبلا ثبت‌نام کرده‌اید؟ </span>
                    </div>
                </v-form>
            </div>
        </v-dialog>

        <!-- Register -->
        <v-dialog
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
    import { mapState , mapMutations } from 'vuex';
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
                } ,
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

            changeModal(from , to) {
                this.closeModal(from);
                setTimeout(() => {
                    this.openModal(to)
                }, 300);
            }
        }
    }
</script>