<template>
  <div class="scroll" ref="wrapper">
    <slot />
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
  name: 'Bscroll',
  data() {
    return {
      scroll,
    }
  },
  props: {
    probeType: {
      type: Number,
      default: 3
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    scrollDirection: {
      type: String,
      default: 'onlyY'
    },
    isClick: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    scrollTo(x, y, time = 400, easing) {
      this.scroll.scrollTo(x, y, time, easing)
    },
    backTop(x = 0, y = 0, time = 400) {
      this.scroll.scrollTo(x, y, time, easing)
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  },
  mounted() {
    let scrollX = false;
    let scrollY = false;
    if (this.scrollDirection === 'onlyY') {
      scrollX = false
      scrollY = true
    }
    if (this.scrollDirection === 'onlyX') {
      scrollX = true
      scrollY = false
    }
    this.scroll = new Bscroll(this.$refs.wrapper, {
      click: this.isClick,
      probeType: this.probeType,
      scrollX,
      scrollY,
      pullUpLoad: true,
      pullDownRefresh: true,
      stopPropagation: this.stopPropagation,
      preventDefault: false
    })

    this.scroll.on('scroll', (position) => {
      this.$emit('scroll', position)
    })
    this.scroll.on('refresh', () => {
      this.$emit('refresh')
    })
    this.scroll.on('pullingUp', () => {
      this.$emit('pullingUp')
      this.scroll.finishPullUp()
    })
    this.scroll.on('pullingDown', () => {
      this.$emit('pullingDowm')
      this.scroll.finishPullDown()
    })
    this.scroll.on('scrollEnd', (event) => {
      this.$emit('scrollEnd', event)
    })
  },
}
</script>

<style>

</style>