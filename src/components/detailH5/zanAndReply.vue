<template>
  <div class="zanAndReply">
    <div class="zan">
      <img  v-if="!isZan" src="../../assets/img/nozanm.png" alt="" @click="zanFun()">
      <img v-if="isZan" src="../../assets/img/zanmobil.png" alt="" @click="zanFun()">
      <span>{{zanNum}}</span>
    </div>
    <button v-if="currentUseFor == 'app_an'" @click="anReply">回复</button>
    <button v-if="currentUseFor == 'app_ios'" @click="iosReply">回复</button>
    <div class="clear"></div>
  </div>
</template>
<script>
import { mapState,mapActions} from 'vuex'
export default {
  props:['comment','auth_cookie','articleId','currentUseFor'],
  data(){
    return{

    }
  },
  mounted(){
    
  },
  computed:{
    ...mapState(['mobileCurrentAcid']),
    isZan(){
      return this.comment.givezan;
    },
    zanArg(){
      let obj = {
        auth_cookie: this.auth_cookie,
        about_id: this.comment.ac_id,
        givezan: this.comment.givezan,
        type:5
      }
      return obj;
    },
    zanNum(){
      return this.comment.ac_zan_count;
    }
  },
  methods:{
    ...mapActions(['mobilReplayComment','getMobilArticleComment','commentZan']),
    sendComment(ac_id,content){
      let obj = {
        auth_cookie: this.auth_cookie,
        at_id: this.articleId,
        ac_txt:content,
        ac_id:ac_id
      };
      let _this = this;
      this.mobilReplayComment(obj).then(({ data }) => {
        let code = data.code,
            desc = data.desc;
        if (code == 200) {
          this.$emit('sendsuccess',data.data);
         
        }
        window.js_invoke.showResult(code,desc);
      });
    },
    zanFun(){
      
      this.commentZan(this.zanArg).then(({ data }) => {
          let code = data.code,
            zanArr = data.data,
            desc = data.desc;
          if (code == 200) {
            this.comment.givezan = zanArr.givezan;
            this.comment.ac_zan_count = zanArr.zancount;
          } else {
            throw new Error(desc);
          }
        });
    },
    anReply(){
      window.sendComment = this.sendComment.bind(this);
      window.js_invoke.showInput(this.comment.ac_id);
    },
    iosReply(){
      window.sendComment = this.sendComment.bind(this);
      try{window.webkit.messageHandlers.showInput.postMessage(this.comment.ac_id);}
      catch(e){
        alert(e);
      }
      
    }
  }
}
</script>
<style lang="scss" scoped>
  .clear{clear:both;}
  .zanAndReply{
    margin-left: 5rem;
    // margin-top: 1.1rem;
    .zan{
      float: left;
      height: 1.5rem;
      color: #999;
      font-size: 1.2rem;
      img{
        width: 1.5rem;
        height: 1.5rem;
      }
      span{
        display: inline-block;
        height: 1.5rem;
        line-height: 1.5rem;
        position: relative;
        top: -2px;
        margin-left: .5rem;
      }
    }
    button{
      float: left;
      margin-left: 3rem;
      color: #999;
      font-size: 1.3rem;
      background: none;
      outline: none;
      border: none;
    }
  }
</style>


