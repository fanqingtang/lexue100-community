<template>
  <div class="homePage">
    <header-page></header-page>
    <main>
      <router-view></router-view>
    </main>
    <footer>© 乐学一百</footer>
    <transition name="fade">
      <div class="backTop" v-show="backT" @click="backTopFn()">
        <img src="../../assets/img/back_top.png" alt="返回顶部">
      </div>
    </transition>
  </div>
</template>

<script>
import HeaderPage from "_c/common/header.vue";

export default {
  name: "Index",
  data() {
    return {
      backT: false //默认回到顶部按钮隐藏
    };
  },
  mounted() {
    window.addEventListener("scroll", this.backTop);
  },
  methods: {
    backTop() {
      //回到顶部
      let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop,
        distance = 800;
      if (scrollTop >= distance) {
        this.backT = true;
      } else {
        this.backT = false;
      }
    },
    backTopFn() {
      //点击回到顶部
      $("html , body").animate({ scrollTop: 0 }, "slow");
    }
  },
  components: {
    HeaderPage
  }
};
</script>


<style lang='scss' scoped>
@import "_a/scss/variable.scss";
.homePage {
  height: 100%;
  main {
    width: 1200px;
    margin: 90px auto 0;
    display: block;
    overflow: hidden;
    min-height: 100%;
  }
  footer {
    font-family: "PingFang-SC-Bold";
    font-size: $font-size-small;
    color: $color-gray-a;
    text-align: center;
    padding: 80px 0 40px;
  }
  .backTop {
    width: 50px;
    height: 50px;
    background-color: $color-background-f;
    border: 1px solid $color-background-d;
    border-radius: 4px;
    position: fixed;
    bottom: 50px;
    right: 40px;
    cursor: pointer;
    img {
      display: block;
      width: 18px;
      height: 10px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
    }
    &:hover {
      background-color: $color-background-a;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>