<template>
  <div class="message" v-if="response">
    <navigation-bar>
      <img :src="search_icon" alt="" slot="nav-left" @click="toSearch">
      <span>消息</span>
    </navigation-bar>

    <scroll class="bscroll" @pullingDowm="refreshDate">
      <div class="main">
        <div class="msg-card"  v-for="(item, index) in response.data.messageSet" :key="index" @click="toMomentDetailPage(item)">
          <message-card>
            <img :src="item.viewerInfo.viewerHeadPhoto" alt="" slot="head-photo"/>
            <div slot="username">{{ item.viewerInfo.viewerName }}</div>
            <div slot="time">{{ item.commentTime | formatDate }}</div>
            <div slot="msg">{{ item.commentContent }}</div>
          </message-card>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { formatDate } from '_utils/formatDate'
import { request } from '_network/network'
import Scroll from '_components/common/betterscroll/Bscroll'
import NavigationBar from '_components/common/NavigationBar'
import MessageCard from './MessageCard'

export default {
  name: 'Message',
  components: {
    NavigationBar,
    MessageCard,
    Scroll
  },
  filters: {
    formatDate(time) {
      let date = new Date(parseInt(time))
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    toSearch() {
      this.$router.push('/search')
    },
    refreshDate() {
      console.log('下拉刷新')
      request({
        url: '/messages',
        method: 'get',
        headers: {
          "content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        params: {
          userId: this.$store.state.userInfo.accountNumber
        }
      }).then( res => {
        console.log('message response' + res)
        this.response = res
        this.$bus.emit('showRefreshTip', 800)
      }).catch( err => {
        console.log(err)
      })
    },
    toMomentDetailPage(item) {
      console.log(item)
      this.$router.push({
        name: 'Moment',
        params: {
          momentid: item.momentId,
          userid: this.$store.state.userInfo.accountNumber
        }
      })
    },
  },  
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.state.isLogined) {
        vm.$router.push({
          name: 'Login',
          params: {
            "originalPage": from.fullPath
          }
        })
      }
    })
  },
  created() {
    request({
      url: '/messages',
      method: 'get',
      headers: {
        "content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      params: {
        userId: this.$store.state.userInfo.accountNumber,
      }
    }).then( res => {
      console.log('message response')
      console.log(res)
      this.response = res
    }).catch( err => {
      console.log(err)
    })
  },
  mounted() {
    this.$parent.$refs.tab_bar.removeAttribute("style")
  },
  data() {
    return {
      search_icon: require('../../../src/assets/img/common/search-white.png'),
      
      response: '',
      comments: ''
    }
  },
}
</script>

<style lang="less">
.message {
  width: 750px;
  height: 1334px;
  // background-color: rgb(254, 221, 120);
  // background-color: rgba(248, 248, 248, 1);
  background-color: rgba(230, 230, 230, 0.4);


  #nav-bar {
    position: fixed;
    top: 0;
    right: 0;
  }

  .bscroll {
    position: fixed;
    top: 88px;
    bottom: 88px;
    left: 0;
    right: 0;
    overflow: hidden;

    .main {
      position: absolute;
      top: 0;
      width: 750px;
      background-color: transparent;

      .msg-card {
        margin: 4px 0 4px 0; 
      }
    }
  }

}

</style>