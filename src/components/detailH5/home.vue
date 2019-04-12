<template>
  <div>
    <!-- v-if="dataOver"-->
    <div class="wrap">
      <!--详情区域 str-->
      <div class="detailMain">

        <!--审核中 仅自己可见 str-->
        <div class="reviewing" v-if="articleDetailH5.at_status == 1" >
          审核中，仅自己可见
        </div>
        <!--审核中 仅自己可见 end-->

        <h4>{{articleDetailH5.at_title}}</h4>
        <div class="breadTips">
          <span>作者：{{articleDetailH5.name}}</span>
          <span class="time">{{articleDetailH5.dateline}}</span>
          <div class="clear"></div>
        </div>
        <div class="detail" v-html="articleDetailH5.at_txt">
        </div>
      </div>
      <!--详情区域 end-->
       <a name="pinglun"></a>
      <!--评论区域 str-->
      <div class="commentMain"  v-if="articleDetailH5.at_status !== 1">
        <div class="commentTitle">
          <h5>{{articleCommentH5.commentnum}}条评论</h5>
          <div class="buttonWrap">
            <button :class="{current:this.order == 'time'}" @click="commentBy('time')">时间</button>
            <button :class="{current:this.order == 'hot'}" @click="commentBy('hot')">热度</button>
          </div>
          <div class="clear"></div>
        </div>
        <v-reload :on-infinite-load="onInfiniteLoad" :parent-pull-up-state="pullUpState" >
        <div class="commentList">
          <ul>
            <li class="oneComment" v-for="(comment,index) in pullUpList" :key="index">
              <comment  :comment = comment :auth_cookie = auth_cookie  :articleId = articleId :currentUseFor = currentUseFor></comment>
              <!--直接评论 str-->
              <!-- <secondComment :comment = comment></secondComment>  -->
              <!--直接评论 end-->
                  
              <!--点赞回复 str-->
              <!-- <zanAndReply @sendSuccess='refreshSubComment' :comment = comment :auth_cookie = auth_cookie  :articleId = articleId :currentUseFor = currentUseFor></zanAndReply> -->
              <!--点赞回复 end-->
              
              <!--评论的评论 str-->
              <!-- <sub-comment :auth_cookie = auth_cookie  :ac_id = comment.ac_id></sub-comment> -->
              <!-- <div class="secondComment">
                <ul v-if="comment.commcount != 0">
                  <li v-for="comment in comment.comment" :key="comment.uid">
                    <secondComment :comment = comment></secondComment>
                  </li>
                  <li v-for="(comment,index) in subComments" :key="index">
                    <secondComment :comment = comment></secondComment>
                  </li>
                </ul>
                <div class="moreComment" v-if="comment.commcount != 0">
                  <span v-if="comment.commcount < 5 || comment.commcount == 5 || subCommentLen == 0" style="display:none;">没有更多了</span>
                  <span v-else-if="noMore" @click="showSecondCommend(comment.ac_id)">剩余{{comment.commcount - 5}}条回复</span>
                  <span v-else-if="!noMore" @click="showSecondCommend(comment.ac_id)">剩余{{subCommentLen}}条回复</span>
                </div>
              </div>  -->
              <!--评论的评论 end-->
            </li>
          </ul>
        </div>
      
        </v-reload>


      </div>
      <!--没有更多 str   v-if="pullUpState==3 && articleDetailH5.at_status !== 1"-->
      <div class="noMoreComment">
        <div>
          <span class="line"></span>
          <span v-if="pullUpList.length !== 0">没有更多了</span>
          <span v-else>暂无评论</span>
          <span class="line"></span>
        </div>
      </div>    
      <!--没有更多 end-->
      
      
      <!--评论区域 end-->
    </div>
    <!-- <data-loading v-else></data-loading> -->
  </div>
