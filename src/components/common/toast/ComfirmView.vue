<template>
  <div class="comfirm-view">
    <div class="top">
      <div class="title">提示</div>
      <div class="content">您当前尚未登录，是否前往登录？</div>
    </div>
    <div class="bottom">
      <div @click.stop="CloseView" class="cancel">否</div>
      <div @click.stop="toLogin" class="done">是</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComfirmView',
  methods: {
    CloseView() {
      this.$emit('CloseView');
    },
    toLogin() {
      this.$emit('toLogin');
    }
  },
}
</script>

<style lang="less" scoped>
.comfirm-view {
  width: 476px;
  height: 240px;
  border-radius: 14px;
  background-color: rgb(240,240,240);
  border: 1px solid white;
  box-shadow: 0 0 2px 0px white;

  .top {
    height: 167px;
    width: 476px;
    position: relative;

    .title {
      width: inherit;
      height: 44px;
      font-size: 32px;
      text-align: center;
      position: absolute;
      top: 37px;
    }
    .content {
      width: inherit;
      height: 57px;
      position: absolute;
      top: 86px;
      text-align: center;
      font-size: 28px;
    }
  }
  .bottom {
    height: 73px;
    width: inherit;
    display: flex;
    background-color: rgba(254, 221, 120, 1);
    border-radius: 0 0 14px 14px;

    .cancel, .done {
      flex: 1;
      height: inherit;
      font-size: 30px;
      text-align: center;
      line-height: 73px;
      border-top: 4px solid white;
      background-color: rgba(255,255,255, 0.2);
    }
    .cancel {
      border-right: 2px solid  white;
    }
    .done {
      border-left: 2px solid  white;
    }
  }
}

</style>