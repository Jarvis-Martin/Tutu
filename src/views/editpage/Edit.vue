<template>
  <div class="edit-page" v-if="response">
    <div id="nav-bar">
      <navigation-bar :bg_color="'rgba(255, 255, 255, 0)'">
        <img :src="back_icon" alt="" slot="nav-left" @click="back">
        <!-- 添加了css 样式:  color: black -->
        <div slot="nav-right" @click="saveChange" ref="save_text" v-show="!isSaveSuccess" style="color: black" >保存</div>
        <img :src="nav_right_icon" alt="" slot="nav-right" v-show="isSaveSuccess">
      </navigation-bar>
    </div>
    <div class="bg-pic" ref="bg_pic">
      <img :src="response.data.bgImage" alt="" ref="img_bg" />
    </div>
    <input type="file" ref="bg_pic" 
           accept="image/jpeg,image/png,image/gif" 
           class="select-bgimg" name="bgpic" 
           @change="changePic($event, 'bg_pic')">

    <canvas class="bgpic-canvas" ref="bgpicCanvas" style="z-index: -100" width="750" height="408"></canvas>

    <div class="headPhoto">
      <head-photo ref="head_pic">
        <img  ref="img_headphoto" :src="response.data.headphoto" alt="" />
      </head-photo>
    </div>
    <input type="file" ref="headphoto" 
           accept="image/jpeg,image/png,image/gif" 
           class="select-headphoto" name="headphoto"  
           @change="changePic($event, 'head_pic')">

    <canvas class="headphoto-canvas" ref="HeadPhotoCanvas" style="z-index: -100" width="140" height="140"></canvas>

    <div class="tip">点击头像 / 背景图 区域可以进行修改</div>
    <div class="useid-container">
      <div class="userid-tip">账号</div>
      <div class="userid">{{ response.data.accountNumber }}</div>
    </div>
    <div class="usernickname-container">
      <div class="usernickname-tip">昵称</div>
      <input class="usernickname" v-model="nickName" :placeholder="response.data.nickName" />
    </div>
    <div class="usergender-container">
      <div class="usergender-tip">性别</div>
      <input class="usergender" v-model="gender" :placeholder="response.data.gender" />
    </div>
    <div class="userintroduce-container">
      <div class="userintroduce-tip">个性签名</div>
      <textarea class="userintroduce" v-model="self_introduction" :placeholder="response.data.self_introduction" ></textarea>
    </div>
    <div class="userhobbies-label-container">
      <div class="userhobbies-label-tip">兴趣标签</div>
      <div class="userhobbies-label-tip2" >点击添加标签</div>
      <div class="userhobbies-label">
        <label class="label" :for="key" 
                             :class="{ selected: isSelected(key, index) }"  
                             v-for="(item, key) in this.hobbies_labels" :key="key">
          <input type="checkbox" 
                 name="hobbies" 
                 v-model="hobbies" 
                 :id="key" 
                 :value="hobbies_labels[key]" 
                 @change.stop="select" 
                 :placeholder='item' />
          <div class="text">{{ item }}</div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '_network/network'
import NavigationBar from '_components/common/NavigationBar'
import HeadPhoto from '../profile/HeadPhoto'

