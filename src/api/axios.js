import axios from 'axios'

const BaseUrl = "https://v1.itooi.cn/tencent/";

//响应拦截
axios.interceptors.response.use(res => {
  return res.data;
});

let get = (url, params) => {
  return axios.get(BaseUrl + url, {
    params
  })
};

export const request = {
  get
};
