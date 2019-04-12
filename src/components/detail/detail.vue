<template>
  <div>
    <div class="content" v-show="isSuccess">
      <section class="contentLeft">
        <div class="contentText">
          <div class="passPower" v-if="detailContentArr.at_status == 1">
            <span>审核中，仅自己可见</span>
            <i @click="editorArticle(detailContentArr)">编辑</i>
          </div>
          <h2>{{detailContentArr.at_title}}</h2>
          <div class="desGroup">
            <div class="desLeft">
              作者:
              <span class="authorText">{{detailContentArr.name}}</span>
              发表于:
              <span>{{detailContentArr.dateline}}</span>
            </div>
            <div class="desRight" v-if="detailContentArr.at_status !== 1">
              浏览量
              <span class="viewNum">{{detailContentArr.at_view}}</span>
              评论
              <span class="commentNum">{{detailContentArr.at_cmtnum}}</span>
              喜欢
              <span>{{detailContentArr.at_zan_count}}</span>
            </div>
          </div>
          <div class="contentDes" v-html="detailContentArr.at_txt"></div>
          <div
            class="rewardWrap"
            v-show="detailContentArr.nav_id == 2 && detailContentArr.at_status != 1"
          >
            <div class="reward" @click="giveCore">
              <a href="javascript:;" class="rewardText">
                <span>赠送乐币</span>
              </a>
            </div>
            <div class="rewardPeop">
              <span>赠送乐币的人</span>
            </div>
            <ul class="rewardAvatar">
              <li v-for="(item , index) in detailContentArr.reward" :key="index">
                <img :src="item.avator" :title="item.describe">
              </li>
            </ul>
          </div>
          <le-core @closeCore="closeCore" @sureGiveCore="sureGiveCore" :isShow="coreW"></le-core>
          <div class="shareGroup" v-if="detailContentArr.at_status !== 1">
            <div
              class="love loveBorder"
              :class="{loveBg: detailContentArr.givezan}"
              @click="loveToggle()"
            >
              <span class="favour" :class="{favourActive: detailContentArr.givezan}">赞</span>
              <span class="peopleNum">{{detailContentArr.at_zan_count}}</span>
            </div>
            <div
              class="collect collectBorder"
              :class="{collectBg: detailContentArr.collect}"
              @click="collectToggle()"
            >
              <span class="collectText" :class="{collectActive: detailContentArr.collect}">收藏</span>
              <span class="peopleNum">{{detailContentArr.at_shoucang_count}}</span>
            </div>
          </div>
          <div class="ueditorContent" v-show="authCookie && detailContentArr.at_status != 1">
            <img :src="detailContentArr.avator" class="commentAvator">
            <ueditor :config="config" class="commentText" ref="ue"></ueditor>
            <div class="commentBtn">
              <!-- <span>小乐相信每位乐粉都是健康向上的好朋友,一起传递正能量,向不文明网络语言说不</span> -->
              <span v-show="fiComWarn">{{warnText}}</span>
              <button @click="publicComment()">发表评论</button>
            </div>
            <div class="commentGroup">
              <div class="commentFilter">
                <div class="autoComment">
                  <h4>{{detailContentArr.at_cmtnum}}条评论</h4>
                  <span @click="lookSelfComment()" :class="{lookSelfActive: comment}">只看我自己</span>
                </div>
                <div class="commentTime">
                  <span
                    v-for="(value, key ,index) in timeHot"
                    :key="index"
                    :class="{time: index==0,activeColor: timeHotIndex==index}"
                    @click="timeHotFn(value , index)"
                  >{{key}}</span>
                </div>
              </div>
              <div class="commentListWrap">
                <comment-page
                  v-for="(item ,index) in detailComArr"
                  :key="index"
                  :commentContent="item"
                  :atId="ArticleId"
                ></comment-page>
              </div>
              <div class="moreComment">
                <a href="javascript:;" @click="lookMoreComment()">
                  <span v-if="!empty">加载更多评论</span>
                  <span v-else class="noMoreComment">暂无更多评论</span>
                </a>
              </div>
              <div class="commentLoading" v-show="loading">
                <div class="avatorImg"></div>
                <ul>
                  <li class="w200"></li>
                  <li class="w690"></li>
                  <li class="w400"></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="loginComment" v-show="!authCookie">
            <a href="https://www.lexue100.com/mk.php?do=login_lexue&callback=mk.php?do=xlsq">登录</a>后才能评论
          </div>
        </div>
      </section>
      <aside class="asideRight">
        <person-information :authorInfo="detailAuthorList" :isDetail="true"></person-information>
        <Aside
          :isDetail="true"
          :articleList="detailArticleList"
          :authorName="detailContentArr.name"
          v-show="detailArticleList.length"
        ></Aside>
      </aside>
      <!--提醒登录-->
      <login-prompt v-show="!isLogin" @closeLayer="closeLogin"></login-prompt>
      <prompt :isShow="rewardW" @confirmFn="confirmFn" @cancelFn="cancelFn">
        <div class="middle">{{rewardWarn}}</div>
      </prompt>
    </div>
    <data-loading v-show="!isSuccess"></data-loading>
  </div>
