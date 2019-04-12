<template>
  <!-- 'mk.php?do=xlsq' -->
  <header class="header">
    <div class="content">
      <div class="logo">
        <!-- <a href="mk.php?do=xlsq"></a> -->
        <router-link to="/" tag="a">
          <img src="../../assets/img/logo.png" alt="logo">
        </router-link>
      </div>
      <nav class="tabGroup">
        <li>
          <router-link to="/" tag="a">社区首页</router-link>
        </li>
        <li>
          <router-link to="/report" tag="a">小乐快报</router-link>
        </li>
        <li>
          <router-link to="/fanWorld" tag="a">乐粉天地</router-link>
        </li>
        <!-- './student.php?do=index&randstr='+anyNumber -->
        <li>
          <a :href="anyNumber" target="_blank" ref="study">学习专区</a>
        </li>
      </nav>
      <div class="iconGroup">
        <a class="pen" @click="toWrite()"></a>
        <a class="message" @click="noticeClick()" ref="noticeButton">
          <span v-show="noticeNum > 0">{{limitNoticeNum}}</span>
        </a>
        <img :src="user.avator" class="avatar" v-if="authCookie" @click="openStudentCenter()">
        <div class="loginRegister" v-else>
          <a href="mk.php?do=login_lexue&callback=mk.php?do=xlsq" class="login">登录</a>
          <a href="mk.php?do=reg&callback=mk.php?do=xlsq" class="register">注册</a>
        </div>
        <div class="signOut" v-if="authCookie" @click="safeSignOut">退出</div>
        <!--通知浮层 str-->
        <div class="noticePopUp" v-show="isNoticeShow">
          <h3 class="title">通知</h3>
          <!--暂无通知 str-->
          <main v-if="noticeList.length == 0" class="zeroNotices">
            <div class="imgWrap">
              <img src="../../assets/img/fans_zero.png" alt srcset>
            </div>
            <p>暂无通知</p>
          </main>
          <!--暂无通知 end-->
          <main v-if="noticeList.length != 0">
            <div class="noticesList">
              <ul>
                <li
                  @click="readMoreNotices"
                  v-for="(item , index) in noticeList"
                  :key="index"
                  v-html="item"
                ></li>
              </ul>
            </div>
            <div class="moreWrap">
              <button @click="readMoreNotices" class="more">查看所有通知</button>
            </div>
          </main>
        </div>
        <!--通知浮层 end-->
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Header",
  data() {
    return {
      isNoticeShow: false, // 通知浮层是否显示
      page: 1, //默认页码
      pagenum: 5, //默认显示条数
      type: "part" // 首页显示部分
    };
  },
  mounted() {
    // 通知浮层 点击空白处 浮层收起
    document.addEventListener("click", e => {
      if (this.$refs.noticeButton != e.target) {
        if (this.isNoticeShow) this.isNoticeShow = false;
      }
    });
    let obj = {
      page: this.page,
      pagenum: this.pagenum,
      type: this.type
    };
    this.noticeInfo(obj); //获取通知栏信息
    this.SaveAuthCookie(); //把authCookie存起来
    this.IndexUserInfo(); //获取用户头像信息
  },
  methods: {
    ...mapActions(["noticeInfo", "SaveAuthCookie", "IndexUserInfo"]),
    readMoreNotices() {
      //跳转到通知页面
      this.$router.push({ path: "/notices" });
      this.isNoticeShow = false;
    },
    openStudentCenter() {
      //跳转到个人中心
      this.$router.push({ path: "/studentCenter" });
    },
    toWrite() {
      this.$router.push({ path: "/publishArticle" });
    },
    noticeClick() {
      //鼠标点击显示弹出层
      this.isNoticeShow = !this.isNoticeShow;
    },
    safeSignOut() {
      //安全退出
      let rand = Math.random();
      window.location.href = "cp.php?ac=common&op=logout&randstr=" + rand;
    }
  },
  computed: {
    ...mapState(["noticeNum", "noticeList", "user", "authCookie"]),
    anyNumber() {
      return "./student.php?do=index&randstr=" + Math.random();
    },
    /**
     * @description 通知超过99条 显示99+
     */
    limitNoticeNum() {
      if (this.noticeNum > 99) {
        return "99+";
      } else if (this.noticeNum > 0) {
        return this.noticeNum;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "_a/scss/mixin.scss";
@import "_a/scss/variable.scss";
.header {
  font-family: "PingFang-SC,Microsoft YaHei", Arial, Helvetica, sans-serif;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: $color-background-p;
  position: fixed;
  top: 0;
  z-index: 1000;
  .content {
    width: 1200px;
    margin: 0 auto;
    height: 60px;
  }
  .logo {
    float: left;
    width: 154px;
    height: 60px;
    line-height: 60px;
    img {
      display: inline-block;
      width: 154px;
      height: 46px;
      vertical-align: middle;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .iconGroup {
    float: right;
    text-align: right;
    cursor: pointer;
    position: relative;
    a {
      font-family: "PingFang-SC-Bold";
      font-size: $font-size-medium-x;
      color: $color-background-f;
      display: inline-block;
      font-style: normal;
      vertical-align: middle;
      outline: none;
    }
    .pen {
      height: 22px;
      width: 22px;
      background: url("../../assets/img/pen.png") no-repeat center;
    }
    .message {
      height: 22px;
      width: 22px;
      background: url("../../assets/img/message.png") no-repeat center;
      border-width: 18px 26px;
      border-color: transparent;
      border-style: solid;
      position: relative;
      span {
        font-family: "Regular";
        position: absolute;
        top: -4px;
        left: 10px;
        width: 24px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        background-color: $color-background-r;
        border-radius: 7px;
        color: $color-background-f;
        font-size: $font-size-small;
        @include no-wrap;
      }
    }
    .avatar {
      display: inline-block;
      width: 36px;
      height: 36px;
      vertical-align: middle;
      border-radius: 50%;
    }
    .loginRegister {
      display: inline-block;
      line-height: 16px;
      overflow: hidden;
      vertical-align: -3px;
      .login::after {
        content: "";
        border-right: 1px solid;
        padding-left: 6px;
        margin-right: 6px;
      }
    }
  }
  .tabGroup {
    float: left;
    font-family: "PingFang-SC";
    font-size: $font-size-medium-x;
    width: 412px;
    height: 60px;
    line-height: 60px;
    margin: 0 0 0 242px;
    li {
      display: inline-block;
      width: 103px;
      line-height: 60px;
      text-align: center;
      cursor: pointer;
      a {
        display: inline-block;
        height: 50px;
        font-size: 17px;
        text-decoration: none;
        color: $color-background-f;
        outline: none;
      }
      .active {
        border-bottom: 2px solid $color-background-f;
      }
    }
  }
  .signOut {
    display: inline-block;
    font-family: "PingFang-SC-Medium";
    font-size: $font-size-medium;
    color: $color-background-f;
    cursor: pointer;
    margin-left: 20px;
  }
}
.noticePopUp {
  width: 362px;
  position: absolute;
  border: 1px solid $color-text;
  border-radius: 1px;
  box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.15);
  background-color: $color-background-f;
  border: 1px solid rgba(229, 229, 229, 1);
  top: 60px;
  right: 0px;
  z-index: 200;
  .title {
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e5e5e5;
    color: $color-text;
    font-weight: bold;
  }
  .noticesList {
    width: 100%;
    li {
      color: #333;
      font-size: 14px;
      height: 53px;
      line-height: 53px;
      padding: 0px 20px;
      border-bottom: 1px solid #e5e5e5;
      text-align: left;
      @include no-wrap;
      &:hover {
        background: #f3f3f3;
      }
    }
  }
  .moreWrap {
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;

    .more {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium;
      outline: none;
      border: none;
      color: $color-origin-c;
      background: $color-background-f;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .zeroNotices {
    text-align: center;
    padding: 109px 0px;
    width: 362px;
    display: block;
    .imgWrap {
      width: 76px;
      height: 56px;
      margin: 0 auto;
      margin-bottom: 30px;
    }
    p {
      color: #999;
      font-size: 14px;
      height: 20px;
      line-height: 20px;
      padding: 0px;
      margin: 0px;
    }
  }
}

@media screen and (max-width: 1200px) {
  .header .tabGroup {
    margin: 0 100px;
  }
  .header .iconGroup {
    cursor: pointer;
    position: relative;
    float: left;
    text-align: left;
  }
}
</style>