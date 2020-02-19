/*list.js集合了一些列表,电台类api*/
import {
  request
} from "@/api/axios";

/*获取音乐歌词*/
let getLyric = function (id) {
  return request.get("lrc", {
    id
  })
};


export const lyricApi = {
  getLyric
}