</template>

<script>
import Ueditor from "_c/common/ueditor.vue";
import CommentPage from "_c/common/comment.vue";
import PersonInformation from "_c/common/personInformation.vue";
import Aside from "_c/common/aside.vue";
import loginPrompt from "../common/loginPrompt.vue";
import LeCore from "_c/common/leCore.vue"; //赠送乐币弹窗
import Prompt from "_c/common/prompt.vue"; //打赏超过5个出现弹出窗口
import DataLoading from "_c/common/dataLoading.vue"; //页面一加载的时候还没请求到数据时总个页面加载动画组件

import { getQueryStringByName } from "_a/js/utils.js";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Detail",
  data() {
    return {
      config: {
        initialFrameWidth: 740,
        initialFrameHeight: 80,
        toolbars: [["emotion"]],
        elementPathEnabled: false, //隐藏元素路径
        wordCount: false //隐藏字数统计
      },
      comment: false, //默认显示全部评论
      timeHot: { 时间: "time", 热度: "hot" },
      timeHotIndex: 0, //默认第一个元素激活
      page: 1, //默认当前页码
      pagenum: 10, //默认当前显示的条数
      order: "time", //默认按时间排序
      types: "all", //默认显示全部评论
      ArticleId: null, //默认atId
      defaultVal: "detail", //默认是详情页评论
      loading: false, //默认加载动画隐藏
      empty: false, //默认没有数据时显示提示信息
      detailComArr: [], //默认详情页评论数据
      type: 1, //默认是点赞文章
      isLogin: true, //是否登入
      fiComWarn: false, //默认一级评论提示信息为隐藏
      warnText: "请输入评论内容", //默认评论提示信息
      coreW: false, //默认赠送乐币窗口隐藏
      commentNum: 0, //默认评论数的条数
      rewardW: false, // 打赏超过五个给出提示弹窗默认是隐藏
      rewardWarn: null, //默认打赏提示文字
      isSuccess: false //页面刚开始隐藏，等到数据加载成功之后再显示
    };
  },

  mounted() {
    this.ArticleId = parseInt(getQueryStringByName("id")); //获取url链接id
    this.detailAuthorInfo(this.ArticleId).then(({ data }) => {
      this.setCurrentUid(data.data.author.uid);
    }); //获取文章详情页右边栏作者内容
    this.detailContentList(this.ArticleId).then(({ data }) => {
      let code = data.code,
        desc = data.desc;
      if (code == 200) {
        window.document.title = this.detailContentArr.at_title; //设置title标题
      } else {
        throw new Error(desc);
      }
    }); //获取文章详情页内容
    this.IndexComment(this.detailCommentArg).then(({ data }) => {
      //获取详情页面评论信息
      let code = data.code,
        desc = data.desc,
        detailComArr = data.data;
      if (code == 200) {
        this.detailComArr = detailComArr.comments;
        this.commentNum = detailComArr.commentnum;
        this.isSuccess = true; //数据请求成功之后再显示页面内容
        // 无评论时  直接显示暂时无更多评论
        if (!this.detailComArr.length) {
          this.empty = true;
        }
      } else {
        throw new Error(desc);
      }
    });

    this.$nextTick(() => {
      let editor = this.$refs.ue;
      editor && editor.initEditor(); //初始化文本编辑器
    });
  },
  computed: {
    ...mapState([
      "detailContentArr",
      "detailAuthorList",
      "detailArticleList",
      "authCookie"
    ]),
    atId() {
      //文章id
      return this.detailContentArr.at_id;
    },
    givezan() {
      //是否点赞
      return this.detailContentArr.givezan;
    },
    collect() {
      //是否收藏
      return this.detailContentArr.collect;
    },
    detailCommentArg() {
      //获取评论
      let obj = {
        at_id: this.ArticleId,
        type: this.types,
        order: this.order,
        page: this.page,
        pagenum: this.pagenum
      };
      return obj;
    },
    zanArg() {
      //点赞传递的参数
      let arg = {
        about_id: this.atId,
        givezan: this.givezan,
        type: this.type
      };
      return arg;
    },
    collectArg() {
      //收藏传递的参数
      let arg = {
        at_id: this.atId,
        collect: this.collect
      };
      return arg;
    }
  },
  methods: {
    ...mapActions([
      "IndexZan",
      "IndexCollect",
      "detailContentList",
      "detailAuthorInfo",
      "IndexComment",
      "articleComment",
      "giveCoreList",
      "sureGiveLeCore"
    ]),
    ...mapMutations(["setCurrentUid", "saveLeCore"]),
    lookSelfComment() {
      //点击只看我自己显示我自己的评论数
      this.comment = !this.comment;
      if (this.comment) {
        this.types = "mine";
      } else {
        this.types = "all";
      }
      this.commentSort();
    },
    timeHotFn(value, index) {
      this.order = value;
      this.commentSort();
      //时间和热度的切换帅选
      this.timeHotIndex = index;
    },
    commentSort() {
      //评论排序公共方法
      this.page = 1; //默认从第一页开始
      this.empty = false; //默认隐藏数据为空提示
      this.IndexComment(this.detailCommentArg).then(({ data }) => {
        //获取详情页面评论信息
        let code = data.code,
          desc = data.desc,
          commentArr = data.data;
        if (code == 200) {
          this.detailComArr = commentArr.comments;
          this.commentNum = commentArr.commentnum;
        } else {
          throw new Error(desc);
        }
      });
    },
    loveToggle() {
      if (!this.authCookie) {
        this.isLogin = false;
      } else {
        //点击赞切换
        this.IndexZan(this.zanArg).then(({ data }) => {
          let code = data.code,
            desc = data.desc,
            zanArr = data.data;
          if (code == 200) {
            this.detailContentArr.givezan = zanArr.givezan;
            this.detailContentArr.at_zan_count = zanArr.zancount;
          } else {
            throw new Error(desc);
          }
        });
      }
    },
    collectToggle() {
      if (!this.authCookie) {
        this.isLogin = false;
      } else {
        //点击收藏切换
        this.IndexCollect(this.collectArg).then(({ data }) => {
          let code = data.code,
            desc = data.desc,
            collectArr = data.data;
          if (code == 200) {
            this.detailContentArr.collect = collectArr.collect;
            this.detailContentArr.at_shoucang_count =
              collectArr.at_shoucang_count;
          } else {
            throw new Error(desc);
          }
        });
      }
    },
    publicComment() {
      if (!this.authCookie) {
        this.isLogin = false;
      } else {
        //发表评论
        let editor = this.$refs.ue;
        let editorCon = editor.getContent();
        if (!editorCon) {
          this.fiComWarn = true;
          this.warnText = "请输入评论内容";
          return;
        }
        let obj = {
          at_id: this.ArticleId,
          ac_txt: editorCon,
          ac_id: 0
        };
        this.articleComment(obj).then(({ data }) => {
          //发表评论调用的方法
          let code = data.code,
            desc = data.desc,
            commentArr = data.data;
          if (code == 200) {
            editor.setContent(""); //发表评论成功后把里面的内容设置为空
            this.detailContentArr.at_cmtnum = commentArr.commcount; // 给评论赋新值
            this.detailComArr.unshift(commentArr);
            this.fiComWarn = false;
          }
          if (code == 205) {
            //为屏蔽发言
            this.fiComWarn = true;
            this.warnText = desc;
          }
        });
      }
    },
    lookMoreComment() {
      //查看更多评论
      if (!this.loading) {
        if (this.empty) {
          return;
        }
        this.page += 1;
        this.loading = true;
        this.IndexComment(this.detailCommentArg).then(({ data }) => {
          let code = data.code,
            desc = data.desc,
            detailComArr = data.data,
            detailComLength = detailComArr.comments.length;
          if (code == 200) {
            if (detailComLength < this.pagenum && detailComLength >= 0) {
              this.detailComArr = this.detailComArr.concat(
                detailComArr.comments
              );
              this.loading = false;
              this.empty = true;
            } else {
              this.detailComArr = this.detailComArr.concat(
                detailComArr.comments
              );
              this.loading = false;
              this.empty = false;
            }
          } else {
            throw new Error(desc);
          }
        });
      }
    },
    /**
     *@description 关闭提示登陆弹窗
     */
    closeLogin() {
      this.isLogin = true;
    },
    /**
     *@description 展开提示登陆弹窗
     */
    showLogin() {
      this.isLogin = false;
    },
    giveCore() {
      //点击赠送乐币
      if (!this.authCookie) {
        this.isLogin = false;
        return;
      }
      this.coreW = true;
      let at_id = this.ArticleId;
      this.giveCoreList(at_id);
    },
    closeCore() {
      //关闭赠送乐币窗口
      this.coreW = false;
    },
    sureGiveCore(coin) {
      //确认赠送乐币
      let obj = {
        at_id: this.ArticleId,
        coin
      };
      this.sureGiveLeCore(obj).then(({ data }) => {
        let code = data.code,
          desc = data.desc,
          giveCoinPeo = data.data;
        if (code == 200) {
          this.closeCore();
          this.saveLeCore(giveCoinPeo); //赠送成功之后插入到detailContentArr.reward 数组里面
        }
        if (code == 207) {
          this.closeCore();
          this.rewardW = true;
          this.rewardWarn = desc;
        }
      });
    },
    editorArticle(content) {
      //编辑文章
      window.location.href = "mk.php?do=xlsq" + "#/publishArticle"; //跳到提笔就写
      let conStringfy = JSON.stringify(content);
      window.localStorage.setItem("detailCon", conStringfy);
    },
    confirmFn() {
      //点击确定关闭提示弹窗
      this.rewardW = false;
    },
    cancelFn() {
      //点击取消关闭提示弹窗
      this.confirmFn();
    }
  },
  components: {
    Ueditor,
    CommentPage,
    PersonInformation,
    Aside,
    loginPrompt,
    LeCore,
    Prompt,
    DataLoading
  }
};
</script>

