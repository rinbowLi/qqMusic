<template>
  <div id="player" @touchmove.stop v-show="$store.state.playlist.length>0">
    <div id="miniPlayer" v-show="!$store.state.fullscreen">
      <div class="left" @click="setFullScreen(true)">
        <img v-if="player" :src="songPic" :class="{active: !player.paused}" alt />
      </div>
      <div class="center nowrap" v-if="songInfo" @click="setFullScreen(true)">
        <div class="name">{{songInfo.title}}</div>
        <div class="singer">{{songInfo.singer[0].name}}</div>
      </div>
      <div class="right" v-if="player">
        <i class="iconfont icon-zanting active" v-if="player.paused" @click="changeStatus(true)"></i>
        <i class="iconfont icon-bofang" v-else @click="changeStatus(false)"></i>
        <i class="iconfont icon-liebiao" @click="showList=!showList"></i>
      </div>
    </div>
    <div id="pagePlayer" v-show="$store.state.fullscreen">
      <div class="background">
        <div class="back"></div>
        <img :src="songPic" alt v-if="songPic" />
      </div>
      <div class="top">
        <div class="navWrapper clear">
          <div class="back" @click="backClick">
            <i class="iconfont icon-wei-" />
          </div>
          <div class="nav">
            <span v-if="songInfo" class="first-marquee">{{songInfo.title}}</span>
            <span v-if="songInfo" class="second-marquee">{{songInfo.title}}</span>
          </div>
        </div>
      </div>
      <div class="center" v-if="!showLyric">
        <img :src="songPic" alt v-if="songPic" @click="showLyric=!showLyric" />
        <div class="infos" v-if="songInfo">
          <div class="left">
            <div class="name">
              {{songInfo.title}}
              <span class="mv" v-if="songInfo.mv.id!==0" @click="goMv">MV</span>
            </div>
            <div class="singer">{{songInfo.singer[0].name}}</div>
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
            <i class="iconfont icon-xiai" />
            <a v-if="src&&songInfo" :href="src" target="_blank">
              <i class="iconfont icon-xiazai" />
            </a>
            <!--:download="`${songInfo.title}-${songInfo.singer[0].name}.mp3`"-->
          </div>
        </div>
      </div>
      <div class="center2" v-else @click="showLyric=!showLyric">
        <div class="lyric">暂无歌词</div>
      </div>
      <div class="bottom">
        <audio
          autoplay
          ref="audio"
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
            <i class="iconfont icon-liebiaoxunhuan"></i>
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
            <i class="iconfont icon-liebiao" @click="showList=!showList"></i>
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
          <li v-for="(item,index) in $store.state.playlist" :key="index">
            <div class="info" @click="setCurrentIndex(index)">
              <i v-if="index===$store.state.currentIndex" class="iconfont icon-yinle" />
              <span class="name">{{item.name}}</span>
              <span class="singer">{{item.singer}}</span>
            </div>
            <div @click="delCurrentIndex(index)">
              <svg
                t="1581733631069"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="965"
                width="18"
                height="18"
              >
                <path
                  d="M953.6 0L1024 73.856 583.808 523.008l418.56 427.136L930.944 1024 512 596.352 93.056 1024l-70.4-73.856L440.448 523.52 0 73.856 71.424 0l440.96 450.176L953.472 0z"
                  p-id="966"
                  fill="#707070"
                />
              </svg>
            </div>
          </li>
        </ul>
        <p @click="showList=false">关闭</p>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/common/ProgressBar";
import { mapMutations } from "vuex";
import { songApi } from "@/api/song";

export default {
  name: "Player",
  components: { ProgressBar },
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
      showLyric: false
    };
  },
  watch: {
    "$store.state.playlist"(newList) {}
  },
  computed: {
    src() {
      if (this.$store.state.playlist.length > 0) {
        let index = this.$store.state.currentIndex;
        let id = this.$store.state.playlist[index].id;
        this.songPic = "https://v1.itooi.cn/tencent/pic?id=" + id;
        songApi.getSongDetail(id).then(ret => {
          this.songInfo = ret.data[0];
          console.log(this.songInfo);
        });
        return `https://v1.itooi.cn/tencent/url?id=${id}&quality=320`;
      }
    }
  },
  mounted() {
    this.player = this.$refs.audio;
    console.dir(this.player);
  },
  methods: {
    percentChange(percent) {
      this.onMove = true;
      this.currentTime = percent * this.duration;
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
      console.log(this.songInfo.mv.id);
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
      delCurrentIndex: "DeL_CURRENT_INDEX"
    }),
    changeIndex(flag) {
      this.setCurrentIndex(this.$store.state.currentIndex + flag);
    },
    changeStatus(flag) {
      console.log(this.player.play);
      if (flag) {
        this.player.play();
      } else {
        this.player.pause();
      }
    },
    ///////
    backClick() {
      this.setFullScreen(!this.$store.state.fullscreen);
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
  background: rgb(255, 255, 255);

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
        a {
          color: #ebebeb;
          flex: 1;
        }
        i {
          flex: 1;
          margin: 0.1rem;
          font-size: var(--large);
        }
      }
    }
  }
  .center2 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 65%;
    .lyric {
      color: #ffffff;
      width: 20%;
      height: 0.3rem;
      line-height: 0.3rem;
    }
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
        font-size: 0.3rem;
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
          font-size: 0.22rem;
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
    z-index: 10;
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
    z-index: 11;
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
    }
  }
  p {
    color: white;
    text-align: center;
    line-height: 0.4rem;
    background-color: rgba(255, 109, 140, 0.21);
  }
}
</style>
