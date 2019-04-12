<template>
  <li :id="'content_'+index" @mouseover="editorBtnShow()" @mouseout="editorBtnHide()">
    <div class="articleWrapper">
      <div class="articleLeft">
        <img :src="content.avator" alt="头像" @click="otherCenter(content)">
        <div class="articleContent" :class="{fullText: !comment}">
          <a :href="'mk.php?do=article2&id='+content.at_id" target="_blank">
            <h4>{{content.at_title}}</h4>
          </a>
          <div class="authorInstroduce">
            <span class="author">{{content.name}}</span>
            <span>
              <time>{{content.at_dateline}}</time>
              {{content.att_title}}
            </span>
          </div>
          <div class="paragraphText" v-if="comment">
            <p>
              {{content.at_desc | descText}}
              <span
                class="lookAll"
                @click="showFullText"
                v-if="!content.at_status"
              >查看全部</span>
            </p>
          </div>
          <div class="articlList" v-html="content.at_txt" v-else></div>
        </div>
      </div>
      <div class="articleRight" v-show="comment">
        <a :href="'mk.php?do=article2&id='+content.at_id" target="_blank">
          <img :src="content.at_pic" v-show="content.at_pic" alt="封面">
        </a>
      </div>
    </div>

    <div v-if="!content.is_show">
      <evalute-group
        :closeFlag="comment"
        :content="content"
        :index="index"
        @closeContentFn="closeContentFn"
        @evaluteFn="evaluteFn(content)"
        @changeZanNum="changeZanNum"
        @changeColNum="changeColNum"
      ></evalute-group>
      <div class="commentWrapper" ref="commentWrapper" v-show="evalute">
        <div class="commentEditor" v-if="authCookie">
          <ueditor ref="ue"></ueditor>
          <div class="submitBtn">
            <span v-show="firComWarn">{{warnText}}</span>
            <button @click="publicComment(content)">发表评论</button>
          </div>
        </div>
        <div class="loginComment" v-else>
          <a href="https://www.lexue100.com/mk.php?do=login_lexue">登入</a>后才能评论
        </div>
        <div class="commentListWrap">
          <comment-page
            v-for="(item , index) in commentsArr"
            :key="index"
            :commentContent="item"
            :config="config"
            :atId="atId"
          ></comment-page>
        </div>
        <div class="moreComment">
          <a href="javascript:;" @click="lookMoreComment()">
            <span v-if="!empty">加载更多评论</span>
            <span v-else class="noMoreComment">暂无更多评论</span>
          </a>
          <a :href="'#content_'+ index" @click="closeEvaluteFn()" class="closeComment">收起评论</a>
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
    <div class="passPower" v-else>
      <span>审核中,仅自己可见</span>
      <div class="editorArticle" v-show="editorDelete">
        <i class="iconEditor" @click="editorArticle(content)">编辑</i>
        <i class="iconDelete" @click="deleteArticle(content)">删除</i>
      </div>
    </div>
    <prompt :isShow="promptWin" @confirmFn="confirmFn" @cancelFn="cancelFn">
      <div class="middle delMiddle">确定要删除这篇文章吗?</div>
    </prompt>

    <div class="offLine" v-show="content.is_ban">
      <img src="../../assets/img/off_line.png" alt="已下线">
    </div>
  </li>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import EvaluteGroup from "./evaluteGroup.vue"; //评价 赞 收藏 预览
