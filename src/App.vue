<template>
  <div id="app">
    <!-- <div class="comfirmview" v-show="!logined" ref="comfirmView"> -->
    <div class="comfirmview" style="display: none" ref="comfirmView">
      <comfirm-view @CloseView='CloseView' @toLogin="toLogin" />
    </div>
    <!-- <div class="comfirm-view-mask" v-show="!isShowComfirmMask" @click='CloseView' ref="comfirmViewMask"  /> -->
    <div class="comfirm-view-mask" style="display: none" @click='CloseView' ref="comfirmViewMask"  />
    <div class="tip-refresh" ref="refreshTip" v-show="isShowRefreshTip">刷新成功</div>
    <div class="tips" ref="Tip" v-show="isShowTip"></div>
    <router-view @ShowView='ShowView' />
    <div id="tab-bar" ref="tab_bar">
      <tab-bar :tabbarItenms=this.tabbarItenms />
    </div>
  </div>
</template>

<script>
import ComfirmView from '_components/common/toast/ComfirmView'

import Home from '@/views/home/Home'
import TabBar from '_components/common/tabbar/TabBar'

export default {
  name: "App",
  components: {
    ComfirmView,

    Home,
    TabBar,
  },
  methods: {
    ShowView() {
      this.$refs.comfirmView.setAttribute('style', "display: block")
      this.isShowComfirmMask = ! this.isShowComfirmMask
    },
    CloseView() {
      this.$refs.comfirmView.setAttribute('style', "display: none")
      this.isShowComfirmMask = ! this.isShowComfirmMask
    },
    toLogin() {
      this.$router.push('/login')
    }
  },
  data() {
    return {
       tabbarItenms: [
        {
          icon: require('../src/assets/img/index/moment.png'),
          icon_active: require('../src/assets/img/index/moment-active.png'),
          link: '/indexs',
          text: '动态'
        },
        {
          icon: require('../src/assets/img/nearby/nearby.png'),
          icon_active: require('../src/assets/img/nearby/nearby-active.png'),
          link: '/nearbys',
          text: '附近'
        },
        {
          icon: require('../src/assets/img/message/message.png'),
          icon_active: require('../src/assets/img/message/message-active.png'),
          link: '/messages',
          text: '消息'
        },
        {
          icon: require('../src/assets/img/profile/profile.png'),
          icon_active: require('../src/assets/img/profile/profile-active.png'),
          link: '/profile',
          text: '我的'
        },
      ],
      isShowComfirmMask: false,
      isShowRefreshTip: false,
      isShowTip: false
    }
  },
  mounted() {
    this.$bus.on('ShowView', () => {
      this.ShowView();
    })
    this.$bus.on('showRefreshTip', (time=600) => {
      this.isShowRefreshTip = !this.isShowRefreshTip
      setTimeout(() => {
        this.isShowRefreshTip = !this.isShowRefreshTip
      }, time);
    })
    this.$bus.on('showTip', (time=600, text) => {
      this.isShowTip = !this.isShowTip
      this.$refs.refreshTip.innerHTML = text
      setTimeout(() => {
        this.$refs.refreshTip.innerHTML = 'text'
        this.isShowTip = !this.isShowTip
      }, time);
    })
    this.$bus.on('hideTabBar', () => {
      console.log('app hide tabbar')
      this.$refs.tab_bar.setAttribute('style', 'display: none');
    }),
    this.$bus.on('showTabBar', () => {
      this.$refs.tab_bar.setAttribute('style', 'display: flex');
    })
  }
}
</script>

<style lang="less" scoped>
@import './assets/css/base.css';
#app {
  position: relative;
  width: 750px;
  height: 1334px;
  top: 0;
  left: 0;
  background-color: white;

  #tab-bar {
    position: absolute;
    height: 88px;
    left: 0;
    // top: 1246px;
    bottom: 0;
    z-index: 1;
    background-color: rgba(254, 221, 120, 1);
  }
  .tip-refresh {
    position: fixed;
    top: 108px;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: rgba(255, 255, 255, 0.5);
    border: 2px solid white;
    z-index: 1000;
    text-align: center;
    width: 152px;
    height: 46px;
    font-size: 26px;
    line-height: 46px;
    border-radius: 10px;
  }
  .tips {
    position: fixed;
    bottom: 98px;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: rgba(255, 255, 255, 0.5);
    border: 2px solid white;
    z-index: 1000;
    text-align: center;
    // width: 152px;
    height: 46px;
    font-size: 26px;
    line-height: 46px;
    border-radius: 10px;
  }
  .comfirmview {
    position: fixed;
    top: 508px;
    left: 137px;
    z-index: 100000;
  }
  .comfirm-view-mask {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0;
    right: 0;
    z-index: 10000;
  }
}
</style>
