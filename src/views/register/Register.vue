<template>
  <div class="register">
    <div class="main">
      <img :src="bg_icon" @click.prevent="'javascript:none'" alt="" class="bg-img" >
      <div id="nav-bar">
        <navigation-bar>
          <img :src="back_icon" alt="" slot="nav-left" @click="back">
          <span>注册</span>
        </navigation-bar>
      </div>

      <div class="form-panel">
        <input-panel>
          <div slot="username-tip">账号：</div>
          <input type="text" name="username" v-model="userid" placeholder="请输入账号 / 推荐使用手机号" slot="username" ref="nickName">
          <div slot="password-tip">密码：</div>
          <input type="password" name="password" placeholder="请输入您的密码" slot="password" ref="password">

          <div slot="button" ref="submit" @click="register">注册</div>
          <div slot="options" @click="toLogin">-&gt; 登录 &lt;-</div>
        </input-panel>
      </div>
      <div class="tip" ref="tip"></div>
    </div>

  </div>
</template>

<script>
import { request, post } from '_network/network'
import NavigationBar from '_components/common/NavigationBar'
import InputPanel from '_components/content/InputPanel'

export default {
  name: "Register",
  components: {
    InputPanel,
    NavigationBar
  },
  methods: {
    back() {
      this.$router.back()
    },
    toLogin() {
      let userid = this.userid
      console.log(userid)
      // this.$router.replace('/login', userid)
      this.$router.replace({
        name: 'Login',
        params: {
          userId: userid
        }
      })
    },
    register() {
      const nickName = this.$refs.nickName.value
      const password = this.$refs.password.value
      if (!nickName || !password) {
        this.$refs.tip.innerHTML = '昵称 或 密码不能为空！'
        return
      }
      this.$refs.tip.innerHTML = ''
      post('/register', {
        nickName,
        password
      }).then((result) => {
        console.log('-------register result')
        console.log(result)
        if (result.meta.status.toString() === "200" && result.meta.msg === '该用户已存在') {
          this.$refs.tip.innerHTML = '该用户名已存在<br />请您重试'
          return
        }
        if (result.meta.status.toString() === "200" && result.meta.msg === '注册成功') {
          this.$refs.tip.innerHTML = '注册成功！<br><a>-&gt; 点击前往登录 &lt;-</a>'
          this.$refs.tip.addEventListener('click', () => {
            this.$router.replace({
              name: 'Login',
              params: {
                userId: result.data.accountNumber
              }
            })
          })
        }
      }).catch((err) => {
        console.log(err)
      });
    }
  },
  data() {
    return {
      bg_icon: require('../../../src/assets/img/register/register-bg.gif'),
      back_icon: require('../../../src/assets/img/common/return.png'),
      userid: ''
    }
  },
  mounted() {
    this.$parent.$refs.tab_bar.setAttribute('style', 'display: none');
    this.$parent.$refs.comfirmView.setAttribute('style', 'display: none')
    this.$parent.$refs.comfirmViewMask.setAttribute('style', 'display: none')
  },
}
</script>

<style lang="less">
.register {
  width: 750px;
  height: 1334px;
  #nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .bg-img {
    position: absolute;
    top: 0;
    width: 750px;
    height: 1334px;
  }
  .main {
    position: fixed;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;

    .form-panel {
      position: absolute;
      left: 50%;
      top: 380px;
      transform: translate(-50%, 0);
      width: 557px;
      height: 410px;
      border-radius: 12px;
      background-color: rgba(255, 255, 255, 0.2);
      text-align: center;
      box-shadow: 0px 4px 6px 0px rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.8);
    }
    .tip {
      position: absolute;
      z-index: 1000;
      top: 840px;
      left: 0;
      width: 750px;
      text-align: center;
      font-size: 30px;
      color: red;
      line-height: 44px;
    }
  }

}

</style>