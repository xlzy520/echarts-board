<template>
  <nav class="console-nav">
    <div class="console-nav-logo">
      <img src="../assets/logo.png"/>
    </div>
    <div class="console-nav-title">东诚数字看板后台</div>
    <div class="console-nav-date">
      <a-date-picker
        :defaultValue="moment(new Date(), 'YYYY-MM-DD')"
        suffixIcon=" "
        v-model="date"
        :disabledDate="disabledDate"
        :allowClear="false">
        <template slot="dateRender" slot-scope="current, today">
          <div :class="['ant-calendar-date', notSave(current)]" @click="haha(current)">{{moment(current).format('DD')}}</div>
        </template>
      </a-date-picker>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'ConsoleNav',
  data () {
    return {
      date: this.moment()
    }
  },
  methods: {
    notSave (val) {
      if (this.moment(val).format('DD') % 3 === 0) {
        return 'not-save'
      }
    },
    haha (time) {
      this.date = this.moment(time)
      console.log(time)
    },
    disabledDate (current) {
      return current && current > this.moment().endOf('day')
    }
  }
}
</script>

<style lang="less">
  .console-nav {
    display: flex;
    align-items: center;
    width: 100%;
    height: 90*2px;
    font-size: 24*2px;
    color: #fff;
    background-color: #333;
    &-logo {
      padding: 26*2px 10*2px 26*2px 40*2px;
      img {
        height: 38*2px;
      }
    }
    &-title {
      padding: 41*2px 0 27*2px 0;
    }
    &-date {
      flex-grow: 1;
      text-align: right;
      padding-right: 48*2px;
    }
    .ant-calendar-picker{
      width: 210px!important;
    }
    .ant-calendar-body .ant-calendar-cell .ant-calendar-date {
      width: auto;
    }
  }
  .not-save{
    color: #ff001c;
  }
</style>