import Ueditor from "./ueditor.vue"; //编辑器
import CommentPage from "./comment.vue"; //回复评论
import Prompt from "./prompt.vue"; //提示框
export default {
  name: "ArticleList",
  data() {
    return {
      comment: true, //默认文章列表标题显示
      evalute: false, //默认评价时隐藏
      atId: null, //默认atId为空
      type: "all", //默认全部评论
      order: "time", //默认按时间排序
      page: 1, //默认一页
      pagenum: 10, //默认每页10条
      limit: 10, //默认每10条为一页
      config: {
        //默认编辑器配置
        initialFrameWidth: 690,
        initialFrameHeight: 80,
        toolbars: [["emotion"]]
      },
      commentsArr: [], //默认评论数据
      commentsNum: 0, //默认评论总条数
      loading: false, //默认加载动画隐藏
      empty: false, //默认显示加载完图片
      editor: null, //默认文本编辑器初始值
      editorDelete: false, //默认审核中，仅自己可见，编辑删除按钮隐藏
      promptWin: false, //审核中，仅自己可见 默认点击删除时弹出的弹出层隐藏
      firComWarn: false, // 默认一级评论提示信息为隐藏
      warnText: "请输入评论内容" //默认评论提示信息
    };
  },
  props: {
    content: {
      //接受的每条文章列表数据
      type: Object
    },
    index: {
      //接受的每条文章列表索引
      type: Number
    }
  },
  /**
   * @description 文章内容更新时 1.收起全文/展开全文 控制属性 重新设置,2.文章评价收起
   */
  watch: {
    content() {
      this.comment = true;
      this.evalute = false;
    }
  },
  filters: {
    descText: function(value) {
      if (value) {
        return value.substr(0, 95); //截取120个字符避免字符过多把查看全部挤到外面看不到
      } else {
        return "";
      }
    }
  },
  computed: {
    ...mapState(["currentUid", "studenCenterList", "user", "authCookie"]),
    commentArg() {
      //获取评论数据参数
      let arg = {
        at_id: this.atId,
        type: this.type,
        order: this.order,
        page: this.page,
        pagenum: this.pagenum
      };
      return arg;
    }
  },
  methods: {
    ...mapMutations(["setCurrentUid", "delStuCenter"]),
    ...mapActions(["IndexComment", "articleComment", "deleteArticleList"]),
    showFullText() {
      //文章列表内容的显示隐藏
      this.comment = !this.comment;
    },
    closeContentFn() {
      //收起全文
      this.comment = true;
    },
    evaluteFn(content) {
      //评论方法
      this.evalute = !this.evalute;
      this.editor = this.$refs.ue;
      if (this.evalute) {
        this.editor.initEditor(); //格式化文本编辑器
        //获取评论列表信息
        this.atId = content.at_id; //把文章id赋值为atId
        this.loading = true; //加载动画显示；
        this.page = 1; //从第一条评论开始；
        this.empty = false; //加载更多评论显示
        this.firComWarn = false; //当重新打开的时候评论提示信息隐藏
        this.IndexComment(this.commentArg).then(({ data }) => {
          let code = data.code,
            desc = data.desc,
            commentsArr = data.data;
          if (code == 200) {
            this.commentsArr = commentsArr.comments;
            this.commentsNum = commentsArr.commentnum;
            // 评论已加载完 不再显示 加载更多评论
            if (this.commentsArr.length == this.commentsNum) {
              this.loading = false;
              this.empty = true;
            }
          } else {
            throw new Error(desc);
          }
        });
        this.loading = false; //数据加载完成之后 加载动画隐藏
      }
    },
    closeEvaluteFn() {
      //收起评论
      this.evalute = false;
    },
    otherCenter(content) {
      this.setCurrentUid(content.uid);
      if (content.uid == this.user.uid) {
        this.$router.push({ path: "/studentCenter" });
      } else {
        this.$router.push({ path: `/otherCenter/${content.uid}` }); //看其他人的个人中心执行跳转页面
      }
    },
    publicComment(content) {
      //发表评论
      let editorCon = this.editor.getContent();
      if (!editorCon) {
        this.firComWarn = true; //没有输入内容时显示评论提示信息
        this.warnText = "请输入评论内容";
        return;
      }
      let obj = {
        at_id: content.at_id,
        ac_txt: editorCon,
        ac_id: 0
      };
      this.articleComment(obj).then(({ data }) => {
        //发表评论调用的方法
        let code = data.code,
          desc = data.desc,
          commentArr = data.data;
        if (code == 200) {
          this.editor.setContent(""); //发表评论成功后把里面的内容设置为空
          this.content.at_cmtnum = commentArr.commcount; // 给评论赋新值
          this.commentsArr.unshift(commentArr);
          this.firComWarn = false; //有评论内容时隐藏评论提示信息
        }
        if (code == 205) {
          this.firComWarn = true;
          this.warnText = desc;
        }
      });
    },
    editorArticle(content) {
      //编辑文章列表
      // this.$router.push({ name: "PublishArticle", params: content });
      this.$router.push({path: "publishArticle"});
      let conStringfy = JSON.stringify(content);
      window.localStorage.setItem("detailCon", conStringfy);
    },
    lookMoreComment() {
      //查看更多评论
      if (!this.loading) {
        if (this.empty) {
          return;
        }
        this.page += 1;
        this.loading = true;
        this.IndexComment(this.commentArg).then(({ data }) => {
          let code = data.code,
            desc = data.desc,
            commentsArr = data.data,
            commentLength = commentsArr.comments.length;
          if (code == 200) {
            if (commentLength < this.pagenum && commentLength >= 0) {
              this.commentsArr = this.commentsArr.concat(commentsArr.comments);
              this.loading = false;
              this.empty = true;
            } else {
              this.commentsArr = this.commentsArr.concat(commentsArr.comments);
              this.loading = false;
              this.empty = false;
            }
          } else {
            throw new Error(desc);
          }
        });
      }
    },
    deleteArticle() {
      //删除文章
      this.promptWin = true;
    },
    confirmFn() {
      //点击确定删除文章
      let at_id = this.content.at_id;
      this.deleteArticleList(at_id).then(({ data }) => {
        let code = data.code,
          desc = data.desc;
        if (code == 200) {
          this.delStuCenter(this.content);
          this.promptWin = false;
          this.$emit("delSelfArticle");
        }
      });
    },
    cancelFn() {
      //点击取消时关闭弹出窗
      this.promptWin = false;
    },
    editorBtnShow() {
      //鼠标移入时显示审核中的编辑、删除按钮
      this.editorDelete = true;
    },
    editorBtnHide() {
      //鼠标移出时隐藏审核中的编辑、删除按钮
      this.editorDelete = false;
    },
    changeZanNum(zanNum) {
      //个人中心改变点赞文章数量
      this.$emit("chPerCenZan", zanNum);
    },
    changeColNum(colleNum) {
      //个人中心改变收藏文章数量
      this.$emit("chPerCenCollect", colleNum);
    }
  },
  components: {
    EvaluteGroup,
    Ueditor,
    CommentPage,
    Prompt
  }
};
</script>


