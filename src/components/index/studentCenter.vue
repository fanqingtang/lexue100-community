<template>
  <div>
    <div class="selfCenterWrap" v-if="isSuccess">
      <div class="selfLeft">
        <person-information
          :isSelf="true"
          :authorInfo="stuCenAuthor"
          @introChange="saveIntro"
          :currentJs="currentJs"
        ></person-information>
      </div>
      <aside class="selfRight">
        <!--筛选选项 str-->
        <div class="wrap">
          <div class="buttons">
            <ul>
              <li>
                <button
                  @click="sortChange(0,'send')"
                  :class="{current:tabIndex==0}"
                >我发出的文章 {{stuCenAuthor.article_sum}}</button>
              </li>
              <li>
                <button
                  @click="sortChange(1,'zan')"
                  :class="{current:tabIndex==1}"
                >我点赞的文章 {{stuCenAuthor.zan_sum}}</button>
              </li>
              <li>
                <button
                  @click="sortChange(2,'collect')"
                  :class="{current:tabIndex==2}"
                >我收藏的文章 {{stuCenAuthor.collect_sum}}</button>
              </li>
            </ul>
          </div>
          <div class="edit">
            <button @click="toWrite">提笔就写</button>
          </div>
        </div>
        <!--筛选选项 end-->
        <!--文章列表区域 str-->
        <ul class="articleDes" v-show="studenCenterList.length">
          <article-list
            v-for="(item , index ) in studenCenterList"
            :key="item.at_id"
            :content="item"
            :index="index"
            @chPerCenZan="chPerCenZan"
            @chPerCenCollect="chPerCenCollect"
            @delSelfArticle="delSelfArticle"
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
        <!--文章列表区域 end-->
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
import { mapState, mapActions, mapMutations } from "vuex"; //加载vuex
import personInformation from "../common/personInformation.vue";
import ArticleList from "_c/common/articleList.vue"; //文章列表页
import Pagination from "_c/common/pagination.vue"; //文章分页
import DataLoading from "_c/common/dataLoading.vue" //页面一加载的时候还没请求到数据时总个页面加载动画组件
export default {
  name: "StudentCenter",
  data() {
    return {
      tabIndex: 0, //默认tab切换第一项索引值
      page: 1, //默认是第一页,
      pagenum: 10, //默认每页显示10条
      limit: 10, //默认每10条一页
      order: "send", //默认筛选顺序是我发出的文章
      countNum: 0, //默认总的数量
      stuCenAuthor: {}, //默认作者信息
      currentPage: 0, //默认每次tab切换的时候设置分页为当前第一页
      currentJs: "", //当前个人简介 因异步 在本组件取值传给personInformation
      isSuccess: false //页面刚开始隐藏，等到数据加载成功之后再显示
    };
  },
  computed: {
    ...mapState(["studenCenterList"]),
    studentCenterArg() {
      //个人中心列表数据参数
      let arg = {
        page: this.page,
        pagenum: this.pagenum,
        order: this.order,
        uid: this.stuCenAuthor.uid
      };
      return arg;
    }
  },
  mounted() {
    this.studentCenterAuthor().then(({ data }) => {
      //获取作者信息
      let code = data.code,
        desc = data.desc,
        stuCenAuthor = data.data;
      if (code == 200) {
        this.stuCenAuthor = stuCenAuthor;
        this.currentJs = stuCenAuthor.person_js; //作者简介 再处理
        this.studentCenterList(this.studentCenterArg); //获取个人中心列表数据
        this.countNum = stuCenAuthor.article_sum; //默认我发出的文章总数
        this.isSuccess = true; //数据加载成功之后再显示页面内容
      } else {
        throw new Error(desc);
      }
    });
  },
  methods: {
    ...mapActions(["studentCenterList", "studentCenterAuthor"]),
    ...mapMutations(["setOffset"]),
    toWrite() {
      this.$router.push({ path: "/publishArticle" });
    },
    sortChange(index, order) {
      //文章筛选方法
      this.tabIndex = index;
      this.order = order;
      this.setOffset(this.currentPage); //设置分页组件当前激活项为第一项
      this.page = 1; //初始化为第一页
      this.studentCenterList(this.studentCenterArg); //获取个人中心列表数据
      switch (
        order //设置点赞的文章总数量
      ) {
        case "send":
          this.countNum = this.stuCenAuthor.article_sum;
          break;
        case "zan":
          this.countNum = this.stuCenAuthor.zan_sum;
          break;
        case "collect":
          this.countNum = this.stuCenAuthor.collect_sum;
          break;
      }
    },
    /**
     * @description 保存编辑的 简介
     */
    saveIntro(intro) {
      this.stuCenAuthor.person_js = intro;
      this.currentJs = intro;
    },
    scrollBar() {
      //滚动条置顶
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    selectPageFn(page) {
      //选中页数的方法
      this.page = page;
      this.studentCenterList(this.studentCenterArg); //获取个人中心列表数据
      this.scrollBar();
    },
    goPrePage(page) {
      //上一页方法
      this.page = page;
      this.studentCenterList(this.studentCenterArg); //获取个人中心列表数据
      this.scrollBar();
    },
    goNextPage(page) {
      //下一页方法
      this.page = page;
      this.studentCenterList(this.studentCenterArg); //获取个人中心列表数据
      this.scrollBar();
    },
    chPerCenZan(isZan) {
      //改变我点赞的文章数量
      this.stuCenAuthor.zan_sum = isZan
        ? ++this.stuCenAuthor.zan_sum
        : --this.stuCenAuthor.zan_sum;
    },
    chPerCenCollect(isCollect) { //改变我收藏文章的数量
      this.stuCenAuthor.collect_sum = isCollect
        ? ++this.stuCenAuthor.collect_sum
        : --this.stuCenAuthor.collect_sum;
    },
    delSelfArticle() { //改变我发出文章的数量
      this.stuCenAuthor.article_sum = --this.stuCenAuthor.article_sum; 
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
button {
  outline: none;
}
div,
aside {
  margin: 0px;
  padding: 0px;
}
.selfCenterWrap {
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
.wrap {
  overflow: hidden;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e5e5;
}
.buttons {
  float: left;
  overflow: hidden;
  ul li {
    float: left;
    margin-right: 20px;
    button {
      height: 30px;
      border: 1px solid rgba(204, 204, 204, 1);
      border-radius: 4px;
      padding: 0px 16px;
      color: #666;
      font-size: 14px;
      background: #fff;

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
.edit {
  float: right;
  button {
    height: 34px;
    line-height: 34px;
    padding: 0px 16px;
    background: rgba(255, 122, 50, 1);
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    border: none;
    &:hover {
      cursor: pointer;
    }
  }
}
.pagination {
  margin-top: 40px;
}
</style>