<template>
  <nav class="console-nav">
    <div class="console-nav-logo">
      <img src="../assets/英文LOGO白色.png"/>
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
      nowDate: this.dayjs.format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="less">
  .console-nav{
    display: flex;
    align-items: center;
    width: 100%;
    height: 90px;
    font-size: 24px;
    color: #fff;
    background-color: #333;
    &-logo{
      padding: 26px 10px 26px 40px;
      img{
        height: 38px;
      }
    }
    &-title{
      padding: 41px 0 27px 0;
    }
    &-date{
      flex-grow: 1;
      text-align: right;
      padding-right: 48px;
    }
  }
</style>
