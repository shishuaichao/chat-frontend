// src/store/modules/msgModule.js 消息模块
export default {
  namespaced: true, // 开启命名空间，必须！
  state: {
    unreadMsgCount: 0, // 模块内私有未读数
    isInBack: false, // 模块内私有是否在后台
  },
  mutations: {
    UPDATE_UNREAD_COUNT(state, count) {
      state.unreadMsgCount = count
    },
    SET_CURRENT_CHAT_ID(state, chatId) {
      state.currentChatId = chatId
    },
    SET_IS_IN_BACK(state, isInBack) {
      state.isInBack = isInBack
    }
  },
  actions: {
    async getUnreadMsgCount({ commit }) {
      const count = 5
      commit('UPDATE_UNREAD_COUNT', count)
      return count
    },
    setIsInBack({ commit }, isInBack) {
      commit('SET_IS_IN_BACK', isInBack)
    }
  },
  getters: {
    validChatId: (state) => state.currentChatId || ''
  }
}