<template>
  <div class="moment-page" v-if="response">
    <div id="nav-bar" v-show="isShowNavBar">
      <navigation-bar>
        <img :src="nav_left_icon" alt="" slot="nav-left" @click="back" />
        <span>动态</span>
        <!-- <img :src="nav_right_icon" alt="" slot="nav-right" @click="toShare"> -->
      </navigation-bar>
    </div>

    <scroll class="main-scroll" ref="main_scroll">
      <div class="home-body-container" ref="home_container">
        <div @click.stop="stopOrResumeBgm($event)" class="comment-con">
          <div class="headphoto" v-show="isShowHeadPhoto">
            <head-photo
              :size="head_photo_size"
              :moment="response.data"
              ref="headphoto"
            >
              <img
                :src="response.data.publisherInfo.publisherHeadPhoto"
                alt=""
                slot="headphoto"
                @click="
                  toPublisherInfoPage(
                    response.data.publisherInfo.publisherNumber
                  )
                "
              />
              <img
                :src="nav_right_icon"
                alt=""
                slot="concerned"
                @click="addToLike($event, response.data)"
              />
              <img
                :src="liked_icon"
                alt=""
                slot="concerned"
                style="display: none"
              />
            </head-photo>
          </div>

          <div class="like" v-show="isShowLike">
            <like
              :moment="response.data"
              :componentType="'like'"
              @increaseEvent="increaseEvent(response.data)"
              @decreaseEvent="decreaseEvent(response.data)"
            >
              <img :src="heart_active_icon" alt="" slot="iconActive" />
              <img :src="heart_icon" alt="" slot="icon" />
              <span slot="text">{{ response.data.likeNumber }}</span>
            </like>
          </div>
          <div
            class="comment-panel-mask"
            v-if="isShowCommentPanel"
            @click.stop="closeCommentPanel"
          />
          <div
            class="comment-panel-container"
            v-if="isShowCommentPanel"
            @click.stop="&quot;javascript: none&quot;;"
          >
            <comment-panel
              @loadMoreCommentEvent="loadMoreCommentEventHandler($event, 0)"
              :momentId="response.data.momentid"
              :publisherId="response.data.publisherInfo.publisherNumber"
              ref="commentPanel"
              :commentSet="response.data.commentSet"
              :commentNumber="response.data.commentNumber"
              @emitComment="leaveComment($event, response.data)"
            />
          </div>

          <div class="comment" v-show="isShowComment">
            <comment @showCommentPaneEvent="showCommentPaneEventHandler">
              <img :src="comment_icon" alt="" slot="icon" />
              <span slot="text">{{ response.data.commentNumber }}</span>
            </comment>
          </div>

          <div class="sound" @click.stop="mute">
            <img :src="sound_icon" alt="" v-show="isShowActiveSoundbtn" />
            <img
              :src="sound_inactive_icon"
              alt=""
              v-show="!isShowActiveSoundbtn"
            />
          </div>

          <div class="contentpanel" v-show="isShowContentPanel">
            <content-panel>
              <span slot="username">{{
                response.data.publisherInfo.publisherNickName + ":"
              }}</span>
              <span slot="content">{{ response.data.description }}</span>
              <div
                slot="location"
                class="location-con"
                v-show="HasLocation(response.data)"
              >
                <location>
                  <img :src="location_icon" alt="" slot="icon" />
                  <div slot="location">{{ Location() }}</div>
                </location>
              </div>
            </content-panel>
          </div>
          <scroll class="scroll-for-pics" :scrollDirection="'onlyX'">
            <div
              class="pics"
              ref="pics"
              :style="{ width: PicsWidth(response.data.pictures) }"
            >
              <div
                class="pic"
                v-for="(it, index) in response.data.pictures"
                :key="index"
              >
                <img
                  :src="it.pictureUrl"
                  @load="imgLoad(response.data.pictures, index)"
                />
              </div>
            </div>
          </scroll>
          <div class="bgm-player">
            <music-player
              :isFirst="true"
              :musicURL="response.data.bgmUrl"
              ref="player"
            />
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { request, post } from "_network/network";
import Scroll from "_components/common/betterscroll/Bscroll";
import MusicPlayer from "_components/content/MusicPlayer";

import NavigationBar from "_components/common/NavigationBar";
import HeadPhoto from "_components/common/HeadPhoto";
import Like from "_components/common/LikeOrComment";
import Comment from "_components/common/LikeOrComment";
import ContentPanel from "_components/content/contentpanel/ContentPanel";
import Location from "_components/content/contentpanel/Location";
import CommentPanel from "_components/common/commentpanel/CommentPanel.vue";

