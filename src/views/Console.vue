<template>
  <div class="console">
    <console-nav @update-date="updateDate"></console-nav>
    <team-main ref="teamMain"></team-main>
  </div>
</template>

<script>
import ConsoleNav from '../components/ConsoleNav'
import TeamMain from '../components/TeamMain'

export default {
  name: 'Console',
  components: {
    TeamMain,
    ConsoleNav
  },
  data () {
    return {
    }
  },
  methods: {
    updateDate (date) {
      this.$refs.teamMain.getConsoleData(date)
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
  }
</style>
