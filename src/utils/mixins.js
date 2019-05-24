export default {
  data () {
    return {
      data: {},
      timer: null
    }
  },
  methods: {
    draw () {
      if (this.drawBar) {
        this.drawBar()
      }
      if (this.drawGauge) {
        this.drawGauge()
      }
      if (this.drawPie) {
        this.drawPie()
      }
    },
    setPageData () {
      this.getPageData().then(res => {
        this.data = res.data
        this.draw()
        this.tabClick()
        this.$refs.bottom.timer()
      })
    },
    tabClick (index = 0) {
      if (this.chartHeader) {
        this.chartHeader.leftValue = this.data.teamTrendMap[index].avgSpeedMonthGoal
      }
      this.drawLine(index)
    },
    timingUpdateData () {
      this.timer = setInterval(() => {
        this.getPageData().then(res => {
          this.data = res.data
          this.draw()
          this.$message.success('已成功绘图')
        })
      }, this.$timeout)
    }
  },
  mounted () {
    this.setPageData()
    this.timingUpdateData()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
