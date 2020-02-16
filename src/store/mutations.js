export const type = {
  SET_FULL_SCREEN: "SET_FULL_SCREEN",
  SET_PLAYING_STATUS: "SET_PLAYING_STATUS",
  SET_PLAYLIST: "SET_PLAYLIST",
  SET_CURRENT_INDEX: "SET_CURRENT_INDEX",
  DeL_CURRENT_INDEX: "DeL_CURRENT_INDEX",
  Change_Play_Status: "Change_Play_Status", //切换播放模式
  Set_Play_Status: "Set_Play_Status" //切换播放模式
};


export const mutations = {
  [type.SET_FULL_SCREEN](state, flag) {
    state.fullscreen = flag;
  },
  [type.SET_PLAYING_STATUS](state, flag) {
    state.playingStatus = flag;
  },
  [type.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [type.SET_CURRENT_INDEX](state, index) {
    if (index > state.playlist.length - 1) {
      state.currentIndex = 0;
      return
    }
    if (index < 0) {
      state.currentIndex = state.playlist.length - 1;
      return;
    }
    state.currentIndex = index
  },
  [type.DeL_CURRENT_INDEX](state, index) {
    state.playlist.splice(index, 1);
  },
  [type.Change_Play_Status](state, player) {
    //当前播放状态所处的index
    let currentIndex = state.playStatusList.findIndex(
      status => status === state.playStatus
    );
    if (currentIndex === 2) {
      state.playStatus = "normal";
      let curSong = state.playlist[state.currentIndex].id; //保存原歌曲以便设置curIndex
      state.playlist = state.playlist2.slice(0);
      let newCurIndex = state.playlist.findIndex(item => item.id === curSong);
      state.currentIndex = newCurIndex;
    } else if (currentIndex === 0) {
      state.playStatus = "loop";
    } else {
      state.playStatus = "random";
      let curSong1 = state.playlist[state.currentIndex].id; //保存原歌曲以便设置curIndex
      state.playlist2 = state.playlist.slice(0); //先存放原歌曲列表
      getArrRandomly(state.playlist); //打乱歌曲列表
      let newCurIndex1 = state.playlist.findIndex(item => item.id === curSong1);
      state.currentIndex = newCurIndex1;
    }
  },
  [type.Set_Play_Status](state, status) {
    state.playStatus = status
  }
};


//随机打乱数组
function getArrRandomly(arr) {
  let len = arr.length;
  //首先从最大的数开始遍历，之后递减
  for (let i = len - 1; i >= 0; i--) {
    //随机索引值randomIndex是从0-arr.length中随机抽取的
    let randomIndex = Math.floor(Math.random() * (i + 1));
    //下面三句相当于把从数组中随机抽取到的值与当前遍历的值互换位置
    let itemIndex = arr[randomIndex];
    arr[randomIndex] = arr[i];
    arr[i] = itemIndex;
  }
  //每一次的遍历都相当于把从数组中随机抽取（不重复）的一个元素放到数组的最后面（索引顺序为：len-1,len-2,len-3......0）
  return arr;
}
