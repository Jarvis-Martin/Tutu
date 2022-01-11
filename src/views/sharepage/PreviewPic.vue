<template>
  <div class="preview-pic" ref="pic" />
</template>

<script>
export default {
  name: "PreviewPic",
  props: {
    pic_URL: String
  },
  mounted() {
    let url = this.pic_URL
    this.$refs.pic.setAttribute("style", 'background-image: url('+ url + ')')
  },
}
</script>

<style lang="less">
.preview-pic {
  width: 160px;
  height: 294px;
  
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;

}

</style>