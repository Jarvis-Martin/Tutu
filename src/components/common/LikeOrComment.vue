<template>
  <div class="like-or-commment"  @click.stop="emitEvent">
    <div class="icon">
      <div class="like-or-commment-icon-active" v-show="!showDefault">
        <slot name="iconActive" />
      </div>
      <div class="like-or-commment-icon" v-show="showDefault">
        <slot name="icon" />
      </div>
    </div>
    <div class="like-or-commment-text">
      <slot name="text" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LikeOrComment',
  data() {
    return {
      showDefault: true
    }
  },
  mounted() {
      if (this.componentType === 'like' && this.$store.state.isLogined && this.$store.state.userInfo.likedMomentIds.indexOf(this.moment.momentid) != -1) {
        this.showDefault = false
      } else {
        this.showDefault = true
      }
  },
  props: {
    moment: Object,
    componentType: String
  },
  computed: {
    // return false 时，显示 红色爱心
    // return true 时，显示 白色爱心
    // showDefault() {
    //   if (this.componentType === 'like' && this.$store.state.isLogined && this.$store.state.userInfo.likedMomentIds.indexOf(this.moment.momentid) != -1) {
    //     return false
    //   }
    //   return true
    // }
  },
  methods: {
    emitEvent() {
      console.log('emitEvent')
      console.log('componentType' + this.componentType)
      // if (this.componentType === 'like') {
      //   // 点击前未 true，点击后需要 +1 ，showDefault=false
      //   console.log(this.showDefault)
      //   if (this.showDefault) {
      //     console.log('emitincrease')
      //     this.$emit('increaseEvent')
      //   } else {
      //     console.log('emitdecrease')
      //     this.$emit('decreaseEvent')
      //   }
      //   this.showDefault = !this.showDefault
      // } else {
      //   this.$emit('showCommentPaneEvent')
      // }

      if (this.componentType != 'like') {
        this.$emit('showCommentPaneEvent')
        return
      }
      if (this.$store.state.isLogined && this.componentType === 'like') {
        // 点击前未 true，点击后需要 +1 ，showDefault=false
        console.log(this.showDefault)
        if (this.showDefault) {
          console.log('emitincrease')
          this.$emit('increaseEvent')
        } else {
          console.log('emitdecrease')
          this.$emit('decreaseEvent')
        }
        this.showDefault = !this.showDefault
      } else {
        this.$bus.emit('ShowView')
      }
    }
  }
}
</script>

<style lang="less">
.like-or-commment {
  position: relative;
  height: 106px;
  width: 80px;

  .like-or-commment-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 60px;
    margin-bottom: 10px;

    * {
      width: inherit;
      height: inherit;
    }
  }
  .like-or-commment-icon-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 60px;
    margin-bottom: 10px;

    * {
      width: inherit;
      height: inherit;
    }
  }

  .like-or-commment-text {
    position: absolute;
    width: 80px;
    height: 36px;
    font-size: 26px;
    text-align: center;
    bottom: 0;
    left: 0;
  }
}

</style>