<style lang="scss" scoped>
@import "_a/scss/variable.scss";
li {
  position: relative;
  width: 810px;
  border-bottom: 1px solid #e5e5e5;
}
.articleWrapper {
  padding: 30px 0 20px;
  clear: both;
  overflow: auto;
}
.articleLeft {
  float: left;
  img {
    float: left;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 18px;
    cursor: pointer;
  }
}
.fullContentText {
  width: 810px;
}
.articlList {
  width: 100%;
  height: 100%;
}
.articleContent {
  width: 480px;
  height: 100%;
  overflow: hidden;
  a {
    text-decoration: none;
  }
  h4 {
    font-family: "PingFang-SC-Bold";
    font-weight: bold;
    font-size: $font-size-large-m;
    color: $color-text;
  }
  .authorInstroduce {
    margin: 8px 0 16px;
    font-size: $font-size-zero;
    .author {
      color: $color-origin;
      margin-right: 10px;
    }
    span {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-small;
      color: $color-gray;
      line-height: 13px;
      display: inline-block;
      overflow: hidden;
    }
    time {
      display: inline-block;
      line-height: 13px;
    }
    time:after {
      content: "";
      padding: 0 2px;
      margin-right: 4px;
      border-right: 1px solid;
    }
  }
  .paragraphText {
    width: 100%;
    height: 72px;
    p {
      font-family: "PingFang-SC-regular";
      font-size: $font-size-medium;
      color: $color-text;
      width: 100%;
      height: 72px;
      margin: 0;
      line-height: 25px;
      overflow: hidden;
      text-align: justify;
    }
    .lookAll {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium;
      color: $color-origin-c;
      cursor: pointer;
    }
  }
}
.fullText {
  width: 740px;
}
.articleRight {
  float: right;
  &:hover {
    cursor: pointer;
  }
  img {
    display: inline-block;
    width: 220px;
    height: 140px;
    vertical-align: middle;
  }
}
.commentWrapper {
  padding-left: 68px;
}
.loginComment {
  font-family: "PingFang-SC-Medium";
  font-size: 14px;
  color: $color-gray;
  width: 740px;
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
.commentEditor {
  margin-bottom: 30px;
}
.submitBtn {
  margin-top: 10px;
  overflow: hidden;
  span {
    display: inline-block;
    font-family: "PingFang-SC-Medium";
    font-size: 12px;
    padding-left: 19px;
    color: #ff5539;
    background: url("../../assets/img/warn.png") no-repeat 0 center;
    background-size: 12px 12px;
    vertical-align: -4px;
  }
  button {
    float: right;
    font-family: "PingFang-SC-Medium";
    font-size: $font-size-medium;
    outline: 0;
    border: none;
    width: 100px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    background-color: $color-origin;
    color: $color-background-f;
    border-radius: 4px;
    cursor: pointer;
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

.offLine {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  img {
    position: absolute;
    top: 10px;
    left: 490px;
    width: 60px;
    height: 60px;
  }
}

.moreComment {
  height: 74px;
  line-height: 74px;
  border-top: 1px solid $color-background-a;
  text-align: center;
  clear: both;
  margin-top: 30px;
  a {
    font-family: "PingFang-SC-Medium";
    font-size: $font-size-medium;
    color: $color-origin-c;
  }
  .noMoreComment {
    color: $color-gray;
  }
}
.closeComment {
  float: right;
}

.passPower {
  height: 30px;
  margin: 0 0 30px 68px;
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

  .editorArticle {
    float: right;
  }
  i {
    display: inline-block;
    width: 24px;
    padding-left: 17px;
    font-family: "PingFang-SC-Medium";
    font-style: normal;
    font-size: 12px;
    vertical-align: middle;
    cursor: pointer;
  }
  .iconEditor {
    color: $color-origin-c;
    background: url("../../assets/img/editor.png") no-repeat left center;
    margin-right: 30px;
  }
  .iconDelete {
    color: $color-background-r;
    background: url("../../assets/img/delete.png") no-repeat left center;
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
</style>

