<template>
  <div>
    <div class="report" v-if="isSuccess">
      <nav>
        <ul>
          <li
            v-for="(nav,index) in reportLeftNav"
            :key="index"
            @click="reportSortChange(nav , index)"
            :class="{'active': activeIndex === index}"
          >{{nav.att_title}}</li>
        </ul>
      </nav>
      <article>
        <div class="listWrap">
          <header class="filterWrap">
            <span class="filterTitle">按月浏览：</span>
            <div class="filterContent">
              <span
                class="currentSort"
                ref="sortButton"
                @click.stop="showSelectSorts()"
              >{{date | dateTxt}}</span>
              <div class="filterList" v-show="isSelectSorts">
                <ul>
                  <li @click="select(key)" v-for="(value ,key) in reportArticleMonth" :key="key">
                    {{key}}
                    <span v-show="value">(共{{value}}篇)</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="clear"></div>
          </header>
          <!-- 文章列表页start -->
          <main>
            <ul class="articleDes">
              <article-list
                v-for="(item , index ) in reportList"
                :key="index"
                :content="item"
                :index="index"
              ></article-list>
            </ul>
            <loading v-show="loading"></loading>
            <div class="noArticle" v-show="empty && reportList.length">
              <img src="../../assets/img/noArticle.png" alt="没有文章了">
            </div>
          </main>
          <!-- 文章列表页end -->
        </div>
      </article>
    </div>
    <data-loading v-else></data-loading>
  </div>
</template>
 
