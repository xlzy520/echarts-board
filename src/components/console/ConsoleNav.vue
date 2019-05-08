<template>
  <nav class="console-nav">
    <div class="console-nav-logo">
      <img src="../../assets/logo.png"/>
    </div>
    <div class="console-nav-title">东诚数字看板后台</div>
    <div class="console-nav-date">
      <div class="date-picker-spin" v-show="dateSpinning" :style="datePanelStyle">
        <a-spin size="large"/>
      </div>
      <a-date-picker
        suffixIcon=" "
        :defaultValue="moment()"
        :disabledDate="disabledDate"
        @openChange="datePanelChange"
        :allowClear="false">
        <template slot="dateRender" slot-scope="current, today">
          <div :class="['ant-calendar-date', {'work-day': isWorkDay(current)}]"
               @click="updateDate(current)">{{current.format('DD')}}</div>
        </template>
      </a-date-picker>
    </div>
  </nav>
</template>

<script>
import backStage from '../../api/backStage'
export default {
  name: 'ConsoleNav',
  data () {
    return {
      workDays: [],
      dateSpinning: false,
      datePanelStyle: ''
    }
  },
  methods: {
    getDatePanelStyle () {
      const datePanelBox = document.querySelector('.ant-calendar-picker-container')
      const { style, clientWidth, clientHeight } = datePanelBox
      this.datePanelStyle = style.cssText + `width: ${clientWidth}px;height:${clientHeight}px`
    },
    datePanelChange (isShow) {
      if (isShow) {
        setTimeout(() => {
          const dateDom = document.querySelector('.ant-calendar-ym-select')
          dateDom.addEventListener('DOMCharacterDataModified', () => {
            this.getDatePanelStyle()
            this.dateSpinning = true
            const year = document.querySelector('.ant-calendar-year-select').innerText.replace('年', '')
            let month = document.querySelector('.ant-calendar-month-select').innerText.replace('月', '')
            month = month < 10 ? '0' + month : month
            this.getWorkDay(year + '-' + month)
          })
        }, 0)
      }
    },
    isWorkDay (date) {
      return this.workDays.includes(date.format('YYYY-MM-DD'))
    },
    updateDate (current) {
      if (this.isWorkDay(current)) {
        this.$emit('update-date', current)
      }
    },
    disabledDate (current) {
      return (current && current > this.moment().endOf('day')) || !this.isWorkDay(current)
    },
    getWorkDay (date) {
      backStage.getWorkDay({
        date: date
      }).then(res => {
        this.workDays = res.data.date
      }).finally(() => {
        this.dateSpinning = false
      })
    }
  },
  mounted () {
    this.getWorkDay(this.moment().format('YYYY-MM'))
  }
}
</script>

<style lang="less">
  .console-nav {
    display: flex;
    align-items: center;
    width: 100%;
    height: 90px;
    font-size: 24px;
    color: #fff;
    background-color: #333;
    &-logo {
      padding: 26px 10px 26px 40px;
      img {
        height: 38px;
      }
    }
    &-title {
      padding: 41px 0 27px 0;
    }
    &-date {
      flex-grow: 1;
      text-align: right;
      padding-right: 48px;
    }
    .ant-calendar-picker{
      width: 100px;
    }
    .ant-calendar-body .ant-calendar-cell .ant-calendar-date {
      width: auto;
    }
  }
  .work-day{
    color: #fff;
    background: #ffa161;
    &:hover{
      background: #ff7f36;
    }
  }
  // 日期切换时遮罩
  .date-picker-spin{
    position: absolute;
    width: 280px;
    height: 341px;
    background-color: rgba(237,237,237, 0.5);
    z-index: 3000;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
