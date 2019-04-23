import request from '../utils/request.js'

const baseUrl = '/board'
export default {
  /**
   * 获取平均车速看板数据
    */
  getSpeed () {
    return request.get(`${baseUrl}/getSpeed`)
  }
}
