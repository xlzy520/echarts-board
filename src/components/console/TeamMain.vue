<template>
  <div>
    <div class="console-team">
      <a-checkbox-group v-model="checkedList">
        <a-checkbox v-for="(time,index) in data.timeData" :value="time.teamName" :key="time.teamName">
          <span class="console-team-name">{{time.teamName}}</span>
          <a-range-picker
            :allowClear="false"
            :showTime="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
            :disabledDate="(current)=>disabledDate(current, time.teamName)"
            :disabledTime="(current, type)=>disabledTime(current,type, time.teamName)"
            :value="[moment(range[index][0]),moment(range[index][1])]"
            @change="timeRangeChange(...arguments, index)"
            @ok="cacheRange(index)"
            @blur="cacheRange(index)"
          >
            <template slot="renderExtraFooter">
              <a-button type="danger" @click="cancelTimeRange(index)">取消</a-button>
            </template>
          </a-range-picker>
        </a-checkbox>
      </a-checkbox-group>
    </div>
    <div class="console-tabs">
      <div class="console-tabs-bar">
        <div
          v-for="(tab,index) in tabs"
          :key="tab"
          @click="tabChange(index)"
          :class="['tab-name', {'active-tab': index === activeTab }]">{{tab}}
        </div>
      </div>
      <div class="console-tabs-content">
        <a-table
          :columns="columns"
          :dataSource="data.teamBoardData[activeTab].boardData"
          bordered
          :pagination="false"
          :rowKey="record => record.name"
          :loading="tableLoading">
          <template v-for="(col,indexColumn) in ['day', 'month', 'monthGoal']"
                    :slot="col"
                    slot-scope="text, record, index">
            <a-input
              class="table-input"
              v-if="filterDisabled(record, index, indexColumn)"
              :value="text"
              maxLength="10"
              @change="e => inputChange(e.target.value, record, col)"
            />
            <div v-else>{{text}}</div>
          </template>
        </a-table>
      </div>
    </div>
    <div class="console-footer">
      <a-button @click="exchangeTeam" :disabled="!data.timeData.length>0">换班</a-button>
      <a-button type="primary" class="save" @click="save" :disabled="!data.timeData.length>0">保存</a-button>
    </div>
    <modal title="换班" :visible="teamVisible" @close="close">
      <switch-team @close="close" ref="switchTeam"></switch-team>
    </modal>
  </div>
</template>

<script>

