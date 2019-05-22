import request from '../utils/request.js'

const baseUrl = '/backStage'
export default {
  /**
   * 查询已保存班次信息
   * @returns {*}
   */
  getTeam () {
    return request.get(`${baseUrl}/getTeam`)
  },

  /**
   * 保存换班
   * @param restDay
   * @param dayShift
   * @param eveningShift
   * @returns {*}
   */
  changeTime (data) {
    return request.post(`${baseUrl}/changeTime`, data)
  },
  // 获取班组所有数据
  getBoardData (data) {
    return request.post(`${baseUrl}/getBoardData`, data)
  },
  // 保存班组所有数据
  addBoardData (data) {
    return request.post(`${baseUrl}/addBoardData`, data)
  }
}
