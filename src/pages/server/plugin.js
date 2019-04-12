import axios from "axios";
import qs from "qs";
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

let serveUrl,
  hostName = window.location.hostname;

//测试接口
serveUrl = "https://pgt.lexue100.com";

if (hostName == "www.lexue100.com") {
  //正式接口
  serveUrl = "https://pangu.lexue100.com";
}

let service = axios.create({
  //创建axios实例
  baseURL: serveUrl, //api的base_url
  timeout: 10000 //请求超时时间
});

// request 拦截器
service.interceptors.request.use(
  config => {
    if (config.method === "post") {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

export default service;
