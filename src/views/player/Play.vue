<template>
  <div id="player" @touchmove.stop v-show="$store.state.playlist.length>0">
    <div id="miniPlayer" v-show="!$store.state.fullscreen">
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
        <i class="iconfont icon-liebiao" @click="showList=!showList"></i>
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
            <i class="iconfont icon-wei-" />
          </div>
          <div class="nav">
            <span v-if="songInfo" class="first-marquee">{{songInfo.title}}</span>
            <span v-if="songInfo" class="second-marquee">{{songInfo.title}}</span>
          </div>
        </div>
      </div>
      <div class="center" v-if="!showLyric">
        <img v-lazy="songPic" alt v-if="songPic" @click="showLyric=!showLyric" />
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
            <!-- <i class="iconfont icon-xiai" /> -->
            <svg
              t="1581989706629"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="919"
              width="25"
              height="25"
              @click="addToFavList()"
              v-if="!isFav"
            >
              <path
                d="M833.1 244.9c-73.2-73.2-193-73.2-266.1 0l-55.9 55.9-54-54c-73.2-73.2-193-73.2-266.1 0-36.6 36.6-54.9 84.8-54.9 133.1S154.4 476.4 191 513l321 321 321.1-323c73.2-73.2 73.2-193 0-266.1z m-45.3 220.9l-276 277.6-275.6-275.8c-23.3-23.3-36.1-54.5-36.1-87.8s12.8-64.5 36.1-87.8 54.5-36.2 87.8-36.2 64.5 12.8 87.8 36.2l99.3 99.3 101.2-101.1c23.3-23.3 54.5-36.2 87.8-36.2s64.5 12.8 87.8 36.2c23.3 23.3 36.1 54.5 36.1 87.8s-12.8 64.4-36.2 87.8z"
                p-id="920"
                fill="#ffffff"
              />
            </svg>
            <svg
              t="1581989726607"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1117"
              width="25"
              height="25"
              @click="removeToFavList()"
              v-else
            >
              <path
                d="M833.1 244.9c-73.2-73.2-193-73.2-266.1 0l-55.9 55.9-54-54c-73.2-73.2-193-73.2-266.1 0-73.2 73.2-73.2 193 0 266.1L512 834l321.1-323c73.2-73.2 73.2-193 0-266.1z"
                p-id="1118"
                fill="#FF4040"
              />
            </svg>
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
            <i
              class="iconfont icon-liebiaoxunhuan"
              v-if="$store.state.playStatus==='normal'"
              @click="changeMusicStatus()"
            ></i>
            <svg
              t="1581769011277"
              class="icon loopIcon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2319"
              width="30"
              height="30"
              @click="changeMusicStatus()"
              v-else-if="$store.state.playStatus==='loop'"
            >
              <path
                d="M773.597867 203.776l-0.273067 0.443733a33.621333 33.621333 0 0 0-20.343467-6.485333c-18.978133 0.785067-33.723733 16.725333-32.9728 35.771733a33.826133 33.826133 0 0 0 15.633067 26.794667l-0.1024 0.170667a375.227733 375.227733 0 0 1 166.2976 311.876266c0 207.018667-168.448 375.466667-375.466667 375.466667-27.818667 0-27.818667 0-54.340266-2.901333-90.453333-9.898667-152.610133-58.9824-155.5456-61.201067a375.330133 375.330133 0 0 1-165.5808-311.364267c0-201.4208 159.5392-365.841067 358.843733-374.647466l-41.984 40.823466 0.8192 0.853334a33.860267 33.860267 0 0 0-15.2576 29.218133c0.750933 18.978133 16.725333 33.757867 35.669333 33.041067a33.792 33.792 0 0 0 26.0096-14.472534l0.3072 0.341334 128.648534-124.996267L515.6864 34.0992l-0.4096 0.4096a33.6896 33.6896 0 0 0-26.3168-11.400533c-18.944 0.750933-33.6896 16.725333-32.9728 35.703466a33.8944 33.8944 0 0 0 13.038933 25.156267l45.226667 45.2608C275.182933 135.714133 82.602667 331.741867 82.602667 572.347733c0 147.626667 73.1136 285.149867 193.194666 366.114134 3.072 2.56 77.550933 62.190933 188.757334 74.308266 29.422933 3.208533 31.1296 3.310933 61.781333 3.310934 244.667733 0 443.733333-199.0656 443.733333-443.733334A443.392 443.392 0 0 0 773.597867 203.776"
                p-id="2320"
                fill="#ffffff"
              />
              <path
                d="M542.071467 400.827733a33.28 33.28 0 0 0-17.134934 6.075734l-0.170666-0.3072-106.8032 69.700266 0.170666 0.273067a33.9968 33.9968 0 0 0-15.837866 29.696c0.750933 18.944 16.725333 33.723733 35.669333 32.9728a33.109333 33.109333 0 0 0 17.1008-6.0416l0.2048 0.273067 53.998933-35.259734v249.856h0.034134c0 0.477867-0.238933 0.887467-0.2048 1.365334a34.2016 34.2016 0 1 0 68.4032-1.365334h0.034133v-0.170666c0-0.4096 0.2048-0.750933 0.2048-1.160534 0-0.273067-0.170667-0.477867-0.2048-0.785066V435.2c0-0.477867 0.2048-0.887467 0.2048-1.3312a34.4064 34.4064 0 0 0-35.669333-33.041067"
                p-id="2321"
                fill="#ffffff"
              />
            </svg>
            <svg
              t="1581767784123"
              class="icon randomIcon"
              viewBox="0 0 1152 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1775"
              width="30"
              height="30"
              @click="changeMusicStatus()"
              v-else
            >
              <path
                d="M336 334.08l58.56 89.92 76.16-117.44-27.2-42.24A324.8 324.8 0 0 0 192 128H0v128h192a201.6 201.6 0 0 1 144 78.08zM864 256h96v128l192-192-192-192v128h-96a324.8 324.8 0 0 0-251.52 136.32l-276.48 425.6A201.6 201.6 0 0 1 192 768H0v128h192a324.8 324.8 0 0 0 251.52-136.32l276.48-425.6A200.32 200.32 0 0 1 864 256z"
                p-id="1776"
                fill="#ffffff"
              />
              <path
                d="M960 768h-96a200.32 200.32 0 0 1-144-78.08l-58.56-89.92-76.16 117.44 27.2 42.24A324.8 324.8 0 0 0 864 896h96v128l192-192-192-192z"
                p-id="1777"
                fill="#ffffff"
              />
            </svg>
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
          <li v-for="(item,index) in $store.state.playlist" :key="item.id">
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

import Vue from "vue";
import { Toast } from "vant";

Vue.use(Toast);

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
  mounted() {
    this.player = this.$refs.audio;
  },
  methods: {
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
      removeFavListItem: "REMOVE_TO_FAVLIST"
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
        a {
          color: #ebebeb;
          flex: 1;
        }
        svg {
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
      .randomIcon,
      .loopIcon {
        position: relative;
        top: 0.1rem;
      }
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
    }
  }
  p {
    color: white;
    text-align: center;
    line-height: 0.4rem;
    background-color: rgba(129, 86, 232, 0.21);
  }
}
</style>
