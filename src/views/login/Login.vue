<template>
  <div class="login">
    <div class="main">
      <img :src="bg_icon" @click.prevent="'javascript:none'" alt="" class="bg-img" >
      <div id="nav-bar">
        <navigation-bar>
          <img :src="back_icon" alt="" slot="nav-left" @click="back">
          <span>登录</span>
        </navigation-bar>
      </div>

      <div class="form-panel">
        <input-panel>
          <div slot="username-tip">账号：</div>
          <input type="number" autofocus placeholder="请输入您的账号" name="username" slot="username" ref="username">
          <div slot="password-tip">密码：</div>
          <input type="password" placeholder="请输入您的密码" name="password" slot="password" ref="password">
          <div slot="button" ref="submit" @click="login">登录</div>
          <div slot="options">
            <div class="reset_password"><a href="#">忘记密码</a></div>
            <div class="register_now"  @click="toRegister">立即注册</div>
          </div>
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
  name: "Login",
  components: {
    InputPanel,
    NavigationBar
  },
  methods: {
    back() {
      if (this.$route.params.originalPage) {
        this.$router.replace(this.$route.params.originalPage)
      } else {
        this.$router.go(-1)
      }
    },
    toRegister() {
      this.$router.push('/register')
    },
    login() {
      if (this.$store.state.isLogined) {
        this.$refs.tip.innerHTML = '您当前已登录'
        return
      }
      const username = this.$refs.username.value
      const password = this.$refs.password.value
      if (!username || !password) {
        this.$refs.tip.innerHTML = '用户名 或 密码不能为空！'
        return
      }
      this.$refs.tip.innerHTML = ''
      post('/login', {
        username,
        password,
      }).then((result) => {
        console.log('-------login result')
        console.log(result)
        console.log(' login success userinfo')
        console.log(this.$store.state)
        if (result.meta.status.toString() === "200" && result.meta.msg === '登陆成功') {
          this.$store.dispatch({
            type: "logIn",
            userInfo: result.data
          })
          this.$refs.tip.innerHTML = '登录成功！<br />将为您跳转回上一页'

          // 记录上一页面的 偏移量。如果 带有 userid 说明，是刚注册，需要设置为 -2
          // 否则，说明是正常登录， 设置为 -1
          let target_page_bias = -1;
          if (this.$route.params.userId) {
            this.$refs.username.value = this.$route.params.userId
            target_page_bias = -2
          }
          setTimeout(() => {
            this.$router.go(target_page_bias)
          }, 800);
        } else {
          console.log('登录失败')
          this.$refs.tip.innerHTML = '用户名 或 密码错误<br>请重试'
          this.$refs.password.value = ''
        }
      }).catch((err) => {
        console.log(err)
      });
    }
  },
  data() {
    return {
      bg_icon: require('../../../src/assets/img/login/login-bg.gif'),
      back_icon: require('../../../src/assets/img/common/return.png'),
    }
  },
  mounted() {
    this.$parent.$refs.tab_bar.setAttribute('style', 'display: none');
    if (this.$parent.$refs.comfirmView) {
      this.$parent.$refs.comfirmView.setAttribute('style', 'display: none')
      this.$parent.$refs.comfirmViewMask.setAttribute('style', 'display: none')
    }
    
    console.log('login mounted  ' + this.$route.params.userId)
    if (this.$route.params.userId) {
      this.$refs.username.value = this.$route.params.userId
    }
  },
}
</script>

<style lang="less">
.login {
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