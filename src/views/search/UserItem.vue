<template>
  <div class="user-item">
    <div class="head-photo">
      <slot name="head-photo" />
    </div>
    <div class="container">
      <div class="username">
        <slot name="username" />
      </div>
      <div class="content">
        <slot name="content" />
      </div>
      <div class="concernBtn">
        <div class="follow" @click.stop="addToLike" v-show="isFollow">
          <slot name="follow"></slot>
        </div>
        <div class="notfollow" @click.stop="cancelFollow" v-show="!isFollow">
          <slot name="notfollow"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserItem',
  data() {
    return {
      isFollow: true
    }
  },
  props: {
    userInfo: Object
  },
  mounted() {
    if (!this.$store.state.isLogined) {
        console.log('未登录')
        this.isFollow = true
      } else {
        //  moment发布者 id 不在 likedUserId 中时，说明未关注，故需要显示
        console.log(this.$store.state)
        if (this.$store.state.userInfo.likedUserId.indexOf(this.userInfo.userid) == -1) {
          console.log('未关注')
          this.isFollow = true
        } else {
          console.log('关注')
          this.isFollow = false
        }
      }
  },  
  methods: {
    cancelFollow() {
      if (!this.$store.state.isLogined) {
        console.log('未登录')
        this.$bus.emit('ShowView')
        this.isFollow = true
      } else {
        this.isFollow = true
        console.log(this.userInfo)
        this.$emit("cancelFollow", this.userInfo)
      }
    },
    addToLike() {
      if (!this.$store.state.isLogined) {
        console.log('未登录')
        this.$bus.emit('ShowView')
        this.isFollow = true
      } else {
        this.isFollow = false
        console.log(this.userInfo)
        this.$emit('addToLike', this.userInfo)
      }
    }
  },
}
</script>

<style lang="less">
.user-item {
  width: 750px;
  height: 120px;
  padding: 20px;
  // background-color: rgba(255, 255, 255, 0.9);
  background-color:  white;
  display: flex;
  overflow: hidden;

  .head-photo {
    width: 80px;
    height: 80px;

    * {
      width: inherit;
      height: inherit;
      border: 2px solid white;
      border-radius: 8px;
    }
  }
  .container {
    width: 610px;
    height: 80px;
    position: relative;
    margin-left: 20px;

    .username {
      width: 400px;
      height: 38px;
      color: rgba(16, 16, 16, 100);
      font-size: 28px;
      text-align: left;
      position: absolute;
      top: 0;
      left: 0;
    }

    .content {
      width: 610px;
      height: 36px;
      position: absolute;
      bottom: 0;
      left: 0;

      * {
        text-align: left;
        font-size: 26px;
        color: rgba(16, 16, 16, 100);
      }
    }
    .concernBtn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
      width: auto;
      min-width: 110px;
      height: 56px;
      line-height: 41px;
      border-radius: 10px;
      color: rgba(16, 16, 16, 100);
      font-size: 28px;
      text-align: center;
      background-color: white;
      border: 1px solid rgba(16, 16, 16, 0.3);
      padding: 0 10px 0 10px;

      * {
        height: inherit;
        width: auto;
        line-height: 56px;
        font-size: 24px;
        text-align: center;

        * {
          text-align: center;
          width: auto;
          height: inherit;
          font-size: 24px;
          text-align: center;
        }
      }
    }
  }
}
</style>