</template>
<script>
import secondComment from './secondComment.vue';
import zanAndReply from './zanAndReply.vue';
import PullUpReload from './pullUpReload.vue';
import dataLoading from './dataLoading.vue';
import comment from './comment.vue';
import { mapState,mapActions,mapMutations } from 'vuex'
export default {
  name:'Home',
  data(){
    return{
      articleId:null,//文章ID
      type:'all',
      order:'time',
      webview:1,
      page:1,
      pagenum:10,
      initialShowNum:10,
      auth_cookie:null,
      currentUseFor:'', //当前机型
      everyLoadingNum: 3, // 每次加载的个数
      pullUpState: 0, // 子组件的pullUpState状态
      pullUpList: [], // 上拉加载更多数据的数组
      showPullUpListLength: this.initialShowNum, // 上拉加载后所展示的个数
      secondCommentPage:0, // 二级评论页数
      secondCommentPageNum:10, // 二级评论每页显示个数
      // subComments:[], // 点击查看更多二级评论
      // subCommentLen:null, // 二级评论个数 (抛去初次显示的5条)
      // noMore:true, //二级评论是否还有更多
      // dataOver:false// 数据加载完毕
    }
  },
  mounted(){
    let url = window.location.href;
    let obj = this.getQueryString(url);
    this.articleId = obj.at_id;  
    this.auth_cookie = obj.auth_cookie;
    this.currentUseFor = obj.use_for;
    this.getMobilArticleDetail(this.articleDetailArg).then(({ data })=>{
      // let code = data.code,
      //       desc = data.desc;
      // if(code == 200){
      //   this.dataOver = true;
      // }
    });
    this.getMobilArticleComment(this.detailCommentArg).then(({ data })=>{
      let code = data.code,
            desc = data.desc;
      if(code == 200){
        this.getStartPullUpState();
        this.getPullUpDefData();
        // this.dataOver = true;
      }
    });
    window.refreshComment = this.refreshComment.bind(this);
  },
  computed:{
    ...mapState(['articleDetailH5','articleCommentH5']),
    articleDetailArg(){
      let obj = {
        auth_cookie: this.auth_cookie,
        at_id: this.articleId,
      }
      return obj;
    },
    detailCommentArg() {
      //获取评论
      let obj = {
        auth_cookie: this.auth_cookie,
        at_id: this.articleId,
        type: this.type,
        order: this.order,
        webview:this.webview,
        page: this.page,
        pagenum: this.pagenum,
      };
      return obj;
    },
    // detailSecondCommentArg(){
    //   let obj = {
    //     auth_cookie: this.auth_cookie,
    //     ac_id:this.ac_id,
    //     page:this.secondCommentPage,
    //     pagenum: this.secondCommentPageNum,
    //   };
    //   return obj;
    // }
  },
  components:{
    secondComment,
    zanAndReply,
    'v-reload': PullUpReload,
    dataLoading,
    comment
  },
  methods:{
    ...mapActions(['getMobilArticleDetail','getMobilArticleComment','mobilSubReplayComment']),
    commentBy(order){
      this.order = order;
      this.page = 1;
      this.getMobilArticleComment(this.detailCommentArg).then(({ data })=>{
        let code = data.code,
        desc = data.desc;
        if(code == 200){
          this.getStartPullUpState();
          this.getPullUpDefData();
        }
      });
    },

    //刷新评论(评论文章 + 回复评论  后调用此方法)
    
    refreshComment(){
      this.page = 1;
      this.getMobilArticleComment(this.detailCommentArg).then(({ data })=>{
        let code = data.code,
              desc = data.desc;
        if(code == 200){
          this.getStartPullUpState();
          this.getPullUpDefData();
        }
      });
    },
    getQueryString(url){
      if(url) { 
        url=url.substr(url.indexOf("?")+1,-2); //字符串截取，比我之前的split()方法效率高 
      } 
      var result = {}, //创建一个对象，用于存name，和value 
      queryString =url || location.search.substring(1), //location.search设置或返回从问号 (?) 开始的 URL（查询部分）。 
      re = /([^&=]+)=([^&]*)/g, //正则，具体不会用 
      m; 
      while (m = re.exec(queryString)) { //exec()正则表达式的匹配，具体不会用 
          result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]); //使用 decodeURIComponent() 对编码后的 URI 进行解码 
      } 
      return result;
      },

      // 获取上拉加载的初始数据
    getPullUpDefData() {
      this.pullUpList = []
      this.pullUpList = this.articleCommentH5.comments;
   
    },
    getStartPullUpState () {
      if (this.articleCommentH5.commentnum === this.initialShowNum || this.articleCommentH5.commentnum < this.initialShowNum) {
        // 修改子组件的pullUpState状态
        this.pullUpState = 3
      } else {
        this.pullUpState = 0
      }
    },
    // 上拉一次加载更多的数据
    getPullUpMoreData () {
      if(this.articleCommentH5.commentnum > this.pullUpList.length){
         this.page ++;
        // this.showPullUpListLength = this.pullUpList.length;
        this.getMobilArticleComment(this.detailCommentArg).then(({ data })=>{
            let code = data.code,
              desc = data.desc,
              commentsArr = data.data,
              commentLength = commentsArr.comments.length;
            if (code == 200) {
              this.pullUpList = this.pullUpList.concat(commentsArr.comments);
              if (this.articleCommentH5.commentnum === this.pullUpList.length) {
                this.pullUpState = 3
              } else {
                this.pullUpState = 0
              }
            }
          });
      }
     
    },
    onInfiniteLoad (done) {
      if (this.pullUpState === 0) {
        this.getPullUpMoreData()
      }
      done()
    },
    // showSecondCommend(ac_id){
    //   this.noMore = false;
    //   this.ac_id = ac_id;
    //   this.secondCommentPage ++;
    //   this.mobilSubReplayComment(this.detailSecondCommentArg).then(({ data })=>{
    //     let code = data.code,
    //           desc = data.desc,
    //           arr = data.data.comments,
    //           len = data.data.commentnum;
    //     if(code == 200){
    //       this.subComments = this.subComments.concat(arr);
    //       this.subCommentLen = len;
    //       if(len == 0) this.noMore = true;
    //     }
    //   });
    // }
  }
}
</script>
<style lang="scss" scoped>
  h4,div,button,ul,li,img,p,button{padding: 0px;margin: 0px;}
  p{margin-block-start:0rem;margin-block-end:0rem;}
  ul,li{list-style: none;}
  .clear{clear: both;}
  .wrap{
    width: 100%;
    background: #f3f3f3;
    padding-top: 1.5rem;
    
  }
  .reviewing{
    background:rgba(204,204,204,1);
    border-radius:8px;
    height: 2.4rem;
    line-height: 2.4rem;
    color: #fff;
    width: 13.9rem;
    text-align: center;
    margin-bottom: 1.8rem;
    font-size: 1.1rem;
  }
  .detailMain{
    background: #fff;
    padding: 2rem 1.5rem;
    h4{
      font-size: 2.2rem;
    }
  }
  .breadTips{
    margin-top: 1rem;
    color: #999;
    font-size: 1.2rem;
    span{
      display: block;
      &:first-child{
        float: left;
      }
    }
    .time{
        float: right;
      }
  }
  .detail{
    margin-top: 3rem;
    color: #333;
    font-size: 1.6rem;
    line-height: 24px;
    img{
      width: 100%;
    }
  }
  .commentMain{
    background: #fff;
    padding: 0px 1.5rem;
    margin-top: 1.2rem;
    .commentTitle{
      padding: 1rem 0px;
      h5{
        font-size: 1.5rem;
        color: #333;
        font-weight: bold;
        float: left;
      }
      .buttonWrap{
        float: right;
        button{
          display: inline-block;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #999;
          outline: none;
          &:first-child{
            margin-right: 2rem;
          }
        }
        button.current{
          color: #FF7A32;
        }
      }
    }
    .commentList{
      ul{
        li.oneComment{
          border-top: 1px solid #E5E5E5;
          padding: 1rem 0px;
          }
        }
      }
    }
    
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
    position: relative;
    div{
      // width: 180px;
      // margin: 0 auto;
      position:absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      span:first-child{
        // right: .6rem;
      }
      span:last-child{
        // left: .6rem;
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
  .oneComment>div{
    border-bottom: none;
    padding-top: 0px;
  }
</style>


