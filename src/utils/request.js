import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import router from '@/router'
import Qs from 'qs'
// import {router} from 'vue-router'
// import vue from 'vue'
// vue.use(router)
// create an axios instance
const service = axios.create({
  baseURL: 'https://shop.llhmyp.com/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  transformRequest: [function(data) { 
    //在请求之前对data传参进行格式转换
  data = Qs.stringify(data)

  return data
}],
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if(sessionStorage.getItem('token')!=null ){
      config.headers['Authorization'] = "Bearer " + sessionStorage.getItem('token')
 }
  
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
  console.log(res.code)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code == 500) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      router.replace({ path:'/login' })
      return Promise.reject(new Error(res.message || 'Error'))
    } 
      if(res.code==401){
     
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        sessionStorage.removeItem('token');
        router.replace({ path:'/login' })
        return Promise.reject(new Error(res.message || 'Error'))
      }
     
   
    
    else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
