<template>
  <nav class="console-nav">
    <div class="console-nav-logo">
      <img src="../../assets/logo.png"/>
    </div>
    <div class="console-nav-title">东诚数字看板后台</div>
    <div class="console-nav-date">
      <a-date-picker
        format="YYYY-MM-DD"
        suffixIcon=" "
        v-model="date"
        :disabledDate="disabledDate"
        :allowClear="false">
        <template slot="dateRender" slot-scope="current, today">
          <div :class="['ant-calendar-date', workDayStyle(current)]"
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
      date: this.moment(),
      workDays: []
    }
  },
  methods: {
    workDayStyle (current) {
      const day = current.format('DD')
      if (this.workDays.includes(Number(day))) {
        return 'work-day'
      }
    },
    updateDate (current) {
      const month = current.format('MM')
      const day = current.format('DD')
      if (month === this.moment().format('MM') && this.workDays.includes(Number(day))) {
        this.date = current
        this.$emit('update-date', current.format('YYYY-MM-DD'))
      }
    },
    disabledDate (current) {
      return (current && current > this.moment().endOf('day')) || !this.workDays.includes(Number(current.format('DD')))
    },
    getWorkDay () {
      backStage.getWorkDay({
        date: this.date.format('YYYY-MM')
      }).then(res => {
        this.workDays = res.data.date
      })
    }
  },
  mounted () {
    this.getWorkDay()
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
</style>
