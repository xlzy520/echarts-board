<template>
  <div class="dashboard">
    <div class="dashboard-box">
      <div class="dashboard-box-title">平均车速</div>
      <div class="dashboard-box-content">
        <div id="top" class="chart" style="height: 1920px;width: 100%"></div>
      </div>
    </div>
    <div class="dashboard-box">
      <div class="dashboard-box-title">各组日均平均车速趋势图</div>
      <div class="dashboard-box-header">
        <div class="speed-box">
          <div>平均车速月目标：<span class="speed-value">{{avgSpeed}}</span>m/m</div>
          <div>合理最低车速：<span class="speed-value">140</span>m/m</div>
        </div>
        <div class="group-tabs">
          <div v-for="(item, index) in data.teamTrendMap"
               :class="['group-tab', {'tab-checked': item.teamName === checkTab}]"
               @click="tabClick(item, index)"
               :key="item.teamName">{{item.teamName}}</div>
        </div>
      </div>
      <div class="dashboard-box-content">
        <div id="bottom" class="chart" style="height: 1920px;width: 100%"></div>
      </div>
    </div>
  </div>
</template>

<script>
import board from '../api/board'
import wugui from '../assets/乌龟.png'
import baitu from '../assets/白兔.png'
// const echarts = require('echarts/lib/echarts')
const echarts = require('echarts')
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/gauge')
// require('echarts/lib/chart/line')
// require('echarts/lib/component/markLine')
// require('echarts/lib/component/grid')
// require('echarts/lib/component/tooltip')
export default {
  name: 'Dashboard',
  data () {
    return {
      data: {},
      checkTab: '',
      avgSpeed: ''
    }
  },
  methods: {
    drawGauge () {
      const [ left, right ] = this.data.avgSpeed
      let option = {
        series: [
          {
            name: 'left',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '95%',
            startAngle: 270,
            endAngle: 270 - 180 * (Number(left.speed) / 268),
            splitNumber: -1,
            z: 5,
            min: 0,
            max: 268,
            axisTick: {
              show: false
            },
            markLine: {
              symbol: 'none',
              lineStyle: { type: 'solid' },
              symbolSize: 100,
              data: [
                [
                  {
                    x: '50%',
                    y: '2.5%',
                    lineStyle: { width: 5, color: '#d1d1d1' }
                  },
                  { x: '50%', y: '95%' }
                ]
              ]
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false, // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 200,
                color: [[268, this.getColorBySpeed(left.speed)]],
                shadowColor: '#888',
                shadowOffsetX: -10,
                shadowBlur: 50
              }
            },
            pointer: {
              show: false
            },
            itemStyle: {
              color: this.getColorBySpeed(left.speed),
              fontSize: 120
            },
            title: this.getTitleStyleObj(true, left.speed),
            detail: this.getDetailStyleObj(true, left.speed),
            data: [
              {
                value: left.speed,
                name: left.name
              }
            ]
          },
          {
            name: 'right',
            type: 'gauge',
            center: ['50%', '50%'],
            startAngle: 450 - 180 * (Number(268 - right.speed) / 268),
            endAngle: 270,
            z: 5,
            splitNumber: -1,
            min: 268,
            max: 0,
            radius: '95%',
            axisLine: {
              show: false, // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 200,
                color: [[268, this.getColorBySpeed(right.speed)]],
                shadowColor: '#888',
                shadowOffsetX: 10,
                shadowBlur: 50
              }
            },
            splitLine: {
              show: false
            },
            data: [
              {
                value: right.speed,
                name: right.name
              }
            ],
            axisTick: {
              show: false
            },
            pointer: {
              show: false
            },
            title: this.getTitleStyleObj(false, right.speed),
            itemStyle: {
              color: this.getColorBySpeed(right.speed),
              fontSize: 12
            },
            detail: this.getDetailStyleObj(false, right.speed)
          },
          {
            name: 'background',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '95%',
            startAngle: 0,
            endAngle: 0.0000001,
            z: 4,
            min: 0,
            max: 268,
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false, // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 200,
                color: [[268, '#ededed']],
                shadowColor: '#888',
                shadowOffsetX: 10,
                shadowBlur: 50
              }
            },
            pointer: {
              show: false
            }
          }
        ]
      }
      const myChart = echarts.init(document.getElementById('top'))

      myChart.setOption(option, true)
    },
    drawLine (index = 0) {
      const seriesData = this.data.teamTrendMap[index].speedTrendMap.map(v => {
        return {
          date: new Date(v.date).toString(),
          value: [v.date, Number(v.speed)]
        }
      })
      let option = {
        grid: {
          bottom: 180
        },
        xAxis: {
          type: 'category',
          offset: 40,
          splitNumber: 1,
          axisLabel: {
            interval: function (index, val) {
              return index === 0 || index === 30
            },
            formatter: (params, index) => {
              if (index === 0) {
                return '{front|' + this.moment(params).format('YYYY年MM月DD日') + '}'
              } else {
                return '{end|' + this.moment(params).format('YYYY年MM月DD日') + '}'
              }
            },
            rich: {
              front: {
                color: '#333',
                fontFamily: 'PingFang SC Regular',
                fontSize: 80,
                align: 'right',
                width: 1000
              },
              end: {
                color: '#333',
                fontFamily: 'PingFang SC Regular',
                fontSize: 80,
                align: 'left',
                width: 1000
              }
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 268,
          splitNumber: 4,
          interval: 50,
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            fontSize: 80,
            margin: 40
          },
          splitLine: {
            show: true,
            interval: (index, value) => {
              console.log(2)
              console.log(index, value)
              return true
            },
            lineStyle: {
              width: 5
            }
          }
        },
        series: [{
          data: seriesData,
          type: 'line',
          symbolSize: 35,
          itemStyle: {
            color: '#5095f3',
            borderWidth: 10
          },
          lineStyle: {
            width: 10
          }
        }]
      }
      const myChart = echarts.init(document.getElementById('bottom'))

      myChart.setOption(option, true)
    },
    getDetailStyleObj (isLeft, speedStr) {
      const title = this.data.avgSpeed[isLeft ? 0 : 1].name
      return {
        fontFamily: 'PingFang SC Regular',
        color: this.getColorBySpeed(speedStr),
        offsetCenter: [isLeft ? '-40%' : '40%', '35%'],
        formatter: function (paramas) {
          return '{number|' + paramas + '}{speed|m/m}' + '\n\n\n' + '{title| ' + title + '}'
        },
        width: 193 * 1.5,
        height: 235 * 1.5,
        rich: {
          number: {
            fontSize: 160,
            color: this.getColorBySpeed(speedStr)
          },
          speed: {
            fontSize: 100,
            color: '#333'
          },
          title: {
            fontSize: 160,
            color: '#333'
          }
        }
      }
    },
    getTitleStyleObj (isLeft, speed) {
      const image = Number(speed) > 128 ? baitu : wugui
      return {
        fontFamily: 'PingFang SC Regular',
        fontSize: 160,
        color: 'transparent',
        offsetCenter: [isLeft ? '-40%' : '40%', '-25%'],
        formatter: '2',
        rich: {},
        width: 193 * 1.5,
        height: 235 * 1.5,
        backgroundColor: {
          image: image
        }
      }
    },
    getColorBySpeed (speedStr) {
      const speed = Number(speedStr)
      if (speed < 170) {
        return '#f81129'
      } else if (speed < 186) {
        return '#0dd64f'
      } else if (speed > 185) {
        return '#5095f3'
      }
    },
    getSpeedData () {
      return board.getSpeed().then(res => {
        this.data = res.data
        this.drawGauge()
        this.drawLine()
        this.tabClick(res.data.teamTrendMap[0])
        // this.timer()
      })
    },
    tabClick (tab, index) {
      this.checkTab = tab.teamName
      this.avgSpeed = tab.avgSpeedMonthGoal
      this.drawLine(index)
    },
    timer () {
      let i = 1
      return setInterval(() => {
        this.tabClick(this.data.teamTrendMap[i], i)
        i += 1
        if (i > this.data.teamTrendMap.length - 1) {
          i = 0
        }
      }, 10000)
    }
  },
  mounted () {
    this.getSpeedData()
  },
  destroyed () {
    clearInterval(this.timer())
  }
}
</script>

<style lang="less">
.dashboard {
  color: #333;
  font-size: 60 * 2px;
  height: 100%;
  &-box {
    &-title {
      padding-top: 33 * 2px;
      padding-left: 24 * 2px;
    }
    &-header{
      display: flex;
      font-size: 40*2px;
      padding: 49*2px 0 0 20*2px;
      .speed-box{
        display: flex;
        flex-direction: column;
        .speed-value{
          font-size: 60*2px;
        }
      }
      .group-tabs{
        display: flex;
        margin-left: 235*2px;
        align-items: flex-end;
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
}
</style>
