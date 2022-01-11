import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogined: false,
    userInfo: {}
  },
  mutations: {
    updateMoments(state, newMoments) {
      state.userInfo.moments = newMoments
    },
    assignInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    changeLoginState(state) {
      state.isLogined = !state.isLogined
    },
    // 发布动态后，通过该方法提交
    addMoment(state, moment) {
      state.userInfo.likedUserId.unshift(moment)
    },
    // 添加到关注列表中去
    addToLiked(state, userId) {
      state.userInfo.likedUserId.unshift(userId)
    },
    changeNickName(state, newValue) {
      state.userInfo.nickName = newValue
    },
    changeGender(state, newValue) {
      state.userInfo.gender = newValue
    },
    changeintroduction(state, newValue) {
      state.userInfo.self_introduction = newValue
    },
    changeHobbies(state, newValue) {
      state.userInfo.hobbies = newValue
    },
    emptyUserInfo(state) {
      state.userInfo = {}
    },
    cancelFollow(state, userId) {
      const index = state.userInfo.likedUserId.indexOf(userId)
      state.userInfo.likedUserId.splice(index, 1)
    },
    add2LikedMomenIds(state, momentid) {
      state.userInfo.likedMomentIds.push(momentid)
    },
    removeFromLikedMomenIds(state, momentid) {
      state.userInfo.likedMomentIds.splice(state.userInfo.likedMomentIds.indexOf(momentid), 1)
    }
  },
  actions: {
    logIn(context, { userInfo}) {
      console.log(userInfo)
      context.commit('changeLoginState')
      context.commit('assignInfo', userInfo)
      console.log(context)
    },
    logOut(context) {
      context.commit('emptyUserInfo')
    },
  },
  modules: {
  }
})
