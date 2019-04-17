<template>
  <div class="console-tabs">
    <div class="console-tabs-bar">
      <div
        v-for="tab in tabs"
        :key="tab"
        @click="tabChange(tab)"
        :class="['tab-name', {'active-tab': tab === activeTab }]">{{tab}}
      </div>
    </div>
    <div class="console-tabs-content">
      <a-table
        :columns="columns"
        :dataSource="data[activeTab].boardData"
        bordered
        :pagination="false"
        :rowKey="record => record.name"
        :loading="tableLoading">
        <template v-for="col in ['number', 'name', 'day', 'month', 'monthGoal']"
                  :slot="col"
                  slot-scope="text, record, index">
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.dataIndex, col)"
            />
            <template v-else>{{text}}</template>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import backStage from '../api/backStage'
export default {
  name: 'TeamTabs',
  data () {
    return {
      activeTab: 'A',
      tabs: ['A', 'B', 'C', 'D', '总线'],
      columns: [
        {
          title: '看板编号',
          dataIndex: 'number',
          align: 'center',
          scopedSlots: { customRender: 'number' }
        }, {
          title: '项目名称',
          dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        }, {
          title: '日累计',
          dataIndex: 'day',
          align: 'center',
          scopedSlots: { customRender: 'day' }
        }, {
          title: '月累计(总数)',
          dataIndex: 'month',
          align: 'center',
          scopedSlots: { customRender: 'month' }
        }, {
          title: '月目标',
          dataIndex: 'monthGoal',
          align: 'center',
          scopedSlots: { customRender: 'monthGoal' }
        }
      ],
      data: {
        A: { boardData: [] }
      },

      tableLoading: false
    }
  },
  methods: {
    tabChange (tab) {
      this.activeTab = tab
    },

    getBoardData () {
      backStage.getBoardData({

      }).then(res => {
        this.data = res.data
      })
    },
    close () {
      this.teamVisible = false
    }
  },
  mounted () {
    this.getBoardData()
  }
}
</script>

<style lang="less">
  .console-tabs {
    margin: 0 42*2px;
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
    }

    .team-setting {
      display: flex;
      flex-direction: column;
      color: #000;
      font-size: 16*2px;
      margin-left: 76*2-24px;
      .setting-item {
        display: flex;
        height: 30*2px;
        line-height: 30*2px;
        margin-top: 40*2-24px;
        &>label {
          width: 80*2px;
          text-align: right;
        }
        .ant-radio-wrapper{
          color: #000;
          font-size: 16*2px;
          margin-right: 8*2px;
          span.ant-radio + *{
            padding-left: 8*2px;
            padding-right: 8*2px;
          }
          .ant-radio-checked .ant-radio-inner {
            border-color: #5095f3;
          }
          .ant-radio-inner{
            width: 16*2px;
            height: 16*2px;
            border-width: 1*2px;
            border-radius: 100*2px;
            &:after{
              width: 8*2px;
              height: 8*2px;
              left: 3*2px;
              top: 3*2px;
              border-radius: 8*2px;
            }
          }
        }
        .remaining-days-title {

        }
      }
      &-footer {
        display: flex;
        justify-content: center;
        height: 32*2px;
        line-height: 32*2px;
        margin-top: 45*2px;
        .ant-btn {
          margin-left: 22*2px;
          width: 96*2px;
          padding: 0 15*2px;
          font-size: 14*2px;
          border-radius: 4*2px;
          height: 32*2px;
        }
        .ant-btn-default {
          color: #5095f3;
          border-color: #5095f3;
        }
        .ant-btn-primary {
          background-color: #5095f3;
        }
      }
    }
    .ant-select {
      font-size: 16*2px;
      color: #000;
      &-selection {
        border-radius: 4*2px;
        border: 1*2px solid #d9d9d9;
        border-top-width: 1.02*2px;
        &--single {
          height: 32*2px;
        }
        &__rendered {
          margin-left: 11*2px;
          margin-right: 11*2px;
          line-height: 30*2px;
        }
        &-selected-value {
          padding-right: 20*2px;
        }
      }
      &-arrow{
        color: #000;
        right: 11*2px;
        margin-top: -6*2px;
        font-size: 14*2px;
      }
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