<script>
import ArticleList from "_c/common/articleList.vue"; // 文章列表数据组件
import Loading from "_c/common/loading.vue"; //请求数据的时候加载动画组件
import DataLoading from "_c/common/dataLoading.vue"; // 页面一加载的时候还没请求到数据时总个页面加载动画组件
import { mapActions, mapState } from "vuex";
export default {
  name: "Report",
  data() {
    return {
      page: 1, //默认页码
      pagenum: 10, //默认页面条数
      date: "0", //默认按月浏览时间是全部
      activeIndex: 0, //默认左侧切换索引为0
      attId: null, //默认左侧tab第一项attId为0
      loading: false, //是否正在加载中动画
      empty: false, //是否数据为空
      reportList: [], //默认小乐快报数据列表
      reportLeftNav: [], //默认小乐快报左侧导航数据
      isSelectSorts: false,
      isSuccess: false //页面刚开始隐藏，等到数据加载成功之后再显示
    };
  },
  filters: {
    dateTxt(value) {
      if (value == 0) {
        return "全部";
      }
      return value;
    }
  },
  mounted() {
    // 下拉菜单 点击空白处 菜单收起
    document.addEventListener("click", () => {
      if (this.isSelectSorts) this.isSelectSorts = false;
    });
    
    window.addEventListener("scroll", this.loadScroll); //下拉加载数据

    this.getReportLeftNav().then(({ data }) => {
      let code = data.code,
        desc = code.desc,
        reportNavArr = data.data;
      if (code == 200) {
        this.reportLeftNav = reportNavArr;
        this.attId = reportNavArr[0] && reportNavArr[0].att_id;

        this.getReportArticleList(this.reportArg).then(({ data }) => {
          //获取小乐快报文章列表
          this.publicDecision(data);
        });
        this.getReportArticleMonth(this.attId); //获取按月浏览数据
      } else {
        throw new Error(desc);
      }
    });
  },
  computed: {
    ...mapState(["reportArticleMonth"]),
    reportArg() {
      //小乐快报文章列表传参
      let arg = {
        page: this.page,
        pagenum: this.pagenum,
        att_id: this.attId,
        date: this.date
      };
      return arg;
    }
  },
  methods: {
    ...mapActions([
      "getReportLeftNav",
      "getReportArticleList",
      "getReportArticleMonth"
    ]),
    reportSortChange(nav, index) {
      //左边栏导航选项
      this.date = 0; //左侧切换的时候设置按月浏览为全部
      this.activeIndex = index;
      this.attId = nav.att_id;
      this.page = 1; //每次点击tab切换时  都是第一页
      this.empty = false; //默认没有数据图片隐藏
      this.getReportArticleList({
        page: this.page,
        pagenum: this.pagenum,
        att_id: this.attId,
        date: this.date
      }).then(({ data }) => {
        this.publicDecision(data);
      });
      this.getReportArticleMonth(this.attId); //更新按月浏览
    },
    select(value) {
      //选择按月浏览方法
      value = value == "全部" ? 0 : value;
      this.date = value;
      this.page = 1; //默认第一页
      this.empty = false; //默认没有数据图片不显示
      this.getReportArticleList({
        page: this.page,
        pagenum: this.pagenum,
        att_id: this.attId,
        date: this.date
      }).then(({ data }) => {
        this.publicDecision(data);
      });
    },
    showSelectSorts() {
      this.isSelectSorts = !this.isSelectSorts;
    },
    publicDecision(data) {
      //判断后端返回的code方法
      let code = data.code,
        desc = data.desc,
        reportListArr = data.data;
      if (code == 200) {
        this.reportList = reportListArr;
        this.isSuccess = true; //数据加载成功之后再显示页面内容
      } else {
        throw new Error(desc);
      }
    },
    loadScroll() {
      //判断下拉加载的滚动距离
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (
        scrollTop + document.documentElement.clientHeight + 100 >=
        document.documentElement.scrollHeight
      ) {
        this.loadMore();
      }
    },
    async loadMore() {
      // 没有正在加载中才会请求数据
      if (!this.loading && this.attId) {
        if (this.empty) {
          this.loading = false;
          return;
        }
        this.loading = true;
        this.page = ++this.page;
        // 请求下一页数据
        await this.getReportArticleList({
          page: this.page,
          pagenum: this.pagenum,
          att_id: this.attId,
          date: this.date
        }).then(({ data }) => {
          let code = data.code,
            desc = data.desc,
            reportListArr = data.data,
            reportLength = reportListArr.length;
          if (code == 200) {
            if (reportLength < this.pagenum && reportLength >= 0) {
              this.empty = true;
              this.loading = false;
              this.reportList = this.reportList.concat(reportListArr);
            } else {
              this.empty = false;
              this.reportList = this.reportList.concat(reportListArr);
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
    ArticleList,
    Loading,
    DataLoading
  }
};
</script>

<style lang='scss' scoped>
* {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
}
.clear {
  clear: both;
}
ul,
li {
  list-style: none;
}
.report {
  width: 1200px;
  margin: 0 auto;
}
.active {
  color: #ff7a32;
  font-weight: bold;
  background: url(../../assets/img/report-icon.png) left no-repeat;
}
nav {
  width: 300px;
  background: #fff;
  border-radius: 4px;
  float: left;
  ul li {
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    color: #666;
    border-bottom: 1px solid rgba(229, 229, 229, 1);
    width: 100%;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
    &:last-child {
      border-bottom: none;
    }
  }
}

article {
  float: right;
  width: 870px;
  border-radius: 4px;
  background: #fff;
  padding: 28px;
}

.listWrap {
  width: 100%;
}
.filterTitle {
  font-weight: normal;
  float: left;
  font-size: 14px;
}
.filterWrap {
  font-size: 14px;
  width: 100%;
}
.filterContent {
  float: left;
  position: relative;
}
.currentSort {
  color: #ff7a32;
  background: url(../../assets/img/down.png) right no-repeat;
  display: inline-block;
  padding-right: 16px;
  &:hover {
    cursor: pointer;
  }
}
.filterList {
  position: absolute;
  left: -64px;
  z-index: 100;
  top: 36px;
  width: 152px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 229, 229, 1);
  box-shadow: 0px 4px 8px 0px rgba(51, 51, 51, 0.15);
  border-radius: 4px;
  ul li {
    height: 40px;
    line-height: 40px;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #e5e5e5;
    font-size: 14px;
    color: #999;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      cursor: pointer;
      color: #ff7a32;
      font-weight: bold;
    }
  }
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
</style>