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

    fullscreen: false, //是否满屏

    playlist: [], //当前播放歌曲列表

    playlist2: [], //播放歌曲列表，用来存放原来的歌曲列表

    sequenceList: [],

    playMode: null,

    currentIndex: -1,

    favlist: [], //我喜欢的歌
    favAlbumlist: [], //我喜欢的专辑，歌单
    playStatus: "normal", //当前播放状态，顺序，单曲，随机
    playStatusList: ["normal", "loop", "random"], //列表循环，单曲循环，随机播放
    curSingerPic:null

  },
  mutations,
  actions,
  modules: {},
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})
