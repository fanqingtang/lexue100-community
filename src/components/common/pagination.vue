
<template>
  <div class="pageWrap">
    <div v-show="prePage" class="liPage triangleLeft" @click="goPrePage"></div>
    <ul>
      <li
        v-for="(i, index) in showPageBtn"
        :key="index"
        :class="{active: i === currentPage,noHover: !i}"
        @click="pageOffset(i)"
      >
        <a v-if="i" class="notPointer">{{i}}</a>
        <a v-else class="point">···</a>
      </li>
    </ul>
    <div v-show="nextPage" class="liPage triangleRight" @click="goNextPage"></div>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  props: {
    num: {
      type: Number
    },
    limit: {
      type: Number
    }
  },
  computed: {
    offset() {
      //偏移数
      return this.$store.state.offset;
    },
    prePage() {
      //上一页文本是否显示
      return this.offset !== 0 && this.num;
    },

    nextPage() {
      //下一页文本是否显示
      return this.offset + this.limit < this.num && this.num;
    },

    totalPage() {
      //总的页数
      return Math.ceil(this.num / this.limit);
    },

    currentPage() {
      //当前的页数
      return Math.ceil(this.offset / this.limit) + 1;
    },
    showPageBtn() {
      //显示页数编码
      const pageNum = this.totalPage; //总的页数
      const index = this.currentPage; //当前页数
      if (pageNum === 1) return [1]; //总的页数只有一页时 显示一页
      if (pageNum === 2) return [1, 2]; //总的页数只有二页时 显示两页
      if (pageNum === 3) return [1, 2, 3]; //总的页数只有三页时 显示三页
      if (pageNum === 4) return [1, 2, 3, 4]; //总的页数只有四页时 显示四页
      if (pageNum === 5) return [1, 2, 3, 4, 5]; //总的页数只有五页时 显示五页

      if (index <= 3) return [1, 2, 3, 4, 5, 0];
      if (index >= pageNum - 1 || index === pageNum - 2)
        return [0, pageNum - 4, pageNum - 3, pageNum - 2, pageNum - 1, pageNum];
      return [0, index - 2, index - 1, index, index + 1, index + 2, 0];
    }
  },
  methods: {
    pageOffset(i) {
      //选中页数方法
      if (i === 0 || i === this.currentPage) return;
      this.$store.commit("goPage", (i - 1) * this.limit);
      this.$emit("selectPageFn", this.currentPage);
    },

    goPrePage() {
      //点击上一页执行方法
      this.$store.commit("prePage", this.limit);
      this.$emit("goPrePage", this.currentPage);
    },

    goNextPage() {
      //点击下一页执行方法
      this.$store.commit("nextPage", this.limit);
      this.$emit("goNextPage", this.currentPage);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "_a/scss/variable.scss";
.pageWrap {
  text-align: center;
  font-size: 18px;
  div {
    display: inline-block;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 0;
      height: 0;
      border-width: 5px;
      border-style: solid;
    }
  }
  .triangleLeft::after {
    left: 5px;
    border-color: transparent $color-background-j transparent transparent;
  }
  .triangleRight::after {
    right: 5px;
    border-color: transparent transparent transparent $color-background-j;
  }
  .liPage {
    width: 26px;
    height: 26px;
    background-color: $color-background-b;
    border: 1px solid $color-background-d;
    border-radius: 4px;
    margin-right: 10px;
    cursor: pointer;
  }
  ul {
    display: inline-block;
    vertical-align: top;
    li {
      float: left;
      width: 26px;
      height: 26px;
      line-height: 26px;
      border-radius: 4px;
      margin-right: 10px;
      border: 1px solid $color-background-d;
      font-size: 0;
      cursor: pointer;
      &:hover {
        background-color: $color-origin;
        border-color: $color-origin;
        a {
          color: $color-background-f;
        }
      }
      a {
        display: inline-block;
        width: 100%;
        height: 100%;
        font-family: "ArialMT";
        font-size: 14px;
        color: $color-background-k;
        vertical-align: middle;
      }
      .point {
        vertical-align: -12px;
        &:hover {
          border: none;
          color: $color-background-k;
        }
      }
    }
    .notPointer {
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
    .active {
      background-color: $color-origin;
      border-color: $color-origin;
      a {
        color: $color-background-f;
      }
    }
    .noHover {
      color: $color-background-f;
      border: none;
      &:hover {
        background-color: $color-background-f;
        color: $color-background-k;
      }
    }
  }
}
</style>