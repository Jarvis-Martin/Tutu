<template>
  <div class="head-photo" >
    <slot />
    <!-- 显示图片，当用户未关注时 显示，否则不显示。 -->
    <!-- 注意：用户未登录时，始终显示未关注，点击时，显示跳转提示 -->
    <slot name="notconerned" />
  </div>
</template>

<script>
export default {
  name: "HeadPhoto",
}
</script>

<style lang="less" scoped>
.head-photo {
  width: 140px;
  height: 140px;
  border: 4px solid white;

  * {
    width: inherit;
    height: inherit;
  }
}

</style>