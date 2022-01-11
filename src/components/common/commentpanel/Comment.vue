<template>
  <div class="comment">
    <div class="viewer-photo">
      <slot name="viewer-photo" />
    </div>
    <div class="viewer-name">
      <slot name="viewer-name" />
    </div>
    <div class="viewer-time">
      <slot name="viewer-time" />
    </div>
    <div class="viewer-content">
      <slot name="viewer-content" />
    </div>
    <div class="viewer-more">
      <slot name="viewer-more" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  methods: {
    showMore() {

    }
  }
}
</script>

<style lang="less">
.comment {
  width: 710px;
  height: 120px;
  border-radius: 8px;
  position: relative;

  .viewer-photo {
    position: absolute;
    left: 10px;
    top: 24px;
    width: 72px;
    height: 72px;
    border-radius: 8px;
    
    * { 
      position: absolute;
      top: 50%;
      left: 50%;
      height: 50%;
      transform: translate(-50%, -50%);
      width: inherit;
      height: inherit;
      border-radius: 8px;
    }
  }

  .viewer-name {
    position: absolute;
    left: 90px;
    top: 24px;
    width: 400px;
    height: 36px;

    * {
      width: inherit;
      height: inherit;
      font-size: 26px;
      line-height: 36px;
      color: rgba(16, 16, 16, 100);
    }
  }
  .viewer-time {
    position: absolute;
    right: 0;
    top: 24px;
    width: 210px;
    height: 36px;
    text-align: center;

    * {
      width: inherit;
      height: inherit;
      font-size: 16px;
      line-height: 36px;
      color: rgba(16, 16, 16, 100);
      text-align: right;
    }
  }
  .viewer-content {
    position: absolute;
    left: 90px;
    top: 60px;
    width: 500px;
    height: 36px;

    * {
      width: inherit;
      height: inherit;
      color: rgba(16, 16, 16, 100);
      font-size: 22px;
      line-height: 36px;
    }
  }
  .viewer-more {
    position: absolute;
    left: 590px;
    top: 83px;
    width: 120px;
    height: 36px;

    * {
      width: inherit;
      height: inherit;
      color: rgba(16, 16, 16, 100);
      font-size: 18px;
      line-height: 36px;
    }
  }
}
</style>