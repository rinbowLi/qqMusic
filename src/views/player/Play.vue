<template>
  <div id="player" @touchmove.stop v-show="$store.state.playlist.length>0">
    <div id="miniPlayer" v-show="!$store.state.fullscreen">
      <StaticProgressBar
        :percent="percent"
        @percentChange="percentChange"
        @percentChangeEnd="percentChangeEnd"
        class="staticProgressBar"
      />
      <div class="left" @click="setFullScreen(true)">
        <img v-if="player" v-lazy="songPic" :class="{active: !player.paused}" alt />
      </div>
      <div class="center nowrap" v-if="songInfo" @click="setFullScreen(true)">
        <div class="name">{{songInfo.title}}</div>
        <div class="singer">{{songInfo.singer[0].name}}</div>
      </div>
      <div class="right" v-if="player">
        <i class="iconfont icon-zanting active" v-if="player.paused" @click="changeStatus(true)"></i>
        <i class="iconfont icon-bofang" v-else @click="changeStatus(false)"></i>
        <i class="iconfont icon-list" @click="showList=!showList"></i>
      </div>
    </div>
    <div id="pagePlayer" v-show="$store.state.fullscreen">
      <div class="background">
        <div class="back"></div>
        <img v-lazy="songPic" alt v-if="songPic" />
      </div>
      <div class="top">
        <div class="navWrapper clear">
          <div class="back" @click="backClick">
            <i class="iconfont icon-xiangxia" />
          </div>
          <div class="nav">
            <span v-if="songInfo" class="first-marquee">{{songInfo.title}}</span>
            <span v-if="songInfo" class="second-marquee">{{songInfo.title}}</span>
          </div>
        </div>
      </div>
      <div class="center" v-show="!showLyric">
        <img v-lazy="songPic" alt v-if="songPic" @click="showLyric=!showLyric" />
        <div class="infos" v-if="songInfo">
          <div class="left">
            <div class="name">
              {{songInfo.title}}
              <span class="mv" v-if="songInfo.mv.id!==0" @click="goMv">MV</span>
            </div>
            <div class="singer" @click="gotoSinger">{{songInfo.singer[0].name}}</div>
            <div class="album">
              <span>专辑:</span>
              {{songInfo.album.name}}
            </div>
            <div class="timePublic">
              <span>发行:</span>
              {{songInfo.time_public}}
            </div>
          </div>
          <div class="right">
            <i @click="addToFavList()" v-if="!isFav" class="iconfont icon-aixin" />
            <i @click="removeToFavList()" v-else class="iconfont icon-aixin1" />
            <a v-if="src&&songInfo" :href="src" target="_blank">
              <i class="iconfont icon-download" />
            </a>
          </div>
        </div>
      </div>

      <div class="center2" v-show="showLyric" @click="showLyric=!showLyric">
        <!-- <div class="lyric">暂无歌词</div> -->
        <!-- 歌词 -->
        <BScroll
          class="lyric"
          ref="lyricList"
          v-show="showLyric"
          :data="currentLyric && currentLyric.lines"
        >
          <div class="lyric-wrapper">
            <div class="currentLyric" v-if="currentLyric">
              <p
                ref="lyricLine"
                class="text"
                :class="{'current': currentLineNum === index}"
                v-for="(line, index) in currentLyric.lines"
                :key="line.key"
              >{{line.txt}}</p>
            </div>
            <p class="no-lyric" v-if="currentLyric===null">暂无歌词</p>
          </div>
        </BScroll>
      </div>

      <div class="bottom">
        <audio
          autoplay
          ref="audio"
          id="audio"
          :src="src"
          @ended="end"
          @canplay="canPlay"
          @error="error"
          @timeupdate="timeUpdate"
        />
        <div class="progress-wrapper">
          <span class="time time-l">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <ProgressBar
              :percent="percent"
              @percentChange="percentChange"
              @percentChangeEnd="percentChangeEnd"
            />
          </div>
          <span class="time time-r">{{format(duration)}}</span>
        </div>
        <div class="operators" v-if="player">
          <div class="icon i-left">
            <i
              class="iconfont icon-liebiaoxunhuan"
              v-if="$store.state.playStatus==='normal'"
              @click="changeMusicStatus()"
            ></i>
            <i
              class="iconfont icon-danquxunhuan"
              v-else-if="$store.state.playStatus==='loop'"
              @click="changeMusicStatus()"
            ></i>
            <i class="iconfont icon-ziyuan" v-else @click="changeMusicStatus()"></i>
          </div>
          <div class="icon i-left">
            <i class="iconfont icon-kuaitui" @click="changeIndex(-1)"></i>
          </div>
          <div class="icon i-center">
            <i
              class="iconfont icon-zanting active"
              v-if="!player.paused"
              @click="changeStatus(false)"
            ></i>
            <i class="iconfont icon-bofang" v-else @click="changeStatus(true)"></i>
          </div>
          <div class="icon i-right">
            <i class="iconfont icon-kuaijin" @click="changeIndex(1)"></i>
          </div>
          <div class="icon i-right">
            <i class="iconfont icon-list" @click="showList=!showList"></i>
          </div>
        </div>
      </div>
    </div>
    <div id="list" v-show="showList">
      <div class="hide" @click.self="showList=false"></div>
      <div class="content">
        <h3>
          播放列表
          <span>({{$store.state.playlist.length}}首)</span>
        </h3>
        <ul>
          <li v-for="(item,index) in $store.state.playlist" :key="item.id">
            <div class="info" @click="setCurrentIndex(index)">
              <i v-if="index===$store.state.currentIndex" class="iconfont icon-yinyue" />
              <span class="name">{{item.name}}</span>
              <span class="singer">{{item.singer}}</span>
            </div>
            <div @click="delCurrentIndex(index)">
              <i class="iconfont icon-guanbi"></i>
            </div>
          </li>
        </ul>
        <p @click="showList=false">关闭</p>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/common/progressBar/ProgressBar";
