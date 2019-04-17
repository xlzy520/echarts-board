<template>
  <a-spin :spinning="spinning" size="large" class="ant-spin-very-large">
    <div class="team-setting">
      <div class="setting-item">
        <label class="remaining-days-title">换班剩余：</label>
        <a-select v-model="teamData.restDay" style="width: 160px">
          <a-select-option v-for="i in 15" :key="i" :value="i">{{i}}</a-select-option>
        </a-select>
        <div style="margin-left: 10px">天</div>
      </div>
      <div class="setting-item">
        <label>白班：</label>
        <a-radio-group v-model="dayTime[0]" @change="radioChange" name="dayTime">
          <a-radio
            :value="team.teamName"
            :key="team.teamName"
            v-for="team in teamFilter(teamData.dayShift, 0)">{{team.teamName}}</a-radio>
        </a-radio-group>
        <a-radio-group v-model="dayTime[1]" @change="radioChange" name="dayTime">
          <a-radio
            :value="team.teamName"
            :key="team.teamName"
            v-for="team in teamFilter(teamData.dayShift, 1)">{{team.teamName}}</a-radio>
        </a-radio-group>
      </div>
      <div class="setting-item">
        <label>夜班：</label>
        <a-radio-group v-model="night[0]" @change="radioChange" name="night">
          <a-radio
            :value="team.teamName"
            :key="team.teamName"
            v-for="team in teamFilter(teamData.dayShift, 0)">{{team.teamName}}</a-radio>
        </a-radio-group>
        <a-radio-group v-model="night[1]" @change="radioChange" name="night">
          <a-radio
            :value="team.teamName"
            :key="team.teamName"
            v-for="team in teamFilter(teamData.dayShift, 1)">{{team.teamName}}</a-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="team-setting-footer">
      <a-button type="primary" @click="teamSettingSave">保存</a-button>
      <a-button @click="close">取消</a-button>
    </div>
  </a-spin>
</template>

<script>
import backStage from '../api/backStage'
export default {
  name: 'switchTeam',
  data () {
    return {
      dayTime: ['', ''],
      night: ['', ''],
      spinning: false,
      teamData: {
        restDay: null,
        dayShift: []
      }
    }
  },
  methods: {
    getSelectedTeamIdByTeamName (type) {
      return this[type].map(v => {
        for (const item of this.teamData.dayShift) {
          if (v === item.teamName) {
            return item.teamId
          }
        }
      })
    },
    getTeamData () {
      this.spinning = true
      backStage.getTeam().then(({ data }) => {
        this.teamData = data
        this.dayTime = data.dayShift.filter(v => v.timeType === 0).map(v => v.teamName)
        this.night = data.dayShift.filter(v => v.timeType === 1).map(v => v.teamName)
      }).finally(() => {
        this.spinning = false
      })
    },
    teamSettingSave () {
      const selectDayShift = this.getSelectedTeamIdByTeamName('dayTime')
      const selectEveningShift = this.getSelectedTeamIdByTeamName('night')
      backStage.changeTime({
        restDay: this.teamData.restDay,
        dayShift: selectDayShift,
        eveningShift: selectEveningShift
      }).then(res => {
        this.$message.success(res.msg)
      })
    },
    filterABCD (type, value) {
      if ('AB'.indexOf(value) > -1) {
        this[type][0] = 'AB'.replace(value, '')
      } else {
        this[type][1] = 'CD'.replace(value, '')
      }
    },
    radioChange (e) {
      const { name, value } = e.target
      this.filterABCD(name === 'night' ? 'dayTime' : 'night', value)
    },
    teamFilter (data, num) {
      return data.filter(v => v.beltLineId === num)
    },
    close () {
      this.$emit('close')
    }
  },
  mounted () {
    this.getTeamData()
  },
}
</script>

<style lang="less">
  .team-setting {
    display: flex;
    flex-direction: column;
    color: #000;
    font-size: 16*2px;
    margin-left: 76*2-24px;
    .setting-item {
      display: flex;
      height: 30*2px;
      line-height: 30*2px;
      margin-top: 40*2-24px;
      &>label {
        width: 80*2px;
        text-align: right;
      }
      .ant-radio-wrapper{
        color: #000;
        font-size: 16*2px;
        margin-right: 8*2px;
        span.ant-radio + *{
          padding-left: 8*2px;
          padding-right: 8*2px;
        }
        .ant-radio-checked .ant-radio-inner {
          border-color: #5095f3;
        }
        .ant-radio-inner{
          width: 16*2px;
          height: 16*2px;
          border-width: 1*2px;
          border-radius: 100*2px;
          &:after{
            width: 8*2px;
            height: 8*2px;
            left: 3*2px;
            top: 3*2px;
            border-radius: 8*2px;
          }
        }
      }
      .remaining-days-title {

      }
    }
    &-footer {
      display: flex;
      justify-content: center;
      height: 32*2px;
      line-height: 32*2px;
      margin-top: 45*2px;
      .ant-btn {
        margin-left: 22*2px;
        width: 96*2px;
        padding: 0 15*2px;
        font-size: 14*2px;
        border-radius: 4*2px;
        height: 32*2px;
      }
      .ant-btn-default {
        color: #5095f3;
        border-color: #5095f3;
      }
      .ant-btn-primary {
        background-color: #5095f3;
      }
    }

    .ant-select {
      font-size: 16*2px;
      color: #000;
      &-selection {
        border-radius: 4*2px;
        border: 1*2px solid #d9d9d9;
        border-top-width: 1.02*2px;
        &--single {
          height: 32*2px;
        }
        &__rendered {
          margin-left: 11*2px;
          margin-right: 11*2px;
          line-height: 30*2px;
        }
        &-selected-value {
          padding-right: 20*2px;
        }
      }
      &-arrow{
        color: #000;
        right: 11*2px;
        margin-top: -6*2px;
        font-size: 14*2px;
      }
    }
  }
</style>
