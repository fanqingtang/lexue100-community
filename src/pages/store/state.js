const state = {
    authCookie: null, //把authCookie存起来
    activity: [],  //首页侧边栏活动推荐
    banner: [],  //首页banner图
    hotreview: [],  //首页侧边栏热评文章
    recommend: [],  //首页小乐推荐
    noRecommend: false,  //下拉加载时是否有数据标识 
    user: {},       //获取首页用户信息
    offset: 0,    //分页组件默认偏移值
    line: null,  //首页导航栏下划线元素
    reportLeftNav:[],//hanxiaoyang 小乐快报左侧导航
    reportArticleMonth:[], //hanxiaoyang 小乐快报按月浏览
    reportArticleList:[], //hanxiaoyang 小乐快报文章列表
    fanWorldTypeArr:[], //hanxiaoyang 乐粉天地 高手推荐和文章分类
    superior: [],   //乐粉天地右边栏乐粉推荐
    leFenWorldArticleList:[],    //hanxiaoyang 乐粉天地文章列表
    IndexCommentList: [],  //fqt存储首页评论列表数据
    IndexCommentNum: null,  //fqt 存储首页评论的总的数量
    stuCenAuthor:{},//hanxiaoyang 个人中心作者信息
    studenCenterList:[],//hanxiaoyang 个人中心文章列表
    myFans:[],//hanxiaoyang  我的粉丝
    myAttention:[],//hanxiaoyang  我的关注
    currentUid: 0,// hanxiaoyang 点击他人头像 暂存此人UID

    detailContentArr: [],  //fqt文章详情页内容列表
    detailAuthorList:[],   //fqt文章详情页右边栏作者信息
    detailArticleList:[],   //fqt文章详情页右边栏文章信息 
    
    noticeNum: 0,  //fqt 文章首页通知栏总的数量 
    noticeList: [], //fqt 文章首页通知栏列表 
    noticeCount: 0 ,     //fqt 通知列表总的条数
    noticeAllList: [],   //fqt 通知列表的总数据

    columnTypes: [],  //fqt提笔就写选择栏目
    
    leCoreArr: {},  //fqt存储详情页赠送乐币数据

    leFenTxt:'', //hanxiaoyang 乐粉说明 内容  
    zeroOr:0,// hanxiaoyang  我的关注 控制何时显示暂无关注(数据还没请求成功前 统一不显示暂无 成功后再根据又无数据进行显示 因为数据会影响分页 故单独设定一个状态值)
    fansZeroOr:0,// hanxiaoyang  我的粉丝 控制何时显示暂无粉丝(同上)
    articleDetailH5:{}, //hanxiaoyang 移动端详情页文章信息
    articleCommentH5:{},//hanxiaoyang 移动端详情页文章评论

 }


export default state;