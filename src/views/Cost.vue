<template>
  <div class="charts-wrapper">
    <chart-box ref="top" id="top" chartStyle="height: 428px"></chart-box>
    <chart-box ref="bottom" title="各组制程损耗趋势图" id="bottom"
               :header="chartHeader"
               :group-data="data.processLossTeamTrendMap"
               @tabClick="tabClick"
               chartStyle="height: 409px"></chart-box>
  </div>
</template>

<script>
import board from '../api/board'
import ChartBox from '../components/chart/ChartBox'
export default {
  name: 'Cost',
  components: { ChartBox },
  data () {
    return {
      data: {},
      chartHeader: {
        leftTitle: '合理最高制程损耗',
        leftValue: '260',
        leftUnit: 'm²'
      }
    }
  },
  methods: {
    drawBar () {
      let option = {
        color: ['#000f84', '#5095f3'],
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
              icon: 'rect',
              textStyle: {
                padding: [0, 0, 0, 28 / 4]
              }
            },
            {
              name: '维修费用',
              icon: 'rect',
              textStyle: {
                padding: [0, 0, 0, 28 / 4]
              }
            }
          ],
          top: 60,
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
        grid: [
          {
            width: '75%',
            top: '20%',
            bottom: '45%',
            left: 10,
            containLabel: true
          },
          {
            width: '75%',
            top: '65%',
            bottom: '0%',
            left: 10,
            containLabel: true
          }
        ],
        xAxis: [
          {
            show: false,
            type: 'value',
            max: 1000
          },
          {
            gridIndex: 1,
            show: false,
            type: 'value'
          }
        ],
        yAxis: [
          {
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
              fontSize: 120 / 4,
              margin: 40 / 4
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'category',
            inverse: true,
            gridIndex: 1,
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
              fontSize: 120 / 4,
              margin: 40 / 4
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '制程损耗',
            type: 'bar',
            barWidth: 40,
            barGap: '0%',
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
          },
          {
            name: '维修费用',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
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
      this.$refs.top.draw(option)
    },
    drawLine (index = 0) {
      const seriesData = this.data.processLossTeamTrendMap[index].trendMap.map(v => {
        return {
          date: new Date(v.date).toString(),
          value: [ v.date, v.value ]
        }
      })
      let option = {
        grid: {
          top: 20,
          left: 80,
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
      return board.getProcessLossAndCost().then(res => {
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
        board.getProcessLossAndCost().then(res => {
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
