<template>
  <div class="nearby" v-if="response">
    <div id="nav-bar" v-show="isShowNavBar">
      <navigation-bar>
        <img :src="search_icon" alt="" slot="nav-left" @click="toSearch">
        <span>附近</span>
        <img :src="nav_right_icon" alt="" slot="nav-right" @click="toShare">
      </navigation-bar>
    </div>
    <scroll :pullingUp="true"  
            @scroll="scrollEndHandler($event)" 
            :stopPropagation='true' 
            :pullingDown="true" 
            @pullingUp="loadMore" 
            @pullingDowm="refreshData"
            class="main-scroll" 
            ref="main_scroll">
      <div  class="home-body-container" ref="home_container">
        <div @click.stop="stopOrResumeBgm($event)" 
             class="comment-con" v-for="(item, index) in response.data" :key="index">
            <div class="headphoto" v-show="isShowHeadPhoto">
              <head-photo :size='head_photo_size' :moment="item"  ref="headphoto">
                <img :src="item.publisherInfo.publisherHeadPhoto" alt="" slot="headphoto" @click.stop="toPublisherInfoPage(item.publisherInfo.publisherNumber)">
                <img :src="nav_right_icon" alt=""  slot="concerned" @click.stop="addToLike($event, item, index)">
                <img :src="liked_icon" alt="" slot="concerned" style="display: none">
              </head-photo>
            </div>

            <div v-show="isShowLike" class="like" >
              <like :moment="item" :componentType="'like'" @increaseEvent='increaseEvent(item, index)' @decreaseEvent='decreaseEvent(item, index)' >
                <img :src="heart_active_icon" alt="" slot="iconActive">
                <img :src="heart_icon"  alt="" slot="icon">
                <span slot="text">{{ item.likeNumber }}</span>
              </like>
            </div>
            <div class="comment-panel-mask" v-if="isShowCommentPanel" @click.stop="closeCommentPanel"/>      
            <div class="comment-panel-container" v-if="isShowCommentPanel" @click.stop="'javascript: none'">
                <comment-panel  @loadMoreCommentEvent="loadMoreCommentEventHandler($event, index)" 
                                :momentId="item.momentid" 
                                :publisherId="item.publisherInfo.publisherNumber" 
                                ref="commentPanel" 
                                :commentSet='item.commentSet' 
                                :commentNumber='item.commentNumber' 
                                @emitComment="leaveComment($event, item, index)"/>
            </div>

            <!-- <div class="comment" @click="showCommentPanel"> -->
            <div class="comment" v-show="isShowComment" :componentType="'moment'">
              <comment @showCommentPaneEvent="showCommentPaneEventHandler">
                <img :src="comment_icon" alt="" slot="icon">
                <span slot="text">{{ item.commentNumber }}</span>
              </comment>
            </div>

            <div class="sound" @click.stop="mute(index)">
              <img :src="sound_icon" alt="" v-show="isShowActiveSoundbtn">
              <img :src="sound_inactive_icon" alt="" v-show="!isShowActiveSoundbtn">
            </div>

            <div v-show="isShowContentPanel" class="contentpanel" >
              <content-panel>
                <span slot="username">{{ item.publisherInfo.publisherNickName + ':'}}</span>
                <span slot="content">{{ item.description }}</span>
                <div slot="location" class="location-con"  v-show="HasLocation(item, index)">
                  <location>
                    <img :src="location_icon" alt="" slot="icon" />
                    <div slot="location">{{ Location(index) }}</div>
                  </location>
                </div>
              </content-panel>
            </div>
            <scroll class="scroll-for-pics"  :scrollDirection="'onlyX'">
              <div class="pics" ref="pics" :style='{ width: PicsWidth(item.pictures) }'>
                <div class="pic" v-for="(it, index) in item.pictures" :key='index'>
                  <img :src="it.pictureUrl" @load="imgLoad(item.pictures, index)" >
                </div>
              </div>
            </scroll>
            <div class="bgm-player">
              <music-player :musicURL='item.bgmUrl' :isFirst="index === 0" :ref="index" />
            </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { request, post } from '_network/network'
