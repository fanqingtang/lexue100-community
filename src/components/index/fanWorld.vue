<template>
  <div>
    <div class="fanWorldWrap" v-if="isSuccess">
      <div class="listWrap">
        <header class="top">
          <div class="buttons">
            <ul>
              <li v-for="(order,index) in orders" :key="index">
                <button
                  @click="orderChange(order,index)"
                  :class="{current: tabIndex==index}"
                >{{order.title}}</button>
              </li>
            </ul>
          </div>
          <!--文章分类 str-->
          <div class="filter">
            <span>分类：</span>
            <div class="filterContent">
              <span class="currentSort" ref="sortButton" @click="showSlectSorts()">{{selectTxt}}</span>
              <div class="filterList" v-show="isSelectSorts">
                <ul>
                  <li
                    @click="selectType(item)"
                    v-for="item in fanWorldTypeArr"
                    :key="item.tid"
                  >{{item.title}}</li>
                </ul>
              </div>
            </div>
          </div>
          <!--文章分类 end-->
          <span class="clear"></span>
        </header>
        <main>
          <ul class="articleDes">
            <article-list
              v-for="(item , index ) in fanWorldArr"
              :key="index"
              :content="item"
              :index="index"
            ></article-list>
          </ul>
          <loading v-show="loading"></loading>
          <div class="noArticle" v-show="empty && fanWorldArr.length">
            <img src="../../assets/img/noArticle.png" alt="没有文章了">
          </div>
        </main>
      </div>
      <!--高手推荐 str-->
      <div class="recommendWrap">
        <h4 class="title">乐粉推荐</h4>
        <main>
          <main class="content">
            <ul>
              <li class="list" v-for="master in superior" :key="master.uid">
                <Member
                  :member="master"
                  :isPageViews="true"
                  :isRecommend="true"
                  @del="cancelAttention(master)"
                  @attention="addAttention(master)"
                ></Member>
              </li>
            </ul>
          </main>
        </main>
      </div>
    </div>
    <data-loading v-else></data-loading>
  </div>
