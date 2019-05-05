<template>
  <div v-show="visible">
    <div class="modal-mask"></div>
    <div class="modal-wrap">
      <div class="modal-content">
        <button aria-label="Close" class="modal-close" v-if="showClose" @click="close">
          <span class="modal-close-x">
            <i class="modal-close-icon anticon anticon-close">
              <svg viewBox="64 64 896 896" data-icon="close" width="1em"
               height="1em" fill="currentColor" aria-hidden="true"
               class=""><path
            d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
            </i>
          </span>
        </button>
        <div class="modal-header">
          <div class="modal-title">{{title}}</div>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '15vh'
    }
  },
  data () {
    return {}
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
  .fixed-center() {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .modal-mask {
    .fixed-center;
    background-color: rgba(0, 0, 0, 0.65);
    height: 100%;
    z-index: 1000;
  }

  .modal-wrap {
    .fixed-center;
    overflow: auto;
    z-index: 1000;
    outline: 0;
    .modal-content{
      width: 602px;
      position: relative;
      background-color: #fff;
      border-radius: 4px;
      background-clip: padding-box;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.65);
      box-sizing: border-box;
      list-style: none;
      margin: 0 auto;
      top: 100px;
      padding-bottom: 24px;
    }
    .modal-close{
      cursor: pointer;
      border: 0;
      background: transparent;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
      font-weight: 700;
      line-height: 1;
      text-decoration: none;
      transition: color 0.3s;
      color: #fff;
      outline: 0;
      padding: 0;
      &-x{
        display: block;
        font-style: normal;
        vertical-align: baseline;
        text-align: center;
        text-transform: none;
        text-rendering: auto;
        width: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
      }
    }
    .modal-header {
      height: 40px;
      padding: 10px 21px;
      border-radius: 4px 4px 0 0;
      background: #5095f3;
      color: #fff;
      border-bottom: 1px solid #e8e8e8;
    }
    .modal-title {
      margin: 0;
      font-size: 20px;
      line-height: 22px;
      font-weight: 500;
    }
    .modal-body {
      padding: 24px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .modal-footer {
      border-top: 1px solid #e8e8e8;
      padding: 10px 16px;
      text-align: right;
      border-radius: 0 0 4px 4px;
    }
  }
</style>
