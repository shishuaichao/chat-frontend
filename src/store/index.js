// src/store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 1,
    isInBack: false,
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    },
    setIsInBack (state, isInBack) {
      state.isInBack = isInBack
    }
  }
})