<template>
  <div class="charts-wrapper">
    <chart-box ref="top" title="平均车速" id="top"
               chartStyle="height: 428px;width: 560px"></chart-box>
    <chart-box ref="bottom" title="各组日均平均车速趋势图" id="bottom"
               :header="chartHeader"
               :group-data="data.teamTrendMap"
               @tabClick="tabClick"
               chartStyle="height: 353px;width: 560px"></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import wugui from '../assets/乌龟.png'
import tu from '../assets/兔.png'
import ma from '../assets/马.png'
import ChartBox from '../components/chart/ChartBox'
export default {
  name: 'Dashboard',
  components: { ChartBox },
  data () {
    return {
      data: {},
      chartHeader: {
        leftTitle: '平均车速月目标',
        leftValue: '',
        leftUnit: 'm/m'
      }
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
            radius: '90%',
            startAngle: 270,
            endAngle: 270 - 180 * (left.speed / 268),
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
              symbolSize: 25,
              data: [
                [
                  {
                    x: '50%',
                    y: '5%',
                    lineStyle: { width: 1, color: '#d1d1d1' }
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
                width: 200 / 4,
                color: [[268, this.getColorBySpeed(left.speed)]],
                shadowColor: '#888',
                shadowOffsetX: -10 / 4,
                shadowBlur: 50 / 4
              }
            },
            pointer: {
              show: false
            },
            itemStyle: {
              color: this.getColorBySpeed(left.speed),
              fontSize: 30
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
            startAngle: 450 - 180 * ((268 - right.speed) / 268),
            endAngle: 270,
            z: 5,
            splitNumber: -1,
            min: 268,
            max: 0,
            radius: '90%',
            axisLine: {
              show: false, // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 50,
                color: [[268, this.getColorBySpeed(right.speed)]],
                shadowColor: '#888',
                shadowOffsetX: 10 / 4,
                shadowBlur: 50 / 4
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
              fontSize: 30
            },
            detail: this.getDetailStyleObj(false, right.speed)
          },
          {
            name: 'background',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '90%',
            startAngle: 0,
            endAngle: 0.0000001,
            z: 4,
            min: 0,
            max: 268,
            axisTick: {
              show: false
            },
            detail: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false, // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 50,
                color: [[268, '#ededed']],
                shadowColor: '#888',
                shadowOffsetX: 5,
                shadowBlur: 25
              }
            },
            pointer: {
              show: false
            }
          }
        ]
      }
      this.$refs.top.draw(option)
    },
    drawLine (index = 0) {
      const seriesData = this.data.teamTrendMap[index].trendMap.map(v => {
        return {
          date: new Date(v.date).toString(),
          value: [v.date, v.value]
        }
      })
      let option = {
        grid: {
          top: 10,
          left: 60,
          bottom: 60
        },
        xAxis: {
          type: 'category',
          offset: 10,
          splitNumber: 1,
          axisLabel: {
            interval: function (index, val) {
              return index === 0 || index === seriesData.length - 1
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
                fontSize: 20,
                align: 'right',
                width: 200
              },
              end: {
                color: '#333',
                fontFamily: 'PingFang SC Regular',
                fontSize: 20,
                align: 'left',
                width: 240
              }
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
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
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            fontSize: 20,
            margin: 10
          },
          splitLine: {
            lineStyle: {
              width: 1.25
            }
          }
        },
        series: [{
          data: seriesData,
          type: 'line',
          symbolSize: 8,
          itemStyle: {
            color: '#5095f3',
            borderWidth: 2.5
          },
          lineStyle: {
            width: 2.5
          }
        }]
      }
      this.$refs.bottom.draw(option)
    },
    getDetailStyleObj (isLeft, speed) {
      const title = this.data.avgSpeed[isLeft ? 0 : 1].name
      return {
        fontFamily: 'PingFang SC Regular',
        color: this.getColorBySpeed(speed),
        offsetCenter: [isLeft ? '-40%' : '40%', '15%'],
        formatter: function (paramas) {
          return '{number|' + paramas + '}{speed|m/m}' + '\n\n' + '{title| ' + title + '}'
        },
        width: 193 / 4,
        height: 235 / 4,
        rich: {
          number: {
            fontSize: 40,
            color: this.getColorBySpeed(speed)
          },
          speed: {
            fontSize: 25,
            color: '#333'
          },
          title: {
            fontSize: 40,
            color: '#333'
          }
        }
      }
    },
    getTitleStyleObj (isLeft, speed) {
      const image = speed < 170 ? wugui : speed < 186 ? tu : ma
      return {
        fontFamily: 'PingFang SC Regular',
        fontSize: 40,
        color: 'transparent',
        offsetCenter: [isLeft ? '-40%' : '40%', '-25%'],
        formatter: '2',
        rich: {},
        width: 235 / 4,
        height: 193 / 4,
        backgroundColor: {
          image: image
        }
      }
    },
    getColorBySpeed (speed) {
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
        this.tabClick(res.data.teamTrendMap[0], 0)
        this.$refs.bottom.timer()
      })
    },
    tabClick (tab, index) {
      this.drawLine(index)
      this.chartHeader.leftValue = tab.avgSpeedMonthGoal
    },
    timingUpdateData () {
      setTimeout(() => {
        board.getSpeed().then(res => {
          this.data = res.data
        })
      }, 1000 * 60 * 5)
    }
  },
  mounted () {
    this.getSpeedData()
    this.timingUpdateData()
  },
  destroyed () {
    clearTimeout(this.timingUpdateData())
  }
}
</script>

<style lang="less">
.charts-wrapper {
  color: #333;
  font-size: 30px;
  transform: rotate(-90deg);
  height: 960px;
}
</style>
