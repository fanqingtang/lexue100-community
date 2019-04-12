<template>
  <swiper :options="swiperOption" class="swiperImg">
    <swiper-slide v-for="(list, index) in banner" :key="index">
      <a @click="openWin(list)">
        <img :src="list.at_pic" alt="轮播图">
      </a>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
export default {
  name: "SwiperImg",
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          bulletClass: "my-bullet-dot",
          bulletActiveClass: "my-bullet-active"
        },
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        loop: false
      }
    };
  },
  props: {
    banner: {
      type: Array
    }
  },
  methods: {
    openWin(list) {  //详情页在新窗口打开
      window.open(list.at_url);
    }
  }
};
</script>

<style lang="scss">
@import "_a/scss/variable.scss";
.swiperImg {
  width: 870px;
  height: 384px;
  border-radius: 4px;
  overflow: hidden;
  a {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  img {
    display: inline-block;
    width: 870px;
    height: 384px;
    vertical-align: middle;
  }
  .my-bullet-dot {
    display: inline-block;
    width: 8px;
    height: 4px;
    background-color: $color-background-f;
    opacity: 0.35;
    filter: alpha(opacity=35);
    border-radius: 2px;
    margin-right: 10px;
    cursor: pointer;
  }
  .my-bullet-active {
    display: inline-block;
    width: 20px;
    height: 4px;
    background-color: $color-background-f;
    border-radius: 2px;
    opacity: 1;
    filter: alpha(opacity=100);
  }
}
</style>