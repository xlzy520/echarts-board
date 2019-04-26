<template>
  <div id="app">
    <a-locale-provider :locale="zhCN">
      <router-view/>
    </a-locale-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      zhCN
    }
  }
}
</script>

<style lang="less">
#app {
  transform: rotate(90deg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
