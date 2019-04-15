<template>
  <div class="console-tabs">
    <div class="console-tabs-bar">
      <div
        v-for="tab in tabs"
        :key="tab"
        @click="tabChange(tab)"
        :class="['tab-name', {'active-tab': tab === activeTab }]">{{tab}}</div>
    </div>
    <div class="console-tabs-content">

    </div>
  </div>
</template>

<script>
export default {
  name: 'TeamTabs',
  data () {
    return {
      activeTab: 'A',
      tabs: ['A', 'B', 'C', 'D', '总线']
    }
  },
  methods: {
    tabChange (tab) {
      this.activeTab = tab
    }
  }
}
</script>

<style lang="less">
.console-tabs{
  margin-left: 42px;
  &-bar{
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }
  .tab-name{
    cursor: pointer;
    font-size: 30px;
    color: #999;
    &:not(:first-child){
      margin-left: 20px;
    }
    &.active-tab{
      font-size: 50px;
      color: #5095f3;
    }
  }
}
</style>
