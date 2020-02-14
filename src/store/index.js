import Vue from 'vue'
import Vuex from 'vuex'

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
  modules: {}
})
