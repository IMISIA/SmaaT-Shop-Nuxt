<template>
    <section class="row questions">
        <!-- Title -->
        <div class="col-12 mb-4">
            <p class="bold mb-1"> پرسش و پاسخ </p>
            <span class="fs-13 text-muted"> {{ Product.name }} </span>
        </div>

        <v-app class="col-12">
            <div class="input">
                <span class="title-input text-muted"> پرسش خود را در مورد محصول مطرح نمایید </span>
                <v-text-field
                    v-model="NewQuestion.title"
                    label="عنوان پرسش را وارد کنید"
                    reverse
                    hide-details
                    single-line
                    outlined>
                </v-text-field>
            </div>

            <div class="mt-2">
                <v-textarea
                    v-model="NewQuestion.content"
                    label="متن پرسش را وارد کنید"
                    :rows="3"
                    reverse
                    single-line
                    outlined>
                </v-textarea>
            </div>
        </v-app>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        data() {
            return {
                NewQuestion: {
                    isValid: false ,
                    title: '' ,
                    content: ''
                }      
            }
        } ,

        computed: mapState({
            Product: state => state.product.Single_Product ,
            $auth: '$auth'
        })
    }
</script>