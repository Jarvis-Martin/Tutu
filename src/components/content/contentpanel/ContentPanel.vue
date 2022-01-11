<template>
  <div class="content-panel">
    <div class="username">
      <slot name="username" />
    </div>
    <div class="content">
      <slot name="content" />
    </div>
    <slot name="location" />
  </div>
</template>

<script>
export default {
  name: "ContentPanel",
}
</script>

<style lang="less">
.content-panel {
  padding-top: 10px;
  width: 590px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .username {
    height: 46px;
    width: inherit;
    font-size: 32px;
    margin-bottom: 4px;
  }
  .content {
    width: inherit;
    max-height: 134px;
    font-size: 30px;
    line-height: 1.5em;
    margin-bottom: 10px;
    * {
      width: inherit;
      max-height: 134px;
      // text-overflow: ellipsis;
      // overflow: hidden;
      // white-space:nowrap;
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 30px;
    }
  }
}

</style>