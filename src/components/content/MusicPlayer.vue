<template>
  <div class="music-poalyer">
    <audio :src="musicURL" loop ref="bgm_player"></audio>
  </div>
</template>

<script>
export default {
  name: 'MusicPlayer',
  props: {
    musicURL: String,
    isFirst: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    console.log(this.musicURL)
    if (this.isFirst === true) {
      this.$refs.bgm_player.play()
    }
  },
  beforeUpdate () {
    console.log('updataed')
    if (this.isFirst === true) {
      this.$refs.bgm_player.play()
    }
  },
}
</script>

<style lang="less">

</style>