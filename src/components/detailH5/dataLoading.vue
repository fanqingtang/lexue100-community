<template>
  <div class="loading">
    <div class="pic"></div>
  </div>
</template>

<script>
    export default {
        name: "DataLoading"
    }
</script>


<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #fff;
}
.loading .pic {
  width: 60px;
  height: 60px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
	animation: myfirst .6s linear 0s infinite;
}
@keyframes myfirst
{
  0% {background:url(../../assets/img/gif1.png) no-repeat;}
	20% {background:url(../../assets/img/gif2.png) no-repeat;}
	40% {background:url(../../assets/img/gif3.png) no-repeat;}
	60% {background:url(../../assets/img/gif1.png) no-repeat;}
	80% {background:url(../../assets/img/gif2.png) no-repeat;}
	100% {background:url(../../assets/img/gif3.png) no-repeat;}
}

</style>