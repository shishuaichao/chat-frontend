// src/store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 1,
    isInBack: false,
    prePageInfo: {},
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    },
    setIsInBack (state, isInBack) {
      state.isInBack = isInBack
    },
    setPrePageInfo (state, prePageInfo) {
      state.prePageInfo = prePageInfo
    },
  }
})