import Vue from 'vue'
import Vuex from 'vuex'

import env from '@/.env'

Vue.use(Vuex)

const types = {
  SET_TITLE: 'SET_TITLE'
}

export default new Vuex.Store({
  state: {
    token: undefined,
    title: undefined
  },
  getters: {
    getToken: state => {
      return state.token
    }
  },
  mutations: {
    setToken (state, newToken) {
      localStorage.setItem(env.AUTH_TOKEN, newToken)
      state.token = localStorage.getItem(env.AUTH_TOKEN)
    },
    [types.SET_TITLE] (state, { title }) {
      state.title = title
    }
  },
  actions: {
    refreshToken (context, payload) {
      context.commit('setToken', payload)
    },
    setTitle: ({ commit }, payload) => {
      commit(types.SET_TITLE, payload)
    }
  },
  modules: {
  }
})
