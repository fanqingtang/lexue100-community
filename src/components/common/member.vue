<template>
  <div :class="{heightWrap: isAttention||isFan}">
    <!--我的粉丝 高手推荐 我的关注 公用组件-->
    <div class="personalWrap">
      <!--头像-->
      <div class="avatarWrap">
        <img :src="member.avator" @click="otherCenter(member)">
        <span class="vIcon"></span>
      </div>
      <!--名称-->
      <div class="nameWrap">
        <h4 :title="member.name">{{memberName}}</h4>
        <button v-if="!member.follow && !isAttention" class="noAttention" @click="attention">+关注</button>
        <button v-if="(member.follow && isFan) || (isAttention && member.mutual)" @mouseover="change" @mouseleave="recovery('相互关注')"  @click="del" class="eachOther">相互关注</button>
        <!--高手推荐 已关注按钮无滑入滑出效果 故单独放出-->
        <button @click="del" v-if="isRecommend && member.follow" class="alreadyAttention" @mouseover="change" @mouseleave="recovery('已关注')">已关注</button>
        <button @mouseover="change" @mouseleave="recovery('已关注')" @click="del" v-if="isAttention && !member.mutual && !isRecommend" class="alreadyAttention">已关注</button>
      </div>
    </div>
    <div class="fanWrap"> 
      <ul>
        <li>粉丝 <span>{{member.fans}}</span></li>
        <li>文章 <span>{{member.num}}</span></li>
        <li v-if="isPageViews">总浏览量 <span>{{member.view}}</span></li>
      </ul>
    </div>
    <div class="introWrap">
      <p :title="member.person_js">简介：{{interceptPersonJs}}</p>
    </div>
    <!--乐粉说明 弹出框end-->
    <login-prompt v-show="!isLogin" @closeLayer="closeLogin"></login-prompt>
  </div>
</template>
<script>
import { mapMutations,mapActions,mapState } from "vuex";
import loginPrompt from './loginPrompt.vue';
export default {
  name:'Member',
  data(){
    return {
      isLogin:true
    }
  },
  components:{
    loginPrompt
  },
  methods:{
    ...mapActions(["LeFenMasterAttention" ]),
    ...mapMutations(["setCurrentUid"]),
    /**鼠标滑入 文案修改 */
    change:function(event){
      if(event){
        event.target.innerText = '取消关注';
      }
    },
    /**鼠标离开 文案复原 */
    recovery:function(str){
       if(event){
        event.target.innerText = str;
        
      }
    },
    /**取消关注 */
    del(){
      let _this = this;
      this.LeFenMasterAttention({id: this.member.uid,follows:0}).then(function(data){
        let code = data.data.code;
        if(code == 200){
          _this.$emit('del');
        }
      });
    },
    /**关注粉丝 */
    attention(){
      // $ ('.popUp').show ().delay (2000).fadeOut ();
      // this.$emit('attention');
      //未登录时 提示去登录
        if(!this.authCookie){
          this.isLogin = false;
        } else{
          let _this = this;
          this.LeFenMasterAttention({id: this.member.uid,follows:1}).then(function(data){
            let code = data.data.code;
            if(code == 200){
              _this.$emit('attention');
            }
          });
        }
    },
    otherCenter(member) {
      this.setCurrentUid(member.uid);
      this.$router.push({ path: `/otherCenter/${member.uid}` }); //看其他人的个人中心执行跳转页面 
    },
    closeLogin(){
      this.isLogin = true;
    }
  },
  computed:{
    ...mapState(['authCookie']),
    interceptPersonJs(){
      if(this.member.person_js == ''){
        return '暂无简介';
      } else if(this.member.person_js.length == 50 || this.member.person_js.length<50){
        return this.member.person_js;
      } else{
        return this.member.person_js.substr(0,50) + '...';
      }
      
    },
    memberName(){
      if(this.member.name.length == 6 || this.member.name.length < 6){
        return this.member.name;
      } else {
        return this.member.name.substr(0,6) + '...';
      }
    }
  },
  props:['member','isPageViews','isAttention','isFan','isRecommend']  /** isPageViews  是否显示浏览量  isFan 粉丝页面  isAttention 关注页面 isRecommend 高手推荐*/
} 
</script>
<style lang="scss" scoped>
  h4,ul,li,p,div{margin: 0px;padding: 0px;}
  ul,li{list-style-type: none;}
  button{outline: none;}
  $color:#666;
  $clear:both;
  $orange:#FF7A32;
  .personalWrap{
    overflow: hidden;
    width: 100%;
    .avatarWrap{
      float: left;
      position: relative;
      img{
        width:50px;
        height:50px;
        border-radius:50%;
        &:hover{
          cursor: pointer;
        }
      }
      .vIcon{
        position: absolute;
        width: 29px;
        height: 29px;
        background: url(../../assets/img/master.png) no-repeat;
        top: 30px;
        left: 32px;
        // z-index: 100;
      }
      
    }
    .nameWrap{
      float: left;
      margin-left: 18px;
      h4{
        color: #333;
      }
      button{
        background: #FF7A32;
        padding: 0px 12px;
        font-size: 14px;
        height:24px;
        line-height: 22px;
        color: #fff;
        border-radius:12px;
        margin-top: 8px;
        border: none;
        &:hover{
          cursor: pointer;
        }
      }
      button.noAttention{
        background: #FF7A32;
      }
      button.eachOther{
        background: #ccc;
      }
      button.alreadyAttention{
        background: #ccc;
      }
    }
  }
  .fanWrap{
    overflow: hidden;
    margin-top: 20px;
    ul li{
      float: left;
      color: #999;
      font-size: 12px;
      margin-right: 14px;
      span{
        color: $orange;
      }
    }
  }
  .introWrap{
    margin-top: 16px;
    p{
      color: $color;
      font-size: 12px;
      line-height: 24px;
      
    }
  }
  // 针对我的粉丝 我的关注页面 简介内容不一 会造成列表错乱 固定高度 并给予简介部分最大高度 其他页面该组件不变
  .heightWrap{
    height: 160px;
  }
  .heightWrap .introWrap p{
    max-height: 70px;
    overflow: hidden;
  }

</style>


