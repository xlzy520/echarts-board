<template>
  <div class="charts-wrapper">
    <chart-box
      ref="top"
      id="top"
      chartStyle="height: 280px"
    ></chart-box>
    <chart-box
      ref="middle"
      title="总线数据"
      id="middle"
      chartStyle="height: 210px"
    ></chart-box>
    <chart-box
      ref="bottom"
      title="各组日均平均车速趋势图"
      :header="true"
      id="bottom"
      :group-data="data.teamTrendMap"
      @tabClick="tabClick"
      chartStyle="height: 305px"
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
      let option = {
        color: ['#000f84', '#5095f3'],
        title: {
          text: '停机次数',
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 30,
            fontWeight: 'normal'
          },
          left: 12,
          top: 10
        },
        legend: {
          data: [
            {
              name: '月累计完成',
              icon: 'rect',
              textStyle: {
                padding: [0, 0, 0, 28 / 4]
              }
            },
            {
              name: '月目标',
              icon: 'rect',
              textStyle: {
                padding: [0, 0, 0, 28 / 4]
              }
            }
          ],
          right: 120 / 4,
          top: 66 / 4,
          itemHeight: 96 / 4,
          itemWidth: 96 / 4,
          itemGap: 76 / 4,
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 100 / 4,
            itemGap: 10 / 4
          }
        },
        grid: {
          top: 320 / 4,
          left: -60 / 4,
          right: 120,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: {
          type: 'category',
          inverse: true,
          offset: -20,
          data: this.data.haltCountData.map(v => v.name),
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            fontSize: 120 / 4,
            margin: 140 / 4,
            formatter: (params, index) => {
              return (
                '{main|' +
                params +
                '}' +
                '\n{sub|' +
                this.data.haltCountData[index].todayHaltCount +
                '次}'
              )
            },
            rich: {
              main: {
                align: 'left',
                fontSize: 120 / 4
              },
              sub: {
                fontSize: 80 / 4
              }
            }
          },
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
            name: '月累计完成',
            type: 'bar',
            barWidth: 160 / 4,
            barGap: '0%',
            label: {
              normal: {
                show: true,
                position: 'right',
                fontFamily: 'PingFang SC Regular',
                fontSize: 120 / 4,
                color: '#333',
                offset: [44 / 4, 0]
              }
            },
            data: this.data.haltCountData.map(v => v.monthHaltCount)
          },
          {
            name: '月目标',
            type: 'bar',
            barWidth: 160 / 4,
            label: {
              normal: {
                show: true,
                position: 'right',
                fontFamily: 'PingFang SC Regular',
                fontSize: 120 / 4,
                color: '#333',
                offset: [44 / 4, 0]
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
            padding: [0, 0, 0, 28 / 4]
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
          top: 40,
          itemHeight: 96 / 4,
          itemWidth: 96 / 4,
          itemGap: 76 / 4,
          formatter: name => {
            const index = legendName.indexOf(name)
            const value = lineHaltCount[index].value
            return name + ': ' + value + '次'
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
            center: ['25%', '50%'],
            radius: [240 / 4, 400 / 4],
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
          value: [v.date, v.value]
        }
      })
      let option = {
        grid: {
          top: 20,
          bottom: 180 / 4
        },
        xAxis: {
          type: 'category',
          offset: 40 / 4,
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
                fontSize: 80 / 4,
                align: 'right',
                width: 200
              },
              end: {
                color: '#333',
                fontFamily: 'PingFang SC Regular',
                fontSize: 80 / 4,
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
      setInterval(() => {
        board.getPageData().then(res => {
          this.data = res.data
        })
      }, this.$timeout)
    }
  },
  mounted () {
    this.getPageData()
    this.timingUpdateData()
  },
  destroyed () {
    clearInterval(this.timingUpdateData())
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
