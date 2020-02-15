import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

import {
  mutations
} from "@/store/mutations";
import {
  actions
} from "@/store/actions"

export default new Vuex.Store({
  state: {
    hotMvList: null,

    hotSongList: null,

    playingStatus: false,

    fullscreen: false,

    playlist: [],

    sequenceList: [],

    playMode: null,

    currentIndex: -1,

    favlist: [],
  },
  mutations,
  actions,
  modules: {},
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})
