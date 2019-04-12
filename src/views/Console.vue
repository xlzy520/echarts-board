<template>
  <div class="console">
    <console-nav></console-nav>

  </div>
</template>

<script>
import ConsoleNav from '../components/ConsoleNav'
export default {
  name: 'Console',
  components: {
    ConsoleNav
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
    min-width: 1300px;
    min-height: 600px;
    height: 100%;
  }
</style>
