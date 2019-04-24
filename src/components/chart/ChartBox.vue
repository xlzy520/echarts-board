<template>
  <div class="dashboard-box">
    <div class="dashboard-box-title" v-if="title">{{title}}</div>
    <div :class="['dashboard-box-header', {'single-header': !header.leftTitle}]" v-if="header">
      <div class="header-left" v-if="header.leftTitle">
        <div>{{header.leftTitle}}：<span class="header-left-item">{{header.leftValue}}</span>m/m</div>
      </div>
      <div class="group-tabs" v-if="header.groupData">
        <div v-for="(item, index) in header.groupData"
             :class="['group-tab', {'tab-checked': item.teamName === header.checkTab}]"
             @click="tabClick(item, index)"
             :key="item.teamName">{{item.teamName}}</div>
      </div>
    </div>
    <div class="dashboard-box-content">
      <div :id="id" :style="chartStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartBox',
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'top'
    },
    chartStyle: {
      type: String,
      default: () => {
        return {
          height: '1920px',
          width: '100%'
        }
      }
    },
    header: {
      type: Object
      // default: () => {
      //   return {
      //     leftTitle: '',
      //     leftValue: '',
      //     checkTab: '',
      //     groupData: []
      //   }
      // }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    draw (option) {
      const myChart = this.$echarts.init(document.getElementById(this.id))
      myChart.setOption(option, true)
    },
    tabClick (tab, index) {
      this.$emit('tabClick', tab, index)
    }
  }
}
</script>

<style lang="less">
  .dashboard-box {
    &-title {
      padding-top: 33 * 2px;
      padding-left: 24 * 2px;
    }
    &-header{
      display: flex;
      font-size: 40*2px;
      padding: 20*2px 0 20*2px 30*2px;
      .header-left{
        display: flex;
        flex-direction: column;
        width: 60%;
        .header-left-item{
          font-size: 60*2px;
        }
      }
      .group-tabs{
        display: flex;
        align-items: flex-end;
        margin-right: 7%;
        .group-tab{
          cursor: pointer;
          font-size: 50*2px;
          color: #999;
          margin-left: 37*2px;
          line-height: 1.1;
        }
        .tab-checked{
          font-size: 70*2px;
          color: #333;
        }
      }
    }
  }
</style>
