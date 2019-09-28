<template>
    <section class="user-reviews">
        <span class="headline-info"> نقدها </span>
        <div class="row rtl">
            <div class="col-12 col-lg-6" v-for="n in 4" :key="n">
                <el-card class="am-shadow mb-3">
                    <h4> لپ‌تاپ X541UV </h4>
                    <p>
                        ن این لپ تاپ رو حدود یک هفته هستش که خریداری کردم
                        ، دوستان این لپ تاپ فوق العاده عالیه ، راستش تو یه سری ا
                        ز کامنت ها خوندم که صدا میده و اینا ولی من گرفتم
                        اصلا صدای خاص و آزار دهنده ای نداره واسه من ، رم که 12 هستش
                    </p>

                    <div class="d-flex">
                        <span class="alert alert-success" v-if="n == 1 || n == 4">تایید شده</span>
                        <span class="alert alert-danger" v-else>تایید نشده</span>
                        <v-spacer></v-spacer>
                        <el-button type="info" plain size="small">حذف</el-button>
                    </div>
                </el-card>
            </div>
        </div>

        <span class="headline-info"> پرسش‌ها </span>
        <div class="row rtl">
            <div class="col-12 col-lg-6" v-for="n in 4" :key="n">
                <el-card class="am-shadow mb-3">

                </el-card>
            </div>
        </div>

        <span class="headline-info"> نظرات مقالات </span>
        <div class="row rtl">
            <div class="col-12 col-lg-6" v-for="n in 4" :key="n">
                <el-card class="am-shadow mb-3">

                </el-card>
            </div>
        </div>
    </section>
</template>