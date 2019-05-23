<template>
  <div class="charts-wrapper">
    <chart-box ref="top" title="平均车速" id="top" class="average"
               chartStyle="height: 420px"></chart-box>
    <chart-box ref="bottom" title="各组日均平均车速趋势图" id="bottom"
               :header="chartHeader"
               :group-data="data.teamTrendMap"
               @tabClick="tabClick"
               chartStyle="height: 352px"></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import wugui from '../assets/乌龟.png'
import tu from '../assets/兔子.png'
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
            radius: '87%',
            startAngle: 269.5,
            endAngle: 270.5 - 180 * (left.speed / 268),
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
                    y: '32.5%',
                    lineStyle: { width: 1, color: '#d1d1d1' }
                  },
                  { x: '50%', y: '67.5%' }
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
                width: 26,
                color: [[268, this.getColorBySpeed(left.speed)]],
                shadowColor: '#e9e9e9'
              }
            },
            pointer: {
              show: false
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
            startAngle: 449.5 - 180 * ((268 - right.speed) / 268),
            endAngle: 270.5,
            z: 5,
            splitNumber: -1,
            min: 268,
            max: 0,
            radius: '87%',
            axisLine: {
              show: false, // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 26,
                color: [[268, this.getColorBySpeed(right.speed)]],
                shadowColor: '#e9e9e9'
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
            detail: this.getDetailStyleObj(false, right.speed)
          }
        ]
      }
      this.$refs.top.draw(option)
    },
    drawLine (index = 0) {
      const seriesData = this.data.teamTrendMap[index].trendMap.map(v => {
        return {
          date: v.date,
          value: v.value > 200 ? 200 + (50 / 68) * (v.value - 200) : v.value
        }
      })
      const length = seriesData.length - 1
      const startValue = seriesData[0].value
      const endValue = seriesData[length].value
      const markPointData = [
        { name: '第一天', value: startValue, xAxis: 0, yAxis: startValue },
        { name: '最后一天', value: endValue, xAxis: length, yAxis: endValue }
      ]
      let option = {
        grid: {
          top: 10,
          left: 60,
          bottom: 60
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            show: false
            // 不在需要X轴的始末日期
            // interval: function (index, val) {
            //   return index === 0 || index === seriesData.length - 1
            // },
            // formatter: (params, index) => {
            //   if (index === 0) {
            //     return '{front|' + this.moment(params).format('YYYY年MM月DD日') + '}'
            //   } else {
            //     return '{end|' + this.moment(params).format('YYYY年MM月DD日') + '}'
            //   }
            // },
            // rich: {
            //   front: {
            //     color: '#333',
            //     fontFamily: 'PingFang SC Regular',
            //     fontSize: 20,
            //     align: 'right',
            //     width: 200
            //   },
            //   end: {
            //     color: '#333',
            //     fontFamily: 'PingFang SC Regular',
            //     fontSize: 20,
            //     align: 'left',
            //     width: 240
            //   }
            // }
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
          max: 250,
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
            margin: 10,
            formatter: params => {
              if (params === 250) {
                return '268'
              }
              return params
            }
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
          },
          markLine: {
            symbol: 'none',
            data: [
              {
                name: '平均车速月目标',
                yAxis: this.chartHeader.leftValue,
                lineStyle: {
                  color: '#f78787',
                  width: 5 / 4,
                  type: 'solid',
                  opacity: 0.5
                },
                label: {
                  show: false
                }

              }
            ]
          },
          markPoint: {
            symbol: 'rect',
            symbolSize: [50, 20],
            symbolOffset: [0, '-80%'],
            data: markPointData,
            itemStyle: {
              color: '#1c97ff',
              shadowColor: '#b5b5b5',
              shadowBlur: 5,
              shadowOffsetX: 1,
              shadowOffsetY: 3
            },
            label: {
              fontFamily: 'PingFang SC Regular',
              fontSize: 15,
              formatter: params => {
                function formatter (date) {
                  let monthDay = date.substr(date.indexOf('-') + 1)
                  return monthDay.replace('-', '/')
                }
                return formatter(seriesData[params.dataIndex ? length : 0].date)
              }
            }
          }
        }]
      }
      this.$refs.bottom.draw(option)
    },
    getDetailStyleObj (isLeft, speed) {
      const title = this.data.avgSpeed[isLeft ? 0 : 1].name
      return {
        fontFamily: 'PingFang SC Regular',
        color: this.getTextColorBySpeed(speed),
        offsetCenter: [isLeft ? '-40%' : '40%', '15%'],
        formatter: function (paramas) {
          return '{number|' + paramas + '}{speed|m/m}' + '\n\n' + '{title| ' + title + '}'
        },
        width: 193 / 4,
        height: 235 / 4,
        rich: {
          number: {
            fontSize: 40,
            color: this.getTextColorBySpeed(speed)
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
        width: 400 / 3,
        height: 260 / 3,
        backgroundColor: {
          image: image
        }
      }
    },
    getColorBySpeed (speed) {
      if (speed < 170) {
        return new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
          offset: 0,
          color: '#eb3349'
        }, {
          offset: 1,
          color: '#ea162c'
        }], false)
      } else if (speed < 186) {
        return new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
          offset: 0,
          color: '#27e164'
        }, {
          offset: 1,
          color: '#20c556'
        }], false)
      } else if (speed > 185) {
        return new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
          offset: 0,
          color: '#509aff'
        }, {
          offset: 1,
          color: '#387bd6'
        }], false)
      }
    },
    getTextColorBySpeed (speed) {
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
        this.tabClick()
        this.$refs.bottom.timer()
      })
    },
    tabClick (index = 0) {
      this.chartHeader.leftValue = this.data.teamTrendMap[index].avgSpeedMonthGoal
      this.drawLine(index)
    },
    timingUpdateData () {
      const timer = setInterval(() => {
        board.getSpeed().then(res => {
          this.data = res.data
        })
      }, this.$timeout)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    }
  },
  mounted () {
    this.getSpeedData()
    this.timingUpdateData()
  }
}
</script>

<style lang="less">
.average #top{
    background: url("../assets/圆环背景.png") no-repeat;
    background-position-x: center;
    background-position-y: center;
    background-size: 380px;
  }
</style>
