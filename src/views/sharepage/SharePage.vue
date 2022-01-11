<template>
  <div class="share-page">
    <div id="nav-bar">
      <navigation-bar>
        <img :src="back_icon" alt="" slot="nav-left" @click="back">
        <span>分享</span>
      </navigation-bar>
    </div>
    
  <scroll ref="scroll" class="scroll">
    <div class="main">
      <div class="text-prompt">文案输入:</div>
      <textarea name="description" placeholder="请输入您喜欢的文案" class="description" ref="description" />
      <label for="" class="locationquery">
        <div class="locationquery-tip" >是否在发布的动态种包含您当前的位置?</div>
        <input class="radio" type="checkbox" v-model="withLocation" name="publishLocation"  />
        <img src="" alt="" ref="pic">
      </label>
      <label for="selectbgm-file">
        <div class="select-bgm">
          <div class="select-btn"><div>+</div></div>
          <div class="selectbgm-tip" ref="selectbgm_tip" >&lt; 选择配乐</div>
          <input id="selectbgm-file" type="file" class="selectbgm-file" accept="audio/*" @change="getMusic" ref="music">
        </div>
      </label>
      <div class="select-pic">
        <label for="selectpic-file">
          <div class="select-btn"><div>+</div></div>
          <div class="selectpic-tip">&lt; 选择图片</div>
        </label>
          <div class="selectpic-camera" @click="tackPhoto">&lt; 拍照上传</div>
          <input id="selectpic-file" type="file" class="selectpic-file" accept="image/*" multiple @change="getImage(this)" ref="pics">
      </div>
      <scroll class="pre-pic-scroll" ref="prePicScroll" :scrollDirection="'onlyX'">
        <div class="pic-panel" ref="picsPanel" :style="{ 'width': PicsPanelWidth }">
          <div class="pic" v-for="(item, index) in selectedFiles" :key="item" >
            <div class="del-btn">
              <img :src="delete_btn_icon" alt="" @click="deletePrePic(index)">
            </div>
            <preview-pic :pic_URL='item'/>
          </div>
        </div>
      </scroll>  
      <div class="submit" ref="shareBtn" @click="releaseComment">
        分享
      </div>
    </div>
  </scroll>
    <div class="camera-container" @click.stop="'javascript: none'" v-if="isShowCameraPanel">
      <video autoplay id="video" ref="video" :width="deviceWidth" :height="deviceHeight"></video>
      <canvas autoplay id="canvas" ref="canvas" :width="deviceWidth" :height="deviceHeight"></canvas>
      <img src="" alt="" ref="photo" id="photo">
      <div class="control_panel">
        <div class="capture" v-show="isShowCapture">
          <img :src="camera_icon" alt="" ref="capture">
        </div>
        <div class="comfirm" v-if="isShowComfirmAndCancel">
          <img :src="comfirm_icon" alt="" @click.stop="comfirm">
        </div>
        <div class="cancel" v-show="isShowComfirmAndCancel">
          <img :src="cancel_icon" alt="" @click.stop="cancel">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request, post } from '_network/network'
import Scroll from '_components/common/betterscroll/Bscroll'
import NavigationBar from '_components/common/NavigationBar'
import PreviewPic from './PreviewPic'