import StaticProgressBar from "@/components/common/progressBar/StaticProgressBar";
import BScroll from "@/components/common/scroll/BScroll";
import { mapMutations, mapGetters } from "vuex";
import { songApi } from "@/api/song";
import { lyricApi } from "@/api/lyric";

import Vue from "vue";
import Lyric from "lyric-parser";
import { Toast } from "vant";

Vue.use(Toast);

export default {
  name: "Player",
  components: { ProgressBar, StaticProgressBar, BScroll },
  data() {
    return {
      percent: 0,
      currentTime: 0,
      duration: 0,
      onMove: false,
      player: null,
      songInfo: null,
      songPic: null,
      showList: false,
      showLyric: false,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: "",
      noLyric: false
    };
  },
  watch: {
    //监听currentIndex的变化，有变化马上获取歌词渲染
    "$store.state.currentIndex": {
      handler(newVal, oldVal) {
        //console.log("改变", newVal, oldVal);
        this.getLyric(
          this.$store.state.playlist[this.$store.state.currentIndex].id
        );
      },
      immediate: false //首次不执行
    }
  },
  computed: {
    src() {
      if (this.$store.state.playlist.length > 0) {
        let index = this.$store.state.currentIndex;
        let id = this.$store.state.playlist[index].id;
        this.songPic = "https://v1.itooi.cn/tencent/pic?id=" + id;
        songApi.getSongDetail(id).then(ret => {
          this.songInfo = ret.data[0];
        });
        return `https://v1.itooi.cn/tencent/url?id=${id}&quality=320`;
      }
    },
    isFav() {
      let id = this.songInfo.mid;
      return (
        this.$store.state.favlist.filter(item => item.mid === id).length > 0
      );
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.$store.state.currentIndex > -1) {
        this.getLyric(
          this.$store.state.playlist[this.$store.state.currentIndex].id
        );
      }
    });
  },
  mounted() {
    this.player = this.$refs.audio;
  },
  methods: {
    gotoSinger() {
      this.$router.push({ path: `/singer/${this.songInfo.singer[0].mid}` });
      this.setFullScreen(false);
      this.setCurSingerPic(this.songPic);
    },
    addToFavList() {
      let song = this.songInfo;
      Toast.success("已添加到我喜欢");
      this.setFavList(song);
    },
    removeToFavList() {
      let song = this.songInfo;
      Toast.success("已从我喜欢移除");
      this.removeFavListItem(song);
    },
    changeMusicStatus() {
      let player = this.player;
      let currentIndex = this.$store.state.playStatusList.findIndex(
        status => status === this.$store.state.playStatus
      );
      if (currentIndex === 2) {
        player.loop = false;
        Toast.success("已切换到顺序播放");
        this.changePlayStatus();
      } else if (currentIndex === 0) {
        player.loop = true;
        Toast.success("已切换到单曲循环");
        this.changePlayStatus();
      } else {
        player.loop = false;
        Toast.success("已切换到随机播放");
        this.changePlayStatus();
      }
    },
    percentChange(percent) {
      this.onMove = true;
      this.currentTime = percent * this.duration;
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    percentChangeEnd(percent) {
      this.onMove = false;
      this.$refs.audio.currentTime = percent * this.duration;
    },
    end() {
      this.setCurrentIndex(this.$store.state.currentIndex + 1);
    },
    canPlay() {},
    error() {},
    goMv() {
      this.player.pause();
      this.$router.push(`/mv/${this.songInfo.mv.vid}`);
      this.setFullScreen(false);
    },
    timeUpdate(e) {
      if (this.onMove) return;
      this.currentTime = e.target.currentTime;
      this.duration = e.target.duration;
      this.percent = this.currentTime / this.duration;
    },
    format(interval) {
      interval = interval | 0;
      let minute = (interval / 60) | 0;
      let second = interval % 60;
      if (second < 10) {
        second = "0" + second;
      }
      return minute + ":" + second;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setCurrentIndex: "SET_CURRENT_INDEX",
      delCurrentIndex: "DeL_CURRENT_INDEX",
      changePlayStatus: "Change_Play_Status",
      setFavList: "SET_FAVLIST",
      removeFavListItem: "REMOVE_TO_FAVLIST",
      setCurSingerPic: "SET_CURSINGER_PIC"
    }),
    changeIndex(flag) {
      this.setCurrentIndex(this.$store.state.currentIndex + flag);
    },
    changeStatus(flag) {
      if (flag) {
        this.player.play();
      } else {
        this.player.pause();
      }
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    backClick() {
      this.setFullScreen(!this.$store.state.fullscreen);
    },
    getLyric(id) {
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentLyric = null;
      }
      this.noLyric = false;
      lyricApi
        .getLyric(id)
        .then(res => {
          //console.log(res);
          this.currentLyric = new Lyric(res, this.handleLyric);
          if (this.player.paused) {
            this.currentLyric.play();
            // 歌词重载以后 高亮行设置为 0
            this.currentLineNum = 0;
            this.$refs.lyricList.scrollTo(0, 0, 1000);
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.noLyric = true;
          this.currentLineNum = 0;
        });
    },
    // 歌词滚动
    handleLyric({ lineNum, txt }) {
      //console.log(lineNum, txt);
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* 定义第一个span的animation：时长 动画名字 匀速 循环 正常播放 */
.first-marquee {
  -webkit-animation: 25s first-marquee linear infinite normal;
  animation: 25s first-marquee linear infinite normal;
  padding-right: 70%;
}

@keyframes first-marquee {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  /* 向左移动 */
  100% {
    -webkit-transform: translate3d(-200%, 0, 0);
    transform: translate3d(-200%, 0, 0);
    display: none;
  }
}

.second-marquee {
  /* 因为要在第一个span播完之前就得出现第二个span，所以就延迟12s才播放 */
  -webkit-animation: 25s first-marquee linear 12s infinite normal;
  animation: 25s first-marquee linear 12s infinite normal;
  padding-right: 53%;
}

@keyframes second-marquee {
  0% {
    -webkit-transform: translate3d(0%, 0, 0);
    transform: translate3d(0%, 0, 0);
  }

  100% {
    -webkit-transform: translate3d(-200%, 0, 0);
    transform: translate3d(-200%, 0, 0);
    display: none;
  }
}
#miniPlayer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.6rem;
  background: var(--background-color);
  display: flex;
  .staticProgressBar {
    position: absolute;
    width: 100%;
    height: 0.04rem;
    top: 0;
    left: 0;
  }
  .left {
    width: 20%;
    height: 100%;
    img {
      box-sizing: border-box;
      padding: 0.05rem;
      border-radius: 50%;
      width: 0.6rem;
      margin: 0 auto;
      &.active {
        animation: rotate 10s linear infinite;
      }
    }
  }
  .center {
    width: 50%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    line-height: 0.2rem;
    font-size: var(--normal);
    .name {
      font-weight: 600;
    }
    .singer {
      color: var(--text-info);
      font-size: var(--normal-s);
    }
  }
  .right {
    width: 30%;
    text-align: center;
    line-height: 0.6rem;
    display: flex;
    i {
      flex: 1;
      font-size: 0.25rem;
    }
  }
}

#pagePlayer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 12;

  .background {
    position: absolute;
    left: -50%;
    top: -50%;
    width: 300%;
    height: 300%;
    z-index: -1;
    opacity: 0.5;
    filter: blur(30px);

    img {
      width: 300%;
      height: 300%;
    }

    .back {
      position: absolute;
      width: 100%;
      height: 100%;
      background: black;
      opacity: 0.6;
    }
  }

  .top {
    height: 10%;
    color: #ebebeb;
    position: relative;
    div.back {
      width: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
      text-align: center;
      i {
        font-size: 0.4rem;
      }
    }
    div.nav {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      height: 20px;
      overflow: hidden;
      span {
        position: absolute;
        top: 0;
        left: 101%;
        height: 100%;
        width: 100%;
        white-space: nowrap;
      }
    }
  }
  .center {
    height: 65%;

    img {
      width: 3rem;
      height: 3rem;
      margin: 0 auto;
    }
    .infos {
      margin-top: 0.3rem;
      display: flex;
      justify-content: space-between;

      .left {
        margin-left: 0.2rem;
        color: #ebebeb;

        div {
          margin: 0.1rem 0;
          font-size: var(--normal);

          &.name {
            font-size: var(--large-x);
            span.mv {
              font-size: var(--small-x);
              color: #ddff99;
              border: 1px solid var(--border-color);
              padding: 0 0.03rem;
            }
          }
        }
      }

      .right {
        color: #ebebeb;
        display: flex;
        flex-flow: column;
        margin-right: 0.2rem;
        justify-content: space-evenly;
        text-align: center;
        margin-top: 0.1rem;
        a {
          color: #ebebeb;
          flex: 1;
        }
        svg {
          flex: 1;
          margin: 0.1rem;
          font-size: var(--large);
        }
        i {
          font-size: 0.3rem;
          margin-bottom: 0.2rem;
        }
        .icon-aixin1{
          color: #ff4040;
        }
      }
    }
  }
  .center2 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 65%;
  }
  .bottom {
    height: 25%;
    padding-top: 0.2rem;
    .progress-wrapper {
      color: white;
      display: flex;
      width: 80%;
      margin: 0 auto;
      padding: 10px 0;
      font-size: var(--small);

      span {
        line-height: 0.3rem;
        width: 30px;

        &:nth-of-type(1) {
          text-align: left;
        }

        &:nth-of-type(2) {
          text-align: right;
        }
      }

      div.progress-bar-wrapper {
        flex: 1;
      }
    }

    .operators {
      line-height: 0.8rem;
      display: flex;
      justify-content: space-evenly;
      text-align: center;
      div {
        flex: 1;
      }

      i {
        font-size: 0.4rem;
        color: white;

        &.active {
          display: inline-block;
          animation: rotate 5s linear infinite;
        }
      }
      div.i-center {
        i {
          font-size: 0.5rem;
        }
      }
      div:nth-of-type(5) {
        i {
          font-size: 0.42rem;
        }
      }
    }
  }
}

