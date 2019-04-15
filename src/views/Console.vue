<template>
  <div class="console">
    <header>
      <console-nav></console-nav>
    </header>
    <main>
      <team-select></team-select>
      <team-tabs></team-tabs>
    </main>
  </div>
</template>

<script>
import ConsoleNav from '../components/ConsoleNav'
import TeamSelect from '../components/TeamSelect'
import TeamTabs from '../components/TeamTabs'
export default {
  name: 'Console',
  components: {
    ConsoleNav,
    TeamSelect,
    TeamTabs
  },
  data () {
    return {}
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
