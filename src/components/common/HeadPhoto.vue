<template>
  <div class="head-photo" >
    <div class="pic">
      <slot name="headphoto" />
    </div>
    <div class="notconcerned" v-show="showConcernBtn" >
      <slot name="concerned" />
      <slot name="notconcerned" />
    </div>
  </div>
</template>

<script>
export default {
  name: "HeadPhoto",
  props: {
    size: Object,
    moment: Object
  },
  computed: {
    showConcernBtn() {
      if (!this.$store.state.isLogined) {
        console.log('未登录')
        return true
      } else {
        //  moment发布者 id 不在 likedUserId 中时，说明未关注，故需要显示
        console.log(this.$store.state)
        if (this.moment.publisherInfo.publisherNumber != this.$store.state.userInfo.accountNumber && this.$store.state.userInfo.likedUserId.indexOf(this.moment.publisherInfo.publisherNumber) == -1) {
          console.log(this.moment.publisherInfo.publisherNumber)
          console.log('未关注')
          return true
        } else {
          console.log('关注')
          console.log(this.moment.publisherInfo.publisherNumber)
          return false
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.head-photo {
  position: relative;
  width: 120px;
  height: 120px;
  // border: 4px solid rgba(254, 221, 120, 1);
  border: 4px solid rgba(255, 255, 255, 1);
  border-radius: 50%;

.pic {
  width: inherit;
  height: inherit;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
   
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: inherit;
    height: auto;
  }
 }
  .notconcerned {
    width: 38px;
    height: 38px;
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 100);
    background-color: rgb(254, 221, 120);

    * {
      width: 36px;
      height: 36px;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

</style>