<template>
  <div class="dashboard">
    <chart-box
      ref="top"
      id="top"
      chartStyle="height: 1400px;width: 100%"
    ></chart-box>
    <chart-box
      ref="middle"
      title="总线数据"
      id="middle"
      chartStyle="height: 1000px;width: 100%"
    ></chart-box>
    <chart-box
      ref="bottom"
      title="各组日均平均车速趋势图"
      id="bottom"
      :header="chartHeader"
      @tabClick="tabClick"
      chartStyle="height: 1920px;width: 100%"
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
      data: {},
      chartHeader: {
        checkTab: '',
        groupData: []
      }
    }
  },
  methods: {
    // 停机次数
    drawTingJiCiShu () {
      let option = {
        color: ['#000f84', '#5095f3'],
        title: {
          text: '停机次数',
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 120,
            fontWeight: 'normal'
          },
          left: 48,
          top: 66
        },
        legend: {
          data: [
            {
              name: '月累计完成',
              icon: 'rect',
              textStyle: {
                padding: [0, 0, 0, 28]
              }
            },
            {
              name: '月目标',
              icon: 'rect',
              textStyle: {
                padding: [0, 0, 0, 28]
              }
            }
          ],
          right: 120,
          top: 66,
          itemHeight: 96,
          itemWidth: 96,
          itemGap: 76,
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 100,
            itemGap: '10'
          }
        },
        grid: {
          top: 200,
          left: -60,
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: this.data.haltCountData.map(v => v.name),
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            fontSize: 120,
            margin: 40,
            formatter: (params, index) => {
              return (
                '{main|' +
                params +
                '}' +
                '\n{sub|(' +
                this.data.haltCountData[index].todayHaltCount +
                '次)}'
              )
            },
            rich: {
              main: {
                align: 'left',
                fontSize: 120
              },
              sub: {
                fontSize: 80
              }
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '月累计完成',
            type: 'bar',
            barWidth: 160,
            barGap: '0%',
            label: {
              normal: {
                show: true,
                position: 'right',
                fontFamily: 'PingFang SC Regular',
                fontSize: 120,
                color: '#333',
                formatter: (paramas, index) => {
                  return paramas.data + '次'
                },
                offset: [44, 0]
              }
            },
            data: this.data.haltCountData.map(v => v.monthHaltCount)
          },
          {
            name: '月目标',
            type: 'bar',
            barWidth: 160,
            label: {
              normal: {
                show: true,
                position: 'right',
                fontFamily: 'PingFang SC Regular',
                fontSize: 120,
                color: '#333',
                formatter: (paramas, index) => {
                  return paramas.data + '次'
                },
                offset: [44, 0]
              }
            },
            data: this.data.haltCountData.map(v => v.haltCountMonthGoal)
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
          icon: 'rect',
          textStyle: {
            padding: [0, 0, 0, 28]
          }
        }
      })
      const dayTotal = lineHaltCount.find(v => v.name === '日累计停机次数')
        .value
      const monthGoal = lineHaltCount.find(v => v.name === '月目标停机次数')
        .value
      const monthTotal = lineHaltCount.find(v => v.name === '月累计停机次数')
        .value
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
          top: 300,
          itemHeight: 96,
          itemWidth: 96,
          itemGap: 76,
          formatter: name => {
            const index = legendName.indexOf(name)
            const value = lineHaltCount[index].value
            return name + ': ' + value + '次'
          },
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 80,
            itemGap: '10'
          }
        },
        series: [
          {
            name: '总线数据',
            type: 'pie',
            center: ['25%', '50%'],
            radius: [240, 400],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
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
          date: new Date(v.date).toString(),
          value: [v.date, Number(v.value)]
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
              return index === 0 || index === seriesData.length - 1
            },
            formatter: (params, index) => {
              if (index === 0) {
                return (
                  '{front|' + this.moment(params).format('YYYY年MM月DD日') + '}'
                )
              } else {
                return (
                  '{end|' + this.moment(params).format('YYYY年MM月DD日') + '}'
                )
              }
            },
            rich: {
              front: {
                color: '#333',
                fontFamily: 'PingFang SC Regular',
                fontSize: 80,
                align: 'right',
                width: 600
              },
              end: {
                color: '#333',
                fontFamily: 'PingFang SC Regular',
                fontSize: 80,
                align: 'left',
                width: 600
              }
            }
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
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            fontSize: 80,
            margin: 40
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 5
            }
          }
        },
        series: [
          {
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
          }
        ]
      }
      this.$refs.bottom.draw(option)
    },
    // 各组停机次数趋势图
    getHaltCount () {
      return board.getHaltCount().then(res => {
        this.data = res.data
        this.chartHeader.groupData = this.data.teamTrendMap
        this.drawTingJiCiShu()
        this.drawZongXianShuJu()
        this.drawLine()
        this.tabClick(res.data.teamTrendMap[0])
        this.timer()
      })
    },
    tabClick (tab, index) {
      this.checkTab = tab.teamName
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
    this.getHaltCount()
  },
  destroyed () {
    clearInterval(this.timer())
  }
}
</script>

<style lang="less">
.dashboard-box-header {
  &.single-header {
    justify-content: flex-end;
    padding-top: 27 * 2px;
    padding-bottom: 27 * 2px;
  }
}
</style>
