<template>
  <div class="myFansWrap">
    <header class="title">发表乐粉文章</header>
    <main>
      <div class="titleWrap">
        <input type="text" placeholder="请输入标题" v-model="articleTitle">
        <span class="warn" v-show="tipTitle">请输入标题</span>
      </div>
      <div class="coverWrap">
        <span class="itemsName fLeft">上传封面</span>
        <div class="coverUpload" @click="uploadCoverFn()" v-if="coverImg">
          <img src="../../assets/img/upload.png" alt>
          <span class="addImgTxt">添加图片</span>
        </div>
        <div class="coverSize" v-else>
          <img :src="modelSrc" alt="封面">
          <span @click="changeCover()">修改封面</span>
        </div>
        <span class="warn" v-show="tipCover">请上传封面</span>
      </div>
      <div class="sortWrap">
        <span class="itemsName fLeft">选择栏目</span>
        <div class="fLeft sortsButton">
          <ul>
            <li
              v-for="(item , index) in columnTypes"
              :key="item.tid"
              :class="{current: subjectIndex === index}"
              @click="selectSubActive(item,index)"
            >{{item.title}}</li>
          </ul>
        </div>
      </div>
      <!--编辑器位置 str-->
      <div class="toolbar-container"></div>
      <div id="editor"></div>
      <!--编辑器位置 end--->
      <span class="warn" v-show="tipContent">请输入正文</span>
      <div class="publicArticle">
        <button class="publish" @click="publicArticle()">发布文章</button>
        <button class="cancel" @click="cancelPublic()">取消发布</button>
      </div>
    </main>
    <!--点击添加图片 弹出选择上传封面str-->
    <div class="layer" v-show="layer"></div>
    <div class="leFenPopUp" v-show="isUpload">
      <div class="leFenWrap">
        <header>
          <span>上传封面</span>
          <button class="close" @click="closeUploadFn()"></button>
        </header>
        <main>
          <div class="addImg">
            <div class="addIcon">
              <input type="file" class="inputFile" @change="selectUploadFn($event)" ref="inputFile">
            </div>
            <span class="addImgTxt">添加图片</span>
            <p>只支持gif，jpg，png 建议尺寸为440X280</p>
          </div>
        </main>
      </div>
    </div>
    <!--点击添加图片 弹出选择上传封面end-->
    <!-- 上传封面裁切好的弹窗start-->
    <div class="leFenWrap cropperH" v-show="isCropper">
      <header>
        <span>上传封面</span>
        <button class="close" @click="closeCropperFn()"></button>
      </header>
      <main>
        <div class="coverImg">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            :high="option.high"
          ></vue-cropper>
        </div>
        <div class="operation">
          <span @click="repeatUpload()">重新上传</span>
          <div class="controllSize">
            <i class="reduce" @click="changeScale(-1)"></i>
            <i class="add" @click="changeScale(1)"></i>
          </div>
        </div>
      </main>
      <footer>
        <button class="footerCancel" @click="closeCropperFn()">关闭</button>
        <button class="determine" @click="cropperUploadFn()">确定</button>
      </footer>
    </div>
    <!-- 上传封面裁切好的弹窗end-->
    <login-prompt v-show="!isLogin" @closeLayer="closeLogin"></login-prompt>

    <!-- 上传图片提示上传的格式start -->
    <prompt :isShow="promptWin" @confirmFn="confirmFn" @cancelFn="cancelFn">
      <div class="middle delMiddle">图片类型必须是.gif,jpg,png中的一种</div>
    </prompt>
    <!-- 上传图片提示上传的格式end -->
  </div>
</template>
<script>
import UeditorPage from "_c/common/ueditor.vue";
import loginPrompt from "_c/common/loginPrompt.vue";
import Prompt from "_c/common/prompt.vue";

import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import "@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn"; //ckeditor汉化包