<style lang="scss" scoped>
@import "_a/scss/variable.scss";
@import "_a/scss/mixin.scss";
.content {
  font-family: "PingFang-SC-Bold";
  width: 1200px;
  height: auto;
  overflow: hidden;
  .contentLeft {
    float: left;
    width: 870px;
    background-color: $color-background-f;
    height: auto;
    border-radius: 4px;
  }
  .contentText {
    padding: 40px 40px 50px;
    .passPower {
      margin-bottom: 20px;
      overflow: auto;
      span {
        display: inline-block;
        font-family: "PingFang-SC-Medium";
        font-size: 14px;
        width: 150px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: $color-background-c;
        color: $color-background-f;
        border-radius: 4px;
      }
      i {
        float: right;
        width: 24px;
        line-height: 30px;
        padding-left: 17px;
        font-family: "PingFang-SC-Medium";
        font-style: normal;
        font-size: 12px;
        cursor: pointer;
        color: $color-origin-c;
        background: url("../../assets/img/editor.png") no-repeat left center;
      }
    }
    h2 {
      font-family: "PingFang-SC-Bold";
      font-weight: bold;
      font-size: 28px;
      color: $color-text;
    }
  }
  .desGroup {
    margin: 20px 0px;
    font-family: "PingFang-SC-Medium";
    font-size: $font-size-medium;
    color: $color-gray;
    overflow: hidden;
    line-height: 14px;
    span {
      display: inline-block;
    }
  }
  .desLeft {
    float: left;
    .authorText {
      margin-right: 20px;
    }
  }
  .desRight {
    float: right;
    .viewNum,
    .commentNum {
      margin-right: 20px;
    }
  }
  .contentDes {
    padding: 0 38px;
    overflow: hidden;
  }
  .image img {
    max-width: 100% !important;
  }
  .rewardWrap {
    margin-top: 80px;
  }
  .reward {
    position: relative;
    height: 80px;
    width: 80px;
    border-radius: 50%;
    background-color: $color-origin;
    margin: auto;
    font-size: 0;
    cursor: pointer;
    .rewardText {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
      width: 41px;
      height: 44px;
      line-height: 22px;
    }

    span {
      font-family: "PingFang-SC-Medium";
      font-size: 20px;
      color: $color-background-f;
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  .rewardPeop {
    margin: 36px 0 20px;
    span {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium;
      color: $color-gray-a;
      margin: 0 18px;
    }
  }
  .rewardPeop::before,
  .rewardPeop::after {
    content: "";
    display: inline-block;
    width: 335px;
    height: 1px;
    background-color: $color-background-a;
    vertical-align: middle;
  }
  .rewardAvatar {
    margin: 0 auto;
    text-align: center;
    line-height: 60px;
    li {
      display: inline-block;
      width: 56px;
      height: 40px;
      text-align: center;
      img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: auto;
      }
    }
  }
  .shareGroup {
    margin: 40px 0;
    text-align: right;
  }
  .love {
    margin-right: 30px;
  }
  .love,
  .collect {
    display: inline-block;
    width: 150px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 20px;
    cursor: pointer;
    font-size: $font-size-zero;
    span {
      display: inline-block;
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium-x;
      color: $color-background-g;
      vertical-align: middle;
    }
    .favour {
      padding-left: 23px;
      background: url("../../assets/img/love_border_r.png") no-repeat 0 center;
      background-size: 18px 18px;
    }
    .favourActive {
      background: url("../../assets/img/love_full.png") no-repeat 0 center;
    }
    .collectText {
      padding-left: 23px;
      background: url("../../assets/img/collect_border_b.png") no-repeat 0
        center;
      background-size: 18px 18px;
    }
    .collectActive {
      background: url("../../assets/img/collect_full.png") no-repeat 0 center;
    }
    .favour:after,
    .collectText:after {
      content: "";
      border-right: 1px solid;
      margin-left: 16px;
    }
    .peopleNum {
      width: 50px;
      @include no-wrap;
    }
  }
  .loveBorder {
    border: 1px solid $color-background-g;
  }
  .loveBg {
    background-color: $color-background-g;
    border: 1px solid $color-background-g;
    span {
      color: $color-background-f;
    }
  }
  .collectBorder {
    border: 1px solid $color-background-l;
    span {
      color: $color-background-l;
    }
  }
  .collectBg {
    background-color: $color-background-l;
    border: 1px solid $color-background-l;
    span {
      color: $color-background-f;
    }
  }
  .ueditorContent {
    overflow: hidden;
    .commentAvator {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .commentText {
      float: right;
      margin-bottom: 10px;
    }
    .commentBtn {
      height: 40px;
      line-height: 40px;
      width: 100%;
      overflow: hidden;
      margin-bottom: 40px;
      span {
        display: inline-block;
        font-family: "PingFang-SC-Medium";
        font-size: 12px;
        padding-left: 19px;
        margin-left: 50px;
        color: #ff5539;
        background: url("../../assets/img/warn.png") no-repeat 0 center;
        background-size: 12px 12px;
      }
      button {
        float: right;
        font-family: "PingFang-SC-Medium";
        font-size: $font-size-medium;
        color: $color-background-f;
        width: 100px;
        height: 34px;
        background-color: $color-origin;
        position: relative;
        top: 3px;
        border-radius: 4px;
        outline: none;
        border: none;
      }
    }
    .commentGroup {
      height: 100%;
      overflow: hidden;
    }
    .commentFilter {
      width: 100%;
      height: 26px;
    }
    .autoComment {
      float: left;
      color: $color-text;
      h4 {
        float: left;
        font-family: "PingFang-SC-Bold";
        font-weight: bold;
        font-size: $font-size-large;
        margin-right: 12px;
      }
      span {
        display: inline-block;
        font-family: "PingFang-SC-Medium";
        font-size: $font-size-small;
        width: 82px;
        height: 22px;
        line-height: 22px;
        border: 1px solid $color-background-c;
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
      }
      .lookSelfActive {
        background-color: $color-origin;
        color: $color-background-f;
        border: none;
      }
    }
    .commentTime {
      float: right;
      span {
        font-family: "PingFang-SC-Medium";
        font-size: $font-size-small;
        color: $color-gray;
        cursor: pointer;
      }
      .time {
        margin-right: 15px;
      }
      .activeColor {
        color: $color-text;
      }
    }
  }
  .loginComment {
    font-family: "PingFang-SC-Medium";
    font-size: 14px;
    color: $color-gray;
    width: 100%;
    height: 70px;
    line-height: 70px;
    text-align: center;
    background-color: $color-background-b;
    border: 1px solid $color-background-a;
    border-radius: 4px;
    a {
      color: $color-origin-c;
      outline: none;
    }
  }
  .commentListWrap {
    margin-top: 30px;
  }
  .asideRight {
    float: right;
    width: 300px;
    height: auto;
  }

  .moreComment {
    height: 74px;
    line-height: 74px;
    border-top: 1px solid $color-background-a;
    text-align: center;
    clear: both;
    a {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium;
      color: $color-origin-c;
      outline: none;
    }
    .noMoreComment {
      color: $color-gray;
    }
  }
  .commentLoading {
    margin: 30px 0;
    .avatorImg {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: $color-background-e;
      margin-right: 10px;
      animation: ColorOpacity 1s infinite;
    }
    ul {
      overflow: hidden;
    }
    li {
      height: 12px;
      background-color: $color-background-e;
      animation: ColorOpacity 1s infinite;
    }
    .w200 {
      width: 200px;
    }
    .w690 {
      width: 690px;
      margin: 20px 0;
    }
    .w400 {
      width: 400px;
    }
  }
  @keyframes ColorOpacity {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>