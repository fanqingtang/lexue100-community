# vue 版小乐社区开发总结

===========================




## 用到的技术站
### **vue、vue-router、vuex、axios 、vue-awesome-swiper（轮播图插件）、vue-cropper（裁剪插件）**



## 第一周开发内容

===========================

- 搭建 vue-cli 3.0 开发环境，研究 vue-cli 多页开发。

1. 首先安装 vue-cli 3.0 安装包 npm install --save vue-cli。然后创建一个项目名。create xxx。创建完成之后会出来两种模式 一种是
   自定义模式，可以选择你需要开发需要的插件。还有一种是 default 默认模式。

2. 根据 ui 设计图和产品功能，大致想想是否需要多页和每页需要多少个路由。把大致要开发的模块路由先搭建好。

```
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const router = new Router({
  linkExactActiveClass: "active",
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("_c/index/home.vue")
    }
  ]
});

export default router;
```

3. 这种通过 component 指定一个函数是懒加载模块。编译的时候会单独打包成一个小的 js和css 模块，这样话只在你点击这个模块的时候才加载这个 js和css,这样避免一次性全部把 js和css 都加载完，这样能提高代码的加载速度。

4. 这次开发首页的轮播图用到了 vue-awesome-swiper 插件。

```js
    .首先 npm install --save vue-awesome-swiper
    . 然后 在入口文件中引入两个文件  import VueAwesomeSwiper from "vue-awesome-swiper"  //轮播图组件
                                   import "swiper/dist/css/swiper.css"  //轮播图组件css


    . 用法如下

    <template>
  <swiper :options="swiperOption" class="swiperImg">
    <swiper-slide v-for="(list, index) in banner" :key="index">
      <a @click="openWin(list)">
        <img :src="list.at_pic" alt="轮播图">
      </a>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
export default {
  name: "SwiperImg",
  data() {
    return {
      swiperOption: {  //这是需要给轮播图传递的属性
        pagination: {  //这是banner图分页器
          el: ".swiper-pagination",   //分页器容器HTML标签
          clickable: true,  //点击分页器指示点分页器会控制Swiper切换
          bulletClass: "my-bullet-dot",  //分页器内元素的类名
          bulletActiveClass: "my-bullet-active" //分页器内活动元素的类名
        },
        autoplay: {
          delay: 3000,  //自动切换的时间间隔
          stopOnLastSlide: false, //如果设置为true，当切换到最后一个slide时停止自动切换
          disableOnInteraction: false  // 用户操作swiper之后自动切换不会停止，每次都会重新启动autoplay
        },
        loop: false  //设置为true 则开启了loop模式，会在原本slide前后复制若干个slide并在合适的时候切换
      }
    };
  },
  props: {
    banner: {
      type: Array
    }
  },
  methods: {
    openWin(list) {  //详情页在新窗口打开
      window.open(list.at_url);
    }
  }
};
</script>
```

5. 开发小乐社区列表页的时候，关于点赞，收藏功能时，只要一个点赞点亮所有的点赞都点亮了。这个原因是没有循环每个组件，而是循环的组件里面的 li 元素。这样就没有区分开每个作用域，而相互影响。

