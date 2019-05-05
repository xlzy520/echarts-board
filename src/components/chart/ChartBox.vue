<template>
  <div class="chart-box">
    <div class="chart-box-title" v-if="title">{{title}}</div>
    <div :class="['chart-box-header', {'single-header': !header.leftTitle}]" v-if="header">
      <div class="header-left" v-if="header.leftTitle">
        <div>{{header.leftTitle}}：<span class="header-left-item">{{header.leftValue}}</span>{{header.leftUnit}}</div>
      </div>
      <div class="group-tabs" v-if="groupData">
        <div v-for="(item, index) in groupData"
             :class="['group-tab', {'tab-checked': item.teamName === checkTab}]"
             @click="tabClick(item, index)"
             :key="item.teamName">{{item.teamName}}</div>
      </div>
    </div>
    <div class="chart-box-content">
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
      type: [Object, Boolean],
      default: () => {
        return false
      }
    },
    groupData: {
      type: Array
    }
  },
  data () {
    return {
      checkTab: 'A'
    }
  },
  methods: {
    draw (option) {
      const myChart = this.$echarts.init(document.getElementById(this.id))
      myChart.setOption(option, true)
    },
    tabClick (tab, index) {
      this.checkTab = tab.teamName
      this.$emit('tabClick', index, tab)
    },
    timer () {
      let i = 1
      return setInterval(() => {
        this.tabClick(this.groupData[i], i)
        i += 1
        if (i > this.groupData.length - 1) {
          i = 0
        }
      }, 10000)
    }
  },
  destroyed () {
    clearInterval(this.timer())
  }
}
</script>

<style lang="less">
  .chart-box {
    &-title {
      padding-top: 33/2px;
      padding-left: 24/2px;
    }
    &-header{
      width: 540px;
      display: flex;
      font-size: 20px;
      padding: 20/2px 0 20/2px 30/2px;
      .header-left{
        display: flex;
        flex-direction: column;
        width: 63%;
        .header-left-item{
          font-size: 30px;
        }
      }
      .group-tabs{
        display: flex;
        align-items: flex-end;
        margin-right: 7/4%;
        .group-tab{
          cursor: pointer;
          font-size: 25px;
          color: #999;
          margin-left: 37/2px;
          line-height: 1.1;
        }
        .tab-checked{
          font-size: 35px;
          color: #333;
        }
      }
    }
  }
</style>
