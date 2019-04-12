import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

const router = new Router({
  linkExactActiveClass: "active",
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("_c/index/home.vue")
    },
    {
      path: "/report",
      name: "Report",
      component: () => import("_c/index/report.vue")
    },
    {
      path: "/FanWorld",
      name: "FanWorld",
      component: () => import("_c/index/fanWorld.vue")
    },
    {
      path: "/studentCenter",
      name: "StudentCenter",
      component: () => import("_c/index/studentCenter.vue")
    },
    {
      path: "/otherCenter/:id",   // /otherCenter/:id    mk.php?do=xlsq #/otherCenter/34
      name: "OtherCenter",
      component: () => import("_c/index/otherCenter.vue")
    },
    {
      path: "/fan",
      name: "Fan",
      component: () => import("_c/index/fan.vue")
    },
    {
      path: "/attention",
      name: "Attention",
      component: () => import("_c/index/attention.vue")
    },
    {
      path: "/notices",
      name: "Notices",
      component: () => import("_c/index/notices.vue")
    },
    {
      path: "/publishArticle",
      name: "PublishArticle",
      component: () => import("_c/index/publishArticle.vue")
    },
    {
      path: "*",   //如果没找到匹配的路由就跳到首页
      redirect: '/' 
    }
  ]
});

export default router;
