import Vue from "vue";
import App from "./App.vue";
import router from "../router/router.js";
import "../../assets/scss/index.scss"; //全局通用的格式化css
import store from "../store/store.js"; //store仓库

import VueAwesomeSwiper from "vue-awesome-swiper"; //轮播图组件
import "swiper/dist/css/swiper.css"; //轮播图插件

import VueCropper from "vue-cropper"; //图片裁剪组件

Vue.use(VueCropper);
Vue.use(VueAwesomeSwiper);


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
