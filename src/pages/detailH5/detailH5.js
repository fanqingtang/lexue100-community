import Vue from "vue";
import App from "./App.vue";
import "normalize-css"; // 格式化css
// import router from "../router/router.js";
import "_a/scss/index.scss"; //全局通用的css
import "_a/scss/h5.scss";
import store from "../store/store.js"; //store仓库

new Vue({
  // router,
  store,
  render: h => h(App)
}).$mount("#app");
