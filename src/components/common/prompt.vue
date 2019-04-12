<template>
  <div class="promptWrap" v-show="isShow">
    <div class="layer"></div>
    <div class="PromptBox">
      <div class="header">
        <span>提示</span>
        <img src="../../assets/img/close.png" alt="关闭" @click="cancelFn">
      </div>
      <slot></slot>
      <div class="footer">
        <span class="confirm" @click="confirmFn">确定</span>
        <span @click="cancelFn">取消</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Prompt",
  data() {
    return {};
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    confirmFn() {
      //确定执行的方法
      this.$emit("confirmFn");
    },
    cancelFn() {
      //取消执行的方法
      this.$emit("cancelFn");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "_a/scss/variable.scss";
.promptWrap {
  .layer {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1002;
    background-color: $color-background-n;
    opacity: 0.5;
  }
  .PromptBox {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1003;
    margin: auto;
    width: 400px;
    height: 234px;
    background-color: $color-background-f;
    border-radius: 4px;
  }
  .header {
    padding: 14px 30px;
    span {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium;
      color: $color-text;
    }
    img {
      float: right;
      width: 13px;
      height: 13px;
      margin-top: 5px;
      cursor: pointer;
    }
  }
  .middle {
    clear: both;
    font-family: "PingFang-SC-Medium";
    font-size: $font-size-medium-x;
    color: $color-text;
    height: 128px;
    line-height: 30px;
    text-align: left;
    padding: 0 30px;
  }
  .delMiddle {
    line-height: 128px;
    text-align: center;
  }
  .footer {
    height: 53px;
    line-height: 53px;
    border-top: 1px solid $color-background-a;
    overflow: hidden;
    span {
      font-family: "PingFang-SC-Medium";
      font-size: $font-size-medium-x;
      color: $color-gray-a;
      display: inline-block;
      width: 199px;
      text-align: center;
      cursor: pointer;
    }
    .confirm {
      border-right: 1px solid $color-background-a;
      color: $color-origin;
    }
  }
}
</style>