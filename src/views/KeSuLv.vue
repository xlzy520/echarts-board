<template>
  <div class="charts-wrapper">
    <chart-box ref="top" id="top" chartStyle="height: 292px"></chart-box>
    <chart-box
      ref="middle"
      title="总线数据"
      id="middle"
      chartStyle="height: 210px"
    ></chart-box>
    <chart-box
      ref="bottom"
      title="各组客诉率趋势图"
      id="bottom"
      :header="chartHeader"
      :group-data="data.teamTrendMap"
      @tabClick="tabClick"
      chartStyle="height: 270px"
    ></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import ChartBox from '../components/chart/ChartBox'
import mixins from '../utils/mixins'
export default {
  name: 'KeSuLv',
  mixins: [mixins],
  components: { ChartBox },
  data () {
    return {
      chartHeader: {
        leftTitle: '合理客诉率',
        leftValue: '0.1',
        leftUnit: '%'
      }
    }
  },
  methods: {
    // 客诉率
    drawBar () {
      this.data.avgComplaintRate = this.data.avgComplaintRate.reverse()
      const [a, b] = this.data.avgComplaintRate
      const max = Math.max(a.complaintRateMonthGoalRate, b.complaintRateMonthGoalRate)
      const markPointData = this.data.avgComplaintRate.map((v, index) => {
        const rate = v.complaintRateMonthRate / v.complaintRateMonthGoalRate || 0
        return {
          name: '日累计',
          value: v.complaintRate,
          xAxis: rate >= 1 ? max : max * rate,
          yAxis: index
        }
      }).reverse()
      // 提示框标记坐标
      let markPointRectData = JSON.parse(JSON.stringify(markPointData))
      // 提示框左侧和右侧都不能被隐藏
      markPointRectData.map(v => {
        const rate = v.xAxis / max
        if (rate < 0.1333) {
          v.xAxis = v.xAxis + max * 0.128
        } else if (rate > 0.8666666666666636) {
          v.xAxis = v.xAxis - max * 0.128
        }
      })
      // 标记线数据，上下两列
      let markLineData = [
        // 下标记线
        [
          {
            x: '15',
            y: '80.9%',
            lineStyle: { width: 40, color: '#ff001c' }
          },
          { x: 525, y: '80.9%' }
        ],
        // 上标记线
        [
          {
            x: '15',
            y: '40.7%',
            lineStyle: { width: 40, color: '#ff001c' }
          },
          { x: '525', y: '40.7%' }
        ]
      ]
      // 标记线数量，长度
      let monthCount = this.data.avgComplaintRate.map((v, index) => {
        // 长度是否为2，如果长度不为2，那么下标只能取0，而取不到1
        const lengthIs2 = markLineData.length === 2
        if (v.complaintRateMonthRate >= v.complaintRateMonthGoalRate) {
          return max
        } else {
          // 未超过，不显示标记线
          markLineData.splice(lengthIs2 ? index : 0, 1)
        }
        return v.complaintRateMonthRate * (max / v.complaintRateMonthGoalRate)
      })
      let option = {
        color: ['#198cff', '#d0e7ff'],
        title: {
          text: '客诉率',
          textStyle: {
            fontFamily: 'PingFang SC Bold',
            fontSize: 30,
            fontWeight: 'lighter'
          },
          left: 12,
          top: 15
        },
        legend: {
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 100 / 4
          },
          right: 15,
          top: 66 / 4,
          itemHeight: 96 / 4,
          itemWidth: 96 / 4,
          itemGap: 76 / 4,
          data: [
            {
              name: '月累计',
              icon: 'rect'
            },
            {
              name: '月目标',
              icon: 'rect'
            }
          ]
        },
        grid: {
          top: 60,
          left: 15,
          right: 15,
          bottom: -23,
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
          max: max
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            show: false
          },
          data: this.data.avgComplaintRate.map(v => v.name),
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '月累计',
            type: 'bar',
            barWidth: 160 / 4,
            stack: 'count',
            label: {
              show: true,
              position: 'insideLeft',
              fontFamily: 'PingFang SC Regular',
              fontSize: 18,
              offset: [0, -40],
              color: '#333',
              formatter: params => {
                return '{letter|' + params.name + '} 组今日客诉率 ' +
                  '{number|' + (params.dataIndex === 0 ? a : b).complaintRate + '}%'
              },
              rich: {
                letter: {
                  fontFamily: 'PingFang SC Regular',
                  color: '#333',
                  fontSize: 26,
                  verticalAlign: 'top',
                  lineHeight: 26
                },
                number: {
                  fontFamily: 'PingFang SC Regular',
                  color: '#333',
                  fontSize: 30,
                  verticalAlign: 'top',
                  lineHeight: 36
                }
              }
            },
            markPoint: {
              symbol: 'arrow',
              symbolSize: 15,
              symbolOffset: [0, 20],
              itemStyle: {
                color: '#198cff'
              },
              data: markPointData,
              label: {
                show: false
              }
            },
            markLine: {
              symbol: 'none',
              lineStyle: { type: 'solid' },
              silent: true,
              label: {
                position: 'middle',
                color: '#fff',
                fontFamily: 'PingFang SC Regular',
                fontSize: 18,
                height: 30,
                lineHeight: 40,
                verticalAlign: 'middle',
                formatter: params => {
                  let index
                  if (markLineData.length === 1) {
                    if (markLineData[0][1].y === '80.9%') {
                      index = 0
                    } else {
                      index = 1
                    }
                  } else {
                    index = params.dataIndex
                  }
                  const { complaintRateMonthGoalRate, complaintRateMonthRate } = this.data.avgComplaintRate[index]
                  const value = complaintRateMonthRate - complaintRateMonthGoalRate
                  if (value === 0) {
                    return '已触及月目标'
                  } else if (value > 0) {
                    return '已超出月目标{number|' + value.toFixed(3) + '}%'
                  }
                  return ''
                },
                rich: {
                  number: {
                    fontFamily: 'PingFang SC Regular',
                    fontSize: 24,
                    color: '#fff',
                    verticalAlign: 'middle'
                    // lineHeight: 36
                  }
                }
              },
              data: markLineData
            },
            data: monthCount
          },
          {
            name: '月目标',
            type: 'bar',
            barWidth: 160 / 4,
            stack: 'count',
            label: {
              show: true,
              position: 'insideRight',
              offset: [0, -40],
              fontFamily: 'PingFang SC Regular',
              fontSize: 18,
              color: '#333',
              formatter: params => {
                return '月目标客诉率{number|' + (params.dataIndex === 0 ? a : b).complaintRateMonthGoalRate + '}%'
              },
              rich: {
                number: {
                  fontFamily: 'PingFang SC Regular',
                  color: '#333',
                  fontSize: 30
                }
              }
            },
            data: this.data.avgComplaintRate.map(v => {
              if (v.complaintRateMonthRate >= v.complaintRateMonthGoalRate) {
                return 0
              }
              return max - v.complaintRateMonthRate * max / v.complaintRateMonthGoalRate
            }),
            markPoint: {
              symbol: 'rect',
              symbolSize: [150, 30],
              symbolOffset: [0, 45],
              data: markPointRectData,
              itemStyle: {
                color: '#198cff'
              },
              label: {
                fontFamily: 'PingFang SC Regular',
                fontSize: 15,
                formatter: params => {
                  return '月累计客诉率 ' + (params.dataIndex === 0 ? b : a).complaintRateMonthRate + '%'
                },
                offset: [0, 0]
              }
            }
          }
        ]
      }
      this.$refs.top.draw(option)
    },
    // 总线数据
    drawPie () {
      const { lineComplaintRate } = this.data
      const legendName = lineComplaintRate.map(v => v.name)
      const legendData = lineComplaintRate.map(v => {
        return {
          name: v.name,
          icon: 'rect',
          textStyle: {
            padding: [0, 0, 0, 28 / 4]
          }
        }
      })
      const total = lineComplaintRate.find(v => v.name === '月目标客诉率').value
      const currentTotal = lineComplaintRate.find(v => v.name === '月累计客诉率').value
      const seriesData = [
        {
          name: '月累计客诉率',
          value: currentTotal
        },
        {
          'name': '月目标客诉率',
          'value': currentTotal >= total ? 0 : total * (1 - currentTotal / total)
        }
      ]
      let option = {
        color: ['#ffb32f', '#0dd64f'],
        legend: {
          orient: 'vertical',
          data: legendData,
          left: '50%',
          top: 240 / 4,
          itemHeight: 96 / 4,
          itemWidth: 96 / 4,
          itemGap: 76 / 4,
          formatter: (name) => {
            const index = legendName.indexOf(name)
            const value = this.data.lineComplaintRate[index].value
            return name + ': ' + value + '%'
          },
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 80 / 4,
            itemGap: 10 / 4
          }
        },
        series: [
          {
            name: '总线数据',
            type: 'pie',
            silent: true,
            center: ['25%', '50%'],
            radius: [240 / 4, 400 / 4],
            avoidLabelOverlap: false,
            legendHoverLink: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: 30 / 4,
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: seriesData
          }
        ]
      }
      this.$refs.middle.draw(option)
    },
    drawLine (index = 0) {
      const seriesData = this.data.teamTrendMap[index].trendMap
      const length = seriesData.length - 1
      const startValue = seriesData[0].value
      const endValue = seriesData[length].value
      const markPointData = [
        { name: '第一天', value: startValue, xAxis: 0, yAxis: startValue },
        { name: '最后一天', value: endValue, xAxis: length, yAxis: endValue }
      ]
      let option = {
        grid: {
          top: 30,
          left: 400 / 4,
          bottom: 30
        },
        xAxis: {
          type: 'category',
          offset: 40 / 4,
          splitNumber: 1,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 0.15,
          splitNumber: 4,
          interval: 0.05,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            fontSize: 80 / 4,
            margin: 40 / 4,
            formatter: (params, index) => {
              return params.toFixed(3) + '%'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 5 / 4
            }
          }
        },
        series: [{
          data: seriesData,
          type: 'line',
          symbolSize: 35 / 4,
          itemStyle: {
            color: '#5095f3',
            borderWidth: 10 / 4
          },
          lineStyle: {
            width: 10 / 4
          },
          markLine: {
            symbol: 'none',
            data: [
              {
                name: '合理最低原纸利用率：0.1%',
                yAxis: 0.1,
                lineStyle: {
                  color: '#f78787',
                  width: 5 / 4,
                  type: 'solid',
                  opacity: 0.5
                },
                label: {
                  formatter: () => {
                    return '0.1%'
                  }
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
    // 各组客诉率趋势图
    getPageData () {
      return board.getCustomComplaintRate()
    }
  }
}
</script>

<style lang="less">

</style>
