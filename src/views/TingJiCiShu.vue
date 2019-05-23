<template>
  <div class="charts-wrapper">
    <chart-box
      ref="top"
      id="top"
      chartStyle="height: 299px"
    ></chart-box>
    <chart-box
      ref="middle"
      title="总线数据"
      id="middle"
      chartStyle="height: 210px"
    ></chart-box>
    <chart-box
      ref="bottom"
      title="各组停机次数趋势图"
      :header="true"
      id="bottom"
      :group-data="data.teamTrendMap"
      @tabClick="tabClick"
      chartStyle="height: 280px"
    ></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import ChartBox from '../components/chart/ChartBox'
export default {
  name: 'TingJiCiShu',
  components: { ChartBox },
  data () {
    return {
      data: {}
    }
  },
  methods: {
    // 停机次数
    drawTingJiCiShu () {
      this.data.haltCountData = this.data.haltCountData.reverse()
      // a在下，b在上
      const [a, b] = this.data.haltCountData
      // 取最大值，上下两列的最大值都设为这个值
      const max = Math.max(a.haltCountMonthGoal, b.haltCountMonthGoal)
      // 箭头标记点坐标，当月累计大于月目标时，去最大值，否则乘以相应的比例
      const markPointData = [
        {
          name: '日累计',
          value: b.todayHaltCount,
          xAxis: b.monthHaltCount >= a.haltCountMonthGoal ? max : (b.monthHaltCount + b.todayHaltCount) * (max / b.haltCountMonthGoal),
          yAxis: 1
        },
        {
          name: '日累计',
          value: a.todayHaltCount,
          xAxis: a.monthHaltCount >= a.haltCountMonthGoal ? max : (a.monthHaltCount + a.todayHaltCount) * (max / a.haltCountMonthGoal),
          yAxis: 0
        }
      ]
      // 提示框标记坐标
      let markPointRectData = JSON.parse(JSON.stringify(markPointData))
      // 提示框左侧和右侧都不能被隐藏
      markPointRectData.map(v => {
        if ((v.xAxis - v.value) >= max) {
          v.xAxis -= v.value * 2
        }
        let rate = v.xAxis / max
        if (rate < 0.1) {
          v.xAxis += max * 0.08
        } else if (rate > 0.9) {
          v.xAxis -= max * 0.08
        }
      })
      // 标记线数据，上下两列
      let markLineData = [
        // 下标记线
        [
          {
            x: '15',
            y: '77.5%',
            lineStyle: { width: 40, color: '#ff001c' }
          },
          { x: 525, y: '77.5%' }
        ],
        // 上标记线
        [
          {
            x: '15',
            y: '39.3%',
            lineStyle: { width: 40, color: '#ff001c' }
          },
          { x: '525', y: '39.3%' }
        ]
      ]
      // 标记线数量，长度
      let monthCount = this.data.haltCountData.map((v, index) => {
        // 长度是否为2，如果长度不为2，那么下标只能取0，而取不到1
        const lengthIs2 = markLineData.length === 2
        if (v.monthHaltCount >= v.haltCountMonthGoal) {
          // 控制红色警告线的长度
          markLineData[lengthIs2 ? index : 0][1].x -= 5.1
          return max - v.todayHaltCount * (max / v.haltCountMonthGoal)
        } else {
          // 未超过，不显示标记线
          markLineData.splice(lengthIs2 ? index : 0, 1)
        }
        return v.monthHaltCount
      })
      let option = {
        color: ['#5095f3', '#000f84', '#bbdaf7'],
        title: {
          text: '停机次数',
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
              name: '日累计',
              icon: 'rect'
            },
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
          bottom: -10,
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
          data: this.data.haltCountData.map(v => v.name),
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
                return '{letter|' + params.name + '}组 月累计停机次数 ' +
                  '{number|' + (params.dataIndex === 0 ? a : b).monthHaltCount + '}次'
              },
              rich: {
                letter: {
                  fontFamily: 'PingFang SC Regular',
                  color: '#333',
                  fontSize: 26
                },
                number: {
                  fontFamily: 'PingFang SC Regular',
                  color: '#333',
                  fontSize: 30
                }
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
                verticalAlign: 'middle',
                formatter: params => {
                  const { haltCountMonthGoal, monthHaltCount } = params.dataIndex === 0 ? a : b
                  const value = monthHaltCount - haltCountMonthGoal
                  if (value === 0) {
                    return '已触及月目标'
                  } else if (value > 0) {
                    return '已超出月目标停机次数{number|' + value + '}次'
                  }
                  return ''
                },
                rich: {
                  number: {
                    fontFamily: 'PingFang SC Regular',
                    fontSize: 30,
                    color: '#fff'
                  }
                }
              },
              data: markLineData
            },
            data: monthCount
          },
          {
            name: '日累计',
            type: 'bar',
            barWidth: 160 / 4,
            barGap: '0%',
            stack: 'count',
            label: {
              normal: {
                show: false,
                position: 'top',
                fontFamily: 'PingFang SC Regular',
                fontSize: 120 / 4,
                color: '#333'
              }
            },
            data: this.data.haltCountData.map(v => {
              return v.todayHaltCount * (max / v.haltCountMonthGoal)
            }),
            markPoint: {
              symbol: 'arrow',
              symbolSize: 15,
              symbolOffset: [0, 20],
              data: markPointData,
              label: {
                show: false
              }
            }
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
                return '月目标停机次数 {number|' + (params.dataIndex === 0 ? a : b).haltCountMonthGoal + '}次'
              },
              rich: {
                number: {
                  fontFamily: 'PingFang SC Regular',
                  color: '#333',
                  fontSize: 30
                }
              }
            },
            data: this.data.haltCountData.map(v => {
              if (v.monthHaltCount >= v.haltCountMonthGoal) {
                return 0
              }
              return v.haltCountMonthGoal - v.monthHaltCount - v.todayHaltCount
            }),
            markPoint: {
              symbol: 'rect',
              symbolSize: [100, 30],
              symbolOffset: [0, 45],
              data: markPointRectData,
              itemStyle: {
                color: '#000f84'
              },
              label: {
                fontFamily: 'PingFang SC Regular',
                fontSize: 15,
                formatter: params => {
                  return '今日已停 ' + (params.dataIndex === 0 ? b : a).todayHaltCount + '次'
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
    drawZongXianShuJu () {
      const { lineHaltCount } = this.data
      const legendName = lineHaltCount.map(v => v.name)
      const legendData = lineHaltCount.map(v => {
        return {
          name: v.name,
          icon: 'rect'
        }
      })
      const dayTotal = lineHaltCount.find(v => v.name === '日累计停机次数').value
      const monthGoal = lineHaltCount.find(v => v.name === '月目标停机次数').value
      const monthTotal = lineHaltCount.find(v => v.name === '月累计停机次数').value
      const seriesData = [
        {
          name: '日累计停机次数',
          value: monthTotal >= monthGoal ? 0 : dayTotal
        },
        {
          name: '月累计停机次数',
          value: monthTotal
        },
        {
          name: '月目标停机次数',
          value:
            monthTotal >= monthGoal
              ? 0
              : monthGoal * (1 - monthTotal / monthGoal)
        }
      ]
      let option = {
        color: ['#5095f3', '#ffb32f', '#0dd64f'],
        legend: {
          orient: 'vertical',
          data: legendData,
          left: '50%',
          top: 40,
          itemHeight: 96 / 4,
          itemWidth: 96 / 4,
          itemGap: 76 / 4,
          formatter: name => {
            const index = legendName.indexOf(name)
            const value = lineHaltCount[index].value
            return name + '{number| ' + value + '} 次'
          },
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 80 / 4,
            itemGap: 10 / 4,
            rich: {
              number: {
                fontFamily: 'PingFang SC Regular',
                fontSize: 30
              }
            }
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
          bottom: 30
        },
        xAxis: {
          type: 'category',
          offset: 40 / 4,
          splitNumber: 1,
          axisLabel: {
            show: false
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
          splitNumber: 4,
          interval: 3,
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
            margin: 40 / 4
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 5 / 4
            }
          }
        },
        series: [
          {
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
          }
        ]
      }
      this.$refs.bottom.draw(option)
    },
    // 各组停机次数趋势图
    getPageData () {
      return board.getHaltCount().then(res => {
        this.data = res.data
        this.drawTingJiCiShu()
        this.drawZongXianShuJu()
        this.tabClick()
        this.$refs.bottom.timer()
      })
    },
    tabClick (index = 0) {
      this.drawLine(index)
    },
    timingUpdateData () {
      const timer = setInterval(() => {
        board.getHaltCount().then(res => {
          this.data = res.data
        })
      }, this.$timeout)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    }
  },
  mounted () {
    this.getPageData()
    this.timingUpdateData()
  }
}
</script>

<style lang="less">
.chart-box-header {
  &.single-header {
    justify-content: flex-end;
    padding-top: 0;
  }
}
</style>
