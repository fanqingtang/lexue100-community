<template>
  <div class="myFansWrap">
      <header class="title">我的粉丝 {{myFans.fansnum}}</header>
      <!--我的粉丝数为 0 的情况 str-->
      <main class="content fansZero" v-if="fansZeroOr == 1">
          <img src="../../assets/img/fans_zero.png" alt="" srcset="">
          <p>暂无数据</p>
      </main>
      <!--我的粉丝数为 0 的情况 end-->
      <main class="content" v-if="fansZeroOr == 2">
          <ul>
              <li v-for="fan in myFans.fans" :key="fan.uid">
                  <member :member="fan" :isPageViews='false' :isAttention='false' :isFan='true' @del="cancel(fan)" @attention="addAttention(fan)"></member>
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
            limit: 20,  //默认每20条一页
        }
    },
  components:{
        Member,
        pagination
    },
  created(){
      this.getMyFans();
  },
  
  computed: {
    ...mapState(["myFans",'fansZeroOr']),
    isZero(){
        return this.myFans.fansnum == 0;
    },
    countNum() { //总的数量
       return this.myFans.fansnum; 
    }
  },
   methods:{
       ...mapActions(["getMyFans"]),
       scrollBar() {
            //滚动条置顶
            document.documentElement.scrollTop = 0;
        },
       selectPageFn(page) {
      //选中页数的方法
        this.page = page;
        this.getMyFans(this.page);
        this.scrollBar();
      },
      goPrePage(page) {
        //上一页方法
        this.page = page;
        this.getMyFans(this.page);
        this.scrollBar();
      },
     goNextPage(page) {
        //下一页方法
        this.page = page;
        this.getMyFans(this.page); 
        this.scrollBar();
     },
       cancel:function(fan){
           fan.follow = false;
           fan.fans--;
       },
       addAttention:function(fan){
           fan.follow = true;
           fan.fans++;
       }
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


