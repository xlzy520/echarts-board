import request from '../utils/request.js'

const baseUrl = '/board'
export default {
  /**
   * 获取平均车速看板数据
    */
  getSpeed () {
    return request(`${baseUrl}/getSpeed`)
  },
  /**
   * 获取停机次数看板数据
   * @returns {*}
   */
  getHaltCount () {
    return request(`${baseUrl}/getHaltCount`)
  },
  /**
   * 获取客诉率看板数据
   * @returns {*}
   */
  getCustomComplaintRate () {
    return request(`${baseUrl}/getCustomComplaintRate`)
  },
  /**
   * 获取原纸利用率数据
   * @returns {*}
   */
  getPaperUseRate () {
    return request(`${baseUrl}/getPaperUseRate`)
  },
  /**
   * 获取平均门幅和修边比率看板数据
   * @returns {*}
   */
  getTrimmingRateAndAvgWidth () {
    return request(`${baseUrl}/getTrimmingRateAndAvgWidth`)
  },
  /**
   * 获取欠数率和准时入库率看板数据
   * @returns {*}
   */
  getOwnRateAndPunctualRate () {
    return request(`${baseUrl}/getOwnRateAndPunctualRate`)
  },
  /**
   * 获取制程损耗和维修费用看板数据
   * @returns {*}
   */
  getProcessLossAndCost () {
    return request(`${baseUrl}/getProcessLossAndCost`)
  }

}