export default {
  name: "MomentPage",
  components: {
    Scroll,

    NavigationBar,
    HeadPhoto,
    Like,
    Comment,
    ContentPanel,
    Location,
    CommentPanel,
    MusicPlayer,
  },
  computed: {
    Location() {
      return () => {
        return `${
          this.response.data.location.provience
            ? this.response.data.location.provience
            : ""
        }${
          this.response.data.location.city
            ? this.response.data.location.city
            : ""
        }`;
      };
    },
    HasLocation() {
      return (moment) => {
        if (moment.location) {
          return true;
        }
        return false;
      };
    },
    PicsWidth() {
      return (pictures) => {
        return pictures.length * 750 + (pictures.length - 1) * 20 + "px";
      };
    },
  },
  data() {
    return {
      sound_icon: require("../../../src/assets/img/common/sound.png"),
      sound_inactive_icon: require("../../../src/assets/img/common/sound-inactive.png"),

      nav_right_icon: require("../../../src/assets/img/common/add.png"),
      nav_left_icon: require("../../../src/assets/img/common/return.png"),
      location_icon: require("../../../src/assets/img/common/location.gif"),
      liked_icon: require("../../../src/assets/img/common/liked.png"),
      heart_icon: require("../../../src/assets/img/common/heart.png"),
      heart_active_icon: require("../../../src/assets/img/common/heart-active.gif"),
      comment_icon: require("../../../src/assets/img/common/comment.png"),

      // like 记录是否已经点过赞了
      like: false,
      response: "",
      head_photo_size: {
        width: 120,
        height: 120,
      },
      isShowCommentPanel: false,
      cur_comment_page: 1,
      _limit_comment: 5,

      isShowCommentPanel: false,
      isShowNavBar: true,
      isShowHeadPhoto: true,
      isShowLike: true,
      isShowComment: true,
      isShowContentPanel: true,
      isshowOthercon: true,
      isShowActiveSoundbtn: false,
      isMute: false,

      dbClickTimer: "",
      clickTimes: 0,
    };
  },
  methods: {
    mute() {
      console.log("mute");
      this.isShowActiveSoundbtn = !this.isShowActiveSoundbtn;
      console.log(this.isShowActiveSoundbtn);
      this.isMute = !this.isMute;
      const player = this.$refs.player.$el.children[0];
      if (this.isMute) {
        player.pause();
      } else {
        player.play();
      }
    },
    enlargePic() {
      console.log("双击全屏显示图片");
      console.log(this.isshowOthercon);
      if (this.isshowOthercon) {
        console.log("隐藏其他组件");
        this.showOrHideOtherCon();
        this.$bus.emit("hideTabBar");
      } else {
        console.log("显示其他组件");
        this.showOrHideOtherCon();
        console.log("emoit shoe tabbatr");
        this.$bus.emit("showTabBar");
      }
    },
    showOrHideOtherCon() {
      this.isshowOthercon = !this.isshowOthercon;
      this.isShowNavBar = !this.isShowNavBar;
      this.isShowHeadPhoto = !this.isShowHeadPhoto;
      this.isShowLike = !this.isShowLike;
      this.isShowComment = !this.isShowComment;
      this.isShowContentPanel = !this.isShowContentPanel;
    },
    loadMoreCommentEventHandler(event, index) {
      console.log(event);
      console.log(index);
    },
    showCommentPaneEventHandler() {
      this.isShowCommentPanel = !this.isShowCommentPanel;
      this.$parent.$refs.tab_bar.setAttribute("style", "display: none");
    },
    stopOrResumeBgm(event) {
      ++this.clickTimes;
      this.dbClickTimer = setTimeout(() => {
        if (this.clickTimes == 1) {
          clearTimeout(this.dbClickTimer);
          this.clickTimes = 0;
          console.log("点击事件");
          console.log(this.$refs);
          const player = this.$refs.player.$el.children[0];
          if (player.paused) {
            player.play();
          } else {
            player.pause();
          }
        } else {
          clearTimeout(this.dbClickTimer);
          this.clickTimes = 0;
          console.log("双击事件");
          this.enlargePic();
        }
      }, 300);
    },
    back() {
      this.$router.back();
    },
    increaseEvent(item) {
      post("/moment/like", {
        publisherId: item.publisherInfo.publisherNumber,
        momentId: item.momentid,
        userId: this.$store.state.userInfo.accountNumber,
        type: "up",
      })
        .then((result) => {
          console.log("点赞数 + 1");
          item.likeNumber++;
          this.$store.commit("add2LikedMomenIds", item.momentid);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    decreaseEvent(item) {
      post("/moment/like", {
        publisherId: item.publisherInfo.publisherNumber,
        momentId: item.momentid,
        userId: this.$store.state.userInfo.accountNumber,
        type: "down",
      })
        .then((result) => {
          console.log("点赞数 - 1");
          item.likeNumber--;
          this.$store.commit("removeFromLikedMomenIds", item.momentid);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 用户已经登录 return true 否则 显示 comfirmView 并返回false
    toShare() {
      if (this.$store.state.isLogined) {
        this.$router.push("/share");
      } else {
        this.$emit("ShowView");
      }
    },
    closeCommentPanel() {
      this.isShowCommentPanel = !this.isShowCommentPanel;
      this.$parent.$refs.tab_bar.setAttribute("style", "display: flex");
    },
    toPublisherInfoPage(publisherId) {
      this.$router.push({
        name: "PublisherDetail",
        params: {
          id: publisherId,
        },
      });
    },
    async addToLike(event, moment) {
      console.log("addtolike------------------");
      console.log(this.response);
      console.log("-------------moment id addtolike" + moment);
      // 添加关注
      if (this.$store.state.isLogined) {
        event.srcElement.setAttribute("style", "display: none;opacity: 0");
        await setTimeout(() => {
          event.srcElement.nextSibling.setAttribute("style", "display: block");
        }, 400);
        await setTimeout(() => {
          // 设置 勾号 消失
          event.srcElement.nextSibling.setAttribute("style", "display: none");
          // 设置 整个按钮消失
          event.srcElement.parentNode.setAttribute("style", "display: none");
        }, 1000);

        post("/follow", {
          userid: this.$store.state.userInfo.accountNumber,
          concernedId: moment.publisherInfo.publisherNumber,
        })
          .then((res) => {
            this.$store.commit(
              "addToLiked",
              moment.publisherInfo.publisherNumber
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$emit("ShowView");
      }
    },
    leaveComment(ChildParams, moment) {
      let timeStamp = new Date().getTime();
      const content = ChildParams.value;
      if (!content) {
        this.$bus.emit("showTip", 600, "评论不能为空白哦~");
        return;
      }

      post("/moment/comment", {
        publisherId: moment.publisherInfo.publisherNumber,
        momentId: moment.momentid,
        viewerId: this.$store.state.userInfo.accountNumber,
        content,
        time: timeStamp,
      })
        .then((result) => {
          moment.commentNumber += 1;
          moment.commentSet.unshift({
            viewerInfo: {
              viewerName: this.$store.state.userInfo.nickName,
              viewerAccount: this.$store.state.userInfo.accountNumber,
              viewerHeadphoto: this.$store.state.userInfo.headPhoto,
            },
            commentContent: content,
            commentTime: timeStamp,
            subComments: [
              // 目前不做子评论功能
              {
                viewerInfo: {
                  viewereName: "fake1 子评论人昵称",
                  viewereAccount: "fake1 子评论人账号",
                  viewereHeadPhoto: "fake1 子评论人头像",
                },
                commentContent: "fake1 评论内容",
                commentTime: "fake1 123456798",
              },
            ],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    imgLoad(pics, cur_index) {
      if (pics.length - 1 == cur_index) this.$refs.main_scroll.refresh();
    },
  },
  async created() {
    const momentid = this.$route.params.momentid;
    const userid = this.$route.params.userid;
    console.log("moment page momentid" + momentid);
    console.log("moment page userid" + userid);
    request({
      url: "/moments",
      method: "get",
      headers: {
        "content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      params: {
        momentid: momentid,
        userid: userid,
      },
    })
      .then((res) => {
        this.response = res;
        console.log(this.response);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  mounted() {
    // 移除 tabbar 的 style="display: none" 避免从 sharepage 回到主页时，tabbar display none
    this.$parent.$refs.tab_bar.removeAttribute("style");
  },
};
</script>

<style lang="less" scoped>
.moment-page {
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
          z-index: 100;
        }

        .like {
          position: absolute;
          top: 770px;
          left: 630px;
          z-index: 100;
        }

        .comment {
          position: absolute;
          top: 910px;
          left: 630px;
          z-index: 100;
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
        .contentpanel {
          position: absolute;
          bottom: 88px;
          width: 750px;
          padding-left: 20px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 8px 8px 0 0;
          z-index: 10;

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
              display: inline-block;
              width: 750px;
              height: 1158px;
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
