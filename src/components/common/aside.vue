<template>
  <aside>
    <h4 v-if="!isDetail">{{titleName}}</h4>
    <h4 v-if="isDetail" style="color:#666;">{{authorName}}的更多文章</h4>
    <div class="articleList">
      <ul>
        <li v-for="(article,index) in articleList" :key="index">
          <a :href="'mk.php?do=article2&id='+article.at_id" target="_blank">
            <img :src="article.at_pic" alt>
          </a>
          <article>
            <a :href="'mk.php?do=article2&id='+article.at_id" target="_blank">
              <title>{{article.at_title}}</title>
            </a>

            <time>{{article.at_dateline}}</time>
          </article>
        </li>
      </ul>
      <footer v-if="!isDetail">
        <button @click="moreContent()">查看更多</button>
      </footer>
    </div>
  </aside>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Aside",
  data() {
    return {};
  },
  props: {
    isDetail: {
      default: false
    },
    titleName: {
      type: String
    },
    articleList: { 
      type: Array
    },
    authorName: {
      type: String
    }
  },
  computed: {
    ...mapState(["line"])
  },
  methods: {
    moreContent() {
      //点击查看更多
      this.$router.push({ path: "/report" });
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  margin: 0px;
  padding: 0px;
}
button {
  outline: none;
  &:hover {
    cursor: pointer;
  }
}
ul,
li {
  list-style: none;
}
$font-size: 14px;
aside {
  width: 268px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  padding: 25px 16px 0px 16px;
}
h4 {
  color: #ff7a32;
  margin-bottom: 26px;
}
.articleList {
  li {
    margin-bottom: 23px;
    overflow: hidden;
    &:last-child{
      padding-bottom: 30px;
    }
    img {
      float: left;
      width: 90px;
      height: 58px;
      &:hover{
        cursor: pointer;
      }
    }
  }
}
article {
  float: right;
  width: 150px;
  text-align: left;
  title {
    color: #333;
    font-size: $font-size;
    display: block;
    &:hover{
      cursor: pointer;
    }
  }
}
time {
  color: #999;
  font-size: 12px;
}
footer {
  width: 100%;
  text-align: center;
  padding-bottom: 24px;
  margin-top: -20px;
}
button {
  border: none;
  color: #ca8e6e;
  font-size: $font-size;
  background: none;
}
</style>