export default {
  name: "SharePage",
  components: {
    NavigationBar,
    PreviewPic,
    Scroll
  },
  data() {
    return {
      back_icon: require('../../../src/assets/img/common/return.png'),
      delete_btn_icon: require('../../../src/assets/img/common/delete-btn.png'),
      camera_icon: require('../../../src/assets/img/common/camera.png'),
      comfirm_icon: require('../../../src/assets/img/common/comfirm.png'),
      cancel_icon: require('../../../src/assets/img/common/cancel.png'),

      selectedFiles: new Array(),
      withLocation: 'true',
      
      isShowCameraPanel: false,
      isShowComfirmAndCancel: false,
      isShowCapture: false,
      video: this.$refs.video,
      canvas: this.$refs.canvas
    }
  },
  computed: {
    PicsPanelWidth() {
      return `${ Math.ceil((this.selectedFiles.length / 2)) * 170 + 40 }px`
    },
    deviceWidth() {
      return window.innerWidth
    },
    deviceHeight() {
      return window.innerHeight
    },
  },
  methods: {
    comfirm() {
      this.selectedFiles.push(this.$refs.photo.src)
      this.$refs.photo.src = ''
      console.log(this.$refs.photo)
      this.$refs.video.srcObject.getTracks()[0].stop()
      this.isShowCameraPanel = false
      this.isShowComfirmAndCancel = false
      this.isShowCapture = false
    },
    cancel() {
      this.$refs.photo.src = ''
      console.log(this.$refs.photo)
      this.$refs.video.srcObject.getTracks()[0].stop()
      this.isShowCameraPanel = false
      this.isShowComfirmAndCancel = false
      this.isShowCapture = false
    },
    tackPhoto() {
      this.isShowCameraPanel = true
      const constraints = {
        video : {width: 480, height: 320}
        // video : {width: this.deviceWidth, height: this.deviceHeight}
      }
      if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
        //调用用户媒体设备, 访问摄像头
        this.getUserMedia(constraints, this.success, this.error);
      } else {
        alert('您的浏览器不支持访问用户媒体');
      }
    },
    success(stream) {
      let CompatibleURL = window.URL || window.webkitURL;
      //video.src = CompatibleURL.createObjectURL(stream);
      this.stream = stream
      video.srcObject = stream;
      this.$refs.canvas.setAttribute('style', 'opacity: 0')
      video.play();
      this.isShowCameraPanel = true
      this.isShowCapture = true
      this.$refs.capture.addEventListener('click', () => {
        let canvar = this.$refs.canvas
        let video = this.$refs.video

        let ctx = canvas.getContext('2d')
        this.$refs.canvas.removeAttribute('style')
        ctx.drawImage(video, 0, 0, this.deviceWidth, this.deviceHeight)
        // this.stream.getTracks()[0].stop()
        console.log(canvas.toDataURL('image/png'))
        this.$refs.photo.src = canvas.toDataURL('image/png')
        console.log(this.$refs.photo)
        this.isShowCapture = false
        this.isShowComfirmAndCancel = true
      })
    },
    error(error) {
      console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
    },
    getUserMedia(constraints, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints,success, error)
      } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
      }
    },
    deletePrePic(index) {
      console.log(`del ${ index }`)
      this.selectedFiles.splice(index, 1)
      this.$refs.picsPanel.setAttribute('style', `width: ${ Math.ceil((this.selectedFiles.length / 2)) * 170 + 40 }px`)
      this.$refs.prePicScroll.refresh()
    },
    releaseComment() {
      const description = this.$refs.description.value;
      const location = {
        'provience': '',
        'city': '',
      }
      if (this.withLocation) {
        location.provience = returnCitySN['cname']
      }
      const bgMusic = this.$refs.music.files[0]
      const pics = this.$refs.pics.files
      let formData = new FormData()
      formData.append('publisherId', this.$store.state.userInfo.accountNumber)
      formData.append('description', description)
      let timestamp = new Date().getTime()
      formData.append('releaseTime', timestamp)
      formData.append('publishLocation.provience', location.provience)
      formData.append('publishLocation.city', location.city)
      formData.append('bgMusic', bgMusic)
      console.log(this.selectedFiles)
      for (let it = 0; it < pics.length; it++) {
        formData.append(`pictures.${ it }`, pics[it])
      }

      if (this.selectedFiles.length <= 0) {
        this.$bus.emit('showTip', 600, '一定要选择图片哦！')
        return
      }

      request({
        url: '/upload',
        headers:{
          'Content-Type': 'multipart/form-data',
        },
        method: 'post',
        data: formData
      }).then((result) => {
        // 发表成功后，记得加入到 profile 的数据 内，
        this.$store.commit('addMoment', result)
        this.$refs.shareBtn.innerHTML = '分享成功'
        this.$refs.shareBtn.setAttribute('style', "color: red")
        setTimeout(() => {
          this.$router.back()
        }, 400);
      }).catch((err) => {
        console.log(err)
      });

    },
    back() {
      this.$router.back()
    },
    getImage() {
      let files = this.$refs.pics.files
      for (let it = 0; it < files.length; it++) {
        let reader = new FileReader()
        reader.readAsDataURL(files[it])
        reader.onloadend = e => {
          let url = reader.result
          this.selectedFiles.push(url)
          if (it === (files.length - 1)) {
            this.$refs.prePicScroll.refresh()
            console.log('refresh data')
          }
        }
      }
    },
    getMusic() {
      let music = this.$refs.music.files[0]
      this.$refs.selectbgm_tip.innerHTML = music.name
    }
  },
  mounted() {
    this.$parent.$refs.tab_bar.setAttribute('style', 'display: none');
  },
}
</script>

