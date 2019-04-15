import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: '/',
  timeout: 10000 // 请求超时时间
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 1500
      })
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    error.message = error.message === 'timeout of 10000ms exceeded' ? '连接服务器超时！' : error.message
    Message({
      message: error.message,
      type: 'error',
      duration: 1500
    })
    return Promise.reject(error)
  }
)

export default service
