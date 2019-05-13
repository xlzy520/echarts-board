<template>
  <div class="charts-wrapper">
    <chart-box ref="top" title="修边比例、平均门幅" id="top"
               chartStyle="height: 428px"></chart-box>
    <chart-box ref="bottom" title="各组修边比例、平均门幅趋势图" id="bottom"
               class="group-inside"
               :header="true"
               :group-data="data.avgWidthTeamTrendMap"
               @tabClick="tabClick"
               chartStyle="height: 379px"></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import ChartBox from '../components/chart/ChartBox'
export default {
  name: 'MenFuXiuBian',
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
              name: '修边比例',
              icon: 'rect'
            },
            {
              name: '平均门幅',
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
          data: this.data.trimmingRateAndAvgWidth.map(v => v.name)
        },
        yAxis: [
          {
            type: 'value',
            min: 1.5,
            max: 3.5,
            interval: 0.5,
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
                return params === 1.5 ? '0.00%' : Number(params).toFixed(2) + '%'
              }
            }
          },
          {
            type: 'value',
            min: 0,
            max: 2400,
            interval: 600,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              fontFamily: 'PingFang SC Regular',
              fontSize: 20,
              formatter: val => Number(val) // 否则会显示2,400这种格式
            }
          }
        ],
        series: [
          {
            name: '修边比例',
            type: 'bar',
            data: this.data.trimmingRateAndAvgWidth.map(v => {
              if (v.todayTrimmingRate < 2) {
                return 1.5 + 0.5 / 2 * v.todayTrimmingRate
              }
              return v.todayTrimmingRate
            }),
            label: {
              normal: {
                show: true,
                position: 'top',
                fontFamily: 'PingFang SC Regular',
                fontSize: 20,
                color: '#333',
                formatter: params => {
                  if (params.value < 2) {
                    return ((params.value - 1.5) * 4).toFixed(2) + '%'
                  }
                  return params.value.toFixed(2) + '%'
                }
              }
            },
            barWidth: 40,
            barGap: '60%'
          },
          {
            name: '平均门幅',
            type: 'bar',
            yAxisIndex: 1,
            data: this.data.trimmingRateAndAvgWidth.map(v => v.todayAvgWidth),
            label: {
              normal: {
                show: true,
                position: 'top',
                fontFamily: 'PingFang SC Regular',
                fontSize: 20,
                color: '#333'
              }
            },
            barWidth: 40,
            barGap: '60%'
          }
        ]
      }
      this.$refs.top.draw(option)
    },
    drawLine (index = 0) {
      const seriesData = this.data.trimmingRateTeamTrendMap[index].trendMap.map(v => {
        return {
          date: new Date(v.date).toString(),
          value: [v.date, v.value < 2 ? 1.5 + (0.5 / 2) * v.value : v.value]
        }
      })
      const seriesDataAvg = this.data.avgWidthTeamTrendMap[index].trendMap.map(v => {
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
              name: '修边比例',
              icon: 'rect'
            },
            {
              name: '平均门幅',
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
            min: 1.5,
            max: 3.5,
            interval: 0.5,
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
                return params === 1.5 ? '0.00%' : Number(params).toFixed(2) + '%'
              }
            },
            splitLine: {
              lineStyle: {
                width: 1.25
              }
            }
          },
          {
            type: 'value',
            min: 0,
            max: 2400,
            interval: 600,
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
              formatter: val => Number(val)
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
            name: '修边比例',
            yAxisIndex: 0,
            data: seriesData,
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
            name: '平均门幅',
            data: seriesDataAvg,
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
      return board.getTrimmingRateAndAvgWidth().then(res => {
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
        board.getTrimmingRateAndAvgWidth().then(res => {
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
  .group-inside{
    .chart-box-header{
      position: absolute;
      right: 35px;
      z-index: 200;
    }
    .chart-box-title{
      padding-bottom: 30px;
    }
  }
</style>