</template>
<script>
import ArticleList from "_c/common/articleList.vue"; //文章列表组件
import Member from "_c/common/member.vue";
import Loading from "_c/common/loading.vue"; //每次滚动加载动画加载中
import DataLoading from "_c/common/dataLoading.vue" // 页面一加载时数据还没请求到时加载的动画 
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "articleLists",
  data() {
    return {
      tabIndex: 0, //默认 最新、推荐、和热度切换 索引
      selectTxt: "全部", //默认分类帅选为全部
      isSelectSorts: false, //默认分类列表隐藏
      isAttentionLayer: true, //是否为关注成功的弹层 出现
      orders: [
        { title: "最新", params: "new" },
        { title: "推荐", params: "order" },
        { title: "热度", params: "hot" }
      ],

      page: 1, //默认页码
      pagenum: 10, //默认显示条数
      order: "new", //默认按时间排序
      superior_type: null, //默认文章分类为全部
      fanWorldArr: [], //默认乐粉天地文章列表
      loading: false, //默认正在加载动画隐藏
      empty: false, //默认数据为空图片隐藏
      isSuccess: false //默认当数据还没加载出来的时候隐藏所有页面
    };
  },
  mounted() {
    // 下拉菜单 点击空白处 菜单收起
    document.addEventListener("click", e => {
      if (this.$refs.sortButton != e.target) {
        if (this.isSelectSorts) this.isSelectSorts = false;
      }
    });

    window.addEventListener("scroll", this.loadScroll); //下拉加载数据
  },

  computed: {
    ...mapState([
      "leFenWorldMasterAndSort",
      "leFenWorldArticleList",
      "fanWorldTypeArr",
      "superior"
    ]),
    fanWorldArg() {
      let arg = {
        page: this.page,
        pagenum: this.pagenum,
        order: this.order,
        superior_type: this.superior_type
      };
      return arg;
    }
  },
  created() {
    this.fanWorldType(); //获取高手推荐和文章分类
    this.fanWorldList(this.fanWorldArg).then(({ data }) => {
      //获取乐粉世界文章列表
      this.publicDecision(data);
    });
  },
  methods: {
    ...mapActions(["fanWorldType", "fanWorldList"]),
    /**
     * @description 按照文章分类 筛选
     */
    selectType(item) {
      this.superior_type = item.tid;
      this.selectTxt = item.title;
      this.fanWorldList(this.fanWorldArg).then(({ data }) => {
        //获取乐粉世界文章列表
        this.publicDecision(data);
      });
    },
    publicDecision(data) {
      //调用公共的获取乐粉天地数据列表方法
      let code = data.code,
        desc = data.desc,
        fanWorldArr = data.data;
      if (code == 200) {
        this.fanWorldArr = fanWorldArr;
        this.isSuccess = true; //数据加载成功之后再显示页面内容
      } else {
        throw new Error(desc);
      }
    },
    showSlectSorts() {
      this.isSelectSorts = !this.isSelectSorts;
    },
    addAttention(master) {
      this.isAttentionLayer = true;
      master.follow = true;
      master.fans++;
    },
    cancelAttention(master) {
      this.isAttentionLayer = false;
      master.follow = false;
      master.fans--;
    },
    /**
     * @description 最新 推荐 热度 切换筛选
     */
    orderChange(order, index) {
      this.tabIndex = index;
      this.order = order.params;

      this.page = 1; //设置默认页数为一页
      this.empty = false; //默认数据为空图片隐藏
      this.fanWorldList(this.fanWorldArg).then(({ data }) => {
        //获取乐粉世界文章列表
        this.publicDecision(data);
      });
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
      //下拉加载
      if (!this.loading) {
        if (this.empty) {
          this.loading = false;
          return;
        }
        this.loading = true;
        this.page = ++this.page;
        // 请求下一页数据
        await this.fanWorldList(this.fanWorldArg).then(({ data }) => {
          let code = data.code,
            desc = data.desc,
            fanWorldListArr = data.data,
            fanWorldLength = fanWorldListArr.length;
          if (code == 200) {
            if (fanWorldLength < this.pagenum && fanWorldLength >= 0) {
              this.empty = true;
              this.loading = false;
              this.fanWorldArr = this.fanWorldArr.concat(fanWorldListArr);
            } else {
              this.empty = false;
              this.fanWorldArr = this.fanWorldArr.concat(fanWorldListArr);
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
    //销毁scroll方法
    window.removeEventListener("scroll", this.loadScroll);
  },
  components: {
    ArticleList,
    Member,
    Loading,
    DataLoading
  }
};
</script>
<style lang="scss" scoped>
ul,
li {
  padding: 0px;
  margin: 0px;
  list-style: none;
}
button {
  outline: none;
}
.fanWorldWrap {
  width: 1200px;
  margin: 0 auto;
}
.listWrap {
  width: 822px;
  background: #fff;
  border-radius: 4px;
  padding: 24px;
  float: left;
}
.top {
  margin-bottom: 22px;
}
.clear {
  clear: both;
}
.buttons {
  float: left;
  ul li {
    float: left;
    list-style: none;
    margin-right: 14px;
    button {
      width: 68px;
      text-align: center;
      height: 30px;
      border: 1px solid rgba(204, 204, 204, 1);
      background: #fff;
      border-radius: 4px;
      font-size: 14px;
      color: #666;
      &:hover {
        border: 1px solid rgba(255, 122, 50, 1);
        color: #ff7a32;
        cursor: pointer;
      }
    }
    button.current {
      border: 1px solid rgba(255, 122, 50, 1);
      color: #ff7a32;
    }
  }
}
.filter {
  float: right;
  line-height: 30px;
  span:first-child {
    color: #666666;
    font-size: 14px;
  }
  .filterContent {
    display: inline-block;
    position: relative;
    padding-right: 22px;
    span.currentSort {
      color: #ff7a32;
      background: url(../../assets/img/down.png) right no-repeat;
      display: inline-block;
      padding-right: 16px;
      &:hover {
        cursor: pointer;
      }
    }
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

$color: #666;
$clear: both;
$orange: #ff7a32;
.content {
  width: 100%;
  ul li.list {
    margin-bottom: 40px;
  }
}
.recommendWrap {
  width: 262px;
  background: #fff;
  border-radius: 4px;
  padding: 28px 20px 0px 18px;
  float: right;
}
.title {
  color: $color;
  font-weight: normal;
  margin-bottom: 30px;
}
.popUp {
  display: none;
}
.layer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: #000;
  opacity: 0.5;
  z-index: 1000;
}
.layerMain {
  position: absolute;
  width: 200px;
  text-align: center;
  height: 100px;
  line-height: 100px;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -50px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  z-index: 1001;
}

.popUp {
  display: none;
}
.layer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: #000;
  opacity: 0.5;
  z-index: 1000;
}
.layerMain {
  position: absolute;
  width: 200px;
  text-align: center;
  height: 100px;
  line-height: 100px;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -50px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  z-index: 1001;
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


