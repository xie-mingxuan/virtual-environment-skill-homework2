import axios from 'axios'
import qs from 'qs'


//通用post
export const api_post = (option) => {
  // var baseURL = ''; //生产环境/开发、测试时打包时路径(变量写在全局url.js中在index.html中引入)
  var option = {
    url: option.url || '',
    data: option.data,
    //请求成功的回调
    callback: option.callback || function () {},
    //请求未响应时的处理
    errorback: option.errorback || function () {},
    token: option.token || '',
    contentType:option.contentType == null || option.contentType == undefined || option.contentType == ""?"application/json;charset=utf-8":option.contentType
  }
  // option.data.sign = toSign(option.data) // sign签名：后台设置已不需要签名
  return axios({
    method: 'post', //方法
    url: option.url, //地址
    data: option.data,
    timeout: 10000,
    //`headers`选项是需要被发送的自定义请求头信息
    //ajax传中文的时候，必须加这个，否则后台接受到的中文都是乱码
    // headers: {
    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    //},
    headers : {
      // 'X-Requested-With': 'XMLHttpRequest',
      'Content-Type':  option.contentType,
      'Authorization': option.token
    }
    ,
    transformRequest: [function (data) {
      if(option.contentType.indexOf("application/json") != -1){
        //依自己的需求对请求数据进行处理
        return  JSON.stringify(data)
      }else{
        return qs.stringify(data)
      }
    }],
    //返回数据类型
    responseType: 'json',
    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],
  })
    .then(function (response) { //成功之后回调

      if (response.status == 200) {
        //只有成功的时候才回调函数
        // 不管状态如何，回调函数必须执行
        option.callback(response.data);
        if(response.data.code != "00"){

        }
      } else {

      }
    })
    .catch(function (error) { //失败之后回调
      option.errorback(error)
      // alert("忙不过来了，客官请稍后")
    });
}



//通用get
export const api_get = (option) => {
  // var baseURL = ''; //生产环境/开发、测试时打包时路径(变量写在全局url.js中在index.html中引入)
  var option = {
    url: option.url || '',
    data: option.data,
    //请求成功的回调
    callback: option.callback || function () {},
    //请求未响应时的处理
    errorback: option.errorback || function () {},
    token: option.token || '',
    contentType:option.contentType == null || option.contentType == undefined || option.contentType == ""?"application/json;charset=utf-8":option.contentType
  }
  // option.data.sign = toSign(option.data) // sign签名：后台设置已不需要签名
  return axios({
    method: 'get', //方法
    url: option.url, //地址
    params:option.params,
    timeout: 10000,
    //`headers`选项是需要被发送的自定义请求头信息
    //ajax传中文的时候，必须加这个，否则后台接受到的中文都是乱码
    // headers: {
    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    //},
    headers : {
      // 'X-Requested-With': 'XMLHttpRequest',
      'Content-Type':  option.contentType,
      'Authorization': option.token
    }
    ,
    transformRequest: [function (data) {
      if(option.contentType.indexOf("application/json") != -1){
        //依自己的需求对请求数据进行处理
        return  JSON.stringify(data)
      }else{
        return qs.stringify(data)
      }
    }],
    //返回数据类型
    responseType: 'json',
    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],
  })
    .then(function (response) { //成功之后回调
      if (response.status == 200) {
        //只有成功的时候才回调函数
        // 不管状态如何，回调函数必须执行
        option.callback(response.data);
        if(response.data.code != "00"){
        }
      } else {

      }
    })
    .catch(function (error) { //失败之后回调
      option.errorback(error)
      // alert("忙不过来了，客官请稍后")
    });
}

