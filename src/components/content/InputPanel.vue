<template>
  <form class="input-panel" @sumbit.prevent="submitClicked">
    <div class="username-tip">
      <slot name="username-tip" />
    </div>
    <div class="username">
      <slot name="username" ref="username" />
    </div>
    <div class="password-tip">
      <slot name="password-tip" />
    </div>
    <div class="password">
      <slot name="password" ref="password" />
    </div>
    <div type="submit" class="submit">
      <slot name="button" />
    </div>
    <div class="options">
      <slot name="options" />
    </div>
  </form>
</template>

<script>
export default {
  name: "InputPanel",
  methods: {
    submitClicked() {
      if (this.$route.path === "login") {
        this.$emit("loginEvent", {
          username: this.$refs.username.values,
          password: this.$refs.password.values,
        });
      }
    },
  },
};
</script>

<style lang="less">
.input-panel {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);

  .username-tip {
    width: 374px;
    left: 50%;
    transform: translate(-50%, 0);
    position: absolute;
    top: 60px;
    text-align: left;
    height: 38px;

    * {
      position: absolute;
      top: 0;
      left: 0;
      width: inherit;
      height: inherit;
      color: rgba(255, 255, 255, 1);
      font-size: 36px;
      line-height: 38px;
    }
  }
  .password-tip {
    width: 374px;
    left: 50%;
    transform: translate(-50%, 0);
    position: absolute;
    top: 183px;
    text-align: left;
    height: 38px;

    * {
      position: absolute;
      top: 0;
      left: 0;
      width: inherit;
      height: inherit;
      color: rgba(255, 255, 255, 1);
      font-size: 36px;
      line-height: 38px;
    }
  }
  .username {
    width: 374px;
    height: 58px;
    position: absolute;
    top: 110px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 8px;

    * {
      position: absolute;
      top: 0;
      left: 0;
      width: inherit;
      height: inherit;
      font-size: 28px;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 1);
      background-color: rgba(255, 255, 255, 0.5);
      padding-left: 10px;
      padding-right: 10px;
      line-height: 58px;
    }
  }
  .password {
    width: 374px;
    height: 58px;
    position: absolute;
    top: 233px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 8px;

    * {
      position: absolute;
      top: 0;
      left: 0;
      width: inherit;
      height: inherit;
      font-size: 28px;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 1);
      background-color: rgba(255, 255, 255, 0.5);
      padding-left: 10px;
      padding-right: 10px;
      line-height: 58px;
    }
  }
  .submit {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 322px;
    width: 164px;
    height: 52px;
    border-radius: 8px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.5);

    * {
      width: inherit;
      height: inherit;
      font-size: 34px;
      text-align: center;
      line-height: 52px;
      border-radius: 8px;
      color: rgba(255, 255, 255, 1);
      border: 2px solid white;
      background-color: rgb(254, 221, 120);
    }
  }
  .options {
    position: absolute;
    bottom: -46px;
    width: 100%;

    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      * {
        width: auto;
        text-decoration: none;
        font-size: 27px;
        line-height: 26px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>