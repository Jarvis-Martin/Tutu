<template>
  <div class="navigation-bar" :style="{ 'background-color': bg_color }">
    <div class="nav-left">
      <slot name="nav-left" />
    </div>
    <div class="nav-center">
      <slot></slot>
    </div>
    <div class="nav-right">
      <slot name="nav-right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: {
    bg_color: {
      type: String,
      default: 'rgb(254, 221, 120)'
    }
  }
}
</script>

<style lang="less" scoped>
@navigationbar-height: 88px;

.navigation-bar {
  width: 100vw;
  height: @navigationbar-height;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  position: relative;

  .nav-left,.nav-right {
    width: 53px;
    height: 53px;
    position: absolute;
    // background-color: rgb(254, 221, 120, 0.8);
  }
  .nav-left {
    float: left;    
    top: 50%;
    left: 20px;
    transform: translate(0, -50%);
    
    * {
      width: 40px;
      height: 40px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .nav-right {    
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translate(0, -50%);
    float: right;

    img {
      width: inherit;
      height: inherit;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    div {
      width: 100px;
      height: inherit;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      line-height: 53px;
      font-size: 32px;
      color: rgba(255, 255, 255, 0.9);
      text-align: center;
      letter-spacing: 6px;
      text-align: left;
    }
  }
  .nav-center {
    height: inherit;
    // border: 1px solid white;
    font-size: 34px;
    text-align: center;
    line-height: @navigationbar-height;
    font-weight: 600;
    flex: 1;
    overflow: hidden;
    // background-color: rgb(254, 221, 120, 0.8);
  }
}
</style>