import { mapActions, mapState } from "vuex";
export default {
  name: "PublishArticle",
  data() {
    return {
      isUpload: false, //上传封面弹窗
      isCropper: false, //裁剪封面弹窗
      layer: false, //默认遮罩层隐藏
      coverImg: true, // 默认封面图片隐藏
      subjectIndex: 0, //默认选择栏目的第一项
      tId: 0, //默认选择栏目id
      atId: 0, //默认文章id
      modelSrc: "",
      editorContent: {}, //默认编辑内容
      option: {
        img: "", //裁切图片的地址
        size: 1, //裁剪生成图片的质量
        full: false, //是否输出原图比例的截图
        outputType: "png", //裁剪生成图片的格式
        canMove: true, //图片是否允许滚轮缩放
        fixedBox: true, //固定截图框大小，不允许改变
        original: false, //上传图片按照原始比例渲染
        canMoveBox: false, //截图框能否拖动
        autoCrop: true, //是否默认生成截图框
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 440, //默认生成截图框宽度
        autoCropHeight: 280, // 默认生成截图框的高度
        centerBox: false, //截图框是否被限制在图片里面
        high: true //是否按设备的dpr输出等比例图片
      },
      show: true,
      columnTypes: [], //默认选择栏目数据
      articleTitle: "", //默认文章标题为空
      tipTitle: false, //默认标题提示信息为隐藏
      tipCover: false, //默认封面提示信息为隐藏
      tipContent: false, //默认正文提示信息为隐藏
      isLogin: true, //是否登入
      promptWin: false  //上传图片格式框默认是隐藏
    };
  },
  computed: {
    ...mapState(["authCookie"])
  },
  methods: {
    ...mapActions(["selectColumn", "uploadArticle"]),
    uploadCoverFn() {
      //点击添加图片弹出上传封面
      this.layer = true;
      this.isUpload = true;
    },
    closeUploadFn() {
      //点击关闭弹窗
      this.layer = false;
      this.isUpload = false;
    },
    closeCropperFn() {
      //关闭裁切弹窗
      this.layer = false;
      this.isCropper = false;
    },
    selectUploadFn(e, num) {
      //选择上传图片后弹窗裁剪窗口
      this.isUpload = false;
      this.isCropper = true;
      var file = e.target.files[0];
      if (!/\.(gif|jpg|png)$/i.test(e.target.value)) {
        this.promptWin = true;
        this.isUpload = true;
        this.isCropper = false;
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.img = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
      this.$refs.inputFile.value = ""; //点击关闭按钮的时候把上传图片框清空，避免第二次选中同一张图片的时候不触发change事件
    },
    changeScale(num) {
      //点击放大缩小执行的方法
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    cropperUploadFn() {
      this.isCropper = false; //点击确定的时候把裁切页面隐藏掉
      //点击裁切图片确定时获取裁切图片的信息
      this.$refs.cropper.getCropData(data => {
        this.modelSrc = data; //裁切的图片
        this.coverImg = false; // 把裁切的图片显示出来
        this.closeUploadFn();
      });
    },
    changeCover() {
      //修改封面
      this.layer = true;
      this.isUpload = true;
    },
    selectSubActive(item, index) {
      //选择栏目切换
      this.subjectIndex = index;
      this.tId = item.tid;
    },
    publicArticle() {
      //发布文章
      if (!this.authCookie) {
        //是否登入，没登入给出提示
        this.isLogin = false;
        return;
      }

      let ckeditorContent = this.ckeditor.getData(),
        title = this.articleTitle,
        imgData = this.modelSrc,
        tId = this.tId;
      if (!title) {
        this.tipTitle = true;
        return;
      }
      this.tipTitle = false;
      if (!imgData) {
        this.tipCover = true;
        this.tipContent = true;
        return;
      }
      this.tipCover = false;
      this.tipContent = false;
      if (!ckeditorContent) {
        this.tipContent = true;
        return;
      }

      let obj = {
        at_title: title,
        at_txt: ckeditorContent,
        at_pic: imgData,
        superior_type: tId,
        at_id: this.atId
      };
      this.uploadArticle(obj).then(({ data }) => {
        let code = data.code,
          desc = data.desc;
        if (code == 200) {
          this.$router.push("/studentCenter");
          this.scrollBar(); //发布成功之后让滚动条置顶
        } else {
          throw new Error(desc);
        }
      });
    },
    repeatUpload() {
      //重新上传
      this.isCropper = false;
      this.isUpload = true;
    },
    cancelPublic() {
      //取消发布文章
      this.$router.go(-1);
    },
    scrollBar() {
      //滚动条置顶
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    setEditorCon() {
      //给编辑器收入框赋值
      this.articleTitle = this.editorContent.at_title;
      this.ckeditor.setData(this.editorContent.at_txt);
      this.modelSrc = this.editorContent.at_pic; //裁切的图片
      this.coverImg = false; // 把裁切的图片显示出来
      this.atId = this.editorContent.at_id;

      this.columnTypes.forEach((item, index) => {
        //设置选择栏目选择
        if (item.title == this.editorContent.att_title) {
          this.selectSubActive(item, index);
          return;
        }
      });
    },
    isEmptyObj(obj) {
      //判断是否为空对象
      for (var key in obj) {
        return false;
      }
      return true;
    },
    closeLogin() {
      //关闭提示弹窗
      this.isLogin = true;
    },
    confirmFn() { //上传图片格式提示框确定
      this.promptWin = false;
    },
    cancelFn() { //上传图片格式提示框取消
      this.confirmFn();
    }
  },
  components: {
    UeditorPage,
    loginPrompt,
    Prompt
  },
  mounted() {
    DecoupledEditor.create(document.querySelector("#editor"), {
      toolbar: [
        "heading",
        "|",
        "fontsize",
        "fontfamily",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "highlight",
        "|",
        "alignment",
        "|",
        "imageUpload",
        "|",
        "undo",
        "redo"
      ],
      language: "zh-cn",
      ckfinder: {
        options: {
          resourceType: "Image"
        },
        uploadUrl:
          "/public/js/ckfinder/ckfinder_php_3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json"
      }
    })
      .then(editor => {
        const toolbarContainer = document.querySelector(".toolbar-container");
        toolbarContainer.prepend(editor.ui.view.toolbar.element);
        this.ckeditor = editor;
      })
      .catch(err => {
        console.error(err.stack);
      });

    this.selectColumn().then(({ data }) => {
      //获取选择栏目数据
      let code = data.code,
        desc = data.desc,
        types = data.data.typels;
      if (code == 200) {
        this.columnTypes = types;
        this.tId = types[0] && types[0].tid; //获取选择栏目第一项tId

        let editorContent = JSON.parse(
          window.localStorage.getItem("detailCon")
        );

        if (editorContent) {
          this.editorContent = editorContent;
          this.setEditorCon();
        }
      } else {
        throw new Error(desc);
      }
    });
  },
  destroyed() {  //销毁存储的文章内容
    window.localStorage.removeItem("detailCon");
  }
};
</script>
<style lang="scss" scoped>
ul,
button {
  outline: none;
  &:hover {
    cursor: pointer;
  }
}
.fLeft {
  float: left;
}
.fRight {
  float: right;
}
.myFansWrap {
  width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 4px;
  padding-bottom: 40px;
}
.title {
  padding-left: 30px;
  padding-top: 30px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
}
main {
  padding: 0px 30px;
}
main > div {
  margin-bottom: 30px;
  width: 100%;
}
.titleWrap > input {
  box-sizing: border-box;
  width: 100%;
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: #fff;
}
.itemsName {
  display: block;
  font-size: 14px;
  color: #333;
  height: 30px;
  line-height: 30px;
}
.coverWrap,
.sortWrap {
  overflow: hidden;
}
.sortsButton {
  margin-left: 36px;
  overflow: hidden;
}
.publicArticle {
  margin-top: 20px;
}
.sortsButton li {
  float: left;
  margin-right: 18px;
  width: 94px;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  color: #666;
  border: 1px solid rgba(204, 204, 204, 1);
  background: #fff;
}
.sortsButton li.current {
  background: #ff7a32;
  border-color: #ff7a32;
  color: #fff;
}
.coverUpload {
  margin-top: 10px;
  margin-left: 92px;
  width: 220px;
  padding-top: 35px;
  text-align: center;
  height: 105px;
  background: #f3f3f3;
  &:hover {
    cursor: pointer;
  }
}
.coverUpload > img {
  width: 40px;
  height: 40px;
  display: block;
  margin: 0 auto;
}
.coverUpload > span {
  margin-top: 4px;
  font-size: 14px;
}
.footer button {
  margin-right: 30px;
  &:hover {
    cursor: pointer;
  }
}
.publish {
  width: 150px;
  line-height: 40px;
  text-align: center;
  height: 40px;
  background-color: #ff7a32;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  border: none;
  margin-right: 24px;
}
.cancel {
  font-size: 14px;
  color: #333;
  border: none;
  background: #fff;
}

// 上传固定裁切的图片大小css start
.coverImg {
  width: 440px;
  height: 280px;
  margin: 0 auto;
  img {
    display: block;
    width: 440px;
    height: 280px;
    margin: 0 auto;
  }
}
.coverSize {
  height: 140px;
  width: 300px;
  margin-top: 10px;
  margin-left: 36px;
  display: inline-block;
  vertical-align: middle;
  img {
    display: inline-block;
    width: 220px;
    height: 140px;
    vertical-align: middle;
    margin-right: 20px;
  }
  span {
    font-family: "PingFang-SC-Medium";
    font-size: 14px;
    color: #ff7a32;
    cursor: pointer;
  }
}
.operation {
  width: 440px;
  margin: 20px auto 40px;
  span {
    float: left;
    font-family: "PingFang-SC-Medium";
    font-size: 14px;
    color: #ff7a32;
    line-height: 14px;
    cursor: pointer;
  }
  .controllSize {
    float: right;
    i {
      display: inline-block;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .reduce {
      margin-right: 20px;
      background: url("../../assets/img/reduce.png") no-repeat center;
      background-size: 20px 20px;
    }
    .add {
      background: url("../../assets/img/add.png") no-repeat center;
      background-size: 20px 20px;
    }
  }
}

.leFenWrap {
  position: fixed;
  width: 770px;
  height: 480px;
  top: 50%;
  left: 50%;
  margin-left: -385px;
  margin-top: -258px;
  background: #fff;
  border-radius: 4px;
  z-index: 1001;
  header {
    height: 54px;
    line-height: 54px;
    border-bottom: 1px solid #e5e5e5;
    span {
      display: block;
      float: left;
      font-size: 14px;
      color: #333;
      padding-left: 30px;
    }
    button.close {
      float: right;
      margin-right: 30px;
      margin-top: 20px;
      border: none;
      width: 13px;
      height: 13px;
      background: url(../../assets/img/close.png) no-repeat;
      &:hover {
        cursor: pointer;
      }
    }
  }
  main {
    padding: 30px 32px 40px 30px;
    font-size: 14px;
    line-height: 30px;
    color: #333;
    .orange {
      color: #ff7a32;
    }
  }
  footer {
    border-top: 1px solid #e5e5e5;
    padding-top: 30px;
    padding-right: 30px;
    overflow: hidden;
    button {
      float: right;
      padding: 0px 32px;
      border-radius: 4px;
      font-size: 14px;
    }
    button.determine {
      background: #ff7a32;
      color: #fff;
      height: 34px;
      line-height: 34px;
      border: none;
      margin-right: 18px;
    }
    button.footerCancel {
      height: 32px;
      line-height: 32px;
      border: 1px solid #ccc;
      color: #666;
      background: #fff;
    }
  }
}
.cropperH {
  height: 556px;
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
.addImg {
  width: 440px;
  height: 195px;
  background: rgba(243, 243, 243, 1);
  margin: 0 auto;
  padding-top: 85px;
  text-align: center;
}
.addImg {
  img {
    width: 40px;
    height: 40px;
  }
  span {
    display: block;
  }
  p {
    width: 319px;
    height: 33px;
    line-height: 18px;
    text-align: center;
    color: #999;
    font-size: 12px;
    margin: 0 auto;
  }
}
.addIcon {
  width: 40px;
  height: 40px;
  color: #999999;
  transition: color 0.25s;
  position: relative;
  margin: 0 auto;
}

.addIcon::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 40px;
  margin-left: -20px;
  margin-top: -1px;
  border-top: 2px solid;
}
.addIcon::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  height: 40px;
  margin-left: -1px;
  margin-top: -20px;
  border-left: 2px solid;
}

.addIcon:hover {
  color: #ff7a32;
}
.inputFile {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
}
button.close {
  float: right;
  margin-right: 30px;
  margin-top: 20px;
  border: none;
  width: 13px;
  height: 13px;
  background: url(../../assets/img/close.png) no-repeat;
  &:hover {
    cursor: pointer;
  }
}
.warn {
  display: block;
  font-family: "PingFang-SC-Medium";
  font-size: 12px;
  padding-left: 19px;
  color: #ff5539;
  background: url("../../assets/img/warn.png") no-repeat 0 center;
  background-size: 12px 12px;
  margin-top: 12px;
}
.addImgTxt {
  color: #666;
}
#editor {
  //编辑器主体
  min-height: 360px;
  background: #ffffff;
  border: 1px solid #dfe4e6;
  border-bottom-color: #cdd0d2;
  border-right-color: #cdd0d2;
  box-sizing: border-box;
}
.toolbar-container {
  //编辑器toolbar
  margin: 0;
}
</style>


