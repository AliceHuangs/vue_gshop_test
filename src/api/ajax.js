/*
ajax请求函数模块
函数的返回值是个promise对象
*/


import axios from 'axios'

export default function ajax(url = '', data = {}, type = 'GET') {
  return new Promise(function (resolve, reject) { /*返回一个自己创建的promise对象，为了能够得到的不是response,而是response.data*/

    let promise;

    if (type === 'GET') {
      // 准备url query参数数据
      let dataStr = '' //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr) {
        dataStr = dataStr.substring(0, dataStr.length-1)
        url = url + '?' + dataStr
      }
      // 发送get请求
      promise = axios.get(url)
    } else {
      // 发送post请求
      promise = axios.post(url, data)
    }

    promise.then(response => {
      resolve(response.data)
    })
      .catch(error => {
        reject(error)
      })
  })
}



