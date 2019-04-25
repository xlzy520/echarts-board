import axios from 'axios'
import { message } from 'ant-design-vue'

// 创建axios实例
const service = axios.create({
  baseURL: '/djfb',
  timeout: 10000 // 请求超时时间
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success) {
      message.error(res.msg, 1.5)
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    error.message = error.message === 'timeout of 10000ms exceeded' ? '连接服务器超时！' : error.message
    message.error(error.msg, 1.5)
    return Promise.reject(error)
  }
)

export default service
