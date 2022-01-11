<template>
  <div class="tabbar-item" @click="emitClick">
    <div class="icon" v-if="isActive">
      <slot name="icon-active" />
    </div>
    <div class="icon" v-else>
      <slot name="icon" />
    </div>
    <div class="text" :style="{color: ActiveColor}">
      <slot name="text" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
    link: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    ActiveColor() {
      return this.isActive ? this.activeColor : ''
    },
    isActive() {
      // 当前 path 中是否包含 link——即当前 path 是否 等于 link，
      // 相等：表明活跃
      return this.$route.path.indexOf(this.link) != -1
    }
  },
  methods: {
    emitClick() {
      if (this.$route.path === this.link) {
        this.active = !this.active
        return
      }
      this.$router.replace(this.link)
    }
  },
}
</script>

<style lang='less' scoped>
.tabbar-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    position: relative;
    width: 36px;
    height: 36px;
    margin-right: 8px;

    * {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: inherit;
      height: inherit;
    }
  }
  .text {
    width: 68px;
    height: 44px;

    * {
      width: 68px;
      height: 44px;
      font-size: 26px;
      letter-spacing: 0.2em;
      line-height: 44px;
      text-align: center;
    }
  }
}
</style>