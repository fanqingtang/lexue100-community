<template>
  <!--个人中心--个人信息 本人视角-->
  <div>

  
  <div class="wrap" v-if="authorInfo">
    <main>
      <div class="avatar">
        <img :src="authorInfo.avator" v-if="isSelf || !isDetail" >
        <a :href="toHref" v-if="!isSelf && isDetail && authorInfo.uid !== this.user.uid">
          <img class="otherAvator" @click="clickAvator(authorInfo)" :src="authorInfo.avator">
        </a> <!--详情页面点击他人头像 可进入其个人中心-->
         <a :href="toSelfHref" v-if="!isSelf && isDetail && authorInfo.uid == this.user.uid">
          <img class="otherAvator" @click="clickAvator(authorInfo)" :src="authorInfo.avator">
        </a> <!--自己文章详情页  点击自己头像-->
        <span class="greyVIcon" :class="{VIcon:authorInfo.is_super==1}"></span>
      </div>
      <span class="name">{{authorInfo.name}}</span>
      <div class="buttonWrap" v-if="(authorInfo.is_super == 0 && isSelf) || (authorInfo.is_super == 0 && this.currentUid == this.user.uid)">
        <button class="lightUp" @click="showLeFenPopUp()">成为乐粉新星</button>
      </div>
      <div class="buttonWrap" v-if="(authorInfo.is_super == 1 && isSelf) || (authorInfo.is_super == 1 && this.currentUid == this.user.uid)">
        <button class="lightUp" @click="toWrite">提笔就写</button>
      </div>
      <div class="attention" v-if="this.currentUid !== this.user.uid">
        <button v-if="(!authorInfo.follow && !isSelf)" @click="attentionSucess(authorInfo)" class="noAttention">+关注</button>
        <button v-if="(authorInfo.follow && !isSelf)" @click="cancelAttentionSucess(authorInfo)" @mouseover="change" @mouseleave="recovery('已关注')"   class="alreadyAttention">已关注</button>
      </div>
      <div class='items'>
        <ul>
          <li>
            <span class="num">{{authorInfo.article_sum}}</span>
            <span class="itemsName">文章</span>
          </li>
          <li @click="fanFn" :class="{fan:isSelf}">
            <span class="num">{{authorInfo.fan_sum}}</span>
            <span class="itemsName">粉丝</span>
          </li>
          <li v-if="!isDetail" @click="attentionFn" :class="{attention:isSelf}">
            <span class="num">{{authorInfo.follow_sum}}</span>
            <span class="itemsName" >关注</span>
          </li>
          <li v-if="isDetail">
            <span class="num">{{authorInfo.view}}</span>
            <span class="itemsName">总浏览量</span>
          </li>
          <div class="clear"></div>
        </ul>
      </div>
      <div class="introWrap" v-if="!isDetail&&!isEditLayer">
        <p><span>简介：</span><span v-if="authorInfo.person_js != ''" :title="authorInfo.person_js">{{personJs}}</span> <span v-if="authorInfo.person_js == ''">暂无简介</span></p>
      </div>
      <div class="foot" v-if="isSelf&&!isEditLayer">
        <button class="editButton" @click="toEditIntro">编辑简介</button>
      </div>
      <div class="introEdit" v-show="isEditLayer">
        <div class="textarea" contenteditable="true" ref="editing">{{authorInfo.person_js}}</div>
        <div class="editButtons">
          <button class="editCancel" @click="cancelEditIntro">取消</button>
          <button class="editSave" @click="saveEditIntro">保存</button>
        </div>
      </div>

    </main>
    <login-prompt v-show="!isLogin" @closeLayer="closeLogin"></login-prompt>
    </div>
     <!--乐粉说明 弹出框str-->
    <div class="leFenPopUp" v-if="isSelf || this.currentUid == this.user.uid" :class="{'overLeFenWrap':this.overHeight}">
      <div class="layer"></div>
      <div class="leFenWrap">
        <div class="leFenMain">
           <header>
             <span>乐粉说明</span>
             <button class="close" @click="closeLeFenPopUp()"></button>
             <div class="clear"></div>
           </header>
           <main v-html="leFenTxt" :class="{'overHeight':this.overHeight}">
           </main>
           <footer>
             <button class="footerClose" @click="closeLeFenPopUp()">关闭</button>
             <button class="footerEdit" @click="toWrite">提笔就写</button> 
             <div class="clear"></div>
           </footer>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions,mapMutations,mapState} from "vuex";
