<template>
  <div>
    <div class="otherCenterWrap" v-if="isSuccess">
      <div class="selfLeft">
        <person-information :isSelf="false" :authorInfo="othCenAuthor" :currentJs="currentJs"></person-information>
      </div>
      <aside class="selfRight">
        <!--文章列表头标题 str-->
        <div class="buttons">Ta发出的文章 {{othCenAuthor.article_sum}}</div>
        <!--文章列表头标题 end-->
        <!-- 文章列表页 -->
        <ul class="articleDes">
          <article-list
            v-for="(item , index ) in studenCenterList"
            :key="index"
            :content="item"
            :index="index"
          ></article-list>
        </ul>
        <div class="pagination" v-show="countNum > limit">
          <pagination
            :num="countNum"
            :limit="limit"
            @selectPageFn="selectPageFn"
            @goPrePage="goPrePage"
            @goNextPage="goNextPage"
          ></pagination>
        </div>
        <!--还没有发表过文章 str-->
        <div class="noArticle" v-show="!studenCenterList.length">
          <img src="../../assets/img/no_article.png" alt>
          <p>
            还没有发表过文章
            <button @click="toWrite">提笔就写</button>
          </p>
        </div>
        <!--还没有发表过文章 end-->
      </aside>
    </div>
    <data-loading v-else></data-loading>
  </div>
</template>
<script>
import personInformation from "../common/personInformation.vue";
import ArticleList from "_c/common/articleList.vue";
import { mapState, mapActions, mapMutations } from "vuex";
import Pagination from "_c/common/pagination.vue"; //文章分页
import DataLoading from "_c/common/dataLoading.vue"; //页面一加载的时候还没请求到数据时总个页面加载动画组件
export default {
  name: "otherCenter",
  data() {
    return {
      page: 1, //默认当前页码
      pagenum: 10, //默认显示当前的条数
      order: "send",
      othCenAuthor: {}, //默认其他作者个人中心数据
      countNum: 0, //默认文章总的条数
      limit: 10, //默认文章每10条一页
      currentJs: "",
      isSuccess: false //页面刚开始隐藏，等到数据加载成功之后再显示
    };
  },
  created() {
    this.setCurrentUid(this.$route.params.id);
    this.studentCenterAuthor(this.currentUid);
    this.studentCenterList({
      order: "send",
      uid: this.currentUid,
      page: 1,
      pagenum: 10
    });
  },
  mounted() {
    this.studentCenterAuthor(this.currentUid).then(({ data }) => {
      //获取其他人的个人中心
      let code = data.code,
        desc = data.desc,
        othCenArr = data.data;
      if (code == 200) {
        this.othCenAuthor = othCenArr;
        this.currentJs = othCenArr.person_js;
        this.countNum = othCenArr.article_sum; //默认文章的总条数
        this.studentCenterList(this.otherCenterAr); //获取个人中心列表数据
        this.isSuccess = true; //数据加载成功之后再显示页面内容
      } else {
        throw new Error(desc);
      }
    });
  },
  computed: {
    ...mapState(["currentUid", "studenCenterList", "authCookie"]),
    otherCenterAr() {
      //其他个人中心参数
      let arg = {
        page: this.page,
        pagenum: this.pagenum,
        order: this.order,
        uid: this.currentUid
      };
      return arg;
    }
  },
  methods: {
    ...mapMutations(["setCurrentUid"]),
    // ...mapActions(['getPersonalCenterAuthorInfo','getPersonalCenterArticleList']),
    ...mapActions(["studentCenterList", "studentCenterAuthor"]),
    attentionSuccess() {
      authorInfo.follow = true;
    },
    scrollBar() {
      //滚动条置顶
      document.documentElement.scrollTop = 0;
    },
    selectPageFn(page) {
      //选中页数的方法
      this.page = page;
      this.studentCenterList(this.otherCenterAr); //获取个人中心列表数据
      this.scrollBar();
    },
    goPrePage(page) {
      //上一页方法
      this.page = page;
      this.studentCenterList(this.otherCenterAr); //获取个人中心列表数据
      this.scrollBar();
    },
    goNextPage(page) {
      //下一页方法
      this.page = page;
      this.studentCenterList(this.otherCenterAr); //获取个人中心列表数据
      this.scrollBar();
    },
    toWrite() {  //点击提笔就写
      this.$router.push({ path: "/publishArticle" });
    }
  },
  components: {
    personInformation,
    ArticleList,
    Pagination,
    DataLoading
  }
};
</script>
<style lang="scss" scoped>
div,
aside {
  margin: 0px;
  padding: 0px;
}
button {
  outline: none;
}
.buttons {
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e5e5;
  color: #ff7a32;
  font-size: 14px;
}
.otherCenterWrap {
  overflow: hidden;
  .selfLeft {
    float: left;
  }
}
.selfRight {
  float: right;
  width: 810px;
  border-radius: 4px;
  background: #fff;
  padding: 30px 30px 50px 30px;
}
.pagination {
  margin-top: 40px;
}
.noArticle {
  text-align: center;
  padding: 200px 0px;
  font-size: 14px;
  img {
    width: 68px;
    height: 80px;
  }
  p {
    color: #999;
    button {
      border: none;
      outline: none;
      color: #ca8e6e;
      background: none;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>

