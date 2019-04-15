<template>
  <div class="console-tabs">
    <div class="console-tabs-bar">
      <div
        v-for="tab in tabs"
        :key="tab"
        @click="tabChange(tab)"
        :class="['tab-name', {'active-tab': tab === activeTab }]">{{tab}}</div>
    </div>
    <div class="console-tabs-content">
      <a-table :columns="columns" :dataSource="data" bordered>
        <template v-for="col in ['name', 'age', 'address']" :slot="col" slot-scope="text, record, index">
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>{{text}}</template>
          </div>
        </template>
      </a-table>
    </div>
    <div class="console-tabs-footer">
      <a-button @click="exchangeTeam">换班</a-button>
      <a-button type="primary" class="save">保存</a-button>
    </div>
    <a-modal>

    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'TeamTabs',
  data () {
    return {
      activeTab: 'A',
      tabs: ['A', 'B', 'C', 'D', '总线'],
      columns: [
        {
          title: '看板编号',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' }
        }, {
          title: '项目名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        }, {
          title: '日累计',
          dataIndex: 'day',
          scopedSlots: { customRender: 'day' }
        }, {
          title: '月累计(总数)',
          dataIndex: 'month',
          scopedSlots: { customRender: 'month' }
        }, {
          title: '月目标',
          dataIndex: 'monthGoal',
          scopedSlots: { customRender: 'monthGoal' }
        }
      ],
      data: [

      ],
      teamVisible: false
    }
  },
  methods: {
    tabChange (tab) {
      this.activeTab = tab
    },
    exchangeTeam(){
      this.teamVisible = true
    }
  }
}
</script>

<style lang="less">
.console-tabs{
  margin: 0 42*2px;
  &-bar{
    display: flex;
    flex-direction: row;
    align-items: baseline;
    .tab-name{
      cursor: pointer;
      color: #999;
      line-height: 1;
      &:not(:first-child){
        margin-left: 20*2px;
      }
      &.active-tab{
        font-size: 50*2px;
        color: #5095f3;
      }
    }
  }
  &-content{
    .ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td{
      font-size: 30*2px;
      color: #727578;
    }
    .ant-table-bordered .ant-table-thead > tr > th:not(:last-child){
      border-right: none;
    }
  }
  &-footer{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 40px;
    &>button{
      font-size: 34*2px;
      color: #999;
      width: 240*2px;
      margin-left: 37*2px;
      padding: 0 15*2px;
      border-radius: 4*2px;
      height: 60*2px;
    }
    .save{
      color: #fff;
    }
  }
}
</style>
