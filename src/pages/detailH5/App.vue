<template>
  <div id="app">
      <home></home>
  </div>
</template>

<script>
import Home from "_c/detailH5/home.vue";
export default {
  name: "App",
  components: {
    Home
  }
};
</script>

<style scoped>
  #app{
    width: 100%;
  }
</style>
<style>
  #app .commentContent img{max-width: 98%;}
  .detail img{max-width:100%!important;}
  #app .commentContent {width: 100%;word-break: break-word;}
  #app .detail section, #app .detail ol{max-width:100%!important;} /*详情自带宽度超出 控制*/
</style>
