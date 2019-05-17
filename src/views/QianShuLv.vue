<template>
  <div class="charts-wrapper">
    <chart-box ref="top" title="欠数率、准时入库率" id="top"
               chartStyle="height: 428px"></chart-box>
    <chart-box ref="bottom" title="各组欠数率、准时入库率趋势图" id="bottom"
               class="group-inside"
               :header="true"
               :group-data="data.punctualRateTeamTrendMap"
               @tabClick="tabClick"
               chartStyle="height: 379px"></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import ChartBox from '../components/chart/ChartBox'
export default {
  name: 'QianShuLv',
  components: { ChartBox },
  data () {
    return {
      data: {}
    }
  },
  methods: {
    drawBar () {
      let option = {
        color: ['#000f84', '#5095f3'],
        grid: {
          top: '20%',
          left: '2%',
          bottom: '5%',
          containLabel: true
        },
        legend: {
          top: '5%',
          left: '2%',
          itemHeight: 24,
          itemWidth: 24,
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 20,
            padding: [0, 20, 0, 0]
          },
          data: [
            {
              name: '欠数率',
              icon: 'rect'
            },
            {
              name: '准时入库率',
              icon: 'rect'
            }
          ]
        },
        xAxis: {
          axisLabel: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 25
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          type: 'category',
          data: this.data.ownRateAndPunctualRate.map(v => v.name)
        },
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 6,
            interval: 2,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              fontFamily: 'PingFang SC Regular',
              fontSize: 20,
              formatter: val => val.toFixed(2) + '%'
            }
          },
          {
            type: 'value',
            min: 85,
            max: 100,
            interval: 5,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              fontFamily: 'PingFang SC Regular',
              fontSize: 20,
              formatter: (params) => {
                return params === 85 ? '0.00%' : Number(params).toFixed(2) + '%'
              }
            }
          }
        ],
        series: [
          {
            name: '欠数率',
            type: 'bar',
            data: this.data.ownRateAndPunctualRate.map(v => v.todayOwnRate),
            label: {
              normal: {
                show: true,
                position: 'top',
                fontFamily: 'PingFang SC Regular',
                fontSize: 20,
                color: '#333',
                formatter: params => params.value.toFixed(2) + '%'
              }
            },
            barWidth: 40,
            barGap: '80%'
          },
          {
            name: '准时入库率',
            type: 'bar',
            yAxisIndex: 1,
            data: this.data.ownRateAndPunctualRate.map(v => {
              if (v.todayPunctualRate < 90) {
                return 85 + 5 / 90 * v.todayPunctualRate
              }
              return v.todayPunctualRate
            }),
            label: {
              normal: {
                show: true,
                position: 'top',
                fontFamily: 'PingFang SC Regular',
                fontSize: 20,
                color: '#333',
                formatter: params => {
                  if (params.value < 90) {
                    return ((params.value - 85) * 18).toFixed(2) + '%'
                  }
                  return params.value.toFixed(2) + '%'
                }
              }
            },
            barWidth: 40,
            barGap: '80%'
          }
        ]
      }
      this.$refs.top.draw(option)
    },
    drawLine (index = 0) {
      // 准时入库率
      const seriesData = this.data.punctualRateTeamTrendMap[index].trendMap.map(v => {
        return {
          date: v.date,
          value: v.value < 90 ? 85 + (5 / 90) * v.value : v.value
        }
      })
      const length = seriesData.length - 1
      const startValue = seriesData[0].value
      const endValue = seriesData[length].value
      const markPointData = [
        { name: '第一天', value: startValue, xAxis: 0, yAxis: startValue },
        { name: '最后一天', value: endValue, xAxis: length, yAxis: endValue }
      ]
      // 欠数率
      const seriesDataSecond = this.data.ownRateTeamTrendMap[index].trendMap
      let option = {
        color: ['#000f84', '#5095f3'],
        grid: {
          top: 60,
          bottom: 30,
          left: '2%',
          containLabel: true
        },
        legend: {
          top: '0%',
          left: '2%',
          itemHeight: 24,
          itemWidth: 24,
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 20,
            padding: [0, 20, 0, 0]
          },
          data: [
            {
              name: '欠数率',
              icon: 'rect'
            },
            {
              name: '准时入库率',
              icon: 'rect'
            }
          ]
        },
        xAxis: {
          type: 'category',
          offset: 10,
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
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 6,
            interval: 2,
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
              formatter: val => val.toFixed(2) + '%'
            },
            splitLine: {
              lineStyle: {
                width: 1.25
              }
            }
          },
          {
            type: 'value',
            min: 85,
            max: 100,
            interval: 5,
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
              formatter: (params) => {
                return params === 85 ? '0.00%' : Number(params).toFixed(2) + '%'
              }
            },
            splitLine: {
              lineStyle: {
                width: 1.25
              }
            }
          }
        ],
        series: [
          {
            name: '欠数率',
            yAxisIndex: 0,
            data: seriesDataSecond,
            type: 'line',
            symbolSize: 8,
            itemStyle: {
              borderWidth: 2.5
            },
            lineStyle: {
              width: 2.5
            }
          },
          {
            name: '准时入库率',
            data: seriesData,
            yAxisIndex: 1,
            type: 'line',
            symbolSize: 8,
            itemStyle: {
              borderWidth: 2.5
            },
            lineStyle: {
              width: 2.5
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
            markLine: {
              symbol: 'none',
              label: {
                show: false
              },
              data: [
                {
                  name: markPointData[0].name,
                  xAxis: 0,
                  lineStyle: {
                    color: '#989898',
                    width: 1.5,
                    type: 'dot'
                  }
                },
                {
                  name: markPointData[1].name,
                  xAxis: seriesData.length - 1,
                  lineStyle: {
                    color: '#989898',
                    width: 1.5,
                    type: 'dot'
                  }
                }
              ]
            },
          }
        ]
      }
      this.$refs.bottom.draw(option)
    },
    getPageData () {
      return board.getOwnRateAndPunctualRate().then(res => {
        this.data = res.data
        this.drawBar()
        this.tabClick()
        this.$refs.bottom.timer()
      })
    },
    tabClick (index = 0) {
      this.drawLine(index)
    },
    timingUpdateData () {
      const timer = setInterval(() => {
        board.getOwnRateAndPunctualRate().then(res => {
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

</style>
