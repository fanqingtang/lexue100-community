<template>
  <div class="myFansWrap">
      <header class="title">我的关注 {{myAttention.follownum}}</header>
      <!--我的关注数为 0 的情况 str-->
      <main class="content fansZero" v-if="zeroOr ==  1">
          <img src="../../assets/img/fans_zero.png" alt="" srcset="">
          <p>暂无数据</p>
      </main>
      <!--我的关注数为 0 的情况 end-->
      <main class="content" v-if="zeroOr == 2">
          <ul>
              <li v-for="fan in myAttention.follows" :key="fan.uid">
                  <member :member="fan" :isPageViews='false' :isAttention='true' @del="delThis(fan)"></member>
              </li>
              <div class="clear"></div>
          </ul>
          <pagination  v-show="countNum > limit"
            :num= "countNum"
            :limit= "limit"
            @selectPageFn="selectPageFn"
            @goPrePage="goPrePage"
            @goNextPage="goNextPage">
            </pagination>
      </main>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Member from '../common/member.vue';
import pagination from "../common/pagination.vue"
export default {
  name:'myFans',
  data(){
        return{
            page: 1,
            limit: 20 //默认每20条一页
        }
    },
  components:{
        Member,
        pagination
    },
  created(){
    // this.myAttention.follownum = 0;
    this.getMyAttention();

     },

   computed: {
        ...mapState(["myAttention",'zeroOr']),
        isZero(){
            return this.myAttention.follownum == 0;
        },
        countNum() {
            return this.myAttention.follownum ; //关注的总的数量
        }
    },
   methods:{
       delThis:function(fan){   
        let index = this.myAttention.follows.indexOf(fan);
        this.myAttention.follows.splice(index,1);
       },
       scrollBar() {
            //滚动条置顶
            document.documentElement.scrollTop = 0;
        },
       selectPageFn(page) {
      //选中页数的方法
        this.page = page;
        this.getMyAttention(this.page); //
        this.scrollBar();
      },
      goPrePage(page) {
        //上一页方法
        this.page = page;
        this.getMyAttention(this.page); //
        this.scrollBar();
      },
     goNextPage(page) {
        //下一页方法
        this.page = page;
        this.getMyAttention(this.page); //
        this.scrollBar();
     },
       ...mapActions(["getMyAttention"]),
   }
}
</script>
<style lang="scss" scoped>
  .clear{clear:both;}
  div,header,main,ul,li{margin: 0px;padding: 0px;}
    ul,li{list-style: none;}
    .myFansWrap{
        width: 1200px;
        margin: 0 auto;
        background: #fff;
        border-radius: 4px;
    }
    .title{
        padding-left: 30px;
        padding-top: 30px;
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 40px;              
    }
    .content{
        padding-left: 50px;
        overflow: hidden;
        padding-bottom: 20px;
        ul li{
            width: 193px;
            float: left;
            margin-right: 108px;
            // height: 200px;
            // background: #333;
            margin-bottom: 58px;
            &:nth-child(4n+4){
                margin-right: 50px;
            }
        }
        
    }
    .fansZero{
        padding-top: 120px;
        padding-bottom: 195px;
        text-align: center;
        background: #fff;
        padding-left: 0px;
        p{
            color: #999;
            font-size: 14px;
        }
    }
</style>


