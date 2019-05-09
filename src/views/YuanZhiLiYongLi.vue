<template>
  <div class="charts-wrapper">
    <chart-box ref="top" id="top" chartStyle="height: 272px"></chart-box>
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
      chartStyle="height: 290px"
    ></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import ChartBox from '../components/chart/ChartBox'
export default {
  name: 'YuanZhiLiYongLi',
  components: { ChartBox },
  data () {
    return {
      data: {},
      chartHeader: {
        leftTitle: '原纸利用率月目标',
        leftValue: '',
        leftUnit: '%'
      },
      paperUseRate: []
    }
  },
  methods: {
    drawBar () {
      let option = {
        color: ['#000f84', '#5095f3'],
        title: {
          text: '原纸利用率',
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 120 / 4,
            fontWeight: 'normal'
          },
          left: 48 / 4,
          top: 40 / 4
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
          right: 100 / 4,
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
          left: -20,
          right: -30,
          bottom: -30,
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
          min: 97.5,
          max: 100
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: this.data.paperUseRate.map(v => v.name),
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            fontSize: 120 / 4,
            margin: 40 / 4,
            formatter: (params, index) => {
              return '{main|' + params + '}' + '\n{sub|' + this.data.paperUseRate[index].paperUseRate.toFixed(2) + '%}'
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
                formatter: (paramas) => {
                  // 解决小于98%的数值显示
                  return this.paperUseRate[paramas.dataIndex].paperUseRateMonthRate.toFixed(2) + '%'
                },
                offset: [44 / 4, 0]
              }
            },
            data: this.data.paperUseRate.map(v => {
              // 解决小于98%的数值显示
              if (v.paperUseRateMonthRate < 98) {
                v.paperUseRateMonthRate = 97.5 + (0.5 / 49 * v.paperUseRateMonthRate)
              }
              return v.paperUseRateMonthRate
            })
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
                formatter: (paramas) => {
                  // 解决小于98%的数值显示
                  return this.paperUseRate[paramas.dataIndex].paperUseRateMonthGoalRate.toFixed(2) + '%'
                },
                offset: [44 / 4, 0]
              }
            },
            data: this.data.paperUseRate.map(v => {
              // 解决小于98%的数值显示
              if (v.paperUseRateMonthGoalRate < 98) {
                v.paperUseRateMonthGoalRate = 97.5 + (0.5 / 49 * v.paperUseRateMonthGoalRate)
              }
              return v.paperUseRateMonthGoalRate
            })
          }
        ]
      }
      this.$refs.top.draw(option)
    },
    // 总线数据
    drawZongXianShuJu () {
      const legendName = this.data.linePaperUseRate.map(v => v.name)
      const legendData = this.data.linePaperUseRate.map(v => {
        return {
          name: v.name,
          icon: 'rect',
          textStyle: {
            padding: [0, 0, 0, 28 / 4]
          }
        }
      })
      let option = {
        color: ['#ffb32f', '#0dd64f'],
        legend: {
          orient: 'vertical',
          data: legendData,
          left: '45%',
          top: 240 / 4,
          itemHeight: 96 / 4,
          itemWidth: 96 / 4,
          itemGap: 76 / 4,
          formatter: (name) => {
            const index = legendName.indexOf(name)
            const value = this.data.linePaperUseRate[index].value
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
            center: ['25%', '50%'],
            radius: [240 / 4, 400 / 4],
            avoidLabelOverlap: false,
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
            data: this.data.linePaperUseRate
          }
        ]
      }
      this.$refs.middle.draw(option)
    },
    drawLine (index = 0) {
      const seriesData = this.data.teamTrendMap[index].trendMap.map(v => {
        return {
          date: new Date(v.date).toString(),
          // 小于98就直接为0行，97.5为伪0行,将97.5-98分成98份
          value: [v.date, v.value < 98 ? 97.5 + (0.5 / 98) * v.value : v.value]
        }
      })
      let option = {
        grid: {
          top: 10,
          left: 400 / 4,
          bottom: 260 / 4
        },
        xAxis: {
          type: 'category',
          offset: 40 / 4,
          splitNumber: 1,
          axisTick: {
            show: false
          },
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
                fontSize: 80 / 4,
                align: 'right',
                width: 200
              },
              end: {
                color: '#333',
                fontFamily: 'PingFang SC Regular',
                fontSize: 80 / 4,
                align: 'left',
                width: 200
              }
            }
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
            symbol: 'circle',
            data: [
              {
                name: '合理最低原纸利用率：98.00%',
                yAxis: 98,
                lineStyle: {
                  color: '#f78787',
                  width: 5 / 4,
                  type: 'solid'
                },
                label: {
                  formatter: () => {
                    return '98%'
                  }
                }
              }
            ]
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
    // 各组客诉率趋势图
    getPaperUseRate () {
      return board.getPaperUseRate().then(res => {
        this.data = res.data
        this.paperUseRate = JSON.parse(JSON.stringify(this.data.paperUseRate))
        this.drawBar()
        this.drawZongXianShuJu()
        this.tabClick()
        this.$refs.bottom.timer()
      })
    },
    tabClick (index = 0) {
      this.chartHeader.leftValue = this.data.teamTrendMap[index].paperUseRateMonthGoalRate
      this.drawLine(index)
    },
    timingUpdateData () {
      setInterval(() => {
        board.getPaperUseRate().then(res => {
          this.data = res.data
        })
      }, this.$timeout)
    }
  },
  mounted () {
    this.getPaperUseRate()
    this.timingUpdateData()
  },
  destroyed () {
    clearInterval(this.timingUpdateData())
  }
}
</script>

<style lang="less">

</style>
