<template>
  <div id="player">
    <div id="miniPlayer">
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
            <div>
              <svg
                t="1581673758285"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="851"
                width="20"
                height="20"
              >
                <path
                  d="M953.6 0L1024 73.856 583.808 523.008l418.56 427.136L930.944 1024 512 596.352 93.056 1024l-70.4-73.856L440.448 523.52 0 73.856 71.424 0l440.96 450.176L953.472 0z"
                  p-id="852"
                  fill="#707070"
                />
              </svg>
            </div>
          </li>
        </ul>
        <p @click="showList=false">关闭</p>
      </div>
    </div>
    <audio
      autoplay
      id="audio"
      :src="src"
      @ended="end"
      @canplay="canPlay"
      @error="error"
      @timeupdate="timeUpdate"
    />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { songApi } from "@/api/song";

export default {
  name: "play",
  data() {
    return {
      percent: 0,
      currentTime: 0,
      duration: 0,
      onMove: false,
      player: null,
      songInfo: null,
      songPic: null,
      showList: false
    };
  },
  mounted() {
    this.player = document.getElementById("audio");
  },
  computed: {
    src() {
      if (this.$store.state.playlist.length > 0) {
        let index = this.$store.state.currentIndex;
        let id = this.$store.state.playlist[index].id;
        this.songPic = "https://v1.itooi.cn/tencent/pic?id=" + id;
        songApi.getSongDetail(id).then(res => {
          this.songInfo = res.data[0];
        });
        return `https://v1.itooi.cn/tencent/url?id=${id}&quality=320`;
      }
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setCurrentIndex: "SET_CURRENT_INDEX"
    }),
    changeStatus(flag) {
      debugger;
      if (flag) {
        this.player.pause();
      } else {
        this.player.play();
      }
    },
    end() {
      this.setCurrentIndex(this.$store.state.currentIndex + 1);
    },
    canPlay() {},
    error() {},
    timeUpdate(e) {
      if (this.onMove) return;
      this.currentTime = e.target.currentTime;
      this.duration = e.target.duration;
      this.percent = this.currentTime / this.duration;
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
    position: absolute;
    right: 0;
    i {
      flex: 1;
      font-size: 0.25rem;
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