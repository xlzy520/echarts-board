<template>
  <div class="charts-wrapper">
    <chart-box ref="top" id="top" chartStyle="height: 1000px;width: 100%"></chart-box>
    <chart-box
      ref="middle"
      title="总线数据"
      id="middle"
      chartStyle="height: 840px;width: 100%"
    ></chart-box>
    <chart-box
      ref="bottom"
      title="各组原纸利用率趋势图"
      id="bottom"
      :header="chartHeader"
      :group-data="data.teamTrendMap"
      @tabClick="tabClick"
      chartStyle="height: 1280px;width: 100%"
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
      }
    }
  },
  methods: {
    // 客诉率
    drawKeSuLv () {
      let option = {
        color: ['#000f84', '#5095f3'],
        title: {
          text: '原纸利用率',
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
              name: '当前原纸利用率',
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
          left: -100,
          right: 420,
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
          min: 97,
          max: 100
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: this.data.paperUseRate.map(v => v.name),
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            fontSize: 120,
            margin: 40,
            formatter: (params, index) => {
              return '{main|' + params + '}' + '\n{sub|(' + this.data.paperUseRate[index].paperUseRate.toFixed(2) + '%)}'
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
          }
        },
        series: [
          {
            name: '当前原纸利用率',
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
                  return paramas.data.toFixed(2) + '%'
                },
                offset: [44, 0]
              }
            },
            data: this.data.paperUseRate.map(v => v.paperUseRateMonthRate)
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
                  return paramas.data.toFixed(2) + '%'
                },
                offset: [44, 0]
              }
            },
            data: this.data.paperUseRate.map(v => v.paperUseRateMonthGoalRate)
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
            padding: [0, 0, 0, 28]
          }
        }
      })
      let option = {
        color: ['#ffb32f', '#0dd64f'],
        legend: {
          orient: 'vertical',
          data: legendData,
          left: '50%',
          top: 350,
          itemHeight: 96,
          itemWidth: 96,
          itemGap: 76,
          formatter: (name) => {
            const index = legendName.indexOf(name)
            const value = this.data.linePaperUseRate[index].value
            return name + ': ' + value + '%'
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
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
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
          // todo 小于98就直接为0行，97.5为伪0行,将97.5-98分成98份
          value: [v.date, v.value < 98 ? 97.5 + (0.5 / 98) * v.value : v.value]
        }
      })
      let option = {
        grid: {
          left: 400,
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
                return '{front|' + this.moment(params).format('YYYY年MM月DD日') + '}'
              } else {
                return '{end|' + this.moment(params).format('YYYY年MM月DD日') + '}'
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
          splitNumber: 4,
          interval: 0.5,
          min: 97.5,
          max: 100,
          scale: true,
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            fontSize: 80,
            margin: 40,
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
              width: 5
            }
          }
        },
        series: [{
          data: seriesData,
          markLine: {
            data: [
              {
                name: '合理最低原纸利用率：98.00%',
                yAxis: 98,
                lineStyle: {
                  color: '#f78787',
                  width: 5,
                  type: 'solid'
                }
              }
            ]
          },
          type: 'line',
          symbolSize: 35,
          itemStyle: {
            color: '#5095f3',
            borderWidth: 10
          },
          lineStyle: {
            width: 10
          }
        }]
      }
      this.$refs.bottom.draw(option)
    },
    // 各组客诉率趋势图
    getPaperUseRate () {
      return board.getPaperUseRate().then(res => {
        this.data = res.data
        this.drawKeSuLv()
        this.drawZongXianShuJu()
        this.tabClick(res.data.teamTrendMap[0], 0)
        this.$refs.bottom.timer()
      })
    },
    tabClick (tab, index = 0) {
      this.chartHeader.leftValue = this.data.teamTrendMap[index].paperUseRateMonthGoalRate
      this.drawLine(index)
    }
  },
  mounted () {
    this.getPaperUseRate()
  }
}
</script>

<style lang="less">

</style>
