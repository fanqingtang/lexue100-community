<template>
  <div v-show="isShow">
    <div class="layer"></div>
    <div class="LeCoreWrap">
      <div class="LeCoreInner">
        <div class="header">
          <span>赠送给作者</span>
          <img src="../../assets/img/close.png" alt="关闭" @click="close">
        </div>
        <div class="middle">
          <img :src="leCoreArr.avator" alt="小乐">
          <span>{{leCoreArr.name}}</span>
        </div>
        <div class="seleLeCore">
          <div class="core">
            <span class="oneCore" :class="{coreActive : coreIndex === 1}" @click="selectCore(1)">1乐币</span>
            <span class="twoCore" :class="{coreActive : coreIndex === 2}" @click="selectCore(2)">2乐币</span>
          </div>
          <span class="nowCore">
            当前乐币
            <i>{{leCoreArr.coin}}</i>
          </span>
        </div>
        <div class="sureGive" @click="sureGiveCore">
          <a href="javascript:;">
            <span>确认赠送</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  name: "LeCore",
  data() {
    return {
      coreIndex: 1 //默认选择赠送乐币的索引
    };
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["leCoreArr"])
  },
  methods: {
    close() {
      //点击关闭方法
      this.$emit("closeCore");
    },
    selectCore(num) {
      //选择乐币切换active方法
      this.coreIndex = num;
    },
    sureGiveCore() {
      //确认赠送乐币
      this.$emit("sureGiveCore", this.coreIndex);
    }
  }
};
</script>


<style lang="scss" scoped>
@import "_a/scss/variable.scss";
.layer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background-color: $color-background-n;
  opacity: 0.5;
}
.LeCoreWrap {
  width: 400px;
  height: 348px;
  background-color: $color-background-f;
  border-radius: 4px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1002;
  margin: auto;
  .LeCoreInner {
    padding: 23px 30px;
  }
  .header {
    overflow: hidden;
    line-height: 14px;
    span {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium;
      color: $color-text;
    }
    img {
      float: right;
      width: 13px;
      height: 13px;
      cursor: pointer;
    }
  }
  .middle {
    margin: 19px auto 0;
    text-align: center;
    img {
      display: block;
      width: 80px;
      height: 80px;
      margin: auto;
      border-radius: 50%;
    }
    span {
      display: inline-block;
      font-family: "PingFang-SC-Heavy";
      font-size: $font-size-medium-x;
      color: $color-text;
      margin-top: 12px;
      line-height: 16px;
    }
  }
  .seleLeCore {
    text-align: center;
    margin-top: 26px;
    line-height: 0;
  }
  .core {
    width: 250px;
    margin: auto;
    overflow: hidden;
    span {
      display: inline-block;
      font-family: "PingFang-SC-Heavy";
      font-size: $font-size-medium-x;
      width: 110px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 20px;
      border: 1px solid $color-gray;
      color: $color-gray-a;
      cursor: pointer;
    }
    .oneCore {
      float: left;
    }
    .twoCore {
      float: right;
    }
    .coreActive {
      background-color: $color-origin;
      border: 1px solid $color-origin;
      color: $color-background-f;
    }
  }
  .nowCore {
    display: inline-block;
    margin-top: 30px;
    font-family: "PingFang-SC-Medium";
    font-size: $font-size-small;
    color: $color-gray;
    line-height: 12px;
    i {
      font-style: normal;
      color: $color-origin;
    }
  }
  .sureGive {
    position: absolute;
    left: 50%;
    bottom: -42px;
    transform: translateX(-50%);
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: $color-origin;
    margin: auto;
    a {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
      width: 40px;
      height: 46px;
      line-height: 23px;
    }
    span {
      font-family: "PingFang-SC-Bold";
      font-size: 20px;
      color: $color-background-f;
    }
  }
}
</style>