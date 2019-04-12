<template>
  <div class="console">
    <nav class="console-nav">
      <div class="console-nav-logo">
        <img src="../assets/英文LOGO白色.png"/>
      </div>
      <div class="console-nav-title">东诚数字看板后台</div>
      <div class="console-nav-date">
        {{nowDate}}
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Console',
  data () {
    return {
      nowDate: this.dayjs.format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="less">

</style>
