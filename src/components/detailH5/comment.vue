<template>
  <div class="commentMain">
    <!--直接评论 str-->
              <secondComment :comment = comment></secondComment> 
              <!--直接评论 end-->
                  
              <!--点赞回复 str-->
              <zanAndReply @sendsuccess = "refresh" :comment = comment :auth_cookie = auth_cookie  :articleId = articleId :currentUseFor = currentUseFor></zanAndReply>
              <!--点赞回复 end-->
              
              <!--评论的评论 str-->
              <!-- <sub-comment :auth_cookie = auth_cookie  :ac_id = comment.ac_id></sub-comment> -->
              <div class="secondComment">
                <ul>
                  <li v-for="(comment,index) in subComments" :key="index">
                    <secondComment :comment = comment></secondComment>
                  </li>
                  <!-- <li v-for="(comment,index) in subComments" :key="index">
                    <secondComment :comment = comment></secondComment>
                  </li> -->
                </ul>
                <div class="moreComment" v-if="comment.commcount != 0">
                  <span v-if="comment.commcount < 5 || comment.commcount == 5 || subCommentLen == 0" style="display:none;">没有更多了</span>
                  <span v-else-if="noMore" @click="showSecondCommend(comment.ac_id)">剩余{{comment.commcount - 5}}条回复</span>
                  <span v-else-if="!noMore" @click="showSecondCommend(comment.ac_id)">剩余{{subCommentLen}}条回复</span>
                </div>
              </div> 
              <!--评论的评论 end-->
  </div>
</template>

<script>
import secondComment from './secondComment.vue';
import zanAndReply from './zanAndReply.vue';
import { mapState,mapActions,mapMutations } from 'vuex'
export default {
  data(){
    return {
      subCommentLen:null,
      noMore:true,
      secondCommentPage:0, // 二级评论页数
      secondCommentPageNum:10, // 二级评论每页显示个数
      subComments:this.comment.comment,
    }
  },
  props:{
    comment:{
    type: Object
  },
  auth_cookie:{
    type: String
  },
  articleId:{
    type: String
  },
  currentUseFor:{
    type: String
  }
  },
  // props:['comment','auth_cookie','articleId','currentUseFor'],
  computed:{
    // subComments(){
    //   return this.comment.comment;
    // },
    detailSecondCommentArg(){
      let obj = {
        auth_cookie: this.auth_cookie,
        ac_id:this.ac_id,
        page:this.secondCommentPage,
        pagenum: this.secondCommentPageNum,
      };
      return obj;
    }
  },
  watch:{
    comment(){
      this.subComments = this.comment.comment;
    }
  },
  components:{
    secondComment,
    zanAndReply
  },
  methods:{
    ...mapActions(['getMobilArticleDetail','getMobilArticleComment','mobilSubReplayComment']),
    showSecondCommend(ac_id){
      this.noMore = false;
      this.ac_id = ac_id;
      this.secondCommentPage ++;
      this.mobilSubReplayComment(this.detailSecondCommentArg).then(({ data })=>{
        let code = data.code,
              desc = data.desc,
              arr = data.data.comments,
              len = data.data.commentnum;
        if(code == 200){
          this.subComments = this.subComments.concat(arr);
          this.subCommentLen = len;
          if(len == 0) this.noMore = true;
        }
      });
    },
    refresh(obj){
      this.subComments.unshift(obj);
    },
  },
}
</script>
<style lang="scss" scoped>
  .secondComment{
        margin-left: 5rem;
        padding: 0px 1rem;
        background: #f8f8f8;
        margin-top: .6rem;
        .moreComment{
          padding: 1rem 0px;
          text-align: center;
          span{
            color: #CA8E6E;
            font-size: 1.3rem;
            margin: 0 auto;
          }
        }

      }
  
    .noMoreComment{
      padding: 1.5rem;
      color: #CCC;
      font-size: 1.2rem;
      div{
        width: 190px;
        margin: 0 auto;
        span:first-child{
          right: .6rem;
        }
        span:last-child{
          left: .6rem;
        }
        .line{
          width: 5rem;
          height: 1px;
          background: #E5E5E5;
          display: inline-block;
          position: relative;
          top: -4px;
        }
      }
      
    }
    .commentMain>div{
    border-bottom: none;
    padding-top: 0px;
  }
</style>


