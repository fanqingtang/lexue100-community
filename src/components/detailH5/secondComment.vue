<template>
  <div class="main">
    <div class="avatar">
      <img :src="comment.avator" alt="">
    </div>
    <div class="content">
      <h5>{{comment.name}}</h5>
      <span class="commentTime">{{comment.ac_dateline}}</span>
      <p v-html="comment.ac_txt" class="commentContent"></p>
    </div>
    <div class="clear"></div>
</div>
</template>
<script>
export default {
  data(){
    return {}
  },
  props:['comment']
}
</script>
<style lang="scss" scoped>
.clear{clear: both;}
.main{
    width: 100%;
    border-bottom: 1px solid #E5E5E5;
    padding-top: 1rem;
    .avatar{
      width: 4rem;
      float: left;
      img{
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
      }
    }
    .content{
      width: 82%;
      margin-left: 5rem;
      box-sizing: border-box;
      h5{
        color: #333;
        font-size: 1.4rem;
        font-weight: bold;
      }
      .commentTime{
        color: #999;
        font-size: 1.1rem;
        margin-top: 0.4rem;
        // margin-bottom: 1rem;
        display: inline-block;
      }
      p{
        color: #333;
        font-size: 1.4rem;
      }

    }
  }
</style>


