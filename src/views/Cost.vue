<template>
  <div class="charts-wrapper">
    <chart-box ref="top" id="top" chartStyle="height: 270px"></chart-box>
    <chart-box ref="middle" id="middle" chartStyle="height: 213px"></chart-box>
    <chart-box ref="bottom" title="各组制程损耗趋势图" id="bottom"
               :header="chartHeader"
               :group-data="data.processLossTeamTrendMap"
               @tabClick="tabClick"
               chartStyle="height: 350.5px"></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import ChartBox from '../components/chart/ChartBox'
import mixins from '../utils/mixins'
export default {
  name: 'Cost',
  mixins: [mixins],
  components: { ChartBox },
  data () {
    return {
      chartHeader: {
        leftTitle: '合理最高制程损耗',
        leftValue: '260',
        leftUnit: 'm²'
      }
    }
  },
  methods: {
    drawBar () {
      const optionTop = {
        color: ['#000f84'],
        title: {
          text: '制程损耗、维修费用',
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 30,
            fontWeight: 'normal'
          },
          left: 10,
          top: 10
        },
        legend: {
          data: [
            {
              name: '制程损耗',
              icon: 'rect'
            }
          ],
          top: 80,
          left: 10,
          itemHeight: 96 / 4,
          itemWidth: 96 / 4,
          itemGap: 76 / 4,
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 20,
            itemGap: 10 / 4
          }
        },
        grid: {
          top: 150,
          left: 10,
          bottom: 0,
          right: '16%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
          max: 1000
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: this.data.processLoss.map(v => v.name),
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            formatter: params => params + '组',
            fontSize: 120 / 4,
            margin: 40 / 4
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '制程损耗',
            type: 'bar',
            barWidth: 40,
            barGap: '160%',
            label: {
              normal: {
                show: true,
                position: 'right',
                fontFamily: 'PingFang SC Regular',
                fontSize: 20,
                color: '#333',
                formatter: (paramas) => this.data.processLoss[paramas.dataIndex].todayProcessLoss + 'm²',
                offset: [5, 0]
              }
            },
            data: this.data.processLoss.map(v => v.todayProcessLoss)
          }
        ]
      }
      const optionBottom = {
        color: ['#5095f3'],
        title: {
          show: false
        },
        legend: {
          data: [
            {
              name: '维修费用',
              icon: 'rect',
              textStyle: {
                padding: [0, 0, 0, 28 / 4]
              }
            }
          ],
          top: 30,
          left: 10,
          itemHeight: 96 / 4,
          itemWidth: 96 / 4,
          itemGap: 76 / 4,
          textStyle: {
            fontFamily: 'PingFang SC Regular',
            fontSize: 20,
            itemGap: 10 / 4
          }
        },
        grid: {
          top: 100,
          left: 10,
          bottom: 0,
          right: '15%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: this.data.upkeepCost.map(v => v.name),
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#333',
            fontFamily: 'PingFang SC Regular',
            formatter: params => params + '号线',
            fontSize: 120 / 4,
            margin: 40 / 4
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '维修费用',
            type: 'bar',
            barWidth: 160 / 4,
            label: {
              normal: {
                show: true,
                position: 'right',
                fontFamily: 'PingFang SC Regular',
                fontSize: 20,
                color: '#333',
                formatter: (paramas) => this.data.upkeepCost[paramas.dataIndex].monthCost + '万',
                offset: [5, 0]
              }
            },
            data: this.data.upkeepCost.map(v => v.monthCost)
          }
        ]
      }
      this.$refs.top.draw(optionTop)
      this.$refs.middle.draw(optionBottom)
    },
    drawLine (index = 0) {
      const seriesData = this.data.processLossTeamTrendMap[index].trendMap
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
          left: 80,
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
          interval: 200,
          min: 0,
          max: 1200,
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
            formatter: val => Number(val)
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
          type: 'line',
          symbolSize: 35 / 4,
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
    getPageData () {
      return board.getProcessLossAndCost()
    }
  }
}
</script>

<style lang="less">

</style>
