const path = require("path");
const resolve = dir => {
  return path.join(__dirname , dir)
};
const webpack = require("webpack");
module.exports = {
  publicPath:'./',
  outputDir: "dist",
  assetsDir: "public/pages/xlsq",
  pages: {
    index: {
      entry: "src/pages/index/index.js",
      template: "public/index.html",
      filename: "index.html",
      title: "小乐社区首页",
      chunks: ["chunk-vendors", "chunk-common", "index"]
    },
    detail: "src/pages/detail/detail.js",
    detailH5:"src/pages/detailH5/detailH5.js"
  },
  lintOnSave: false, //关闭eslint规范
  configureWebpack: {
    //全局引用jquery
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        axios: "axios"
      })
    ]
  },
  chainWebpack:config=>{
    config.resolve.alias  
      .set("@" , resolve("src"))
      .set("_c" , resolve("src/components"))
      .set("_a" , resolve("src/assets"))
      .set("_p" , resolve("src/pages"))
  },
  devServer: { //代理
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    before(app) {  //重定向
      app.get('/mk.php', function (req, res) {
        const id = req.query && req.query.id;
        const _do = req.query && req.query.do;
        if (_do == 'xlsq')
          res.redirect('/index.html');
        else if (_do == 'article2')
          res.redirect('/detail.html?id=' + id);
        else if (_do == 'article2mb')
          res.redirect('/detailH5.html?id=' + id);
      });
    }
    // proxy: {
    //   "/api": {
    //     target: "http://pgt.lexue100.com",
    //     changeOrigin: true
    //   }
    // }
  }
};
