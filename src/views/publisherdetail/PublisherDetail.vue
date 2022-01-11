<template>
  <div class="root" v-if="response">
    <div class="backtop" style="display: none" ref="backtopBtn">
      <img :src="backTop_icon" alt="" @click="backTop">
    </div>
    <div id="nav-bar">
      <div class="back_btn" @click="back">
        <img :src="back_Icon" alt="">
      </div>
    </div>
    <scroll :scrollDirection="'onlyY'" class="bscroll" ref="main_scroll" @scroll="showBackTopBtn">
      <div class="detail" ref="detail" :style="{ height: ProfileHeight }">
        <div class="bg-pic">
          <img :src="response.data.bgImage" alt="" />
        </div>
        <div class="headPhoto">
          <head-photo>
            <img :src="response.data.headPhoto" alt="" />
          </head-photo>
        </div>
        <div class="name_and_account">
          <div class="nickname">{{ this.response.data.nickName }}</div>
          <div class="account-number">账号: {{ this.response.data.accountNumber }}</div>
        </div>
        <div class="like-btn" v-show="showConcernBtn" @click="follow">关注</div>
        <div class="like-btn" v-show="!showConcernBtn" @click="cancelFollow">取消关注</div>
        <div class="introduction-tip">个性签名:</div>
        <textarea name="self-introduction" class="self-introduction" readonly :placeholder="response.data.self_introduction" />
        <div class="fans-number">粉丝数: {{ this.response.data.fansNumber }}</div>
        <div class="givendlike-number">获赞数: {{ this.response.data.givenLikesNumber }}</div>
        <div class="liked-number">关注数: {{ this.response.data.concernedNumber }}</div>
        <div class="hobbiespanel">
          <hobbies-panel :HobbyLabels='this.response.data.hobbies' />
        </div>
        <div class="monent-panel">
          <div class="momentContainer" @click="toMomentDetailPage(item, index)" v-for="(item, index) in this.response.data.moments" :key="index">
            <moment>
              <img :src="item.firstPicture" alt="" slot="pic" />
              <div slot="text">{{ item.description }}</div>
              <div slot="time">{{ item.releaseTime | formatDate}}</div>
            </moment>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { formatDate } from '_utils/formatDate'
import { request, post } from '_network/network'
import Scroll from '_components/common/betterscroll/Bscroll'

import HeadPhoto from '../../../src/views/profile/HeadPhoto'
import HobbiesPanel from '../../../src/views/profile/HabbiesPanel'
import Moment from '../../../src/views/profile/Moment'

export default {
  name: "PublisherDetail",
  components: {
    Scroll,
    HeadPhoto,
    HobbiesPanel,
    Moment,
  },
  filters: {
    formatDate(time) {
      let date = new Date(parseInt(time))
      console.log('评论页：时间戳 ' + time)
      console.log('评论页：日期 ' + date)
      console.log('评论页：格式化 ' + formatDate(date, 'yyyy-MM-dd hh:mm'))
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  computed: {
    ProfileHeight() {
      return Math.ceil(this.response.data.moments.length / 2) * 600 + 828 + 88 + 'px'
    },
  },
  async created() {
    this.userId = this.$route.params.id
    console.log(this.userId)
    await request({
      url: '/user',
      method: 'get',
      params: {
        userId: this.userId
      },
      headers: {
        "content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    }).then((result) => {
      this.response = result
    }).catch((err) => {
      console.log(err)
    });
    if (this.$store.state.isLogined) {
      // 如果当前登录的用户关注列表中，存在页面跳转时传递过来的userid，
      // 存在 return false --不显示 关注按钮。
      if (this.$store.state.userInfo.likedUserId.indexOf(this.userId.toString()) !== -1) {
        this.showConcernBtn = false
      }
    }
  },
  methods: {
    toMomentDetailPage(item, index) {
      console.log('click moment history')
      console.log(item)
      this.$router.push({
        name: 'Moment',
        params: {
          userid: this.response.data.accountNumber,
          momentid: item.comemtnid
        }
      })
    }, 
    cancelFollow() {
       if (this.$store.state.isLogined)  {
        post('/notfollow', {
          userid: this.$store.state.userInfo.accountNumber,
          concernedId: this.response.data.accountNumber
        }).then((res) => {
          this.$store.commit('cancelFollow', this.response.data.accountNumber)
          this.showConcernBtn = true
        }).catch((err) => {
          console.log(err)
        });
      } else {
        this.$bus.emit('ShowView')
      }
    },
    follow() {
      if (!this.$store.state.isLogined) {
        this.$bus.emit('ShowView')
      } else {
        // this.$store.commit('addToLiked', this.userId)
        post('/follow', {
            userid: this.$store.state.userInfo.accountNumber,
            concernedId: this.response.data.accountNumber
        }).then((res) => {
          this.$store.commit('addToLiked', this.response.data.accountNumber)
          this.showConcernBtn = false
        }).catch((err) => {
          console.log(err)
        });
      }
    },
    backTop() {
      this.$refs.main_scroll.scroll.scrollTo(0, 50, 400)
    },
    showBackTopBtn(position) {
      if (position.y <= -763) {
        this.$refs.backtopBtn.removeAttribute('style')
      } else {
        this.$refs.backtopBtn.setAttribute('style', "display: none")
      }
    },
    back() {
      this.$router.back()
    },
    publishDate(timeStamp) {
      return new Date(timeStamp).format("yyyy-MM-dd hh:mm:ss")
    }
  },
  mounted() {
    this.$parent.$refs.tab_bar.removeAttribute("style")
  },
  data() {
    return {
      backTop_icon: require('../../../src/assets/img/common/backtop.png'),
      back_Icon: require('../../../src/assets/img/common/return.png'),
      response: '',
      showConcernBtn: true,
      userId: '',
    }
  },
}
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

    .back_btn {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translate(0, -50%);
      width: 53px;
      height: 53px;
      z-index: 1000;
      border-radius: 50%;

      * {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
      }
    }
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
    background-color: white;
    background-color: rgba(230, 230, 230, 1);

    .detail {
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
          width: inherit;
          height: inherit;
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
          border: 4px solid white;
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
        background: linear-gradient(to top, rgba(255, 255, 255, 0.4),  rgba(255, 255, 255, 0));

        .nickname, .account-number {
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
        min-width: 110px;
        padding: 0 10px 0 10px;
        height: 46px;
        font-size: 28px;
        position: absolute;
        text-align: center;
        line-height: 46px;
        border-radius: 8px;
        // top: 344px;
        top: 426px;
        border: 1px solid rgba(255, 255, 255, 1);
        background-color: rgba(255,255,255, 0.6);
      }
      .like-btn:active {
        background-color: transparent;
      }
      .like-btn {
        right: 20px;
      }
      .introduction-tip {
        width: 470px;
        height: 50px;
        position: absolute;
        left: 20px;
        // top: 344px;
        top: 432px;
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
        border-radius: 8px;
        padding-left: 10px;
        padding-right: 10px;
        background-color: transparent;
        border: 2px solid white;
        resize: none;
      }
      .fans-number, .givendlike-number, .liked-number {
        width: 230px;
        height: 44px;
        position: absolute;
        // top: 532px;
        top: 650px;
        font-size: 26px;
        line-height: 44px;
        text-align: center;
        color: rgb(110, 110, 110);
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
        top: 112px;
      }
      .monent-panel {
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
        background-color: rgba(255,255,255, 0.3);

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