<template>
  <div :id="randomId" type="text/plain"></div>
</template>

<script>
export default {
  name: "Ueditor",
  props: {
    config: {
      type: Object,
      default: () => {
        let options = {
          initialFrameWidth: 740,
          initialFrameHeight: 80,
          toolbars: [["emotion"]],
          elementPathEnabled: false,  //隐藏元素路径
          wordCount: false  //隐藏字数统计
        };
        return options;
      }
    }
  },
  data() {
    return {
      instance: null, //编辑器实例
      randomId: 'editor_' + (Math.random() * 1000000000), //每个编辑器生成不同的id,以防止冲突
      ready: false
    };
  },
  mounted() {
    // this.initEditor();
  },
  methods: {
    initEditor () {
      //dom 元素已经挂载上去了
      this.$nextTick(() => {
        this.instance = UE.getEditor(this.randomId , this.config);
        //绑定事件，当UEditor 初始化完成后,将编辑器实例通过自定义的ready 事件交出去
        this.instance.addListener("ready" , ()=> {
            this.ready = true;
            this.$emit("ready" , this.instance)
        })
      })
    },
    getContent() {  //获取文本框内容
      return this.instance.getContent();
    },
    setContent() {  //设置文本框内容
      return this.instance.setContent("");
    }
  },
  beforeDestroy() {
    //组件销毁的时候，要销毁 UEditor 实例
    if (this.instance && this.instance.destroy) {
      this.instance.destroy();
    }
  }
};
</script>