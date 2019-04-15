<template>
  <div class="console-team">
    <a-checkbox-group v-model="checkedList" @change="onChange">
      <a-checkbox v-for="option in team" :value="option.name" :key="option.name">
        <span class="console-team-name">{{option.name}}</span>
        <a-range-picker
          size="large"
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
.console-team{
  width: 100%;
  padding: 40px 20% 0;
  &-name{
    display: inline-block;
    position: relative;
    width: 40px;
    font-size: 40px;
    vertical-align: middle;
    color: #333;
    bottom: 5px;
    margin: 0 21px;
  }

  // 改变组件的样式

  .ant-checkbox-inner{
    width: 33px;
    height: 33px;
    border-radius: 50%;
  }
  .ant-checkbox-inner:after{
    transform: rotate(45deg) scale(2);
    left: 13.571429px;
    top: 9.142857px;
  }
  .ant-checkbox-wrapper{
    height: 40px;
    line-height: 40px;
    margin-bottom: 40px;
    &:nth-child(3), &:nth-child(4){
      margin-bottom: 0;
    }
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper{
    margin-left: 0;
  }
  .ant-checkbox-wrapper:nth-child(2n){
    margin-left: 69px;
  }
}
@media screen and (max-width: 1367px){
  .console-team{
    padding: 40px 12% 0;
  }
}
</style>