import loginPrompt from './loginPrompt.vue';
export default {
    name: "PersonInformation",
    data(){
      return{
        isEditLayer:false, //是否编辑个人简介
        isLogin:true, // 是否登录
        overHeight:false
      }
    },
    components:{
      loginPrompt
    },
    /**isSelf 是否是本人视角 authorInfo 作者信息  isDetail 组件是否用在详情页  currentJs 当前作者的简介*/
    props:['isSelf','authorInfo','isDetail','currentJs'],
     computed: {
      ...mapState(['currentUid','authCookie','user','leFenTxt']),
      toHref(){
        return 'mk.php?do=xlsq#/otherCenter/'+ this.authorInfo.uid;
      },
      toSelfHref(){
        return 'mk.php?do=xlsq#/studentCenter/';
      },
      /**
       * @description 对页面显示简介进行限制字符数处理
       */
      personJs(){
        if(this.currentJs == ''){
          return '暂无简介';
        }else if (this.currentJs.length > 50) {
          return this.currentJs.substr(0, 50) + "...";
        } else {
          return this.currentJs;
        }
      },
    }, 
    created(){
      this.getLeFenTxt();
    },
    mounted(){
       let windowHeight = document.body.clientHeight, currentHeight = windowHeight - 150;
        if(currentHeight>400){
          this.overHeight = false;
        }
        this.overHeight = true;
    },
    methods: {
      ...mapMutations(["setCurrentUid"]),
      ...mapActions(['getEditIntro','LeFenMasterAttention','getLeFenTxt']),
      fanFn() { //粉丝页面跳转粉丝组件
        if(this.isSelf){this.$router.push({path: "/fan"});}
        
      },
      attentionFn() { //关注页面跳转关注组件
        if(this.isSelf){this.$router.push({path: "/attention"});}
      },
      attentionSucess(authorInfo){
        //未登录时 提示去登录
        if(!this.authCookie){
          this.isLogin = false;
        } else{
          this.isLogin = true;
          let _this = this;
          this.LeFenMasterAttention({authCookie:this.authCookie,id: authorInfo.uid,follows:1}).then(function(data){
            let code = data.data.code;
            if(code == 200){
              _this.authorInfo.follow = true;
            }
          });
        }
        
      },
      cancelAttentionSucess(authorInfo){
        let _this = this;
        this.LeFenMasterAttention({authCookie:this.authCookie,id: authorInfo.uid,follows:0}).then(function(data){
          let code = data.data.code;
          if(code == 200){
            _this.authorInfo.follow = false;
          }
        });
      },
      closeLeFenPopUp(){
        $('.leFenPopUp').hide();
      },
      showLeFenPopUp(){
        $('.leFenPopUp').show();
      },
      toWrite() { //提笔就写
        window.location.href="mk.php?do=xlsq#/publishArticle/";
      },
      // 编辑个人简介 界面显示
      toEditIntro(){
        this.isEditLayer = true;
      },
      //取消 编辑个人简介
      cancelEditIntro(){
        this.isEditLayer = false;
        let _this = this;
        this.getEditIntro({person_js:this.$refs.editing.innerText,status:0}).then(function(data){
          let code = data.data.code,oldIntro = data.data.data.person_js;
          if(code == 200){
            _this.$emit('introChange',oldIntro);
          }
        });
      },
      //保存 编辑个人简介
      saveEditIntro(){
        this.isEditLayer = false;
        let _this = this;
        this.getEditIntro({person_js:this.$refs.editing.innerText,status:1}).then(function(data){
          let code = data.data.code,newIntro = data.data.data.person_js; 
          if(code == 200){
            _this.$emit('introChange',newIntro);
          }
        });
      },
     clickAvator(authorInfo) {
      this.setCurrentUid(authorInfo.uid);
      },
      closeLogin(){
        this.isLogin = true;
      },
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
    }
}
</script>
<style lang="scss" scoped>
  div,ul,li,main,button,span,p{margin: 0px;padding: 0px;}
  ul,li{list-style: none;}
  button{
    outline: none;
    &:hover{
      cursor: pointer;
    }
  }
  .clear{clear: both;}
  .wrap{
    width: 300px;
    background: #fff;
    border-radius: 4px;
    padding: 30px 0px;
    margin-bottom: 24px;
    main{
      .avatar{
        img{
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 0 auto;
          display: block;
        }
        position: relative;
        margin-bottom: 8px;
        /**灰色V**/
        .greyVIcon{
          position: absolute;
          width: 29px;
          height: 29px;
          background: url(../../assets/img/master_grey.png) no-repeat;
          top: 52px;
          left: 165px;
        }
        .VIcon{
          background: url(../../assets/img/master.png) no-repeat;
        }
      }
      .name{
        width: 100%;
        display: block;
        text-align: center;
        color: #333;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
      }
      .buttonWrap{
        margin-bottom: 24px;
        button{
          background: #FF7A32;
          color: #fff;
          height: 24px;
          line-height: 22px;
          border-radius:12px;
          text-align: center;
          margin: 0 auto;
          border: none;
          display: block;
          font-size: 14px;
          &:hover{
            cursor: pointer;
          }
        }
        button.lightUp{
          padding: 0px 20px;
        }
      }
      .items{
        
        overflow: hidden;
        height: 44px;
        ul li{
          float: left;
          width: 100px;
          text-align: center;
          span{
            display: block;
          }
          span.num{
            color: #333;
            font-size: 16px;
            font-weight: bold;
          }
          span.itemsName{
            font-size: 14px;
            color: #999;
          }
        }
        ul li.fan:hover,ul li.attention:hover{cursor: pointer;}
      } 
      .introWrap{
        
        width: 235px;
        margin: 0 auto;
        margin-top: 20px;
        p{
          font-size: 12px;
          color: #666;
          line-height: 24px;
          overflow: hidden;
          span:first-child{
            float: left;
          }
          span:last-child{
            display: inline-block;
            float: left;
            width: 198px;
            word-wrap: break-word; word-break: normal; 
          }
        }
      }
      .foot{
        text-align: right;
        width: 100%;
        padding-right: 29px;
        box-sizing: border-box;
        .editButton{
          color: #CA8E6E;
          font-size: 12px;
          border: none;
          background: url(../../assets/img/edit.png) 2px no-repeat;
          padding-left: 20px;
        }
      }
    }
  }
  .attention{
    text-align: center;
    margin-bottom: 20px;
     button{
        background: #FF7A32;
        padding: 0px 12px;
        font-size: 14px;
        height:24px;
        line-height: 22px;
        color: #fff;
        border-radius:12px;
        // margin-top: 8px;
        border: none;
        display: inline-block;
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
  .popUp{display: none;}
  .layer{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left:0px;
    background: #000;
    opacity: .5;
    z-index: 1000;
  }
  .layerMain{
    position: absolute;
    width: 200px;
    text-align: center;
    height: 100px;
    line-height: 100px;
    top: 50%;
    left:50%;
    margin-left: -100px;
    margin-top: -50px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    z-index: 1001;
  }
  .leFenWrap{
    position: fixed;
    width: 760px;
    // height: 780px;
    top: 50%;
    left:50%;
    margin-left: -385px;
    // margin-top: -380px;
    background: #fff;
    border-radius: 4px;
    z-index: 1001;
    transform: translateY(-50%);
    padding-bottom: 28px;
  }
  .leFenPopUp{
    display: none;
  }
  .leFenMain{
    header{
      height: 54px;
      line-height: 54px;
      border-bottom: 1px solid #E5E5E5;
      span{
        display: block;
        float: left;
        font-size: 14px;
        color: #333;
        padding-left: 30px;
      }
      button.close{
        float: right;
        margin-right: 30px;
        margin-top: 20px;
        border: none;
        width: 13px;
        height: 13px;
        background: url(../../assets/img/close.png) no-repeat;
        &:hover{
          cursor: pointer;
        }
      }
    }
    main{
      padding: 30px 32px 40px 30px;
      font-size: 14px;
      line-height: 30px;
      color: #333;
      .orange{color: #FF7A32;}
    }
    footer{
      border-top: 1px solid #e5e5e5;
      padding-top: 30px;
      padding-right: 30px;
      button{
        float: right;
        padding: 0px 32px;
        border-radius: 4px;
        font-size: 14px;
      }
      button.footerEdit{
        background: #FF7A32;
        color: #fff;
        height: 34px;
        line-height: 34px;
        border:none;
        margin-right: 18px;
      }
      button.footerClose{
        height: 32px;
        line-height: 32px;
        border: 1px solid #ccc;
        color: #666;
        background: #fff;
      }
    }
  }
  .introEdit{
    width: 260px;
    // margin: 0 auto;
    margin-left: 20px;
    margin-top: 20px;
    .editButtons{
      margin-top: 10px;
      overflow: hidden;
      padding-right: 0px;
      width: 256px;
      button{
        float: right;
        background: #fff;
        border: none;
        margin-left: 16px;
        &:hover{
          cursor: pointer;
        }
      }
      .editSave{
        color: #CA8E6E;
      }
      .editCancel{
        color: #333;
      }
    }
  }
  .textarea{
    min-height: 20px;
    max-height: 300px;
    _height: 120px;
    margin-left: auto;
    margin-right: auto;
    padding: 4px 10px 8px 10px;
    outline: 0;
    border: 1px solid #E5E5E5;
    font-size: 12px;
    line-height: 22px;
    word-wrap: break-word;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 4px;
    color: #666;
 
}
.otherAvator{
  &:hover{
    cursor: pointer;
  }
}
.overHeight{
  height: 400px;
  overflow-y: scroll;
}
.overLeFenWrap{
    position: fixed;
    width: 760px;
    height: 550px;
    top: 50%;
    left:50%;
    margin-left: -385px;
    margin-top: -275px;
    background: #fff;
    border-radius: 4px;
    z-index: 1001;
    padding-bottom: 28px;
  }
</style>


