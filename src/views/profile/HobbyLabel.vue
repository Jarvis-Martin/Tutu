<template>
  <div class="hobby-label">
    <slot />
  </div>
</template>

<script>
export default {
  name: "HobbyLabel",
}
</script>

<style lang="less">
.hobby-label {
  width: inherit;
  height: 46px;
  font-size: 24px;
  border: 2px solid rgba(16, 16, 16, 0.3);
  background-color: rgba(255,255,255,0.6);

  * {
    width: inherit;
    height: inherit;
    line-height: 46px;
    text-align: center;
  }
}

</style>