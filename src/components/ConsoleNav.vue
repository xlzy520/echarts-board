<template>
  <nav class="console-nav">
    <div class="console-nav-logo">
      <img src="../assets/logo.png"/>
    </div>
    <div class="console-nav-title">东诚数字看板后台</div>
    <div class="console-nav-date">
      {{nowDate}}
    </div>
  </nav>
</template>

<script>
export default {
  name: 'ConsoleNav',
  data () {
    return {
      nowDate: this.moment().format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="less">
  .console-nav {
    display: flex;
    align-items: center;
    width: 100%;
    height: 90*2px;
    font-size: 24*2px;
    color: #fff;
    background-color: #333;
    &-logo {
      padding: 26*2px 10*2px 26*2px 40*2px;
      img {
        height: 38*2px;
      }
    }
    &-title {
      padding: 41*2px 0 27*2px 0;
    }
    &-date {
      flex-grow: 1;
      text-align: right;
      padding-right: 48*2px;
    }
  }
</style>
