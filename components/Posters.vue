<template>
    <section class="row mx-2 rtl" v-if="Valid_Posters">
        <div class="px-2 mb-3" :class="autoGrid[idx]" v-for="(poster,idx) in Valid_Posters" :key="idx">
            <nuxt-link to="/">
                <img
                    :src="$url + poster.image.large"
                    class="poster"
                    :alt="`poster-${idx}`"
                >
            </nuxt-link>
        </div>
    </section>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        props: ['Posters'] ,

        computed: {
            ...mapState([
                '$url'
            ]) ,

            Valid_Posters() {
                if(this.Posters && this.Posters.length) {
                    return this.Posters.filter( poster => !!poster.image && !!poster.image.large );
                } else {
                    return null;
                }
            } ,

            autoGrid() {
                let length = this.Valid_Posters.length;
                let cols = [];

                if(length <= 3) {
                    switch(length) {
                        case 1 : {
                            cols = ['col-md-12'];
                            break; 
                        }
                        case 2 : {
                            cols = ['col-md-6','col-md-6'];
                            break;
                        }
                        case 3 : {
                            cols = ['col-md-4','col-md-4','col-md-4'];
                            break;
                        }
                    }
                } else {
                    switch(length % 3) {
                        case 0 : {
                            for( var n = 0 ; n < (length - 2) ; n++ ) {
                                cols.push('col-md-4');
                            }
                        }
                        case 1 : {
                            for( let n = 0 ; n < (length - 1) ; n++ ) {
                                cols.push('col-md-4');
                            }
                            cols.push('col-12');
                        }
                        case 2 : {
                            for( let n = 0 ; n < (length - 2) ; n++ ) {
                                cols.push('col-md-4');
                            }
                            cols.push('col-md-6');
                            cols.push('col-md-6');
                        }
                            
                    }
                }

                return cols;
            }
        }
    }
</script>