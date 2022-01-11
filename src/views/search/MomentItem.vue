<template>
  <div class="moment-item">
    <div class="pic">
      <slot name="pic"/>
    </div>
    <div class="total">
      <slot name="total" />
    </div>
    <div class="headphoto">
      <slot name="headphoto"/>
    </div>
    <div class="bottom-panel">
      <div class="username">
        <slot name="username" />
      </div>
      <div class="content">
        <slot name="content" />
      </div>
      <div class="panel-footer">
        <div class="like-con">
          <div class="total-like">
            <slot name="total-like-icon" />
            <slot name="total-like-text" />
          </div>
        </div>
        <div class="moment-con">
          <div class="total-moment">
            <slot name="total-moment-icon" />
            <slot name="total-moment-text" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MomentItem'
}
</script>

<style lang="less">
  .moment-item {
    position: relative;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(230, 230, 230 1);

    .pic {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: inherit;
      height: inherit;
      overflow: hidden;

      * {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: inherit;
        height: auto;
      }
    }
    .total {
      position: absolute;
      top: 10px;
      right: 14px;
      width: 24px;
      height: 38px;
      border: 2px solid white;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 6px;
      overflow: hidden;
      font-size: 8px;

      * {
        width: inherit;
        height: inherit;
        line-height: 38px;
        text-align: center;
        font-size: 8px;

        div {
          width: inherit;
          height: inherit;
          line-height: 38px;
          text-align: center;
          font-size: 8px;
        }
      }
    }
    .headphoto {
      position: absolute;
      top: 304px;
      left: 6px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid white;
      background-color: rgba(255, 255, 255, 0.6);
      z-index: 1000;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: inherit;
        height: inherit;
      }
    }
    .bottom-panel {
      position: absolute;
      top: 364px;
      left: 0;
      width: 324px;
      height: 122px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 0 0 12px 12px;

      .username {
        position: absolute;
        top: 0;
        right: 0;
        width: 208px;
        height: 40px;

        * {
          width: inherit;
          height: inherit;
          line-height: 40px;
          font-size: 20px;
          text-align: left;
          color: rgba(16, 16, 16, 100);
        }
      }
      .content {
        position: absolute;
        top: 40px;
        left: 0;
        height: 42px;
        width: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        * {
          width: inherit;
          height: inherit;
          color: rgba(16, 16, 16, 100);
          font-size: 24px;
          text-align: left;
          padding: 0 10px 0 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .panel-footer {
        width: inherit;
        height: 40px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0 0 12px 12px;
        border-top: 2px solid white;
        overflow: hidden;

        * {
          position: absolute;
          height: inherit;
          width: 50%;

          * {
            width: 100px;
            height: 38px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            img {
              position: absolute;
              left: 0;
              transform: translate(0, -50%);
              width: auto;
              height: 32px;
            }
            div {
              position: absolute;
              right: 0;
              transform: translate(0, -50%);
              width: auto;
              height: 32px;
              text-align: center;
              font-size: 22px;
            }
          }
        }
        .like-con {
          left: 0;
        }
        .moment-con {
          right: 0;
        }

      }
    }
  }
</style>