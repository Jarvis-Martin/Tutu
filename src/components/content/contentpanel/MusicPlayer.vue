<template>
  <div class="music-player">
    <audio autoplay loop>
      <slot name="resource"  />
    </audio>
  </div>
</template>

<script>
export default {
  name: "MusicPlayer",
}
</script>

<style lang="less" scoped>
.music-player {
  display: none;
}
</style>