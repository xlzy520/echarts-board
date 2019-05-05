<template>
  <div class="charts-wrapper">
    <chart-box ref="top" title="欠数率、准时入库率" id="top"
               chartStyle="height: 428px;width: 560px"></chart-box>
    <chart-box ref="bottom" title="各组欠数率、准时入库率趋势图" id="bottom"
               class="group-inside"
               :header="true"
               :group-data="data.punctualRateTeamTrendMap"
               @tabClick="tabClick"
               chartStyle="height: 409px;width: 560px"></chart-box>
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
          date: new Date(v.date).toString(),
          value: [v.date, v.value < 90 ? 85 + (5 / 90) * v.value : v.value]
        }
      })
      // 欠数率
      const seriesDataSecond = this.data.ownRateTeamTrendMap[index].trendMap.map(v => {
        return {
          date: new Date(v.date).toString(),
          value: [v.date, v.value]
        }
      })
      let option = {
        color: ['#f45b5b', '#5095f3'],
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
            }
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
      setInterval(() => {
        board.getOwnRateAndPunctualRate().then(res => {
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
  .group-inside{
    .chart-box-header{
      position: absolute;
      left: -15px;
      z-index: 200;
    }
  }
</style>
