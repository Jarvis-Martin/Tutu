<template>
  <div class="moment">
    <div class="mask" v-if="flag !== 1">
      <slot name="user_tip"/>
    </div>
    <div class="del-btn" v-show="show_del_btn">
      <img :src="delete_btn_icon" alt="" @click.stop="EmitDelMomentEvent" />
    </div>
    <div class="pic">
      <slot name="pic" />
    </div>
    <div class="text-container">
      <div class="text">
        <slot name="text" />
      </div>
      <div class="time">
        <slot name="time" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Monment",
  data() {
    return {
      delete_btn_icon: require("../../../src/assets/img/common/delete-btn.png"),
    };
  },
  props: {
    index: Number,
    show_del_btn: {
      type: Boolean,
      default: false,
    },
    // date: 2021/10/10 22:46
    // flag: 作品审核状态：
    // 0：审核种
    // 1：审核通过
    flag: {
      type: Number,
      default: false
    }
  },
  mounted() {
    console.log(this.index);
  },
  methods: {
    EmitDelMomentEvent() {
      this.$emit("EmitDelMomentEvent", this.index);
    },
  },
};
</script>

<style lang="less" scoped>
.moment {
  position: relative;
  width: inherit;
  height: inherit;
  border-radius: 10px;
  position: absolute;
  // border: 2px solid white;
  border: 2px solid rgba(254, 221, 120, 0.8);

.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1000;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(112, 112, 112, .8);
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: white;
    font-size: 26px;
    font-weight: 600;
  }
}
  .del-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 48px;
    height: 48px;
    z-index: 1000;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid white;

    * {
      position: absolute;
      width: 40px;
      height: 40px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .pic {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: inherit;
    height: inherit;
    border-radius: 10px;
    overflow: hidden;
    background-color: rgba(248, 248, 248, 1);

    * {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: inherit;
      height: auto;
      border-radius: 10px;
    }
  }

  .text-container {
    height: 122px;
    width: inherit;
    position: absolute;
    top: 458px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 0 0 10px 10px;
    background-color: rgba(254, 221, 120, 0.8);

    .text {
      font-size: 24px;
      width: inherit;
      height: 82px;
      padding-top: 10px;
      line-height: 38px;
      padding: 0 14px 0 14px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .time {
      height: 40px;
      width: inherit;
      font-size: 20px;
      border-top: 2px solid white;
      text-align: center;
      line-height: 40px;
      border-radius: 0 0 10px 10px;
      color: rgb(255, 255, 255);
    }
  }
}
</style>