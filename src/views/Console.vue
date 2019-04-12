<template>
  <div class="console">
    <console-nav></console-nav>
    <team-select></team-select>
  </div>
</template>

<script>
import ConsoleNav from '../components/ConsoleNav'
import TeamSelect from '../components/TeamSelect'
export default {
  name: 'Console',
  components: {
    ConsoleNav,
    TeamSelect
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