<style lang="less">
.share-page {
  width: 750px;
  height: 1334px;
  background-color: rgb(248, 248, 248, 1);

  #nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .scroll {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .main {
      position: absolute;
      top: 88px;
      left: 0;
      right: 0;
      bottom: 0;

      .text-prompt {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 710px;
        height: 44px;
        font-size: 30px;
        margin-bottom: 10px;
      }
      .description {
        position: absolute;
        top: 74px;
        left: 20px;
        width: 710px;
        height: 132px;
        font-size: 28px;
        line-height: 41px;
        margin-bottom: 20px;
        padding: 2px;
        resize: none;
        padding: 8px;
        // background-color: rgba(255, 255, 255, 0.8);
        background-color: rgba(254, 221, 120, 1);
        border: 2px solid white;
        border-radius: 8px;
      }
      .locationquery {
        position: absolute;
        top: 226px;
        left: 20px;
        width: 710px;
        height: 44px;
        font-size: 26px;

        .locationquery-tip {
          position: absolute;
          width: 496px;
          height: 44px;
          font-size: 26px;
          line-height: 44px;
        }
        .radio {
          width: 26px;
          height: 26px;
          position: absolute;
          left: 520px;
          border-radius: 4px;
          top: 50%;
          transform: translate(0, -50%);
          border: 1px solid white;
        }
      }
      .select-bgm, .select-pic {
        width: 710px;
        height: 60px;
        position: absolute;
        left: 20px;
        
        .select-btn, .selectbgm-file, .selectpic-file {
          position: absolute;
          left: 2px;
          width: 60px;
          height: 60px;
          border: 2px solid white;
          border-radius: 10px;
          text-align: center;
          font-size: 36px;
          font-weight: 1000;
          background-color: rgba(254, 221, 120, 1);

          div {
            line-height: 60px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        
        .selectbgm-file, .selectpic-file {
          opacity: 0;
        }
        .selectbgm-tip, .selectpic-tip {
          position: absolute;
          left: 80px;
          height: 60px;
          font-size: 30px;
          line-height: 60px;
        }
        .selectpic-camera {
          position: absolute;
          height: 60px;
          right: 0;
          font-size: 28px;
          line-height: 60px;
          text-align: right;
        }
      }
      .select-bgm {
        top: 290px;
      }
      .select-pic {
        top: 393px;
      }
      .pre-pic-scroll {
        overflow: hidden;
        position: absolute;
        top: 472px;
        left: 20px;
        right: 20px;
        height: 646px;
        background-color: rgba(254, 221, 120, 1);
      }
      .pic-panel {
        position: absolute;
        // width: 710px;
        height: 646px;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        min-width: 710px;
        min-height: 646px;
        // top: 472px;
        // left: 20px;

        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        padding: 20px 8px 20px 18px;
        border-radius: 8px;

        .pic {
          position: relative;
          background-color: rgba(230, 230, 230, 0.9);
          height: 294px;
          width: 160px;
          border: 2px solid white;
          border-radius: 8px;
          margin-right: 10px;

          * {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 156px;
            height: inherit;
          }
          .del-btn {
            position: absolute;
            top: 18px;
            left: 138px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            z-index: 5;

            * {
              position: absolute;
              top: 50%;
              height: 50%;
              width: 34px;
              height: 34px;
              transform: translate(-50%, -50%);
              opacity: 0.7;
            }
          }
        }
      }
      .submit {
        position: absolute;
        top: 1146px;
        left: 50%;
        transform: translate(-50%, 0);
        width: 160px;
        height: 60px;
        text-align: center;
        font-size: 30px;
        line-height: 60px;
        border: 1px solid white;
        border-radius: 8px;
        opacity: 0.6;
        background-color: white;
      }
    }
  }
  .camera-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(16, 16,16);

    #video{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
     #canvas {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
     }
     #photo {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       width: 100%;
       height: auto;
     }
    .control_panel {
      position: absolute;
      // background-color: rgba(0, 0, 0, 0.2);
      width: 750px;
      height: 260px;
      bottom: 0px;

      .capture {
        position: absolute;
        width: 160px;
        height: 160px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: radial-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
        z-index: 10000;

        img {
          position: absolute;
          width: 100px;
          height: 100px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }
      }
      .comfirm, .cancel {
        position: absolute;
        bottom: 10px;
        width: 100px;
        height: 100px;
        background: radial-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
        border-radius: 50%;
        overflow: hidden;
        z-index: 10000;

        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
        }
      }
      .cancel {
        left: 200px;
      }
      .comfirm {
        right: 200px;
      }
    }
  }
}


</style>