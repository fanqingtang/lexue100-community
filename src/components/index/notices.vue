<template>
  <div class="myFansWrap">
    <header class="title">我的通知</header>
    
    <main>
      <div class="noticesList">
        <ul>
          <li v-for="(item , index) in noticeAllList" :key="index" >
            <span class="noticeText" v-html="item.mg_text"></span>
            <span class="noticeTime">{{item.mg_dateline}}</span>
          </li>
        </ul>
      </div>
      <div class="pagination" v-show="noticeCount > limit">
        <pagination
          :num="noticeCount"
          :limit="limit"
          @selectPageFn="selectPageFn"
          @goPrePage="goPrePage"
          @goNextPage="goNextPage"
        ></pagination>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Pagination from "_c/common/pagination.vue";
export default {
  name: "Notices",
  data() {
    return {
      page: 1,
      limit: 20,
      pagenum: 20,
      type: "all"
    };
  },
  computed: {
    ...mapState(["noticeCount", "noticeAllList"])
  },
  created() {
    let page = this.page,
      pagenum = this.pagenum,
      type = this.type,
      obj = { page, pagenum, type };
    this.noticeInfo(obj); //获取消息列表信息
  },
  methods: {
    ...mapActions(["noticeInfo"]),
    selectPageFn(page) {
      //选中的页数
      let pagenum = this.pagenum,
        type = this.type,
        obj = { page, pagenum, type };
      this.noticeInfo(obj);
    },
    goPrePage(page) {
      //上一页
      let pagenum = this.pagenum,
        type = this.type,
        obj = { page, pagenum, type };
      this.noticeInfo(obj);
    },
    goNextPage(page) {
      //下一页
      let pagenum = this.pagenum,
        type = this.type,
        obj = { page, pagenum, type };
      this.noticeInfo(obj);
    }
  },
  components: {
    Pagination
  }
};
</script>
<style lang="scss" scoped>
@import "_a/scss/mixin.scss";
@import "_a/scss/variable.scss";
div,
header,
main,
ul,
li {
  margin: 0px;
  padding: 0px;
}
ul,
button {
  outline: none;
}
.myFansWrap {
  width: 1200px;
  margin: 0 auto;
  background: #fff;
  padding: 0 30px 50px;
  border-radius: 4px;
  box-sizing: border-box;
}
.title {
  font-family: "PingFang-SC-Bold";
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #e5e5e5;
  padding: 30px 0 50px;
}
.noticesList {
  width: 100%;
  ul li {
    color: #333;
    font-size: 14px;
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #e5e5e5;
  }
  .noticeText {
    float: left;
    height: 100%;
    width: 926px;
    @include no-wrap;
  }
  .noticeTime {
    font-family: "PingFang-SC-Medium";
    font-size: 12px;
    color: #999999;
    display: block;
    height: 100%;
    text-align: right;
    @include no-wrap;
  }
}
.pagination {
  padding: 40px 0 0;
}

</style>


