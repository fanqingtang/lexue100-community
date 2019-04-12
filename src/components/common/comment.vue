<template>
  <div class="commentContent">
    <img :src="commentContent.avator" alt="头像" class="avator">
    <div class="commentArea">
      <h4>{{commentContent.name}}</h4>
      <time>{{commentContent.ac_dateline}}</time>
      <p v-html="commentContent.ac_txt" class="commentHtml"></p>
      <div class="commentReply">
        <span
          class="number"
          :class="{favourActive:commentContent.givezan}"
          @click="thumbUp()"
        >{{commentContent.ac_zan_count}}</span>
        <span @click="replyFn()">回复</span>
      </div>
      <div ref="reply" class="editorContent">
        <ueditor-page ref="ue" :config="config"></ueditor-page>
        <div class="submitBtn">
          <span class="warn" v-show="seComWarn">{{warnText}}</span>
          <div class="btnGroup">
            <span @click="cancel()">取消</span>
            <button @click="replyDownComment()">发送</button>
          </div>
        </div>
      </div>
      <div class="commentRecord" v-if="secondComment && secondComment.length">
        <ul>
          <li v-for="(item , index) in secondComment" :key="index">
            <img :src="item.avator" alt="头像" class="avator">
            <div class="commentArea">
              <h4>{{item.name}}</h4>
              <time>{{item.ac_dateline}}</time>
              <p v-html="item.ac_txt" class="commentHtml"></p>
            </div>
          </li>
        </ul>
        <div class="commentNum">
          <span>没有更多回复</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UeditorPage from "_c/common/ueditor.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "Comment",
  data() {
    return {
      ueditorInited: false, // UEditor 是否初始化过的标志
      getEditor: null, //获取ueditor对象
      type: 5, //默认t为评论点赞
      seComWarn: false, //默认评论提示信息隐藏
      warnText: "请输入评论内容" //默认评论提示信息
    };
  },
  props: {
    config: {
      //ueditor配置信息
      type: Object
    },
    commentContent: {
      //评论数据
      type: Object
    },
    atId: {
      //获取文章id
      type: Number
    }
  },
  computed: {
    secondComment() {
      //二级评论数组
      return this.commentContent.comment;
    },
    zanArg() {
      //评论区点赞参数
      let arg = {
        about_id: this.commentContent.ac_id,
        givezan: this.commentContent.givezan,
        type: this.type
      };
      return arg;
    }
  },
  methods: {
    ...mapActions(["secondArticleComment", "IndexZan"]),
    replyFn() {
      if (!this.ueditorInited) {
        this.ueditorInited = true;
        this.getEditor = this.$refs.ue;
        this.getEditor.initEditor();
      }
      //回复展开收缩文本框的高度
      $(this.$refs.reply).slideToggle("slow");
      this.seComWarn = false;
    },
    thumbUp() {
      //点赞
      this.IndexZan(this.zanArg).then(({ data }) => {
        let code = data.code,
          desc = data.desc,
          zanArr = data.data;
        if (code == 200) {
          this.commentContent.givezan = zanArr.givezan;
          this.commentContent.ac_zan_count = zanArr.zancount;
        } else {
          throw new Error(desc);
        }
      });
    },
    replyDownComment() {
      //回复上级评论
      let getContent = this.getEditor.getContent();
      if (!getContent) {
        this.seComWarn = true;
        this.warnText = "请输入评论内容";
        return;
      }
      let obj = {
        at_id: this.atId,
        ac_id: this.commentContent.ac_id,
        ac_txt: getContent
      };
      this.secondArticleComment(obj).then(({ data }) => {
        let code = data.code,
          desc = data.desc,
          commentArr = data.data;
        if (code == 200) {
          this.secondComment.unshift(commentArr);
          this.getEditor.setContent("");
          this.seComWarn = false;
        }
        if (code == 205) {
          this.seComWarn = true;
          this.warnText = desc;
        }
      });
    },
    cancel() {
      //取消
      this.replyFn();
      this.getEditor.setContent("");
    }
  },
  components: {
    UeditorPage
  }
};
</script>

<style lang="scss" scoped>
@import "_a/scss/variable.scss";
.commentContent {
  width: 100%;
  height: 100%;
  border-top: 1px solid $color-background-a;
  padding-top: 26px;
  margin-top: 30px;
  .avator {
    float: left;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .commentArea {
    overflow: hidden;
    h4 {
      font-family: "PingFang-SC-Bold";
      font-weight: bold;
      font-size: $font-size-medium;
      color: $color-text;
    }
    time {
      font-family: "PingFang-SC-Bold";
      font-size: $font-size-small;
      color: $color-gray;
      margin-top: 14px;
    }
    .commentHtml {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium-x;
      color: $color-gray-a;
      text-align: justify;
      margin: 20px 0;
      line-height: 1.5;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
  .commentReply {
    margin-bottom: 22px;
    font-size: $font-size-zero;
    span {
      display: inline-block;
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium;
      color: $color-gray;
      vertical-align: middle;
      cursor: pointer;
    }
    .number {
      padding-left: 17px;
      background: url("../../assets/img/thumb_gray.png") no-repeat left center;
      background-size: 16px 16px;
      margin-right: 40px;
    }
    .favourActive {
      background: url("../../assets/img/thumb.png") no-repeat left center;
      color: $color-origin;
    }
  }
  .editorContent {
    display: none;
    margin-bottom: 20px;
  }
  .submitBtn {
    font-family: "PingFang-SC-Medium";
    font-size: $font-size-medium;
    margin-top: 10px;
    overflow: hidden;
    .warn {
      display: inline-block;
      font-family: "PingFang-SC-Medium";
      font-size: 12px;
      padding-left: 19px;
      color: #ff5539;
      background: url("../../assets/img/warn.png") no-repeat 0 center;
      background-size: 12px 12px;
      vertical-align: -4px;
    }
    .btnGroup {
      float: right;
    }
    span {
      display: inline-block;
      color: $color-text;
      margin-right: 30px;
      cursor: pointer;
    }
    button {
      outline: none;
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
  .commentRecord {
    background-color: $color-background-b;
    padding: 0 20px;
    border-radius: 4px;
    li {
      border-bottom: 1px solid $color-background-a;
      padding-top: 20px;
    }
  }
  .commentNum {
    height: 54px;
    line-height: 54px;
    text-align: center;
    span {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium;
      color: $color-gray;
    }
  }
}
</style>