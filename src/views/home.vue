<template>
  <div class="main-container">
    <div class="headers-container">
      <div class="headers-content">
        <div class="console-router">
          <router-link class="header-item-link" to="/console">控制台</router-link>
        </div>
        <ul class="headers-list">
          <li class="header-item" v-for="(route, index) in routers" :key="route.name">
            <router-link class="header-item-link" :to="'/'+ route.href">{{(index+1) + '.'+ route.name}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      routers: [
        { name: '平均车速', href: 'dashboard' },
        { name: '停机次数', href: 'tingji' },
        { name: '客诉率', href: 'kesulv' },
        { name: '原纸利用率', href: 'yuanzhi' },
        { name: '平均门幅、修边比例', href: '' },
        { name: '欠数率、准时入库率', href: '' },
        { name: '制程损耗、维修费用', href: '' }
      ]
    }
  }
}
</script>

<style lang="less">
  @myBlue: #1296db;
  .main-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff url("//activity.hdslb.com/blackboard/static/20180416/b8f2b74d0482aed61472c7065dc1ed56/images/m6kmoznp0p.jpg") center/cover no-repeat;
  }

  .headers-container {
    position: absolute;
    top: 10%;
    left: 12%;
    color: #c99;
    text-align: center;
    ::selection {
      color: @myBlue;
    }

    .headers-content {
      display: flex;
      line-height: 1.5;
      .console-router{
        color: #212121;
        font-size: 2.5vw;
        width: 16vw;
        @media screen and (min-height: 3800px){
          width: 20vw;
          font-size: 6vw;
        }
        a{
          text-decoration: underline;
          text-decoration-color: #ff001c;
        }
      }
      .headers-list {
        list-style-type: none;
        text-align: left;
        .header-item {
          padding: 0 5vw 1vw;
          a:hover {
            color: inherit;
            text-decoration: underline;
          }
          a.header-item-link {
            font-size: 2vw;
            @media screen and (min-height: 3800px){
              font-size: 5vw;
            }
          }
        }
      }
    }
  }
</style>
