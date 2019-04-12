const mutations = {
  setAuthCookie(state, authCookie) {
    //把auth_cookie存起来
    state.authCookie = authCookie;
  },
  IndexBanner(state, { data }) {
    let IndexDataArray = data.data;
    //获取banner以及侧边栏数据
    let code = data.code,
      desc = data.desc;
    if (code == 200) {
      state.activity = IndexDataArray.activity;
      state.banner = IndexDataArray.banner;
      state.hotreview = IndexDataArray.hotreview;
    } else {
      throw new Error(desc);
    }
  },
  IndexUserInfo(state, { data }) {
    //设置用户头像信息
    let code = data.code,
      desc = data.desc,
      userInfo = data.data;
    if (code == 200) {
      state.user = userInfo;
    } else {
      throw new Error(desc);
    }
  },
  prePage(state, offset) {
    //分页 上一页
    state.offset -= offset;
  },
  nextPage(state, offset) {
    //分页 下一页
    state.offset += offset;
  },
  goPage(state, offset) {
    //分页 跳转到指定的页
    state.offset = offset;
  },
  setOffset(state, val) {
    //设置分页组件里面的当前页数
    state.offset = val;
  },
  /**
   * @description 保存小乐快报左侧导航
   * @author hanxiaoyang
   */
  setReportLeftNav(state, { data }) {
    let code = data.code,
      desc = data.desc;
    if (code == "200") {
      state.reportLeftNav = data.data;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 保存小乐快报按月浏览 各个选项
   * @author hanxiaoyang
   */
  setReportArticleMonth(state, { data }) {
    let code = data.code,
      desc = data.desc,
      time = data.data;
    let newTime = Object.assign({ 全部: 0 }, time);
    if (code == "200") {
      state.reportArticleMonth = newTime;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 保存小乐快报文章列表
   * @author hanxiaoyang
   */
  setReportArticleList(state, { data }) {
    let code = data.code,
      desc = data.desc,
      reportArticleListArr = data.data;
    if (code == "200") {
      state.reportArticleList = reportArticleListArr;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 保存乐粉天地高手推荐+文章分类
   * @author hanxiaoyang
   */
  fanWorldType(state, { data }) {
    let code = data.code,
      desc = data.desc,
      types = data.data.typels,
      superior = data.data.superior;
    let firstItem = {
      tid: null,
      title: "全部"
    };
    types.unshift(firstItem);
    if (code == "200") {
      state.fanWorldTypeArr = types;
      state.superior = superior;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 保存乐粉天地文章列表
   * @author hanxiaoyang
   */
  setLeFenWorldArticleList(state, { data }) {
    let code = data.code,
      desc = data.desc;
    if (code == "200") {
      state.leFenWorldArticleList = data.data;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 保存首页评论数据
   * @author fqt
   *
   */
  setIndexComment(state, { data }) {
    let code = data.code,
      desc = data.desc;
    if (code == 200) {
      state.IndexCommentList = data.data.comments;
      state.IndexCommentNum = data.data.commentnum;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 保存个人中心作者信息
   * @author hanxiaoyang
   */
  getStuCenAuthor(state, { data }) {
    let code = data.code,
      desc = data.desc;
    if (code == 200) {
      state.stuCenAuthor = data.data;
    } else {
      throw new Error(desc);
    }
  },
  /**
   *@description 保存个人中心文章列表
   *@author hanxiaoyang
   */

  getStudentCenterList(state, { data }) {
    let code = data.code,
      desc = data.desc;
    if (code == 200) {
      state.studenCenterList = data.data;
    } else {
      throw new Error(desc);
    }
  },
  /**
   *@description 保存个人中心我的粉丝
   *@author hanxiaoyang
   */
  setMyFans(state, { data }) {
    let code = data.code,
      desc = data.desc;
      state.fansZeroOr = 0;
    if (code == 200) {
      state.myFans = data.data;
      if(state.myAttention.fansnum == 0){
        state.fansZeroOr = 1;
      } else {
        state.fansZeroOr = 2;
      }
    } else {
      throw new Error(desc);
    }
  },
  /**
   *@description 保存个人中心我的关注
   *@author hanxiaoyang
   */
  setMyAttention(state, { data }) {
    let code = data.code,
      desc = data.desc;
      state.zeroOr = 0;
    if (code == 200) {
      state.myAttention = data.data;
      if(state.myAttention.follownum == 0){
        state.zeroOr = 1;
      } else {
        state.zeroOr = 2;
      }
      
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 暂存 点击他人头像时 他人UId
   * @author hanxiaoyang
   */
  setCurrentUid(state, data) {
    state.currentUid = data;
  },
  /*
   *
   * @description  文章详情页
   * @author fqt
   */
  detailContentList(state, { data }) {
    let code = data.code,
      desc = data.desc;
    if (code == 200) {
      state.detailContentArr = data.data;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 文章详情页右侧作者信息
   * @author fqt
   */
  detailAuthorList(state, { data }) {
    let code = data.code,
      desc = data.desc,
      authorArticle = data.data;
    if (code == 200) {
      state.detailAuthorList = authorArticle.author;
      //详情页作者信息 与 个人中心作者信息公用一个组件  后端两个接口字段不同 故而在此统一处理!
      if (
        !state.detailAuthorList.article_sum &&
        !state.detailAuthorList.fan_sum
      ) {
        state.detailAuthorList.article_sum = state.detailAuthorList.num;
        state.detailAuthorList.fan_sum = state.detailAuthorList.fans;
      }
      // 详情页作者信息 与 个人中心个人信息 公用一个组件  名称字段 不同 要做相应处理
      // if(!state.detailAuthorList.name){
      //   state.detailAuthorList.name = state.detailAuthorList.nickname;
      // }
      state.detailArticleList = authorArticle.article;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 通知栏信息
   * @author fqt
   */
  noticeInfoList(state, { data }) {
    let code = data.code,
      desc = data.desc,
      noticeArr = data.data;
    if (code == 200) {
      state.noticeNum = noticeArr.count;
      state.noticeList = noticeArr.notice;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 通知列表信息
   * @author fqt
   */

  noticeAllList(state, { data }) {
    let code = data.code,
      desc = data.desc,
      noticeArr = data.data;
    if (code == 200) {
      state.noticeCount = noticeArr.count;
      state.noticeAllList = noticeArr.notice;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 把返回的评论信息存起来
   * @author fqt
   *
   */
  articleComment(state, { data }) {
    let code = data.code,
      desc = data.desc,
      commentArr = data.data;
    if (code == 200) {
      // state.IndexCommentList.unshift(commentArr);
    }
  },

  /**
   * @description 获取提笔就写里面的选择栏目信息
   * @author fqt
   */
  selectColumn(state, { data }) {
    let code = data.code,
      desc = data.desc,
      columnArr = data.data;
    if (code == 200) {
      state.columnTypes = columnArr.typels;
    } else {
      throw new Error(desc);
    }
  },

  /**
   * @description 删除个人中心的数据
   * @author fqt
   */

  delStuCenter(state, content) {
    state.studenCenterList = state.studenCenterList.filter((item, index) => {
      return item !== content;
    });
  },

  /**
   * @description 赠送乐币
   * @author fqt
   */
  giveLeCore(state, { data }) {
    let code = data.code,
      desc = data.desc,
      leCore = data.data;
    if (code == 200) {
      state.leCoreArr = leCore;
    } else {
      console.log(desc);
    }
  },
  /**
   * @description  详情页赠送乐币成功之后把这条数据插入到数组里面
   * @author fqt
   */
  saveLeCore(state, item) {
    state.detailContentArr.reward.unshift(item);
  },
  /**
   * @description 设置乐粉说明内容
   * @author hxy
   */
  setLeFenTxt(state, { data }){
    let code = data.code,
      desc = data.desc,
      txt = data.data.fans_explain;
    if (code == 200) {
      state.leFenTxt = txt;
    } else {
      throw new Error(desc);
    }
  },
  /**
   * @description 
   * @author hxy
   */
  setMobilArticleDetail(state,{ data }){
    let code = data.code,
      desc = data.desc;
    if (code == 200) {
      state.articleDetailH5 = data.data;
    } else {
      throw new Error(desc);
    }
  },
  setMobilArticleComment(state,{ data }){
    let code = data.code,
      desc = data.desc;
    if (code == 200) {
      state.articleCommentH5 = data.data;
    } else {
      throw new Error(desc);
    }
  }
};

export default mutations;
