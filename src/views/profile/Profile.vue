<template>
  <div class="root" v-if="response">
    <div class="backtop" style="display: none" ref="backtopBtn">
      <img :src="backTop_icon" alt="" @click="backTop" />
    </div>
    <div id="nav-bar">
      <div class="settings-icon" @click="showOrCloseOptionsBtn">
        <img :src="settings_icon" alt="" />
      </div>
    </div>
    <div class="option-btns" v-show="isShowOptionBtns">
      <div class="register-btn" @click="toRegisterPage">注册</div>
      <div class="login-btn" @click="toLoginPage">登录</div>
      <div class="logout-btn" @click="showLogoutQuestionView">退出</div>
    </div>
    <div class="comfirm-view" v-show="isShowLogoutView">
      <div class="top">
        <div class="title">提示</div>
        <div class="content">您确定要退出吗？</div>
      </div>
      <div class="bottom">
        <div @click="showLogoutQuestionView" class="cancel">否</div>
        <div @click="toIndexsPage" class="done">是</div>
      </div>
    </div>
    <div class="comfirm-view" v-show="isShowDelMomentView">
      <div class="top">
        <div class="title">提示</div>
        <div class="content">您确定要删除该动态吗？</div>
      </div>
      <div class="bottom">
        <div @click="cancelDel" class="cancel">否</div>
        <div @click="DeleteMoment" class="done">是</div>
      </div>
    </div>
    <div
      class="ViewMask"
      v-show="isShowLogoutView"
      @click="showLogoutQuestionView"
    ></div>

    <scroll
      @pullingDowm="refreshData"
      :scrollDirection="'onlyY'"
      class="bscroll"
      ref="main_scroll"
      @scroll="showBackTopBtn"
    >
      <div class="profile" ref="profile" :style="{ height: ProfileHeight }">
        <div class="bg-pic">
          <img :src="response.data.bgImage" alt="" />
        </div>
        <div class="headPhoto">
          <head-photo>
            <img :src="response.data.headphoto" alt="" />
          </head-photo>
        </div>
        <div class="name_and_account">
          <div class="nickname">{{ this.response.data.nickName }}</div>
          <div class="account-number">
            账号: {{ this.response.data.accountNumber }}
          </div>
        </div>
        <div class="like-btn" @click="toEditPage">编辑</div>
        <div class="introduction-tip">个性签名:</div>
        <textarea
          name="self-introduction"
          placeholder="还没有留下个性签名喔~~"
          readonly
          class="self-introduction"
          v-model="this.response.data.self_introduction"
        ></textarea>
        <div class="fans-number">
          粉丝数: {{ this.response.data.fansNumber }}
        </div>
        <div class="givendlike-number">
          获赞数: {{ this.response.data.givenLikesNumber }}
        </div>
        <div class="liked-number">
          关注数: {{ this.response.data.LikedNumber }}
        </div>
        <div class="hobbiespanel">
          <hobbies-panel :HobbyLabels="this.response.data.hobbies" />
        </div>
        <div class="monent-panel">
          <div
            class="momentContainer"
            @click="toMomentDetailPage(item, index)"
            @touchstart="touchStart(index)"
            @touchmove="touchMove"
            @touchend="touchEnd"
            v-for="(item, index) in this.response.data.moments"
            :key="index"
          >
            <moment
              :index="index"
              :show_del_btn="isShowDelBtn"
              @EmitDelMomentEvent="EmitDelMomentEventHandler"
              :flag="item.flag"
            >
              <div class="text" slot="user_tip">{{ item.userTip }}</div>
              <img
                :src="item.firstPicture"
                alt=""
                slot="pic"
                @load="loadImg(index)"
              />
              <div slot="text">{{ item.description }}</div>
              <div slot="time">{{ item.releaseTime | formatDate }}</div>
            </moment>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { formatDate } from "_utils/formatDate";
