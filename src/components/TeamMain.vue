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
            v-model="range[index]"
            :disabledDate="disabledDate"
          >
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
          <template v-for="col in ['day', 'month', 'monthGoal']"
                    :slot="col"
                    slot-scope="text, record, index">
            <a-input
              class="table-input"
              v-if="filterDisabled(record, index)"
              :value="text"
              maxLength="10"
              @change="e => inputChange(e.target.value, record, col)"
            />
            <div v-else class="readOnly">{{text}}</div>
          </template>
        </a-table>
      </div>
    </div>
    <div class="console-footer">
      <a-button @click="exchangeTeam">换班</a-button>
      <a-button type="primary" class="save" @click="save">保存</a-button>
    </div>
    <modal title="换班" :visible="teamVisible" @close="close">
      <switch-team @close="close"></switch-team>
    </modal>
  </div>
</template>

<script>

import SwitchTeam from '../components/SwitchTeam'
import Modal from '../components/Modal'
import backStage from '../api/backStage'
export default {
  name: 'TeamMain',
  data () {
    return {
      teamVisible: false,

      checkedList: ['A', 'B', 'C', 'D'],
      timeRange: [

      ],
      range: [
        [], [], [], []
      ],
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
          scopedSlots: { customRender: 'day' }
        }, {
          title: '月累计(总数)',
          width: '20%',
          dataIndex: 'month',
          align: 'center',
          scopedSlots: { customRender: 'month' }
        }, {
          title: '月目标',
          width: '20%',
          dataIndex: 'monthGoal',
          align: 'center',
          scopedSlots: { customRender: 'monthGoal' }
        }
      ],
      data: {
        teamBoardData: [{
          boardData: []
        }],
        timeData: []
      },

      tableLoading: false
    }
  },
  components: {
    SwitchTeam, Modal
  },
  methods: {
    disabledDate (current) {
      return current && current > this.moment().endOf('day')
    },
    // 只读和编辑
    filterDisabled (record, index) {
      console.log(record, index)
      const disabledRows = [3, 4, 6, 7]
      if (this.activeTab !== 4) {
        if (disabledRows.includes(record.number)) {
          return true
        }
      } else {
        if (index === 10 && record.number === 7) {
          return true
        }
      }
    },
    inputChange (value, record, key) {
      if (value !== '' && Number(value) >= 0) {
        record[key] = value
        this.count()
      } else {
        this.$message.warning('请输入数字')
      }
    },
    close () {
      this.teamVisible = false
    },
    /**
     * 累加ABCD到总线
     */
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
      this.activeTab = tabIndex
    },
    // 获取另外四个班组的某个项目的总和
    getCount (prop, index) {
      let total = 0
      for (let i = 0; i < 4; i++) {
        total += Number(this.data.teamBoardData[i].boardData[index][prop])
      }
      return total
    },
    // 获取页面所欲数据
    getConsoleData () {
      backStage.getBoardData({

      }).then(res => {
        this.data = res.data
        this.range = res.data.timeData.map(v => {
          return [this.moment(v.workBeginTime), this.moment(v.workEndTime)]
        })
        this.count()
      })
    },
    // 换班弹窗
    exchangeTeam () {
      this.teamVisible = true
    },
    save () {
      // 格式化之后再保存
      this.range.map((v, index) => {
        this.data.timeData[index].workBeginTime = this.moment(v[0]).format('YYYY-MM-DD HH:mm')
        this.data.timeData[index].workEndTime = this.moment(v[1]).format('YYYY-MM-DD HH:mm')
      })
      if (this.checkedList.length > 0) {
        backStage.addBoardData(this.data).then(res => {
          this.$message.success(res.msg)
        })
      } else {
        this.$message.error('请选择班组！')
      }
    }
  },
  mounted () {
    this.getConsoleData()
  }
}
</script>

<style lang="less">
  @import "../styles/ant-calendar";
  .console-team {
    width: 55%;
    margin: 80px auto 0;
    &-name {
      display: inline-block;
      position: relative;
      width: 80px;
      font-size: 80px;
      vertical-align: middle;
      color: #333;
      bottom: 10px;
      margin: 0 42px;
    }

    .ant-checkbox-inner {
      width: 33*2px;
      height: 33*2px;
      border-radius: 50%;
      &:after{
        transform: rotate(45deg) scale(4);
        left: 30.142858px;
        top: 24.285714px;
      }
    }
    .ant-checkbox-wrapper {
      height: 40*2px;
      line-height: 40*2px;
      margin-bottom: 40*2px;
      &:nth-child(3), &:nth-child(4) {
        margin-bottom: 0;
      }
      &:nth-child(n+1) {
        margin-left: 0;
      }
      &:nth-child(2n) {
        margin-left: 69*2px;
      }
    }
  }
  .console-tabs {
    margin: 0 42*2px;
    input.table-input{
      width: 80%;
      text-align: center;
    }
    .readOnly{
      background-color: #eee;
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
          margin-left: 20*2px;
        }
        &.active-tab {
          font-size: 50*2px;
          color: #5095f3;
        }
      }
    }
    &-content {
      .ant-table-thead > tr > th{
        background: #f3f7fb;
      }
      .ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td {
        font-size: 30*2px;
        color: #727578;
      }
      .ant-table-bordered .ant-table-thead > tr > th:not(:last-child) {
        border-right: none;
      }
      .ant-input{
        padding: 4*2px 11*2px;
        height: 45*2px;
        font-size: 30*2px;
        border: 1*2px solid #d9d9d9;
        border-radius: 4*2px;
      }
    }
  }
  .console-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 35*2px 0;
    & > button {
      font-size: 34*2px;
      color: #999;
      width: 240*2px;
      margin-left: 37*2px;
      padding: 0 15*2px;
      border-radius: 4*2px;
      height: 60*2px;
    }
    .save {
      color: #fff;
    }
  }
  // after body
  .ant-select-dropdown{
    box-shadow: 0 2*2px 8*2px rgba(0, 0, 0, 0.15);
    border-radius: 4*2px;
    font-size: 14*2px;
    &-menu{
      max-height: 250*2px;
      &-item{
        color: #000;
        padding: 5*2px 12*2px;
        line-height: 22*2px;
        &:first-child{
          border-radius: 4*2px 4*2px 0 0;
        }
      }
    }
  }

  .ant-spin-very-large{
    & > div > .ant-spin-lg .ant-spin-dot{
      margin-left: -16*2px;
    }
    .ant-spin-lg .ant-spin-dot{
      font-size: 32*2px;
      width: 32*2px;
      height: 32*2px;
      i{
        width: 14*2px;
        height: 14*2px;
      }
    }
  }

</style>
