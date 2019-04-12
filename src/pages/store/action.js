import GetCookie from "js-cookie"; //获取auth_cookie的包
import axios from "../server/plugin.js"; //引入axios配置
const auth_cookie = GetCookie.get("uchome_auth"); //获取auth_cookie
const actions = {
  SaveAuthCookie({ commit }) {
    //把auth_cookie存起来
    commit("setAuthCookie", auth_cookie);
  },
  IndexBanner({ commit }) {
    //首页获取banner和侧边栏数据
    axios
      .post("/api/pc/bbs/index_banner", {
        auth_cookie
      })
      .then(data => {
        commit("IndexBanner", data);
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  IndexRecommend({ commit }, obj) {
    let { page, pagenum } = obj;
    //首页获取小乐推荐数据
    return axios
      .post("/api/pc/bbs/index_recommend", {
        page,
        pagenum,
        auth_cookie
      })
      .then(data => {
        return data;
      });
  },
  /**
   * @description 获取用户信息
   * @author fqt
   *
   */
  IndexUserInfo({ commit }) {
    axios
      .post("/api/pc/bbs/info_userinfo", {
        auth_cookie
      })
      .then(data => {
        commit("IndexUserInfo", data);
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  /**
   * @description 获取小乐快报左侧导航
   * @author hanxiaoyang
   */
  getReportLeftNav({ commit }) {
    return axios
      .post("/api/pc/bbs/index_newsmenu",{
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 获取小乐快报按月浏览 选项
   * @author hanxiaoyang
   */
  getReportArticleMonth({ commit }, att_id) {
    axios
      .post("/api/pc/bbs/index_artsmonth", {
        att_id,
        auth_cookie
      })
      .then(data => {
        commit("setReportArticleMonth", data);
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 获取小乐快报文章列表
   * @author hanxiaoyang
   */
  getReportArticleList({ commit }, obj) {
    let { page, pagenum, att_id, date } = obj;

    return axios
      .post("/api/pc/bbs/index_newsarticle", {
        page,
        pagenum,
        att_id,
        date,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 获取乐粉天地高手推荐+文章分类
   * @author hanxiaoyang
   */
  fanWorldType({ commit }) {
    axios
      .post("/api/pc/bbs/index_superior", {
        auth_cookie
      })
      .then(data => {
        commit("fanWorldType", data);
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 获取乐粉天地文章列表
   * @author hanxiaoyang
   */
  fanWorldList({ commit }, obj) {
    let { page, pagenum, order, superior_type } = obj;
    return axios
      .post("/api/pc/bbs/index_supercolumn", {
        page,
        pagenum,
        order,
        superior_type,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 乐粉天地高手推荐 关注作者
   */
  LeFenMasterAttention({ commit }, obj) {
    return axios
      .post("/api/pc/bbs/index_follow", {
        id: obj.id,
        follows: obj.follows,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  IndexCollect({ commit }, obj) {
    let { at_id, collect } = obj;
    collect = collect ? 1 : 0;
    //fqt首页文章列表收藏方法
    return axios
      .post("/api/pc/bbs/index_collection", {
        at_id,
        collect,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  IndexZan({ commit }, obj) {
    //首页点赞功能
    let { about_id, givezan, type } = obj;
    givezan = givezan ? 0 : 1; //givezan是true高亮 然后传0 就是取消点赞
    return axios
      .post("/api/pc/bbs/index_givezan", {
        about_id,
        givezan,
        type,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 获取文章列表评论数据
   * @author fqt
   */

  IndexComment({ commit }, obj) {
    let { at_id, type, order, page, pagenum } = obj;
    return axios
      .post("/api/pc/bbs/info_comment", {
        at_id,
        type,
        order,
        page,
        pagenum,
        auth_cookie
      })
      .then(data => {
        commit("setIndexComment", data);
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 获取个人中心作者信息
   * @author hanxiaoyang
   */

  studentCenterAuthor({ commit }, uid) {
    let params = null;
    if (uid !== undefined) {
      params = {
        uid,
        auth_cookie
      };
    } else {
      params = {
        auth_cookie
      };
    }
    return axios
      .post("/api/pc/bbs/info_minecenter", params)
      .then(data => {
        commit("getStuCenAuthor" , data);
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 获取个人中心文章列表
   * @author hanxiaoyang
   */
  studentCenterList({ commit }, obj) {
    let { page, pagenum, order, uid } = obj;
    axios
      .post("/api/pc/bbs/info_minearticle", {
        page,
        pagenum,
        order,
        uid,
        auth_cookie
      })
      .then(data => {
        commit("getStudentCenterList", data);
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 获取个人中心我的粉丝
   * @author hanxiaoyang
   */

  getMyFans({ commit },params) {
    let page;
    if(params){
      page = params;
    }else{
      page = 1;
    }
    axios
      .post("/api/pc/bbs/info_minefans", {
        auth_cookie,
        page
      })
      .then(data => {
        commit("setMyFans", data);
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 获取个人中心我的关注
   * @author hanxiaoyang
   */

  getMyAttention({ commit },params) {
    let page;
    if(params){
      page = params;
    }else{
      page = 1;
    }
    
    axios
      .post("/api/pc/bbs/info_minefollow", {
        auth_cookie,
        page,
      })
      .then(data => {
        commit("setMyAttention", data);
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  /**
   * @description 文章详情页
   * @author fqt
   *
   */
  detailContentList({ commit }, id) {
    return axios
      .post("/api/pc/bbs/info_article", {
        at_id: id,
        auth_cookie
      })
      .then(data => {
        commit("detailContentList", data);
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  /**
   *
   * @description 文章详情右侧作者
   * @author fqt
   */
  detailAuthorInfo({ commit }, id) {
    return axios
      .post("/api/pc/bbs/info_author", {
        at_id: id,
        auth_cookie
      })
      .then(data => {
        commit("detailAuthorList", data);
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  /**
   * @description 首页通知信息
   * @author fqt
   *
   */
  noticeInfo({ commit }, obj) {
    let { page, pagenum, type } = obj;
    axios
      .post("/api/pc/bbs/index_notice", {
        page,
        pagenum,
        type,
        auth_cookie
      })
      .then(data => {
        if (type == "part") {
          commit("noticeInfoList", data);
        } else {
          commit("noticeAllList", data);
        }
      })
      .catch(err => {
        // throw new Error(err);
      });
  },
  /**
   * @description 保存/取消 编辑个人简介
   * @author hanxiaoyang
   */
  getEditIntro({ commit }, obj) {
    return axios
      .post("/api/pc/bbs/info_editpersonjs", {
        auth_cookie,
        person_js: obj.person_js,
        status: obj.status
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 文章评论
   * @author fqt
   */

  articleComment({ commit }, obj) {
    let { at_id, ac_txt, ac_id } = obj;
    return axios
      .post("/api/pc/bbs/info_artcomment", {
        at_id,
        ac_txt,
        ac_id,
        auth_cookie
      })
      .then(data => {
       // commit("articleComment", data); //一级回复评论
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 文章二级回复评论
   * @author fqt
   */

  secondArticleComment({ commit }, obj) {
    let { at_id, ac_txt, ac_id } = obj;
    return axios
      .post("/api/pc/bbs/info_artcomment", {
        at_id,
        ac_txt,
        ac_id,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  /**
   * @description 提笔就写选择栏目
   * @author fqt
   *
   */
  selectColumn({ commit }) {
    return axios
      .post("/api/pc/bbs/index_superior",{
        auth_cookie
      })
      .then(data => {
        return data;
        // commit("selectColumn", data);
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  /**
   * @description 提笔就写里面上传文章
   * @author fqt
   */

  uploadArticle({ commit }, obj) {
    let { at_title, at_txt, at_pic, superior_type, at_id } = obj;
    return axios
      .post("/api/pc/bbs/info_addarticle", {
        at_title,
        at_txt,
        at_pic,
        superior_type,
        at_id,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(err);
      });
  },

  /**
   * @description 个人中心文章删除
   * @author fqt
   */

  deleteArticleList({ commit }, at_id) {
    return axios
      .post("/api/pc/bbs/info_delessay", {
        at_id,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  /**
   * @description 详情页打赏乐币
   * @author fqt
   */

  giveCoreList({ commit }, at_id) {
    axios
      .post("/api/pc/bbs/info_rewardpop", {
        at_id,
        auth_cookie
      })
      .then(data => {
        commit("giveLeCore", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  /**
   * @description 确认赠送乐币
   * @author fqt
   *
   */
  sureGiveLeCore({ commit } , obj) {
    let {at_id , coin} = obj;
    return axios
      .post("/api/pc/bbs/info_artreward" , {
        at_id,
        coin,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  /**
   * @description 乐粉说明内容
   */
  getLeFenTxt({ commit }, at_id) {
    axios
      .post("/api/pc/bbs/info_fansexplain", {
        at_id,
        auth_cookie
      })
      .then(data => {
        commit("setLeFenTxt", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  /**
    * @description 手机端详情页文章信息
    * @author hxy
    */
  getMobilArticleDetail({ commit }, obj){
    let {auth_cookie, at_id} = obj;
    return axios.post("/api/pc/bbs/info_article",{
      auth_cookie,
      at_id
    })
         .then(data => {
           commit("setMobilArticleDetail",data);
           return data;
         })
         .catch(err => {
           console.log(err);
         });
  },
  /**
   * @description 手机端文章详情页评论
   */
  getMobilArticleComment({ commit }, obj) {
    let {auth_cookie, at_id, type, order, webview, page, pagenum} = obj;
    return axios
      .post("/api/pc/bbs/info_comment", {
        auth_cookie,
        at_id,
        type,
        order,
        webview,
        page,
        pagenum,
        
      })
      .then(data => {
        commit("setMobilArticleComment", data);
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
   /**
   * @description 移动端回复  一级评论
   * @author hxy
   */

  mobilReplayComment({ commit }, obj) {
    let { at_id, ac_txt, ac_id,auth_cookie} = obj;
    return axios
      .post("/api/pc/bbs/info_artcomment", {
        at_id,
        ac_txt,
        ac_id,
        auth_cookie
      })
      .then(data => {
        // commit("articleComment", data);
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  /**
   * @description 移动端点赞回复
   * @author hxy
   */
  commentZan({ commit }, obj) {
    //首页点赞功能
    let { about_id, givezan, type, auth_cookie} = obj;
    givezan = givezan ? 0 : 1; 
    return axios
      .post("/api/pc/bbs/index_givezan", {
        about_id,
        givezan,
        type,
        auth_cookie
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },
   /**
   * @description 移动端回复  二级回复
   * @author hxy
   */

  mobilSubReplayComment({ commit }, obj) {
    let { ac_id, page, pageNum,auth_cookie} = obj;
    return axios
      .post("/api/pc/bbs/info_subcomment", {
        ac_id,
        page,
        pageNum,
        auth_cookie
      })
      .then(data => {
        // commit("articleComment", data);
        return data;
      })
      .catch(err => {
        throw new Error(err);
      });
  },

};


export default actions;