import SwitchTeam from './SwitchTeam'
import Modal from '../Modal'
import backStage from '../../api/backStage'
export default {
  name: 'TeamMain',
  data () {
    return {
      teamVisible: false,

      checkedList: ['A', 'B', 'C', 'D'],
      cacheTimeRange: [],
      range: [[], [], [], []],
      activeTab: 0,
      tabs: ['A', 'B', 'C', 'D', '总线'],
      columns: [
        {
          title: '看板编号',
          width: '10%',
          dataIndex: 'number',
          align: 'center',
          scopedSlots: { customRender: 'number' }
        }, {
          title: '项目名称',
          width: '30%',
          dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        }, {
          title: '日累计',
          width: '20%',
          dataIndex: 'day',
          align: 'center',
          scopedSlots: { customRender: 'day' },
          customCell: (record, index) => {
            if (this.activeTab !== 4) {
              if (this.data.teamBoardData[this.activeTab].canWrite) {
                if ([0, 1, 4, 5].includes(index)) {
                  return {
                    class: {
                      readOnly: true
                    }
                  }
                }
              } else {
                return {
                  class: {
                    readOnly: true
                  }
                }
              }
            } else {
              if (index < 11) {
                return {
                  class: {
                    readOnly: true
                  }
                }
              }
            }
          }
        }, {
          title: '月累计(总数)',
          width: '20%',
          dataIndex: 'month',
          align: 'center',
          scopedSlots: { customRender: 'month' },
          customCell: function (record, index) {
            return {
              class: {
                readOnly: true
              }
            }
          }
        }, {
          title: '月目标',
          width: '20%',
          dataIndex: 'monthGoal',
          align: 'center',
          scopedSlots: { customRender: 'monthGoal' },
          customCell: (record, index) => {
            if (this.activeTab === 4) {
              return {
                class: {
                  readOnly: true
                }
              }
            }
          }
        }
      ],
      data: {
        teamBoardData: [{
          boardData: []
        }],
        timeData: []
      },

      tableLoading: false,
      disabledHour: '',

      navDate: this.moment().format('YYYY-MM-DD')
    }
  },
  components: {
    SwitchTeam, Modal
  },
  methods: {
    // 缓存选择的时间段
    cacheRange (index) {
      this.cacheTimeRange[index] = this.range[index]
    },
    // 取消选择
    cancelTimeRange (index) {
      this.range[index] = this.cacheTimeRange[index]
      this.$forceUpdate()
    },
    // 选择时间段
    timeRangeChange (value, dateString, index) {
      this.range[index] = dateString
      this.$forceUpdate()
    },
    // 禁用日期
    disabledDate (current, name) {
      const { dayTime } = this.$refs.switchTeam
      if (dayTime.includes(name)) {
        return current < this.moment().subtract(1, 'days') || current > this.moment()
      }
      return current > this.moment().add(2, 'days') || current < this.moment()
    },
    rangeM (start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    // 禁用同一天的同一小时
    disabledTime (current, type, name) {
      const { dayTime } = this.$refs.switchTeam
      if (dayTime.includes(name)) {
        if (type === 'start' && this.moment(current).hour() > 0) {
          this.disabledHour = this.moment(current).hour()
        }
        if (type === 'end') {
          return {
            disabledHours: () => this.rangeM(0, 24).splice(this.disabledHour, 1)
          }
        }
      }
    },
    // 只读和编辑
    filterDisabled (record, index, indexColumn) {
      const disabledRows = [3, 4, 6, 7, 8]
      if (indexColumn === 1) {
        return false
      } else if (indexColumn === 0) {
        if (this.activeTab !== 4) {
          if (this.data.teamBoardData[this.activeTab].canWrite) {
            return disabledRows.includes(record.number)
          }
        } else {
          return record.number === 7 && index > 10
        }
      } else {
        return this.activeTab !== 4
      }
    },
    // 表格输入框输入规则
    inputChange (value, record, key) {
      if (value === '' || Number(value) >= 0) {
        record[key] = value
        this.count()
      } else {
        this.$message.warning('请输入数字')
      }
    },
    // 累加ABCD到总线
    count () {
      this.data.teamBoardData[4].boardData.map((v, index) => {
        if (index > 10) {
          return v
        }
        v.day = this.getCount('day', index)
        v.month = this.getCount('month', index)
        return v
      })
    },
    // 切换tab
    tabChange (tabIndex) {
      if (this.data.timeData.length > 0) {
        this.activeTab = tabIndex
      }
    },
    // 获取另外四个班组的某个项目的总和
    getCount (prop, index) {
      const precision = [2, 0, 3, 2, 2, 2, 2, 2, 2, 0, 0, 1] // 总线从上到下的每行的精度
      const checkTabs = this.data.teamBoardData.filter(v => v.canWrite === 1 && v.teamName !== '总线')
      let total = 0
      checkTabs.map(v => {
        total += Number(v.boardData[index][prop])
      })
      const averageIndex = [0, 2, 3, 4, 5, 6, 7] // 需要计算平均值的列
      if (checkTabs.length === 0) {
        return '暂无数据'
      }
      if (averageIndex.includes(index)) {
        total = total / checkTabs.length
      }
      return total.toFixed(precision[index])
    },
    // 获取页面所需数据
    getConsoleData (date) {
      this.tableLoading = true
      this.navDate = date
      backStage.getBoardData({
        date: date
      }).then(res => {
        this.data = res.data
        this.checkedList = res.data.timeData.filter(v => v.selectTime === 1).map(v => v.teamName)
        this.range = res.data.timeData.map(v => {
          return [v.workBeginTime, v.workEndTime]
        })
        this.cacheTimeRange = this.range.concat([])
        this.count()
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 换班弹窗
    exchangeTeam () {
      this.teamVisible = true
    },
    close () {
      this.teamVisible = false
    },
    save () {
      // 格式化之后再保存
      this.range.map((v, index) => {
        this.data.timeData[index].workBeginTime = v[0]
        this.data.timeData[index].workEndTime = v[1]
      })
      const allCheck = ['A', 'B', 'C', 'D']
      allCheck.map((v, index) => {
        this.data.timeData[index].selectTime = this.checkedList.includes(v) ? 1 : 0
      })
      if (this.checkedList.length > 0) {
        backStage.addBoardData({
          ...this.data,
          date: this.navDate
        }).then(res => {
          this.$message.success(res.msg)
          this.getConsoleData(this.navDate)
        })
      } else {
        this.$message.error('请选择班组！')
      }
    }
  },
  mounted () {
    this.getConsoleData(this.moment().format('YYYY-MM-DD'))
  }
}
</script>

<style lang="less">
  .ant-table-placeholder {
    padding: 16px 16px;
    font-size: 30px;
  }
  .readOnly{
    background-color: #eee;
  }
  .console-team {
    width: 55%;
    margin: 40px auto 0;
    @media screen and (max-width: 1366px){
      width: 80%;
    }
    &-name {
      display: inline-block;
      position: relative;
      width: 40px;
      font-size: 40px;
      vertical-align: middle;
      color: #333;
      bottom: 5px;
      margin: 0 21px;
    }

    .ant-checkbox-inner {
      width: 33px;
      height: 33px;
      border-radius: 50%;
      &:after{
        transform: rotate(45deg) scale(2);
        left: 32.142858/2.5px;
        top: 24.285714/2.5px;
      }
    }
    .ant-checkbox-wrapper {
      height: 40px;
      line-height: 40px;
      margin-bottom: 33px;
      &:nth-child(3), &:nth-child(4) {
        margin-bottom: 0;
      }
      &:nth-child(n+1) {
        margin-left: 0;
      }
      &:nth-child(2n) {
        margin-left: 69px;
      }
    }
  }
  .console-tabs {
    margin: 0 42px;
    font-size: 30px;
    input.table-input{
      width: 80%;
      text-align: center;
    }
    &-bar {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      .tab-name {
        cursor: pointer;
        color: #999;
        line-height: 1;
        &:not(:first-child) {
          margin-left: 20px;
        }
        &.active-tab {
          font-size: 50px;
          color: #5095f3;
        }
      }
    }
    &-content {
      //表格loading样式
      .ant-spin-nested-loading > div > .ant-spin{
        max-height: 400px;
        .ant-spin-dot{
          margin: -10px;
        }
      }
      .ant-spin{
        font-size: 14px;
        &-dot{
          font-size: 20px;
          width: 20*3px;
          height: 20*3px;
          i{
            width: 9*3px;
            height: 9*3px;
          }
        }
      }

      .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
        padding: 8px;
      }
      .ant-table-thead > tr > th{
        background: #f3f7fb;
      }
      .ant-table-body table,.ant-table-tbody > tr > td,.ant-table-thead > tr > th{
        border-color: #ddd;
      }
      .ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td {
        font-size: 30px;
        color: #727578;
      }
      .ant-table-bordered .ant-table-thead > tr > th:not(:last-child) {
        border-right: none;
      }
      .ant-input{
        padding: 4px 11px;
        height: 45px;
        font-size: 30px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
      }
    }
  }
  .console-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 35px 0;
    & > button {
      font-size: 34px;
      color: #999;
      width: 240px;
      margin-left: 37px;
      padding: 0 15px;
      border-radius: 4px;
      height: 60px;
    }
    .save {
      color: #fff;
    }
  }
  // after body
  .ant-select-dropdown{
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    font-size: 14px;
    &-menu{
      max-height: 250px;
      &-item{
        color: #000;
        padding: 5px 12px;
        line-height: 22px;
        &:first-child{
          border-radius: 4px 4px 0 0;
        }
      }
    }
  }

  .ant-spin-very-large{
    & > div > .ant-spin-lg .ant-spin-dot{
      margin-left: -16px;
    }
    .ant-spin-lg .ant-spin-dot{
      font-size: 32px;
      width: 32px;
      height: 32px;
      i{
        width: 14px;
        height: 14px;
      }
    }
  }

  .ant-calendar-footer-extra{
    .ant-btn {
      padding: 0 15px;
      font-size: 14px;
      border-radius: 4px;
      height: 32px;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
    }
  }

</style>