export default {
  name: "Edit",
  components: {
    NavigationBar,
    HeadPhoto
  },
  data() {
    return {
      back_icon: require('../../../src/assets/img/common/return.png'),
      nav_right_icon: require('../../../src/assets/img/common/liked.png'),
      // isSaveSuccess 是否保持成功， 成功后显示未true，表示显示 勾号图片，提示用户保持成功
      isSaveSuccess: false,
      response: '',
      hobbies: [],
      nickName: '',
      gender: '',
      self_introduction: '',
      
      hobbies_labels: {
        'game': '游戏',
        'scenery': '风景',
        'life': '生活',
        'food': '美食',
        'sport': '运动',
        'idol': '名星',
        'superCar': '超跑',
        'scienceAndTechnology': '科技',
        'militaryScience': '军事',
        'animal': '动物',
        'sing': '嗨唱',
        'dance': '跳舞',
        'article': '美文',
        'fashion': '时尚',
        'wallpaper': '壁纸',
      }
    }
  },
  computed: {
    isSelected() {
      return (key, index) => {
        // 不等于 -1 说明 用户已有 对应标签
        return this.response.data.hobbies.indexOf(this.hobbies_labels[key]) != -1
      }
    }
  },
  methods: {
    saveChange() {
      console.log('edit click save btn')
      let bg_pic = this.$refs.bg_pic.files[0]
      let headphoto = this.$refs.headphoto.files[0]
      // const headphoto = this.$refs.headphoto.files[0]
// 为 ’‘ 说明 用户没有改信息， 所有使用原先的 data数据


      if (!bg_pic) { // 如果 bg_pic为undefined，就手动读取
        const bgpicCanvas =  this.$refs.bgpicCanvas
        const ctx = bgpicCanvas.getContext('2d')
        ctx.drawImage(this.$refs.img_bg, 0, 0, 750, 408)
        bg_pic = bgpicCanvas.toDataURL('image/png')
      }
      if (!headphoto) { // 如果 bg_pic为undefined，就手动读取
        const headPicCanvas =  this.$refs.HeadPhotoCanvas
        const ctx = headPicCanvas.getContext('2d')
        ctx.drawImage(this.$refs.img_headphoto, 0, 0, 140, 140)
        headphoto = headPicCanvas.toDataURL('image/png')
      }

      this.nickName = (this.nickName === '') ? this.response.data.nickName : this.nickName
      this.gender = (this.gender === '') ? this.response.data.gender : this.gender
      this.self_introduction = (this.self_introduction === '') ? this.response.data.self_introduction : this.self_introduction

      const formData = new FormData()
      formData.append('userid', this.$store.state.userInfo.accountNumber)

      formData.append('userNickname', this.nickName)
      formData.append('gender', this.gender)
      formData.append('self_Introduction', this.self_introduction)
      formData.append('bgPic', bg_pic)
      formData.append('headphoto', headphoto)
      for (let it = 0; it < this.hobbies.length; it++) {
        formData.append('hobbies', this.hobbies[it])
      }
      request({
        url: '/user/edit',
        method: 'post',
        headers:{
          'Content-Type': 'multipart/form-data',
        },
        data: formData
      }).then(async (result) => {
        this.$refs.save_text.setAttribute('style', 'display: none')
        this.$store.commit('changeNickName', this.response.data.nickName)
        this.$store.commit('changeGender', this.response.data.gender)
        this.$store.commit('changeintroduction', this.response.data.self_Introduction)
        this.$store.commit('chanchangeHobbiesgeintroduction', this.hobbies)
        await setTimeout(() => {
          this.isSaveSuccess = !this.isSaveSuccess
        }, 300);
        await setTimeout(() => {
          this.$router.replace('/profile')
        }, 800);
      }).catch((err) => {
        console.log(err)
      });
    },
    back() {
      this.$router.back()
    },
    select(event) {
      console.log('select a label')
      if (this.hobbies.length > 12) {
        this.hobbies.splice(this.hobbies.length - 1, 1)
        console.log(this.hobbies)
        return
      }
      if (!event.target.checked) {
        console.log(event.srcElement.parentElement)
        event.srcElement.parentElement.setAttribute('class', 'label')
      } else {
        console.log(event.srcElement.parentElement)
        event.srcElement.parentElement.setAttribute('class', 'selected')
      }
    },
    changePic(event, str_ref) {
      // str_ref 待修改的 img 的 ref 字符串
      let file = event.srcElement.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        if (this.$refs[str_ref]._isVue) {
          console.log(this.$refs[str_ref].$el.children[0]);
          this.$refs[str_ref].$el.children[0].src = reader.result
        } else {
          console.log(this.$refs)
          console.log(this.$refs[str_ref].previousSibling.childNodes[0].src);
          this.$refs[str_ref].previousSibling.childNodes[0].src = reader.result
        }
      }
    }
  },
  created() {
    this.response = this.$route.params.response
    console.log('edit response')
    console.log(this.response)
  },
  mounted() {
    this.$parent.$refs.tab_bar.setAttribute('style', 'display: none');
    this.hobbies = this.response.data.hobbies
  },
}
</script>

