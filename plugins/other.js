import Vue from 'vue';
import Vue2Filters from 'vue2-filters';
Vue.use(Vue2Filters);

Vue.filter('Num2Fa' , function(val , useGrouping = true) {
    if(isNaN(val) && eval(val)) val = eval(val); 
    return val ? val.toLocaleString('fa-IR' , { useGrouping }) : 0 ;
});