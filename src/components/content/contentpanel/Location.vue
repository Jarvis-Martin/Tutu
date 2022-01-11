<template>
  <div class="location-container">
    <!-- 判断方式需要再修改以下，试试 computed 计算属性 -->
    <div class="icon">
      <slot name="icon"/>
    </div>
    <div class="location">
      <slot name="location"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Location",
}
</script>

<style lang="less" scoped>
  .location-container {
    position: relative;
    height: 36px;
    width: inherit;
    display: flex;
    align-items: center;

    .icon {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
      width: 24px;
      height: 26px;
      display: inline;

      * {
        position: absolute;
        width: 24px;
        height: 26px;
      }
    }
    .location {
      position: absolute;
      top: 0;
      left: 24px;
      height: inherit;
      width: 546px;
      padding-left: 8px;

      * {
        height: inherit;
        width: inherit;
        font-size: 24px;
      }
    }
  }

</style>