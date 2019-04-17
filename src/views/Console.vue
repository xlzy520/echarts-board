<template>
  <div class="console">
    <console-nav></console-nav>
    <team-select></team-select>
    <team-tabs></team-tabs>
    <div class="console-footer">
      <a-button @click="exchangeTeam">换班</a-button>
      <a-button type="primary" class="save" @click="save">保存</a-button>
    </div>
    <modal title="换班" :visible="teamVisible" @close="close">
      <switch-team @close="close"></switch-team>
    </modal>
  </div>
</template>

<script>
import ConsoleNav from '../components/ConsoleNav'
import TeamSelect from '../components/TeamSelect'
import TeamTabs from '../components/TeamTabs'
import SwitchTeam from '../components/SwitchTeam'
import Modal from '../components/Modal'

export default {
  name: 'Console',
  components: {
    Modal,
    SwitchTeam,
    ConsoleNav,
    TeamSelect,
    TeamTabs
  },
  data () {
    return {
      teamVisible: false
    }
  },
  methods: {
    exchangeTeam () {
      this.teamVisible = true
    },
    save () {

    }
  }
}
</script>

<style lang="less">
  .console {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 1300px;
    min-height: 600px;
    height: 100%;
    &-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 35*2px 0;
      & > button {
        font-size: 34*2px;
        color: #999;
        width: 240*2px;
        margin-left: 37*2px;
        padding: 0 15*2px;
        border-radius: 4*2px;
        height: 60*2px;
      }
      .save {
        color: #fff;
      }
    }
  }
</style>
