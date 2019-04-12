<template>
  <div class="evaluateGroup">
    <span class="evaluate" @click="evaluteFn()">
      评论
      <i>{{evaluteNum}}</i>
    </span>
    <span class="love" :class="{loveActive: zanFlag}" @click="zanFn()">
      赞
      <i>{{zanNum}}</i>
    </span>
    <span class="collect" :class="{collectActive: collectFlag}" @click="collectFn()">
      收藏
      <i>{{collectNum}}</i>
    </span>
    <span class="eye">
      浏览
      <i>{{view}}</i>
    </span>
    <a
      :href="'#content_'+index"
      class="closeArticle"
      v-show="!closeFlag"
      @click="closeContentFn()"
    >收起全文</a>
    <!--乐粉说明 弹出框end-->
    <login-prompt v-show="!isLogin" @closeLayer="closeLogin"></login-prompt>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import loginPrompt from "./loginPrompt.vue";
export default {
  name: "EvaluteGroup",
  data() {
    return {
      isLogin: true,
      type: 1 //type为1时默认是文章点赞
    };
  },
  props: {
    closeFlag: {
      //是否收起文章
      type: Boolean,
      default: false
    },
    index: {
      type: Number
    },
    content: {
      type: Object
    }
  },
  components: {
    loginPrompt
  },
  computed: {
    ...mapState(["authCookie"]),
    collectFlag() {
      //默认是否收藏
      return this.content.collect;
    },
    zanFlag() {
      //默认是否点赞
      return this.content.givezan;
    },
    zanNum() {
      //点赞数量
      return this.content.at_zan_count;
    },
    view() {
      //预览数量
      return this.content.at_view;
    },
    collectNum() {
      //收藏数量
      return this.content.at_shoucang_count;
    },
    evaluteNum() {
      //评价数量
      return this.content.at_cmtnum;
    },
    zanArg() {
      //点赞参数
      let arg = {
        about_id: this.content.at_id,
        givezan: this.content.givezan,
        type: this.type
      };
      return arg;
    },
    collectArg() {
      //收藏参数
      let arg = {
        at_id: this.content.at_id,
        collect: this.content.collect
      };
      return arg;
    }
  },
  methods: {
    ...mapActions(["IndexCollect", "IndexZan"]),
    closeContentFn() {
      //收起全文触发的方法
      this.$emit("closeContentFn");
    },
    collectFn() {
      //点击收藏执行的方法
      //未登录时 提示去登录
      if (!this.authCookie) {
        this.isLogin = false;
      } else {
        this.IndexCollect(this.collectArg).then(({ data }) => {
          let code = data.code,
            collectArr = data.data,
            desc = data.desc;
          if (code == 200) {
            this.content.collect = collectArr.collect;
            this.content.at_shoucang_count = collectArr.at_shoucang_count;
            this.$emit("changeColNum" , collectArr.collect); //个人中心改变我收藏的文章数量  
          } else {
            throw new Error(desc);
          }
        });
      }
    },
    zanFn() {
      //点赞触发的方法
      if (!this.authCookie) {
        this.isLogin = false;
      } else {
        this.IndexZan(this.zanArg).then(({ data }) => {
          let code = data.code,
            zanArr = data.data,
            desc = data.desc;
          if (code == 200) {
            this.content.givezan = zanArr.givezan;
            this.content.at_zan_count = zanArr.zancount;
            this.$emit("changeZanNum" , zanArr.givezan);  //个人中心改变我点赞文章的数量
          } else {
            throw new Error(desc);
          }
        });
      }
    },
    evaluteFn() {
      //评论
      if (!this.authCookie) {
        this.isLogin = false;
      } else {
        this.$emit("evaluteFn");
      }
    },
    closeLogin() {
      this.isLogin = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "_a/scss/variable.scss";
.evaluateGroup {
  font-family: "PingFang-SC-Medium";
  font-size: 14px;
  color: $color-gray;
  padding-left: 68px;
  margin-bottom: 20px;
  span {
    margin-right: 40px;
    padding-left: 17px;
    cursor: pointer;
    background-size: 16px 16px;
    i {
      font-style: normal;
      margin-left: 6px;
    }
  }
  .evaluate {
    background: url("../../assets/img/talk.png") no-repeat 0 center;
  }
  .love {
    background: url("../../assets/img/love_border_g.png") no-repeat 0 center;
  }
  .collect {
    background: url("../../assets/img/collect_border_g.png") no-repeat 0 center;
  }

  .collectActive {
    color: $color-origin;
    background: url("../../assets/img/collect.png") no-repeat 0 center;
  }
  .loveActive {
    color: $color-origin;
    background: url("../../assets/img/love.png") no-repeat 0 center;
  }
  .eye {
    background: url("../../assets/img/eye.png") no-repeat 0 center;
  }
  .closeArticle {
    font-family: "PingFang-SC-Medium";
    font-size: 14px;
    font-weight: 500;
    color: $color-origin-c;
    float: right;
    margin-right: 0;
    padding-left: 0;
  }
}
</style>