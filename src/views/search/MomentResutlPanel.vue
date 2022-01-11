<template>
  <div class="moment-result-panel" v-if="momentResult">
    <div class="moment-item" @click="toMomentDetailPage(item)" v-for="(item, index) in momentResult" :key="index">
      <moment-item>
        <img slot="pic" @load="loadImg(index)" :src="item.firstPicture" alt="">
        <div slot="total">{{ item.totalNumberOfPic }}</div>
        <img slot="headphoto" :src="item.userInfo.headPhoto" alt="">
        <div slot="username">{{ item.userInfo.userNickName }}</div>
        <div slot="content">{{ item.description }}</div>
        <img slot="total-like-icon" :src="heart_active_icon" alt="" >
        <div slot="total-like-text">{{ item.givenLikeNumber }}</div>
        <img slot="total-moment-icon" :src="comment_icon" alt="" >
        <div slot="total-moment-text">{{ item.commentNumber }}</div>
      </moment-item>
    </div>
  </div>
</template>

<script>
import MomentItem from './MomentItem'

export default {
  name: 'MomentResutlPanel',
  props: {
    momentResult: Array
  },
  components: {
    MomentItem,
  },
  data() {
    return {
      heart_active_icon: require('../../../src/assets/img/common/heart-active.png'),
      comment_icon: require('../../../src/assets/img/common/comment.png'),
    }
  },
  methods: {
    toMomentDetailPage(item) {
      console.log('momentresult item' + item)
      console.log('momentresult moment id' + item.momentid)
      this.$router.push({
        name: 'Moment',
        params: {
          momentid: item.momentid,
          userid: item.userInfo.userid
        }
      })
    },
    loadImg(index) {
      if (index === this.momentResult.length - 1) {
        console.log('emit refresh event')
        this.$emit('refreshScroll')
      }
    },
  },
  mounted() {
    this.$emit('refreshScroll')
  }
}
</script>

<style lang='less'>
.moment-result-panel {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
  flex-wrap: wrap;

  .moment-item {
    width: 324px;
    height: 486px;
    border-radius: 12px;
    background-color: white;
    margin-top: 4px;
    margin-bottom: 20px;
  }
}
</style>