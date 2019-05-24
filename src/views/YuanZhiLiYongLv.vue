<template>
  <div class="charts-wrapper">
    <chart-box ref="top" id="top" chartStyle="height: 312px"></chart-box>
    <chart-box
      ref="middle"
      title="总线数据"
      id="middle"
      chartStyle="height: 210px"
    ></chart-box>
    <chart-box
      ref="bottom"
      title="各组原纸利用率趋势图"
      id="bottom"
      :header="chartHeader"
      :group-data="data.teamTrendMap"
      @tabClick="tabClick"
      chartStyle="height: 250px"
    ></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import ChartBox from '../components/chart/ChartBox'
import mixins from '../utils/mixins'
export default {
  name: 'YuanZhiLiYongLi',
  components: { ChartBox },
  mixins: [mixins],
  data () {
    return {
      chartHeader: {
        leftTitle: '合理原纸利用率',
        leftValue: '98',
        leftUnit: '%'
      }
    }
  },
  methods: {
    calc (min, max, goal, count) {
      const diff = max - goal
      if (count === 0) {
        count = min
      }
      if (diff === 0) {
        return count
      }
      return min + (count - min) / (goal - min) * (max - min)
    },
    drawBar () {
      this.data.paperUseRate = this.data.paperUseRate.reverse()
      const [a, b] = this.data.paperUseRate
      const min = 95
      const max = Math.max(a.paperUseRateMonthGoalRate, b.paperUseRateMonthGoalRate)
      const markPointData = [
        {
          name: '日累计',
          value: b.paperUseRate,
          xAxis: b.paperUseRateMonthRate >= b.paperUseRateMonthGoalRate ? max : this.calc(min, max, b.paperUseRateMonthGoalRate, b.paperUseRateMonthRate),
          yAxis: 1
        },
        {
          name: '日累计',
          value: a.paperUseRate,
          xAxis: a.paperUseRateMonthRate >= a.paperUseRateMonthGoalRate ? max : this.calc(min, max, a.paperUseRateMonthGoalRate, a.paperUseRateMonthRate),
          yAxis: 0
        }
      ]
      // 提示框标记坐标
      let markPointRectData = JSON.parse(JSON.stringify(markPointData))
      // 提示框左侧和右侧都不能被隐藏
      markPointRectData.map(v => {
        const rate = (v.xAxis - min) / (max - min)
        if (rate < 0.1333) {
          v.xAxis = v.xAxis + (max - min) * 0.128
        } else if (rate > 0.8666666666666636) {
          v.xAxis = v.xAxis - (max - min) * 0.128
        }
      })
      // 标记线数据，上下两列
      let markLineData = [
        // 下标记线
        [
          {
            x: '15',
            y: '80.4%',
            lineStyle: { width: 40, color: '#198cff' }
          },
          { x: 525, y: '80.4%' }
        ],
        // 上标记线
        [
          {
            x: '15',
            y: '40.1%',
            lineStyle: { width: 40, color: '#198cff' }
          },
          { x: '525', y: '40.1%' }
        ]
      ]
      // 标记线数量，长度
      let monthCount = this.data.paperUseRate.map((v, index) => {
        // 长度是否为2，如果长度不为2，那么下标只能取0，而取不到1
        const lengthIs2 = markLineData.length === 2
        if (v.paperUseRateMonthRate >= v.paperUseRateMonthGoalRate) {
          return min
        } else {
          // 未超过，不显示标记线
          markLineData.splice(lengthIs2 ? index : 0, 1)
        }
        let diff = max - v.paperUseRateMonthGoalRate
        if (v.paperUseRateMonthRate === 0) {
          if (diff === 0) {
            return min
          }
          return min + (max - v.paperUseRateMonthGoalRate) / (max - min)
        } else {
          if (diff === 0) {
            return v.paperUseRateMonthRate
          }
          // return v.paperUseRateMonthRate + (max - v.paperUseRateMonthGoalRate) / (max - min)
          return min + (v.paperUseRateMonthRate - min) / (v.paperUseRateMonthGoalRate - min) * (max - min)
        }
      })
      let option = {
        color: ['#198cff', '#d0e7ff'],
        title: {
          text: '原纸利用率',
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
          max: max,
          min: min
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            show: false
          },
          data: this.data.paperUseRate.map(v => v.name),
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
                return '{letter|' + params.name + '}组 今日利用率 ' +
                  '{number|' + (params.dataIndex === 0 ? a : b).paperUseRate.toFixed(2) + '}%'
              },
              rich: {
                letter: {
                  fontFamily: 'PingFang SC Regular',
                  color: '#333',
                  fontSize: 30,
                  verticalAlign: 'top'
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
                  const { paperUseRateMonthGoalRate, paperUseRateMonthRate } = params.dataIndex === 0 ? a : b
                  const value = paperUseRateMonthRate - paperUseRateMonthGoalRate
                  if (value === 0) {
                    return '已达成月目标'
                  } else if (value > 0) {
                    return '已超过月目标{number|' + value.toFixed(2) + '}%'
                  }
                  return ''
                },
                rich: {
                  number: {
                    fontFamily: 'PingFang SC Regular',
                    fontSize: 24,
                    color: '#fff',
                    verticalAlign: 'middle'
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
                return '月目标利用率{number|' + (params.dataIndex === 0 ? a : b).paperUseRateMonthGoalRate.toFixed(2) + '}%'
              },
              rich: {
                number: {
                  fontFamily: 'PingFang SC Regular',
                  color: '#333',
                  fontSize: 30,
                  verticalAlign: 'top',
                  lineHeight: 36
                }
              }
            },
            data: this.data.paperUseRate.map(v => {
              if (v.paperUseRateMonthRate >= v.paperUseRateMonthGoalRate) {
                return max
              }
              let diff = max - v.paperUseRateMonthGoalRate
              // 判断月累计为0的情况，将其改为最小值
              if (v.paperUseRateMonthRate === 0) {
                if (diff === 0) {
                  return max
                } else {
                  return max - (max - v.paperUseRateMonthGoalRate) / (max - min)
                }
              } else {
                if (diff === 0) {
                  return min + max - v.paperUseRateMonthRate
                } else {
                  // 目标值减去最小值的部分之后等于最大值减去最小值
                  return max - ((v.paperUseRateMonthRate - min) / (v.paperUseRateMonthGoalRate - min) * (max - min))
                }
              }
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
                  return '月累计利用率 ' + (params.dataIndex === 0 ? b : a).paperUseRateMonthRate.toFixed(2) + '%'
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
      const { linePaperUseRate } = this.data
      const legendName = linePaperUseRate.map(v => v.name)
      const legendData = linePaperUseRate.map(v => {
        return {
          name: v.name,
          icon: 'rect',
          textStyle: {
            padding: [0, 0, 0, 28 / 4]
          }
        }
      })
      const currentTotal = linePaperUseRate[0].value
      const total = linePaperUseRate[1].value
      const seriesData = [
        {
          name: '月累计原纸利用率',
          value: currentTotal
        },
        {
          'name': '月目标原纸利用率',
          'value': currentTotal >= total ? 0 : total * (1 - currentTotal / total)
        }
      ]
      let option = {
        color: ['#ffb32f', '#0dd64f'],
        legend: {
          orient: 'vertical',
          data: legendData,
          left: '42%',
          top: 240 / 4,
          itemHeight: 96 / 4,
          itemWidth: 96 / 4,
          itemGap: 76 / 4,
          formatter: (name) => {
            const index = legendName.indexOf(name)
            const value = this.data.linePaperUseRate[index].value
            return name + ':{number| ' + value.toFixed(1) + '}%'
          },
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 80 / 4,
            itemGap: 10 / 4,
            rich: {
              number: {
                fontFamily: 'PingFang SC Regular',
                color: '#333',
                fontSize: 30,
                verticalAlign: 'top',
                lineHeight: 36
              }
            }
          }
        },
        series: [
          {
            name: '总线数据',
            type: 'pie',
            silent: true,
            center: ['21%', '50%'],
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
      const seriesData = this.data.teamTrendMap[index].trendMap.map(v => {
        return {
          date: v.date,
          // 小于98就直接为0行，97.5为伪0行,将97.5-98分成98份
          value: v.value < 98 ? 97.5 + (0.5 / 98) * v.value : v.value
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
          splitNumber: 4,
          interval: 0.5,
          min: 97.5,
          max: 100,
          scale: true,
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
              if (params < 98) {
                return '0.00%'
              }
              return params.toFixed(2) + '%'
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
          markLine: {
            symbol: 'none',
            data: [
              {
                name: '合理最低原纸利用率：98.00%',
                yAxis: 98,
                lineStyle: {
                  color: '#f78787',
                  width: 5 / 4,
                  type: 'solid',
                  opacity: 0.5
                },
                label: {
                  formatter: () => {
                    return '98%'
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
          },
          type: 'line',
          symbolSize: 35 / 4,
          itemStyle: {
            color: '#5095f3',
            borderWidth: 10 / 4
          },
          lineStyle: {
            width: 10 / 4
          }
        }]
      }
      this.$refs.bottom.draw(option)
    },
    // 各组利用率趋势图
    getPageData () {
      return board.getPaperUseRate()
    }
  }
}
</script>

<style lang="less">

</style>
