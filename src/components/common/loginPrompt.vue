<template>
  <div>
    <div class="layer"></div>
    <div class="leFenWrap">
      <div class="leFenMain">
          <header>
            <span>提示</span>
            <button class="close" @click="close"></button>
            <div class="clear"></div>
          </header>
          <main>
            <span>请先登录后才能进行此操作</span>
          </main>
          <footer>
            <a href="https://www.lexue100.com/mk.php?do=login_lexue&callback=mk.php?do=xlsq" class="login">去登录</a>
            <button @click="close">取消</button>
            <div class="clear"></div>
          </footer>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      
    }
  },

  methods:{
    close(){
      this.$emit('closeLayer');
    }
  }
}
</script>
<style lang="scss" scoped>
  .clear{clear: both;}
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
  .leFenWrap{
    position: fixed; 
    width: 400px;
    height: 232px;
    top: 50%;
    left:50%;
    margin-left: -200px;
    margin-top: -166px;
    background: #fff;
    border-radius: 4px;
    z-index: 1001;
  }

  .leFenMain{
    header{
      width: 100%;
      height: 54px;
      line-height: 54px;
      margin-bottom: 45px;
      span{
        display: block;
        float: left;
        font-size: 14px;
        color: #333;
        height: 54px;
        padding-left: 30px;
      }
      button.close{
        float: right;
        margin-right: 30px;
        margin-top: 20px;
        border: none;
        width: 13px;
        height: 13px;
        display: block;
        background: url(../../assets/img/close.png) no-repeat;
        outline: none;
        &:hover{
          cursor: pointer;
        }
      }
    }
    main{
      width: 100%;
      text-align: center;
      font-size: 14px;
      color: #333;
      span{
        display: block;
        width: 50%;
        text-align: center;
        margin: 0 auto;
      }
    }
    footer{
      margin-top: 50px;
      border-top: 1px solid #e5e5e5;
      width: 100%;
      height: 60px;
      font-size: 16px;
      .login{
        display: block;
        float: left;
        box-sizing: border-box;
        width: 50%;
        text-align: center;
        border-right: 1px solid #e5e5e5;
        color: #FF7A32;
        height: 60px;
        line-height: 60px;
      }
      button{
        float: right;
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        display: block;
        width: 50%;
        text-align: center;
        border: none;
        background: none;
        outline: none;
        &:hover{
          cursor: pointer;
        }
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
</style>