<style lang="less">
.edit-page {
  width: 750px;
  height: 7334px;
  position: fixed; 
  // background-color: rgb(254, 221, 120);
  background-color: rgba(230, 230, 230, 0.4);
  
  #nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .bgpic-canvas {
    opacity: 0;
    display: none;
  }
  .headphoto-canvas {
    opacity: 0;
    display: none;
  }

  .bg-pic {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 750px;
    height: 408px;
    opacity: 0.9;
    border-bottom: 1px solid rgba(255, 255, 255, 1);
    overflow: hidden;

    * {
      position: absolute;
      bottom: 0;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0);
      width: inherit;
      height: auto;
    }
  }
  .select-bgimg {
    position: absolute;
    left: 0px;
    top: 88px;
    width: 750px;
    height: 320px;
    opacity: 0;
  }
  .headPhoto {
    position: absolute;
    left: 20px;
    top: 284px;
    width: 140px;
    height: 140px;
    // border-radius: 80px;
    border-radius: 50%;
    z-index: 100;
    border: 2px solid white;
    overflow: hidden;

    * {
      position: absolute;
      top: 50%;
      left: 50%;
      width: inherit;
      height: auto;
      transform: translate(-50%, -50%);
    }
  }
  .select-headphoto {
    position: absolute;
    left: 20px;
    top: 284px;
    width: 140px;
    height: 140px;
    border-radius: 80px;
    opacity: 0;
    z-index: 1000;
  }
  .tip {
    position: absolute;
    left: 24px;
    top: 408px;
    width: 710px;
    height: 40px;
    line-height: 35px;
    color: rgba(16, 16, 16, 100);
    font-size: 24px;
    text-align: center;
  }
  .useid-container{
    width: 750px;
    height: 80px;
    position: absolute;
    top: 448px;
    display: flex;

    .userid-tip {
      position: absolute;
      left: 20px;
      width: 140px;
      height: inherit;
      line-height: 80px;
      color: rgba(16, 16, 16, 100);
      font-size: 30px;
      text-align: center;
    }
    .userid {
      position: absolute;
      left: 160px;
      width: 570px;
      height: inherit;
      line-height: 80px;
      color: rgba(16, 16, 16, 100);
      font-size: 30px;
      text-align: left;
      padding-left: 10px;
    }
  }
  .usernickname-container{
    width: 750px;
    height: 80px;
    position: absolute;
    top: 528px;
    display: flex;

    .usernickname-tip {
      position: absolute;
      left: 20px;
      width: 140px;
      height: inherit;
      line-height: 80px;
      color: rgba(16, 16, 16, 100);
      font-size: 30px;
      text-align: center;
    }
    .usernickname {
      position: absolute;
      left: 160px;
      width: 570px;
      height: inherit;
      line-height: 80px;
      color: rgba(16, 16, 16, 100);
      font-size: 30px;
      text-align: left;
      padding-left: 10px;
      border: none;
      background: transparent;
    }
  }
  .usergender-container{
    width: 750px;
    height: 80px;
    position: absolute;
    top: 602px;
    display: flex;

    .usergender-tip {
      position: absolute;
      left: 20px;
      width: 140px;
      height: inherit;
      line-height: 80px;
      color: rgba(16, 16, 16, 100);
      font-size: 30px;
      text-align: center;
    }
    .usergender {
      position: absolute;
      left: 160px;
      width: 570px;
      height: inherit;
      line-height: 80px;
      color: rgba(16, 16, 16, 100);
      font-size: 30px;
      text-align: left;
      padding-left: 10px;
      border: none;
      background: transparent;
    }
  }
  .userintroduce-container {
    height: 328px;
    position: absolute;
    top: 966px;
    left: 20px;

    .userintroduce-tip {
      left: 20px;
      width: 710px;
      height: 80px;
      line-height: 80px;
      color: rgba(16, 16, 16, 100);
      font-size: 30px;
      text-align: left;
      padding-left: 10px;
      padding-right: 10px;
    }
    .userintroduce {
      border-radius: 10px;
      width: 710px;
      height: 248px;
      resize: none;
      line-height: 48px;
      color: rgba(16, 16, 16, 100);
      font-size: 30px;
      text-align: left;
      padding-left: 10px;
      padding-top: 8px;
      padding-right: 10px;
      border: none;
      background-color: rgba(254, 221, 120, 1);
    }
  }
  .userhobbies-label-container {
    height: 280px;
    position: absolute;
    width: 710px;
    top: 677px;
    left: 20px;

    .userhobbies-label-tip {
      position: absolute;
      width: 355px;
      height: 80px;
      line-height: 80px;
      color: rgba(16, 16, 16, 100);
      font-size: 30px;
      text-align: left;
      padding-left: 10px;
      padding-right: 10px;
    }
    .userhobbies-label-tip2 {
      position: absolute;
      right: 0;
      width: 355px;
      height: 80px;
      line-height: 80px;
      color: rgba(16, 16, 16, 100);
      font-size: 26px;
      text-align: right;
      padding-left: 10px;
      padding-right: 10px;
    }
    .userhobbies-label {
      position: absolute;
      width: 710px;
      height: 200px;
      top: 80px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      text-align: center;

      .label {
        position: relative;
        width: 130px;
        height: 60px;
        line-height: 60px;
        font-size: 30px;
        border: 1px solid rgba(255, 255, 255, 0.9);
        border-radius: 12px;

        input {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0, -50%);
          width: 100%;
          height: 100%;
          border: none;
          opacity: 0;
        }
        .text {         
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0, -50%);
          width: 100%;
          height: 100%;
          font-size: 28px;
        }
      }
      .selected {
        // background-color: rgba(255, 255, 255, 0.6);
        position: relative;
        background-color: rgba(254, 221, 120, 0.8);
        width: 130px;
        height: 60px;
        line-height: 60px;
        font-size: 30px;
        border: 1px solid rgba(230, 230, 230, 0.8);
        border-radius: 12px;
        input {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0, -50%);
          width: 100%;
          height: 100%;
          border: none;
          opacity: 0;
        }
        .text {         
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0, -50%);
          width: 100%;
          height: 100%;
          font-size: 28px;
        }
      }
    }
  }
}
</style>