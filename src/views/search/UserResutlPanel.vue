<template>
  <div class="user-result-panel" v-if="userResult">
    <div class="useritem" @click="toUserInfoPage(item.userid)"  v-for="(item, index) in userResult" :key="index">
      <user-item :userInfo='item' @addToLike="addToLike($event)"  @cancelFollow="cancelFollow($event)">
        <img slot="head-photo" :src="item.userHeadPhoto" alt="">
        <div slot="username">{{ item.userNickName }}</div>
        <div slot="content">{{ item.userIntroduction }}</div>
        <!-- <div slot="btn" ref="follow" v-if="showConcernBtn(index)" @click="addToLike(item)">关注</div> -->
        <div slot="follow">关注</div>
        <div slot="notfollow" >取消关注</div>
      </user-item>
    </div>
  </div>
</template>

<script>
import { request, post } from '_network/network'
import UserItem from './UserItem'

export default {
  name: 'UserResutlPanel',
  props: {
    userResult: Array
  },
  components: {
    UserItem,
  },
  methods: {
    cancelFollow(item) {
      console.log('click 取消关注')
        console.log(item)
       if (this.$store.state.isLogined)  {
        post('/notfollow', {
          userid: this.$store.state.userInfo.accountNumber,
          concernedId: item.userid
        }).then((res) => {
          this.$store.commit('cancelFollow', item.userid)
        }).catch((err) => {
          console.log(err)
        });
      } else {
        this.$bus.emit('ShowView')
      }
    },
    toUserInfoPage(publisherId) {
      this.$router.push('/user/detail/' + publisherId)
    },
    async addToLike(item) {
      // 添加关注
      console.log('click 添加关注')
        console.log(item)
      if (this.$store.state.isLogined)  {
        post('/follow', {
          userid: this.$store.state.userInfo.accountNumber,
          concernedId: item.userid
        }).then((res) => {
            this.$store.commit('addToLiked', item.userid)
        }).catch((err) => {
          console.log(err)
        });
      } else {
        this.$bus.emit('ShowView')
      }
    },
  },
  mounted() {
    this.$emit('refreshScroll')      
    // if (!this.$store.state.isLogined) {
    //     console.log('未登录')
    //     return true
    //   } else {
    //     //  moment发布者 id 不在 likedUserId 中时，说明未关注，故需要显示
    //     console.log(this.$store.state)
    //     if (this.$store.state.userInfo.likedUserId.indexOf(this.userResult.userid) == -1) {
    //       console.log('未关注')
    //       return true
    //     } else {
    //       console.log('关注')
    //       return false
    //     }
    //   }
  }
}
</script>

<style lang="less">
.user-result-panel {
  width: 100%;
  height: 100%;
  padding-top: 2px;

  .useritem {
    margin-bottom: 4px;
  }
}
</style>