import Scroll from '_components/common/betterscroll/Bscroll'
import MusicPlayer from '_components/content/MusicPlayer'

import NavigationBar from '_components/common/NavigationBar'
import HeadPhoto from '_components/common/HeadPhoto'
import Like from '_components/common/LikeOrComment'
import Comment from '_components/common/LikeOrComment'
import ContentPanel from '_components/content/contentpanel/ContentPanel'
import Location from '_components/content/contentpanel/Location'
import CommentPanel from '_components/common/commentpanel/CommentPanel.vue'

export default {
  name: 'Home',
  components: {
    Scroll,

    NavigationBar,
    HeadPhoto,
    Like,
    Comment,
    ContentPanel,
    Location,
    CommentPanel,
    MusicPlayer
  },
  computed: {
    Location() {
      return (index) => {
        return this.response.data[index].location.provience +
         this.response.data[index].location.city
      }
    },
    HasLocation() {
      return (moment, index) => {
        if (moment.location) {
          return true
        }
        return false
      }
    },
    PicsWidth() {
      return (pictures) => {
        return (pictures.length * 750) + ((pictures.length - 1) * 20) + 'px'
      }
    },
  },
  data() {
    return {
      sound_icon: require('../../../src/assets/img/common/sound.png'),
      sound_inactive_icon: require('../../../src/assets/img/common/sound-inactive.png'),

      search_icon: require('../../../src/assets/img/common/search-white.png'),
      nav_right_icon: require('../../../src/assets/img/common/add.png'),
      location_icon: require('../../../src/assets/img/common/location.gif'),
      liked_icon: require('../../../src/assets/img/common/liked.png'),
      heart_icon: require('../../../src/assets/img/common/heart.png'),
      heart_active_icon: require('../../../src/assets/img/common/heart-active.gif'),
      comment_icon: require('../../../src/assets/img/common/comment.png'),
      
      // like 记录是否已经点过赞了
      like: false,
      response: '',
      // 登录后记录用户当前是 第几页
      cur_page: 0,
      // 每次返回的数量
      moment_limit: 2,
      cur_comment_page: 1,
      comment_limit_comment: 5,

      head_photo_size: {
        width: 120,
        height: 120,
      },
      isShowCommentPanel: false,
      // 记录当前 正在播放的背景音乐的前一个 音乐播放器索引
      // 用于在 启用新播放器时，把上一个背景音乐播放器的音乐关闭掉
      preMusicPlayer: 0,
      curMusicPlayer: 0,

      
      isShowCommentPanel: false,
      isShowNavBar: true,
      isShowHeadPhoto: true,
      isShowLike: true,
      isShowComment: true,
      isShowContentPanel: true,
      isshowOthercon: true,
      isShowActiveSoundbtn: false,
      isMute: false,

      dbClickTimer: '',
      clickTimes: 0,
    }
  },
  methods: {
    mute(index) {
      this.isShowActiveSoundbtn = !this.isShowActiveSoundbtn
      this.isMute = !this.isMute   
      // if (this.preMusicPlayer) {
        const preMusicPlayer = this.preMusicPlayer
        if (this.isMute) {
          this.$refs[index][0].$el.children[0].pause()
          this.$refs[preMusicPlayer][0].$el.children[0].pause()
        } else {
          this.$refs[index][0].$el.children[0].play()
        }
      // }
    },
    enlargePic() {
      if (this.isshowOthercon) {
        console.log('隐藏其他组件')
        this.showOrHideOtherCon()
        this.$bus.emit('hideTabBar')
      } else {
        console.log('显示其他组件')
        this.showOrHideOtherCon()
        this.$bus.emit('showTabBar')
      }
    },
    showOrHideOtherCon() {
      this.isshowOthercon = !this.isshowOthercon
      this.isShowNavBar = !this.isShowNavBar
      this.isShowHeadPhoto = !this.isShowHeadPhoto
      this.isShowLike = !this.isShowLike
      this.isShowComment = !this.isShowComment
      this.isShowContentPanel = !this.isShowContentPanel
    },
    toSearch() {
      console.log('going to search page')
      this.$router.push('/search')
    },
    loadMoreCommentEventHandler(event, index) {
      console.log(event)
      console.log(index)
    },
    // 当点击 comment 按钮时会触发showOrCloseCommentPaneEvent事件，
    // 通知 home 组件显示 评论面板
    showCommentPaneEventHandler() {
      this.isShowCommentPanel = !this.isShowCommentPanel
      this.$parent.$refs.tab_bar.setAttribute('style', 'display: none')
    },
    // stopOrResumeBgm(event) {
    //   ++this.clickTimes
    //   this.dbClickTimer = setTimeout(() => {
    //     if (this.clickTimes == 1) {
    //       clearTimeout(this.dbClickTimer)
    //       this.clickTimes = 0
    //       console.log('点击事件')
    //       const curMusicPlayer = this.curMusicPlayer
    //       const player = this.$refs[curMusicPlayer][0].$el.children[0]
    //       if (player.paused) {
    //         player.play()
    //       } else {
    //         player.pause()
    //       }
    //     } else {
    //       clearTimeout(this.dbClickTimer)
    //       this.clickTimes = 0
    //       console.log('双击事件')
    //       this.enlargePic()
    //     }
    //   }, 300);
    // },
    stopOrResumeBgm(event) {
      ++this.clickTimes
      this.dbClickTimer = setTimeout(() => {
        if (this.clickTimes == 1) {
          if (!this.isMute) {
            clearTimeout(this.dbClickTimer)
            this.clickTimes = 0
            console.log('点击事件')
            const curMusicPlayer = this.curMusicPlayer
            const player = this.$refs[curMusicPlayer][0].$el.children[0]
            if (player.paused) {
              player.play()
            } else {
              player.pause()
            }
          } else {
            return
          }
        } else {
          clearTimeout(this.dbClickTimer)
          this.clickTimes = 0
          console.log('双击事件')
          this.enlargePic()
        }
      }, 300);
    },
    scrollEndHandler(event) {
      let y = -event.y
      const viewPortHeight = window.innerHeight
      const index = Math.ceil((y / viewPortHeight) - 1)
      if (index < 0) {
        return
      }
      this.curMusicPlayer = index // 当需要 切歌 时，保存index，为当前active的player
      if (index != this.preMusicPlayer) { // 当 前一个 player != index 时才去 切歌，避免频繁的 暂停 and 播放
        const preMusicPlayer = this.preMusicPlayer
        if (preMusicPlayer >= 0) { // 前一个 player > 0 时，才暂停前一个player，否则会报错，找不到
          setTimeout(() => {
            this.$refs[preMusicPlayer][0].$el.children[0].pause()
          }, 300);
        }
        this.preMusicPlayer = this.curMusicPlayer
        // 暂停前一个 player后，播放下一个 player
        setTimeout(() => {
          if (this.isMute) {
            return
          } else {
            this.$refs[index][0].$el.children[0].play()
          }
        }, 300);
      }
    }, 
    // scrollEndHandler(event) {
    //   let y = -event.y
    //   const viewPortHeight = window.innerHeight
    //   const index = Math.ceil((y / viewPortHeight) - 1)
    //   if (index < 0) {
    //     return
    //   }
    //   this.curMusicPlayer = index // 当需要 切歌 时，保存index，为当前active的player
    //   if (index != this.preMusicPlayer) { // 当 前一个 player != index 时才去 切歌，避免频繁的 暂停 and 播放
    //     const preMusicPlayer = this.preMusicPlayer
    //     if (preMusicPlayer >= 0) { // 前一个 player > 0 时，才暂停前一个player，否则会报错，找不到
    //       setTimeout(() => {
    //         this.$refs[preMusicPlayer][0].$el.children[0].pause()
    //       }, 300);
    //     }
    //     this.preMusicPlayer = this.curMusicPlayer
    //     // 暂停前一个 player后，播放下一个 player
    //     setTimeout(() => {
    //      this.$refs[index][0].$el.children[0].play()
    //     }, 300);
    //   }
    // }, 
    loadData(params) {
      console.log('param when load home data')
      return request({
        url: '/nearbys',
        method: 'get',
        headers: {
          "content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        "params": params,
      })
    },
    refreshData() {
      console.log('下拉刷新')
      this.cur_page = 1
      let params = {
        "_page": this.cur_page,
        "_limit": this.moment_limit,
        "location.provience": returnCitySN['cname'],
        "location.city": '',
      }
      this.loadData(params).then((result) => {
        this.response = result
        this.$bus.emit('showRefreshTip', 800)
      }).catch((err) => {
        
      });
    },
    loadMore() {
      console.log('上拉加载更多')
      let params = {}
      // 如果以登录，就需要发送id
      ++this.cur_page
      if (this.$store.state.isLogined) {
        params = {
          userId: this.$store.state.userInfo.accountNumber,
          "_page": this.cur_page,
          "_limit": this.moment_limit,
          "location.provience": returnCitySN['cname'],
          "location.city": '',
        } 
      }else {
        params = {
          "_page": this.cur_page,
          "_limit": this.moment_limit,
          "location.provience": returnCitySN['cname'],
          "location.city": '',  
        }
      }
      this.loadData(params).then((result) => {
        console.log('load more data' + result.data)
        this.response.data.push(...result.data)
        console.log('after load more data response.data')
        console.log(this.response.data)
        this.$refs.main_scroll.refresh()
      }).catch((err) => {
        console.log(err)
      });
    },
    increaseEvent(item, index) {
      post('/moment/like', {
        publisherId: item.publisherInfo.publisherNumber,
        momentId: item.momentid,
        userId: this.$store.state.userInfo.accountNumber,
        type: 'up'
      }).then((result) => {
        console.log('点赞数 + 1')
        item.likeNumber ++
        this.$store.commit('add2LikedMomenIds', item.momentid)
      }).catch((err) => {
        console.log(err)
      });
    },
    decreaseEvent(item, index) {
      post('/moment/like', {
        publisherId: item.publisherInfo.publisherNumber,
        momentId: item.momentid,
        userId: this.$store.state.userInfo.accountNumber,
        type: 'down'
      }).then((result) => {
        console.log('点赞数 - 1')
        item.likeNumber --
        this.$store.commit('removeFromLikedMomenIds', item.momentid)
      }).catch((err) => {
        console.log(err)
      });
    },
    // 用户已经登录 return true 否则 显示 comfirmView 并返回false
    toShare() {
      if (this.$store.state.isLogined) {
        this.$router.push('/share')
      } else {
        this.$emit('ShowView')
      }
    },
    closeCommentPanel() {
      console.log('click close commentpanel')
      this.isShowCommentPanel = !this.isShowCommentPanel
      this.$parent.$refs.tab_bar.setAttribute('style', 'display: flex')
    },
    toPublisherInfoPage(publisherId) {
      this.$router.push('/user/detail/' + publisherId)
    },
    async addToLike(event, moment, index) {
      // 添加关注
      if (this.$store.state.isLogined)  {
        event.srcElement.setAttribute("style", "display: none;opacity: 0")
        await setTimeout(() => {
          event.srcElement.nextSibling.setAttribute("style", "display: block")
        }, 400);
        await setTimeout(() => {
          // 设置 勾号 消失
          event.srcElement.nextSibling.setAttribute("style", "display: none")
          // 设置 整个按钮消失
          event.srcElement.parentNode.setAttribute("style", "display: none")
        }, 1000);
        post('/follow', {
          userid: this.$store.state.userInfo.accountNumber,
          concernedId: moment.publisherInfo.publisherNumber
        }).then((res) => {
            this.$store.commit('addToLiked', moment.publisherInfo.publisherNumber)
        }).catch((err) => {
          console.log(err)
        });
      } else {
        this.$emit('ShowView')
      }
    },
    leaveComment(ChildParams, moment, index) {
      let timeStamp = new Date().getTime()
      const content = ChildParams.value
      if (!content) {
        this.$bus.emit('showTip', 600, '评论不能为空白哦~')
        return
      }

      post('/moment/comment', {
        publisherId: moment.publisherInfo.publisherNumber,
        momentId: moment.momentid,
        viewerId: this.$store.state.userInfo.accountNumber,
        content,
        time: timeStamp
      }).then((result) => {
        moment.commentNumber += 1
        moment.commentSet.unshift({
          viewerInfo: {
            viewerName: this.$store.state.userInfo.nickName,
            viewerAccount: this.$store.state.userInfo.accountNumber,
            viewerHeadphoto: this.$store.state.userInfo.headPhoto
          },
          commentContent: content,
          commentTime: timeStamp,
          subComments: [ // 目前不做子评论功能
            {
              viewerInfo: {
              viewereName: 'fake1 子评论人昵称',
              viewereAccount: 'fake1 子评论人账号',
              viewereHeadPhoto: 'fake1 子评论人头像',
            },
            commentContent: 'fake1 评论内容',
            commentTime: 'fake1 123456798',
            }
          ]
        })
      }).catch((err) => {
        console.log(err)
      });
    },
    imgLoad(pics, cur_index) {
      if (pics.length - 1 == cur_index)
      this.$refs.main_scroll.refresh()
    }
  },
  async created() {
    await request({
      url: '/nearbys',
      method: 'get',
      headers: {
        "content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      params: {
        _page: ++this.cur_page,
        _limit: this.moment_limit,
        "location.provience": returnCitySN['cname'],
        "location.city": '',
      }
    }).then( res => {
      this.response = res
    }).catch( err => {
      console.log(err)
    })
  },
  mounted() {
    // 移除 tabbar 的 style="display: none" 避免从 sharepage 回到主页时，tabbar display none
    this.$parent.$refs.tab_bar.removeAttribute("style")
  },
}
</script>

<style lang="less" scoped>
.nearby {
  width: 750px;
  height: 1334px;
  position: fixed;
  // background-color: rgb(254, 221, 120);
  background-color: rgba(248, 248, 248, 1);

  #nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .main-scroll {
    position: absolute;
    top: 0;
    left: 0;
    width: 750px;
    height: 1334px;

    .home-body-container {

      .comment-con {
        position: relative;
        width: 750px;
        height: 1334px;

        .headphoto {
          position: absolute;
          top: 590px;
          left: 610px;
          z-index: 1000;
        }

        .like {
          position: absolute;
          width: 80px;
          top: 770px;
          left: 630px;
          z-index: 1000;
        }

        .comment {
          position: absolute;
          width: 80px;
          top: 910px;
          left: 630px;
          z-index: 1000;
        }

        .sound {
          position: absolute;
          width: 80px;
          height: 100px;
          top: 1025px;
          left: 630px;
          z-index: 1000;

          img {
            position: absolute;
            width: 58px;
            height: 58px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .contentpanel  {
          position: absolute;
          bottom: 88px;
          width: 750px;
          padding-left: 20px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 8px 8px 0 0;
          z-index: 10;
          border-bottom: 1px solid rgba(0, 0, 0, 0.6);;

          .location-con {
            margin-bottom: 6px;
          }
        }
        .comment-panel-mask {
          width: 750px;
          bottom: 624px;
          position: absolute;
          top: 88px;
          left: 0;
          z-index: 100;
        }
        .comment-panel-container {
          position: absolute;
          left: 0px;
          top: 706px;
          width: 750px;
          height: 628px;
          border-radius: 12px 12px 0px 0px;
          background-color: rgb(254, 221, 120);
          z-index: 10000;
        }

        .scroll-for-pics {
          width: 100vw;
          position: absolute;
          top: 88px;
          bottom: 88px;
          left: 0;
          background-color: white;

          .pics {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            .pic {
              position: relative;
              top: 50%;
              transform: translate(0, -50%);
              display: inline-block;
              width: 750px;
              height: 100%;
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
              margin-right: 20px;

              img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: inherit;
                height: auto;
              }
            }
            .pic:last-child {
              margin-right: 0px;
            }
          }
        }
      }
    }
  }
}
</style>
