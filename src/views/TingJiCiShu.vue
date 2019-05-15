<template>
  <div class="charts-wrapper">
    <chart-box
      ref="top"
      id="top"
      chartStyle="height: 330px"
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
      chartStyle="height: 300px"
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
      const max = this.data.haltCountData[0].haltCountMonthGoal
      const [a, b] = this.data.haltCountData
      const markPointData = [
        {
          name: '日累计',
          value: a.todayHaltCount,
          xAxis: a.todayHaltCount + a.monthHaltCount,
          yAxis: 0
        },
        {
          name: '日累计',
          value: b.todayHaltCount,
          xAxis: b.todayHaltCount + b.monthHaltCount,
          yAxis: 1
        }
      ]
      let markPointRectData = [
        {
          name: '日累计',
          value: a.todayHaltCount,
          xAxis: a.todayHaltCount + a.monthHaltCount,
          yAxis: 0
        },
        {
          name: '日累计',
          value: b.todayHaltCount,
          xAxis: b.todayHaltCount + b.monthHaltCount,
          yAxis: 1
        }
      ]
      markPointRectData.map(v => {
        let rate = v.xAxis / max
        if (rate < 0.1) {
          v.xAxis += max * 0.08
        } else if (rate > 0.9) {
          v.xAxis -= max * 0.08
        }
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
              offset: [0, -50],
              color: '#333',
              formatter: params => {
                return '{letter|' + params.name + '}组月累计停机次数 ' + '{number|' + params.value + '}次'
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
            data: this.data.haltCountData.map(v => v.monthHaltCount)
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
            data: this.data.haltCountData.map(v => v.todayHaltCount),
            markPoint: {
              symbol: function (data, params) {
                console.log(data, params)
                // return 'image://http://s0.hao123img.com/res/img/moe/bilibili-logoo.jpg'
                return 'arrow'
              },
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
              offset: [0, -50],
              fontFamily: 'PingFang SC Regular',
              fontSize: 18,
              color: '#333',
              formatter: params => {
                return '月目标停机次数 {number|' + this.data.haltCountData[params.dataIndex].haltCountMonthGoal + '}次'
              },
              rich: {
                number: {
                  fontFamily: 'PingFang SC Regular',
                  color: '#333',
                  fontSize: 30
                }
              }
            },
            data: this.data.haltCountData.map(v => v.haltCountMonthGoal - v.monthHaltCount - v.todayHaltCount),
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
                formatter: paramas => {
                  return '今日已停 ' + paramas.value + '次'
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
