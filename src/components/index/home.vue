<template>
  <div>
    <div class="content" v-if="isSuccess">
      <section class="contentLeft">
        <swiper-img :banner="banner"></swiper-img>
        <div class="aritcleList">
          <div class="articleInner">
            <h4 class="title">小乐推荐</h4>
            <ul class="articleDes">
              <article-list
                v-for="(item , index ) in recommend"
                :key="index"
                :content="item"
                :index="index"
                :loading="loading"
              ></article-list>
            </ul>
            <loading v-show="loading"></loading>
            <div class="noArticle" v-show="empty && recommend.length">
              <img src="../../assets/img/noArticle.png" alt="没有文章了">
            </div>
          </div>
        </div>
      </section>
      <aside class="asideRight">
        <Aside
          class="hotArticleWrap"
          titleName="新热活动推荐"
          :articleList="activity"
          v-show="activity.length"
        ></Aside>
        <Aside titleName="热评文章" :articleList="hotreview" v-show="hotreview.length"></Aside>
      </aside>
    </div>
    <data-loading v-else></data-loading>
  </div>
</template>

<script>
import Aside from "_c/common/aside.vue"; //侧边栏
import SwiperImg from "_c/common/swiperImg.vue"; //轮播图
import ArticleList from "_c/common/articleList.vue"; //文章列表
import Loading from "_c/common/loading.vue"; //正在加载中
import DataLoading from "_c/common/dataLoading"; //页面总体加载数据还没加载到时显示动画
import {
  throttle,
  getScrollTop,
  getDocumentHeight,
  getWindowHeight
} from "_a/js/utils.js";

import { mapActions, mapState } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      page: 1, //页码
      pagenum: 10, //请求多少条数据
      loading: false, //是否正在加载中
      empty: false, //没有更多数据
      recommend: [], //默认文章列表数据
      isSuccess: false //默认数据还没加载到时把页面隐藏
    };
  },
  computed: {
    ...mapState(["banner", "activity", "hotreview"]),
    pageArg() {
      //处理下拉加载传递的参数
      let pageObj = {
        page: this.page,
        pagenum: this.pagenum
      };
      return pageObj;
    }
  },
  mounted() {
    this.IndexBanner(); //获取首页banner和侧边栏数据
    this.IndexRecommend(this.pageArg).then(({ data }) => {
      let code = data.code,
        desc = data.desc,
        recommendArr = data.data;
      if (code == 200) {
        this.recommend = recommendArr;
        this.isSuccess = true; //数据加载完成之后再显示页面内容
      } else {
        throw new Error(desc);
      }
    });

    window.addEventListener("scroll", () => {
      //下拉加载更多数据
      if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {  //判断下拉加载的滚动距离
        this.loadMore();
      }
    });
  },
  methods: {
    ...mapActions(["IndexBanner", "IndexRecommend"]),

    async loadMore() {
      // 没有正在加载中才会请求数据
      if (!this.loading) {
        if (this.empty) {
          this.loading = false;
          return;
        }
        this.loading = true;
        this.page = ++this.page;
        // 请求下一页数据
        await this.IndexRecommend({
          page: this.page,
          pagenum: this.pagenum
        }).then(({ data }) => {
          let code = data.code,
            desc = data.desc,
            recommendArr = data.data,
            recommendLength = recommendArr.length;
          if (code == 200) {
            if (recommendLength < this.pagenum && recommendLength >= 0) {
              this.empty = true;
              this.loading = false;
              this.recommend = this.recommend.concat(recommendArr);
            } else {
              this.empty = false;
              this.recommend = this.recommend.concat(recommendArr);
              this.loading = false;
            }
          } else {
            throw new Error(desc);
          }
        });
      }
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.loadScroll); //销毁下拉加载更多数据事件
  },
  components: {
    Aside,
    SwiperImg,
    ArticleList,
    Loading,
    DataLoading
  }
};
</script>

<style lang='scss' scoped>
@import "_a/scss/variable.scss";
.content {
  font-family: "PingFang-SC-Bold, Microsoft YaHei";
  width: 1200px;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  .contentLeft {
    float: left;
    width: 870px;
    height: auto;
    .aritcleList {
      width: 870px;
      height: auto;
      margin-top: 30px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
    }
    .articleInner {
      padding: 0 30px;
      overflow: hidden;
    }
    .articleDes {
      width: 100%;
      height: 100%;
    }
    .title {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium-x;
      font-weight: 500;
      height: 75px;
      line-height: 75px;
      margin: 0;
      color: $color-origin;
      border-bottom: 1px solid $color-background-a;
    }
  }

  .asideRight {
    float: right;
    width: 300px;
    height: auto;
  }
  .hotArticleWrap {
    margin-bottom: 30px;
  }
  .noArticle {
    width: 100%;
    height: 60px;
    margin: 40px 0;
    img {
      display: block;
      width: 178px;
      height: 60px;
      margin: 0 auto;
    }
  }
}
</style>