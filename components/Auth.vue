<template>
    <v-app>
        <v-dialog v-model="modal" max-width="300">
            <v-card color="#f9f9f9" class="SortDialog">
                <v-toolbar dark :color="web_color_ultra_fade">
                    <v-btn icon dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-toolbar-title class="fs-14">ورود به سایت</v-toolbar-title>
                </v-toolbar>
            </v-card>
        </v-dialog>

    </v-app>
</template>

<script>
    import mixin from '~/Mixins/mixin';
    import { mapMutations } from 'vuex';
    export default {
        mixins: [mixin] ,

        data() {
            return {
                data: 'Hey IMISIA' ,
                modal: false
            }
        } ,

        methods: {
            ...mapMutations([
                'Set_state'
            ]) ,

            open() {
                this.modal = true;
            }
        } ,
    }
</script>