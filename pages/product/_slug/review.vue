<template>
     <article class="row mx-0 rtl">

        <!-- Title -->
        <div class="col-12 mb-4">
            <p class="bold mb-1"> نقد و بررسی اجمالی </p>
            <span class="fs-13 text-muted"> {{ Product.name }} </span>
        </div>
        
        <div class="row mx-0 mx-md-3 p-2 p-md-4 review-text rounded-7">
            <!-- SVG -->
            <div class="col-md-2 d-flex justify-content-center pt-4 pt-md-2">
                <svg class="rounded" height="150px" viewBox="0 0 512 512" width="150px" xmlns="http://www.w3.org/2000/svg">
                    <path d="m512 137v375h-512v-375l256-15zm0 0" fill="#fff5f5" />
                    <path d="m512 137v375h-256v-390zm0 0" fill="#efe2dd" />
                    <path d="m0 0h512v137h-512zm0 0" fill="#6b77e8" />
                    <path d="m256 0h256v137h-256zm0 0" fill="#615ad3" />
                    <path d="m61 62h90v30h-90zm0 0" fill="#fff5f5" />
                    <g fill="#efe2dd">
                        <path d="m301 62h30v30h-30zm0 0" />
                        <path d="m421 62h30v30h-30zm0 0" />
                        <path d="m361 62h30v30h-30zm0 0" />
                    </g>
                    <path
                        d="m106 278.210938-40.605469-40.605469 21.210938-21.210938 19.394531 19.394531 49.394531-49.394531 21.210938 21.210938zm0 0"
                        fill="#7fe881" />
                    <path
                        d="m106 368.210938-40.605469-40.605469 21.210938-21.210938 19.394531 19.394531 49.394531-49.394531 21.210938 21.210938zm0 0"
                        fill="#7fe881" />
                    <path
                        d="m106 458.210938-40.605469-40.605469 21.210938-21.210938 19.394531 19.394531 49.394531-49.394531 21.210938 21.210938zm0 0"
                        fill="#7fe881" />
                    <path d="m211 212h240v30h-240zm0 0" fill="#4a696f" />
                    <path d="m211 302h240v30h-240zm0 0" fill="#4a696f" />
                    <path d="m211 392h240v30h-240zm0 0" fill="#4a696f" />
                    <path d="m256 212h195v30h-195zm0 0" fill="#384949" />
                    <path d="m256 302h195v30h-195zm0 0" fill="#384949" />
                    <path d="m256 392h195v30h-195zm0 0" fill="#384949" />
                </svg>
            </div>

            <!-- Short Review -->
            <div class="col-md-10 pt-4 pt-md-0">
                <div class="v-html" v-html="Product.short_review"></div>
            </div>
        </div>

        <!-- Expert Review -->
        <div class="col-12">
            <div class="v-html" v-html="Product.expert_review"></div>
        </div>

        <!-- Advantages -->
        <div class="col-md-6 fs-14 mt-4" v-if="Product.advantages && Product.advantages.length !== 0">
            <span class="Advantages"> نقاط قوت </span>
            <ul>
                <li class="mt-2" v-for="(item , index) in Product.advantages" :key="index">
                    <i class="fas fa-check ml-2 Advantages"></i>
                    {{ item }}
                </li>
            </ul>
        </div>

        <!-- Disadvantages -->
        <div class="col-md-6 fs-14 mt-4" v-if="Product.disadvantages && Product.disadvantages.length !== 0">
            <span class="Disadvantages"> نقاط ضعف </span>
            <ul>
                <li class="mt-2" v-for="(item , index) in Product.disadvantages" :key="index">
                    <i class="fas fa-times ml-2 Disadvantages"></i>
                    {{ item }}
                </li>
            </ul>
        </div>

    </article>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        computed: mapState({
            Product: state => state.Product.Single_Product
        })
    }
</script>