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

</style>
