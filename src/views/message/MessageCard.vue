<template>
  <div class="message-card">
    <div class="head-photo">
      <slot name="head-photo" />
    </div>
    <div class="container">
      <div class="username">
        <slot name="username" />
      </div>
      <div class="time">
        <slot name="time" />
      </div>
      <div class="msg">
        <slot name="msg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageCard'
}
</script>

<style lang="less" scoped>
.message-card {
  width: 750px;
  height: 120px;
  padding: 20px;
  // background-color: rgba(255, 255, 255, 0.9);
  background-color: rgba(254, 221, 120, 0.8);
  display: flex;

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

    .time {
      width: 210px;
      height: 38px;
      position: absolute;
      top: 0;
      left: 400px;

      * {
        text-align: center;
        font-size: 20px;
        color: rgba(16, 16, 16, 100);
        height: inherit;
        line-height: 38px;
      }
    }

    .msg {
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
  }
}

</style>