6. 在开发中跟后端交互时出现了跨域问题，后端设置了响应头，但是前端还是请求不到数据。这个原因由于前端用的 axios,请求参数要转一下。通过下载一个 qs 包转一下就可以了，具体请参考(https://juejin.im/post/5b505321f265da0f700709ea)。

7. 首页下拉加载的实现，先判断滚动出去的高度 scrollTop 加上当前页面的高度 clientHeight 大于等于当前页面滚动高度 scrollHeight 就请求数据。要实现下拉加载首先要先定义一个空数组。然后每次请求的数据都要向这个数组里面 concat 拼接。

8. 下拉加载遇到了一个问题就是 scroll 是绑定到 window 上的，vue 又是切换路由，每个路由页面滚动滚动条都会执行 scroll 下拉加载方法。解决办法就是每个页面切换的时候都会执行一个 destroyed 生命周期函数，在这个函数里面移除 scroll 方法就可以。

```js
  1. 例如：

      mounted() {
        window.addEventListener("scroll" , this.loadScroll)
      },
      methods: {
        loadScroll() {
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
              clientH = document.documentElement.clientHeight || document.body.clientHeight,
              scrollH = document.documentElement.scrollHeight || document.body.scrollHeight,
              distanceH = 100;  // 距离底部100的时候就开始加载数据，这样就不要完全到达底部再触发了
              if(scrollTop + clientH + distanceH  >= scrollH ) {
                this.loadMore()  // 加载更多数据方法
              }

        },
        loadMore () {
          if( !this.loading ) {  //这个loading属性是判断当数据正在加载中时显示正在加载的动画，默认是隐藏的。
              if(this.empty) {  //这个是判断数据是否为空，如果数据为空了，就不要再发请求了。
                  this.loading = false;
                  return;
              }
              this.loading = true;  //刚开始时显示正在加载动画
              this.page = ++ this.page;  //当触发下拉加载时，页数先累加

              this.IndexRecommend({   //这是请求首页列表数据的方法
                  page: this.page,    //当前页码
                  pagenum: this.pagenum  //每页显示几条数据,现在默认每页都是显示10条
              }).then(({ data }) => {
                  let code = data.code,
                      desc = data.desc,
                      recommendArr = data.data,
                      recommendLength = recommendArr.length;
                      if(code == 200) {
                        if(recommendLength < this.pagenum && recommendLength >= 0) {  //请求数据已经为空
                            this.empty = true;  //提示已经没有数据了
                            this.loading = false;  //加载中的动画隐藏
                            this.recommend = this.recommend.concat(recommendArr);  //把数据拼接到列表数组里面
                        }else {  //数据还不为空，需要继续请求
                           this.empty = false;  //提示没有数据隐藏
                           this.recommend = this.recommend.concat(recommendArr); //把数据拼接到列表数组里面
                           this.loading= false; //加载中的动画隐藏
                        }
                      }
              })
          }else {
            throw new Error( desc );
          }
        },
        destroyed() {
          window.removeEventListener("scroll" , this.loadScroll)  // 销毁下拉加载更多数据
        }
      }

```

9. ueditor 在页面引入过多页面卡顿的问题。原因: 页面一加载把所有的 ueditor 都初始化加载了。每次切换都加载一次 ueditor，所以就很卡。解决方法是每次评论的时候需要加载 ueditor 的时候才加载一次。

## 第二周开发“小乐快报”，“乐粉天地”，“提笔就写”，“个人中心”内容

1. 小乐快报列表页内容是根据侧边栏切换时的 id 来筛选的，所以有个获取数据顺序问题。先要获取到侧边栏数据以及对应的 id 能然后再来加载列表页数据。

```js
 - 例如

    this.getReportLeftNav().then(({ data }) => {
      let code = data.code,
          desc = code.desc,
          reportNavArr = data.data;
          if(code == 200) {
             this.reportLeftNav = reportNavArr;
             this.attId = reportNavArr[0] && reportNavArr[0].att_id;

             this.getReportArticleList(this.reportArg).then(({ data }) => {
               this.publicDecision(data); //获取小乐快报文章列表
             })
          }
    })


```

2. 乐粉天地和小乐快报差不多。乐粉天地是排序筛选功能。

3. 提笔就写里面有个上传封面，需要裁剪。用到一个 vue-cropper 插件。

```html
  - 例如
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            :high="option.high"
          ></vue-cropper>

    data() {
      return  {
        option: {
          img: "", //裁剪图片的地址
          size: 1 , //裁剪生成图片的质量
          full: false , //是否输出原图比例的截图
          outputType: "png", //裁剪生成图片的格式
          canMove: true, // 图片是否允许滚轮缩放
          fixedBox: true, // 固定截图框大小，不允许改变
          original: false, //上传图片按照原始比例渲染
          canMoveBox: false, //截图框能否拖到
          autoCrop: true,   //是否默认生成截图框
          autoCropWidth: 480, //默认生成截图框的宽度
          autoCropHeight: 280, //默认生成截图框的高度
          centerBox: false,   //截图框是否被限制在图片里面
          high: true          //是否按设备的dpr输出等比例图片
        }
      }
    },
    methods: {
      selectUploadFn(e, num) {  
      //选择上传图片后弹窗裁剪窗口
      this.isUpload = false;
      this.isCropper = true;
      var file = e.target.files[0];
      if (!/\.(gif|jpg|png|bmp|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpg,png,bmp中的一种");
        this.isUpload = true;
        this.isCropper = false;
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.img = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
      this.$refs.inputFile.value = ""; //点击关闭按钮的时候把上传图片框清空，避免第二次选中同一张图片的时候不触发change事件
    },
    changeScale(num) {
      //点击放大缩小执行的方法
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    cropperUploadFn() {
      this.isCropper = false; //点击确定的时候把裁切页面隐藏掉
      //点击裁切图片确定时获取裁切图片的信息
      this.$refs.cropper.getCropData(data => {
        this.modelSrc = data; //裁切的图片
        this.coverImg = false; // 把裁切的图片显示出来
        this.closeUploadFn();
      });
    },
    }

```
4. 提笔就写里面有个编辑文章编辑器用的是ckeditor,ckeditor有几种模式，详情内容可以看ckeditor文档。编辑文章我们下载 @ckeditor/ckeditor5-build-decoupled-document。

```js
 - 例如

  import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";  //ckeditor编辑器
  import "@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn"; //ckeditor汉化包

  mounted() {
    DecoupledEditor.create(document.querySelector("#editor"), { //创建ckeditor
      toolbar: [ //自定义ckeditor编辑器上面的toolbar
        "heading", "|", 
        "fontsize","fontfamily",
        "|","bold","italic","underline","strikethrough","highlight",
        "|","alignment","|","imageUpload","|","undo","redo"
      ],
      language: "zh-cn",  //指定语言为中文
      ckfinder: {  //上传图片配置
        options: {
          resourceType: "Image"
        },
        uploadUrl:  //需要上传图片的地址
          "/public/js/ckfinder/ckfinder_php_3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json"
      }
    })
      .then(editor => { //把ckeditor编辑器可视化dom显示出来
        const toolbarContainer = document.querySelector(".toolbar-container");
        toolbarContainer.prepend(editor.ui.view.toolbar.element);
        this.ckeditor = editor;
      })
      .catch(err => {
        console.error(err.stack);
      });

  }

```

5. 个人中心分页功能的实现，写了个分页组件。

``` js
 - 例如

<template>
  <div class="pageWrap">
    <div v-show="prePage" class="liPage triangleLeft" @click="goPrePage"></div>
    <ul>
      <li
        v-for="(i, index) in showPageBtn"
        :key="index"
        :class="{active: i === currentPage,noHover: !i}"
        @click="pageOffset(i)"
      >
        <a v-if="i" class="notPointer">{{i}}</a>
        <a v-else class="point">···</a>
      </li>
    </ul>
    <div v-show="nextPage" class="liPage triangleRight" @click="goNextPage"></div>
  </div>
</template>

<script>
export default {
  data: () => ({

  }),
  props: {
    num: {   //传进来的总的数据数量
      type: Number
    },
    limit: {  //每页限制多少条  
      type: Number
    }
  },
  computed: {
    offset() {
      //偏移数
      return this.$store.state.offset;
    },
    prePage() {
      //上一页文本是否显示
      return this.offset !== 0 && this.num;
    },

    nextPage() {
      //下一页文本是否显示
      return this.offset + this.limit < this.num && this.num;
    },

    totalPage() {
      //总的页数
      return Math.ceil(this.num / this.limit);
    },

    currentPage() {
      //当前的页数
      return Math.ceil(this.offset / this.limit) + 1;
    },
    showPageBtn() {
      //显示页数编码
      const pageNum = this.totalPage; //总的页数
      const index = this.currentPage; //当前页数
      if (pageNum === 1) return [1]; //总的页数只有一页时 显示一页
      if (pageNum === 2) return [1, 2]; //总的页数只有二页时 显示两页
      if (pageNum === 3) return [1, 2, 3]; //总的页数只有三页时 显示三页
      if (pageNum === 4) return [1, 2, 3, 4]; //总的页数只有四页时 显示四页
      if (pageNum === 5) return [1, 2, 3, 4, 5]; //总的页数只有五页时 显示五页

      if (index <= 3) return [1, 2, 3, 4, 5, 0];
      if (index >= pageNum - 1 || index === pageNum - 2)
        return [0, pageNum - 4, pageNum - 3, pageNum - 2, pageNum - 1, pageNum];
      return [0, index - 2, index - 1, index, index + 1, index + 2, 0];
    }
  },
  methods: {
    pageOffset(i) {
      //选中页数方法
      if (i === 0 || i === this.currentPage) return;
      this.$store.commit("goPage", (i - 1) * this.limit);
      this.$emit("selectPageFn", this.currentPage); 
    },

    goPrePage() {
      //点击上一页执行方法
      this.$store.commit("prePage", this.limit);
      this.$emit("goPrePage" , this.currentPage);
    },

    goNextPage() {
      //点击下一页执行方法
      this.$store.commit("nextPage", this.limit);
      this.$emit("goNextPage" , this.currentPage);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "_a/scss/variable.scss";
.pageWrap {
  text-align: center;
  font-size: 18px;
  div {
    display: inline-block;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 0;
      height: 0;
      border-width: 5px;
      border-style: solid;
    }
  }
  .triangleLeft::after {
    left: 5px;
    border-color: transparent $color-background-j transparent transparent;
  }
  .triangleRight::after {
    right: 5px;
    border-color: transparent transparent transparent $color-background-j;
  }
  .liPage {
    width: 26px;
    height: 26px;
    background-color: $color-background-b;
    border: 1px solid $color-background-d;
    border-radius: 4px;
    margin-right: 10px;
    cursor: pointer;
  }
  ul {
    display: inline-block;
    vertical-align: top;
    li {
      float: left;
      width: 26px;
      height: 26px;
      line-height: 26px;
      border-radius: 4px;
      margin-right: 10px;
      font-size: 0;
      cursor: pointer;
      &:hover {
        background-color: $color-origin;
        a {
          color: $color-background-f;
          border-color: $color-background-f;
        }
      }
      a {
        font-family: "ArialMT";
        font-size: 14px;
        color: $color-background-k;
        vertical-align: middle;
      }
      .point {
          vertical-align: -12px;
      }
    }
    .notPointer {
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: 1px solid $color-background-d;
    }
    .active {
      background-color: $color-origin;
      border: 1px solid $color-origin;
      a {
        color: $color-background-f;
        border: none;
      }
    }
    .noHover:hover {
      background-color: $color-background-f;
    }
  }
}
</style>



```
6. 个    人中心里面，“我发出的文章”，“我点赞的文章”，“我收藏的文章”里面的数量随着点赞，收藏，和删除一起变化。点赞和收藏成功都会返回true，如果为true就让点赞和收藏的文章加1，我发出的文章随时获取我发出文章的length就可以。

## 第三周开发内容

1. 列表详情开发，是打开一个新的页面。这是一个多页开发。通过把文章id通过url带过来。然后通过window.location.search获取带过来的id，再通过id获取文章详情内容。

2. 当用户没有登入时，是不能评论和收藏和点赞的，以及通知都看不到的。判断有没有登入是通过获取authCookie，如果有authCookie就说明登入了，如果没有就显示没登入。

3. 列表详情“赠送乐币”功能开发，在详情页数据里面会把当前的用户信息带过来，然后写好静态页面然后把数据加上去。提交打赏的乐币，把打赏的个数和当前用户id带过去。
打赏成功之后，后端会把打赏的个人信息返回来。再把这条数据unshift到详情页数据里面个人信息数组里面。这样的话打赏成功之后在页面中也显示一条。

## 第四周开发内容

1. 修改头部导航切换时出现抖动，原因是有的页面数据超出一屏出现滚动条，有的没有超出不出现滚动条。由于滚动条也占用宽度就出现抖动。解决办法就在html上面把高度暂时设置成101%都统一出现滚动条。因为数据很少没有超过一屏的。

2. 社区首页，和小乐快报以及乐粉天地切换时数据没有变化，出现缓存了。原因是在路由切换的地方，也就是 router-view外面加了keep-alive。被缓存了。

3. 在“小乐快报”里面把评论打开时然后切换左边导航，评论还是打开。原因是打开之后，切换导航没有设置关闭方法。解决是通过watch监听列表数据，只要列表数据变化了就设置关闭方法。

4. 社区首页，和小乐快报，以及乐粉天地里面的点赞和收藏点击之后是成功了，但是一刷新页面就没点亮。但是后端数据那边没返回成功。最后查询原因是没有传authCookie。切记以后每个接口都需要传authCookie。


## 总结：

1. 通过开发这次小乐社区，明白编写代码要认真仔细，不可大意，不然都是给自己埋下问题。
2. 通过开发这次项目也遇到了很多的问题，通过自己认真的思考，再去请教同事和领导，并且一一解决，自己也在不知不觉中提升。
   总的来说这次开发小乐社区就是踩坑的过程。通过这次开发自己要吸取教训，把遇到问题都一一记录。避免下次再犯同样的问题。
3. 多参考别人的代码，多学习别人的开发技巧，勤思考。
4. 多提高自身js和css以及vue的实力，通过这次开发也渐渐明白自身对vue的熟练度也还不够。  


## 网址预览链接为 (https://www.lexue100.com/mk.php?do=xlsq#/)