import { request, post } from "_network/network";
import Scroll from "_components/common/betterscroll/Bscroll";

import NavigationBar from "_components/common/NavigationBar";
import HeadPhoto from "./HeadPhoto";
import HobbiesPanel from "./HabbiesPanel";
import Moment from "./Moment";

export default {
  name: "Profile",
  components: {
    Scroll,
    HeadPhoto,
    HobbiesPanel,
    Moment,
    NavigationBar,
  },
  filters: {
    formatDate(time) {
      let date = new Date(parseInt(time));
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
  },
  updated() {
    this.$refs.main_scroll.refresh();
  },
  methods: {
    cancelDel() {
      this.showDeleteMomentView();
      this.isShowDelBtn = false;
    },
    DeleteMoment() {
      console.log(this.index_of_moment_to_be_del);
      this.response.data.moments.splice(this.index_of_moment_to_be_del, 1);
      this.$store.commit("updateMoments", this.response.data.moments);
      this.isShowDelBtn = !this.isShowDelBtn;
      this.showDeleteMomentView();
    },
    EmitDelMomentEventHandler(index) {
      post("/moment/delete", {
        userId: this.$store.state.userInfo.accountNumber,
        momentId: this.response.data.moments[index].momentid,
      })
        .then((result) => {
          this.index_of_moment_to_be_del = index;
          this.showDeleteMomentView();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    touchStart(index) {
      this.longTouchTimer = setTimeout(() => {
        console.log("long touch");
        this.$bus.emit("showDelBtn", index);
        this.isShowDelBtn = true;
        console.log(this.isShowDelBtn);
      }, 700);
    },
    touchMove() {
      clearTimeout(this.longTouchTimer);
    },
    touchEnd() {
      clearTimeout(this.longTouchTimer);
    },
    toMomentDetailPage(item, index) {
      console.log("click moment history");
      console.log(item);
      this.$router.push({
        name: "Moment",
        params: {
          momentid: item.momentid,
          userid: this.$store.state.userInfo.accountNumber,
        },
      });
    },
    toIndexsPage() {
      this.$router.replace("/indexs");
      setTimeout(() => {
        this.logout();
      }, 600);
    },
    showDeleteMomentView() {
      this.isShowDelMomentView = !this.isShowDelMomentView;
    },
    showLogoutQuestionView() {
      this.isShowLogoutView = !this.isShowLogoutView;
    },
    loadImg(index) {
      if (index === this.response.data.moments.length - 1) {
        this.$refs.main_scroll.refresh();
      }
    },
    refreshData() {
      request({
        url: "/profile",
        method: "get",
        headers: {
          "content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        params: {
          userId: this.$store.state.userInfo.accountNumber,
        },
      })
        .then((result) => {
          this.response = result;
          // 吧收到 用户信息存入 vuex
          this.$store.commit("assignInfo", this.response.data);
          this.$bus.emit("showRefreshTip", 800);
          console.log("yes");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toRegisterPage() {
      this.$router.push("/register");
    },
    toLoginPage() {
      this.$router.push("/login");
    },
    logout() {
      this.$store.commit("changeLoginState");
      this.$store.dispatch("logOut");
    },
    showOrCloseOptionsBtn() {
      this.isShowOptionBtns = !this.isShowOptionBtns;
    },
    backTop() {
      this.$refs.main_scroll.scroll.scrollTo(0, 50, 400);
    },
    showBackTopBtn(position) {
      if (position.y <= -763) {
        this.$refs.backtopBtn.removeAttribute("style");
      } else {
        this.$refs.backtopBtn.setAttribute("style", "display: none");
      }
    },
    toEditPage() {
      this.$router.push({
        name: "EditPage",
        params: {
          id: this.response.data.accountNumber,
          response: this.response,
        },
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$store.state.isLogined) {
        vm.$router.push({
          name: "Login",
          params: {
            originalPage: from.fullPath,
          },
        });
      }
    });
  },
  created() {
    request({
      url: "/profile",
      method: "get",
      headers: {
        "content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      params: {
        userId: this.$store.state.userInfo.accountNumber,
      },
    })
      .then((result) => {
        this.response = result;
        // 吧收到 用户信息存入 vuex
        this.$store.commit("assignInfo", this.response.data);
        console.log(this.response.data);
        console.log("yes");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  mounted() {
    this.$parent.$refs.tab_bar.removeAttribute("style");
  },
  data() {
    return {
      backTop_icon: require("../../../src/assets/img/common/backtop.png"),
      settings_icon: require("../../../src/assets/img/common/settings.png"),
      response: "",
      // 是否显示 settings下的子选项， 默认false 不显示
      isShowOptionBtns: false,
      // 是否显示 用户退出时 最后的询问， 默认不显示
      isShowLogoutView: false,
      isShowDelMomentView: false,
      longTouchTimer: "",
      isShowDelBtn: false,
      index_of_moment_to_be_del: "",
    };
  },
  computed: {
    ProfileHeight() {
      console.log("rpofile height:");
      console.log(
        Math.ceil(this.response.data.moments.length / 2) * 600 + 828 + 88
      );
      return `${
        Math.ceil(this.response.data.moments.length / 2) * 600 + 828 + 88
      }px`;
    },
  },
};
</script>

<style lang="less">
.root {
  position: fixed;
  top: 0;
  left: 0;
  width: 750px;
  height: 1334px;

  #nav-bar {
    position: fixed;
    width: 750px;
    height: 88px;
    // background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
    top: 0;
    left: 0;
    z-index: 100;

    .settings-icon {
      position: absolute;
      top: 50%;
      width: 55px;
      height: 55px;
      right: 20px;
      transform: translate(0, -50%);
      background-color: rgba(255, 255, 255, 0.4);
      border-radius: 50px;

      img {
        width: 53px;
        height: 53px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .option-btns {
    position: absolute;
    z-index: 1000;
    top: 88px;
    right: 20px;
    width: 120px;
    display: flex;
    flex-direction: column;

    * {
      position: relative;
      right: 0;
      height: 46px;
      line-height: 40px;
      font-size: 26px;
      width: inherit;
      border-radius: 14px;
      margin-bottom: 12px;
      text-align: center;
      color: black;
      background-color: rgba(254, 221, 120, 0.8);
      border: 4px solid white;
      // background-color: rgba(255, 255, 255, 0.7);
    }
    div:last-child {
      margin-bottom: 0px;
    }
  }
  .comfirm-view {
    position: fixed;
    top: 508px;
    left: 137px;
    width: 476px;
    height: 240px;
    border-radius: 14px;
    background-color: rgb(240, 240, 240);
    border: 1px solid white;
    box-shadow: 0 0 2px 0px white;
    z-index: 10000;

    .top {
      height: 167px;
      width: 476px;
      position: relative;

      .title {
        width: inherit;
        height: 44px;
        font-size: 32px;
        text-align: center;
        position: absolute;
        top: 37px;
      }
      .content {
        width: inherit;
        height: 57px;
        position: absolute;
        top: 86px;
        text-align: center;
        font-size: 28px;
      }
    }
    .bottom {
      height: 73px;
      width: inherit;
      display: flex;
      background-color: rgba(254, 221, 120, 1);
      border-radius: 0 0 14px 14px;

      .cancel,
      .done {
        flex: 1;
        height: inherit;
        font-size: 30px;
        text-align: center;
        line-height: 73px;
        border-top: 4px solid white;
        background-color: rgba(255, 255, 255, 0.2);
      }
      .cancel {
        border-right: 2px solid white;
      }
      .done {
        border-left: 2px solid white;
      }
    }
  }
  .ViewMask {
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    bottom: 88px;
    opacity: 0;
    z-index: 1000;
  }
  .backtop {
    position: fixed;
    width: 80px;
    height: 80px;
    top: 1156px;
    right: 20px;
    z-index: 100;

    * {
      width: inherit;
      height: inherit;
    }
  }
  .bscroll {
    position: absolute;
    top: 0;
    bottom: 88px;
    left: 0;
    right: 0;
    background-color: rgba(230, 230, 230, 0.4);

    .profile {
      width: 750px;
      position: absolute;
      top: 0;
      left: 0;

      .bg-pic {
        position: relative;
        width: 750px;
        // height: 320px;
        height: 408px;
        opacity: 0.9;
        border-bottom: 1px solid rgba(255, 255, 255, 0.9);
        overflow: hidden;

        * {
          position: absolute;
          bottom: 0;
          left: 50%;
          top: 0;
          transform: translate(-50%, 0);
          width: inherit;
          height: auto;
        }
      }
      .headPhoto {
        width: 140px;
        height: 140px;
        position: absolute;
        // top: 196px;
        top: 284px;
        left: 20px;

        * {
          width: inherit;
          height: inherit;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 2px solid white;
          z-index: 1000;
        }
      }
      .name_and_account {
        width: 750px;
        height: 104px;
        position: absolute;
        // top: 230px;
        top: 316px;
        left: 0;
        background: linear-gradient(
          to top,
          rgba(255, 255, 255, 0.4),
          rgba(255, 255, 255, 0)
        );

        .nickname,
        .account-number {
          position: absolute;
          left: 170px;
          width: 560px;
          height: 50px;
          text-align: left;
        }
        .nickname {
          top: 0px;
          line-height: 50px;
          font-size: 36px;
        }
        .account-number {
          font-size: 30px;
          top: 54px;
          line-height: 44px;
        }
      }
      .like-btn {
        width: 110px;
        height: 46px;
        font-size: 28px;
        position: absolute;
        text-align: center;
        line-height: 46px;
        border-radius: 8px;
        box-shadow: 0px 3px 2px gray;
        // top: 344px;
        top: 426px;
        border: 1px solid rgba(255, 255, 255, 1);
        background-color: rgba(255, 255, 255, 1);
      }
      .like-btn:active {
        background-color: transparent;
      }
      .like-btn {
        left: 620px;
      }
      .introduction-tip {
        width: 470px;
        height: 50px;
        position: absolute;
        left: 20px;
        // top: 344px;
        top: 430px;
        font-size: 28px;
        line-height: 50px;
      }
      .self-introduction {
        position: absolute;
        width: 710px;
        font-size: 28px;
        height: 150px;
        // top: 394px;
        top: 482px;
        left: 20px;
        border: none;
        line-height: 50px;
        border-radius: 10px;
        padding-left: 10px;
        padding-right: 10px;
        background-color: transparent;
        border: 2px solid white;
      }
      .fans-number,
      .givendlike-number,
      .liked-number {
        width: 230px;
        height: 44px;
        position: absolute;
        // top: 532px;
        top: 650px;
        font-size: 26px;
        line-height: 44px;
        text-align: center;
        // color: rgb(110, 110, 110);
        color: rgb(16, 16, 16);
      }
      .fans-number {
        left: 20px;
      }
      .givendlike-number {
        left: 260px;
      }
      .liked-number {
        left: 500px;
      }
      .hobbiespanel {
        position: absolute;
        top: 116px;
      }
      .monent-panel {
        padding-top: 18px;
        width: 750px;
        position: absolute;
        // top: 810px;
        top: 898px;
        left: 0px;
        display: flex;
        justify-content: space-between;
        padding-left: 30px;
        padding-right: 30px;
        flex-wrap: wrap;
        background-color: rgba(255, 255, 255, 0.3);
        // background-color: rgb(248, 248, 248);

        .momentContainer {
          width: 334px;
          height: 580px;
          margin-bottom: 20px;
          border-radius: 12px;
        }
      }
    }
  }
}
</style>