#list {
  div.hide {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: transparent;
    z-index: 12;
  }
  div.content {
    border-top-left-radius: 0.08rem;
    border-top-right-radius: 0.08rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--background-color-light);
    width: 100%;
    z-index: 13;
    box-shadow: 0 -3px 10px rgba(96, 115, 255, 0.32);
  }
  h3 {
    font-size: var(--small);
    text-indent: 4em;
    padding: 0.1rem 0;
    line-height: 0.2rem;
    border-bottom: 1px solid var(--border-color);
    span {
      color: var(--text-info);
    }
  }
  ul {
    width: 102%;
    max-height: 3rem;
    padding: 0 0.5rem;
    overflow-y: auto;
    li {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin: 0.2rem 0;
      font-size: var(--normal-x);
      color: var(--text-color);
      span.singer {
        margin-left: 0.06rem;
        font-size: var(--normal-s);
        color: var(--text-info);
      }
      i {
        position: absolute;
        left: -0.3rem;
        color: #8156e8;
      }
      .icon-guanbi {
        position: static;
        color: #707070;
        font-size: .2rem;
      }
    }
  }
  p {
    color: white;
    text-align: center;
    line-height: 0.4rem;
    background-color: rgba(129, 86, 232, 0.21);
  }
}
.lyric {
  position: relative;
  // height: calc(100% - 0.51rem);
  height: 1rem;
  overflow: hidden;
  z-index: 13;
  transform: translateY(0.22rem);
  width: 65%;
}
.lyric-wrapper {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
  .text {
    line-height: 0.44rem;
    color: #ffffff;
    font-size: 0.15rem;
    &.current {
      color: #8156e8;
      font-size: 0.17rem;
      font-weight: 600;
    }
  }
  .no-lyric {
    line-height: 0.44rem;
    margin-top: 60%;
    color: #ffffff;
    font-size: 0.15rem;
  }
}
</style>
