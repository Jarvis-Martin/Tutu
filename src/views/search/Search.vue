<template>
<keep-alive>
  <div class="search">
    <div class="backtop" style="display: none" ref="backtopBtn" >
      <img :src="backTop_icon" alt="" @click="backTop">
    </div>
    <div class="return" >
      <img :src="return_icon" alt="" @click="back">
    </div>
    <div class="search-frame-bg">
      <div class="search-frame">
        <div class="logo-con">
          <img :src="app_icon" class="logo" alt="">
        </div>
        <div class="input-con">
          <input placeholder="请输入关键字" autofocus ref="search_input" v-model="keyWord" type="text" />
        </div>
        <div class="reset-con">
          <img :src="reset_icon" v-show="isShowReset" @click="resetInput" class="reset" alt="">
        </div>
        <div class="doSearch-con">
          <img :src="search_icon" class="doSearch" @click="doSearch" alt="">
        </div>
      </div>
    </div>
    <div class="selectBar"  v-if="response">
      <div class="user-btn" :class="{ 'active': isShowUserPanel }" @click="changeSubPanel('user')">用户</div>
      <div class="moment-btn" :class="{ 'active': !isShowUserPanel }" @click="changeSubPanel('moment')">动态</div>
    </div>
    <scroll class="scroll" ref="scroll" @scroll="showBackTopBtn"  v-if="response">
      <div class="main" :style="{ height: BodyHeight(response) }"  v-if="response">
        <user-result-panel @refreshScroll='refreshScroll' v-if="isShowUserPanel" :userResult="response.data.users"></user-result-panel>
        <moment-result-panel @refreshScroll='refreshScroll' v-else :momentResult="response.data.momentSet"></moment-result-panel>
      </div>
    </scroll>
  </div>
</keep-alive>
</template>

<script>
import { request, post } from '_network/network'
import Scroll from '_components/common/betterscroll/Bscroll'
import UserResultPanel from './UserResutlPanel'
import MomentResultPanel from './MomentResutlPanel'

export default {
  name: "Search",
  components: {
    Scroll,
    UserResultPanel,
    MomentResultPanel
  },
  mounted() {
    this.$parent.$refs.tab_bar.setAttribute('style', 'display: none');
  },
  data() {
    return {
      return_icon: require('../../../src/assets/img/common/return1.png'),
      backTop_icon: require('../../../src/assets/img/common/backtop.png'),
      app_icon: require('../../../src/assets/img/common/logo.png'),
      search_icon: require('../../../src/assets/img/common/search.png'),
      reset_icon: require('../../../src/assets/img/common/reset.png'),

      response: '',
      keyWord: '',
      isShowUserPanel: true
    }
  },
  computed: {
    isShowReset() {
      if (this.keyWord) {
        return true
      }
      return false
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    refreshScroll(){
      console.log('refresh scroll')
      this.$refs.scroll.refresh()
    },
    changeSubPanel(type) {
      if (type === 'user') {
        this.isShowUserPanel = true
      } else {
        this.isShowUserPanel = false
      }
    },
    BodyHeight(response) {
      if (this.isShowUserPanel) {
        return `${ 128 * response.data.users.length }px`
      } else {
        return `${ 510 * (response.data.momentSet.length / 2) }px`
      }
    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 50, 400)
    },
    showBackTopBtn(position) {
      if (position.y <= -763) {
        this.$refs.backtopBtn.removeAttribute('style')
      } else {
        this.$refs.backtopBtn.setAttribute('style', "display: none")
      }
    },
    resetInput() {
      this.keyWord = ''
    },
    doSearch() {
      console.log('searching-----')    
      request({
        url: '/search',
        method: 'get',
        params: {
          q: this.keyWord
        }
      }).then((result) => {
        console.log(this.response)
        this.response = result
      }).catch((err) => {
        console.log(err)
      });
    }
  }
}
</script>

<style lang='less'>
.search {
  position: fixed;
  width: 750px;
  height: 1334px;

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
  .return {
    position: fixed;
    width: 80px;
    height: 80px;
    top: 1238px;
    right: 20px;
    z-index: 100;
    
    * {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0);
      width: 64px;
      height: 64px;
    }
  }
  .search-frame-bg {
    position: relative;
    top: 0;
    left: 0;
    width: 750px;
    height: 88px;

    .search-frame {
      position: absolute;
      border-radius: 40px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 710px;
      height: 74px; 
      border: 2px solid rgba(187, 187, 187, 100);
      background-color: rgba(248 , 248, 248, 0.8);

      .logo-con, .doSearch-con {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        width: 52px;
        height: 52px;
        border-radius: 50%;
        overflow: hidden;

        img {
          position: absolute;
          width: inherit;
          height: inherit;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .logo-con {
        left: 6px;
      }
      .doSearch-con {
        right: 6px;
      }
      .input-con {
        position: absolute;
        left: 68px;
        right: 68px;
        top: 50%;
        transform: translate(0, -50%);
        // width: 574px;
        height: inherit;

        * {
          position: absolute;
          // left: 0;
          top: 50%;
          transform: translate(0, -50%);
          left: 0;
          width: 538px;
          // right: 30px;
          height: 44px;
          line-height: 44px;
          color: rgba(16, 16, 16, 100);
          font-size: 29px;
          text-align: left;
          border: none;
          background-color: rgba(255, 255, 255, 0);
        }
      }

      .reset-con {
        position: absolute;
        top: 50%;
        right: 58px;
        transform: translate(0, -50%);
        width: 44px;
        height: 44px;

        img {
          position: absolute;
          left: 50%;
          top: 50%;
          width: inherit;
          height: inherit;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  .selectBar {
    position: absolute;
    left: 0px;
    top: 88px;
    width: 750px;
    height: 84px;

    *, .active {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      width: 120px;
      height: 52px;
      font-size: 26px;
      line-height:52px;
      text-align: center;
      border-radius: 8px;
      border: 2px solid rbga(230, 230, 230, 0.8);
    }
    .active {
      background-color: rgb(254, 221, 120);
    }
    .user-btn {
      left: 245px;
    }
    .moment-btn {
      left: 385px;
    }
  }
  .scroll {
    position: fixed;
    top: 170px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(248, 248, 248, 1);
    overflow: hidden;
  }
}
</style>