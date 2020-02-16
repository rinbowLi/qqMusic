import {
  type
} from "@/store/mutations";


export const actions = {
  startPlayingMusic({commit}, {list,index}) {
    commit(type.SET_FULL_SCREEN, true);
    commit(type.SET_PLAYLIST, list);
    commit(type.SET_PLAYING_STATUS, true);
    commit(type.SET_CURRENT_INDEX, index);
    commit(type.Set_Play_Status,"normal")
  }
}
