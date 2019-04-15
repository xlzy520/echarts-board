<template>
  <div class="console-team">
    <a-checkbox-group v-model="checkedList" @change="onChange">
      <a-checkbox v-for="option in team" :value="option.name" :key="option.name">
        <span class="console-team-name">{{option.name}}</span>
        <a-range-picker
          :allowClear="false"
          :defaultValue="defaultDateTime"
          :showTime="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :placeholder="['开始时间', '结束时间']"
          @change="onChange"
          @ok="onOk"
        >
        </a-range-picker>
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'TeamSelect',
  data () {
    return {
      checkedList: ['A', 'B', 'C', 'D'],
      team: [
        {
          name: 'A',
          startTime: '',
          endTime: ''
        },
        {
          name: 'B',
          startTime: '',
          endTime: ''
        },
        {
          name: 'C',
          startTime: '',
          endTime: ''
        },
        {
          name: 'D',
          startTime: '',
          endTime: ''
        }
      ],
      defaultDateTime: [
        this.moment(new Date(), 'YYYY-MM-DD HH:MM'),
        this.moment(new Date(), 'YYYY-MM-DD HH:MM')
      ]
    }
  },
  methods: {
    onChange (value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
    },
    onOk (value) {
      console.log('onOk: ', value)
    }
  }
}
</script>

<style lang="less">
  @import "../styles/ant-calendar";
  .console-team {
    width: 55%;
    margin: 80px auto 0;
    &-name {
      display: inline-block;
      position: relative;
      width: 80px;
      font-size: 80px;
      vertical-align: middle;
      color: #333;
      bottom: 10px;
      margin: 0 42px;
    }

    .ant-checkbox-inner {
      width: 33*2px;
      height: 33*2px;
      border-radius: 50%;
      &:after{
        transform: rotate(45deg) scale(4);
        left: 30.142858px;
        top: 24.285714px;
      }
    }
    .ant-checkbox-wrapper {
      height: 40*2px;
      line-height: 40*2px;
      margin-bottom: 40*2px;
      &:nth-child(3), &:nth-child(4) {
        margin-bottom: 0;
      }
      &:nth-child(n+1) {
        margin-left: 0;
      }
      &:nth-child(2n) {
        margin-left: 69*2px;
      }
    }
  }
</style>
