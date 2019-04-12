<template>
  <div class="loading">
    <div class="loadLeft">
      <div class="avator"></div>
      <ul>
        <li class="w480"></li>
        <li class="w300"></li>
        <li class="w480"></li>
        <li class="w300"></li>
        <li class="w100"></li>
      </ul>
    </div>
    <div class="loadRight"></div>
  </div>
</template>

<script>
export default {
  name: "Loading"
};
</script>

<style lang="scss" scoped>
@import "_a/scss/variable.scss";
.loading {
  height: 200px;
  padding: 30px 0;
  box-sizing: border-box;
  overflow: hidden;
}
.loadLeft {
  float: left;
  .avator {
    float: left;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: $color-background-e;
    margin-right: 20px;
    animation: ColorOpacity 1s infinite;
  }
  ul {
    float: right;
    width: 480px;
    padding: 0;
    list-style: none;
  }
  li {
    height: 12px;
    background-color: $color-background-e;
    margin-bottom: 20px;
    animation: ColorOpacity 1s infinite;
  }
  .w480 {
    width: 480px;
  }
  .w300 {
    width: 300px;
  }
  .w100 {
    width: 100px;
  }
}
.loadRight {
  float: right;
  width: 220px;
  height: 140px;
  background-color: $color-background-e;
  animation: ColorOpacity 1s infinite;
}

@keyframes ColorOpacity {
  0% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }

}
</style>