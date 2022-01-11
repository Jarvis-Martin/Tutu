<template>
  <div class="commentpanel">
    <div class="total-comment">
      {{ commentNumber + "条评论"}}
    </div>
    <div class="main">
      <scroll :stopPropagation='true' :isClick='true' :scrollDirection="'onlyY'" :pullingDown="true" @pullingUp="loadMoreCommentEvent" class="bscroll" ref="scroll">
        <div class="comments-container">
          <div class="comment-container" v-for="(comment, index) in commentSet" :key="index">
            <comment>
              <img slot="viewer-photo" @click="toPublisherInfoPage(comment.viewerInfo.viewerAccount)" 
                                       :src="comment.viewerInfo.viewerHeadphoto" alt="">
              <div slot="viewer-name">{{ comment.viewerInfo.viewerName }}</div>
              <div slot="viewer-time">{{ comment.commentTime | formatDate }}</div>
              <div slot="viewer-content">{{ comment.commentContent }}</div>
              <!-- <div v-if="comment.subComments[0]" slot="viewer-more"></div> -->
            </comment>
          </div>
        </div>
      </scroll>
    </div>
    <div class="inputComment" @click.stop="'javascript: none'">
      <input type="text" name="commentContent" placeholder="留下精彩的评论" />
      <div class="submit_btn" @click.stop="emitComment">提交</div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '_utils/formatDate'
import Scroll from '_components/common/betterscroll/Bscroll'
import Comment from './Comment'
import BetterScroll from 'better-scroll'

export default {
  name: "CommentPanel",
  props: {
    commentSet: Array,
    commentNumber: Number,
    momentId: String,
    publisherId: String,
  },
  filters: {
    formatDate(time) {
      let date = new Date(parseInt(time))
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  data() {
    return {
      scroll: ''
    }
  },
  components: {
    Comment,
    Scroll
  },
  methods: {
    toPublisherInfoPage(publisherId) {
      this.$router.push('/user/detail/' + publisherId)
    },
    loadMoreCommentEvent() {
      console.log('load more comment')
      const momentId = this.momentId
      const publisherId = this.publisherId
      this.$emit('loadMoreCommentEvent', { momentId, publisherId })
    },
    async emitComment(event) {
      if (this.$store.state.isLogined) {
        let value = event.srcElement.previousSibling.value
        if (!value) {
          return
        }
        event.srcElement.previousSibling.value = ''
        await this.$emit('emitComment', {event, value})
        this.$refs.scroll.refresh()
      } else {
        this.$bus.emit('ShowView')
      }
    },
  }
}
</script>

<style lang="less">
.commentpanel {
  position: relative;
  width: inherit;
  height: inherit;
  background-color: rgb(254, 221, 120);

  .total-comment {
    position: absolute;
    left: 20px;
    top: 0px;
    width: 710px;
    height: 36px;
    line-height: 36px;
    color: rgba(16, 16, 16, 100);
    font-size: 20px;
    text-align: center;
  }
  .main {
    position: absolute;
    top: 36px;
    bottom: 66px;
    left: 20px;
    right: 20px;

    .bscroll {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;

      .comments-container {
        .comment-container {
          margin-bottom: 10px;
          border-radius: 8px;
        }
      }
    }
  }
  .inputComment {
    position: absolute;
    // top: 562px;
    left: 20px;
    right: 20px;
    bottom: 10px;
    height: 66px;  
    background-color: white;
    border-radius: 8px;
    z-index: 10000;

    input {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      width: 580px;
      height: 58px;
      line-height: 58px;
      color: rgba(16, 16, 16, 100);
      font-size: 26px;
      border-radius: 8px;
      padding: 0 6px 0 6px;
      background-color: rgba(255, 255, 255, 1);
      border: none;
    }
    .submit_btn {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translate(0, -50%);
      width: 100px;
      height: 44px;
      line-height: 44px;
      font-size: 26px;
      text-align: center;
      background-color:  rgba(254, 221, 120, 1);
      border: 2px solid rgba(230, 230, 230, 100);
      border-radius: 8px;
    }
  }
}
</style>