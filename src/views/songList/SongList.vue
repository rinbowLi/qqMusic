<template>
  <div
    class="topList clear"
    :style="{'bottom':$store.state.playlist.length>0?'0.6rem':'0'}"
    ref="test"
    @scroll="scroll($event)"
  >
    <div class="back" :style="style">
      <span class="back" @click="$router.back()">
        <i class="iconfont icon-fanhui" />返回
      </span>
      <div class="name nowrap" v-if="sectionInfo">{{sectionInfo.dissname}}</div>
    </div>

    <div class="header clear" v-if="sectionInfo">
      <img v-lazy="sectionInfo.logo" alt />
      <svg
        t="1581989706629"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="919"
        width="30"
        height="30"
        @click="addToFavAlbumlist()"
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
        width="30"
        height="30"
        @click="removeToFavAlbumlist()"
        v-else
      >
        <path
          d="M833.1 244.9c-73.2-73.2-193-73.2-266.1 0l-55.9 55.9-54-54c-73.2-73.2-193-73.2-266.1 0-73.2 73.2-73.2 193 0 266.1L512 834l321.1-323c73.2-73.2 73.2-193 0-266.1z"
          p-id="1118"
          fill="#FF4040"
        />
      </svg>
    </div>
    <div class="list">
      <h3>
        排行榜
        <span>共{{listInfo.length}}首</span>
      </h3>
      <ul>
        <li v-for="(item,index) in listInfo" @click="liClick(index)" :key="item.id">
          <div class="left">{{index+1}}</div>
          <div class="right">
            <p class="title nowrap">{{item.title}}</p>
            <p class="singer">{{item.singer[0].name}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { listApi } from "@/api/list";
import { mapActions, mapMutations } from "vuex";

import Vue from "vue";
import { Toast } from "vant";

Vue.use(Toast);

export default {
  name: "SongList",
  data() {
    return {
      pic: null,
      listInfo: [],
      opacity: 0,
      sectionInfo: {}
    };
  },
  computed: {
    style() {
      return {
        background: `rgba(129,86,232,${this.opacity})`
      };
    },
    isFav() {
      let id = this.sectionInfo.disstid;
      return (
        this.$store.state.favAlbumlist.filter(item => item.disstid === id)
          .length > 0
      );
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions({
      startPlayingMusic: "startPlayingMusic"
    }),
    ...mapMutations({
      setFavAlbumlist: "SET_FAVALBUMLIST",
      removeFavAlbumlist: "REMOVE_TO_FAVALBUMLIST"
    }),
    init() {
      let listId = this.$route.params.id;
      listApi.getSongList(listId).then(res => {
        this.sectionInfo = res.data[0];
        this.listInfo = res.data[0].songlist;
      });
    },
    scroll(e) {
      /*340*/
      this.opacity = (e.target.scrollTop / 340) * 0.5;
    },
    liClick(index) {
      let list = this.listInfo.map(item => {
        return { name: item.name, singer: item.singer[0].name, id: item.mid };
      });
      this.startPlayingMusic({ list, index });
    },
    addToFavAlbumlist() {
      let album = this.sectionInfo;
      Toast.success("已添加到我喜欢");
      this.setFavAlbumlist(album);
    },
    removeToFavAlbumlist() {
      let album = this.sectionInfo;
      Toast.success("已从我喜欢移除");
      this.removeFavAlbumlist(album);
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/css/mixin";

.topList {
  position: fixed;
  width: 102%;
  top: 0;
  bottom: 0;
  overflow-y: auto;

  .back {
    position: fixed;
    z-index: 100;
    color: #fff;
    left: 0;
    top: 0;
    height: 0.4rem;
    width: 100%;
    line-height: 0.4rem;
    padding-left: 0.1rem;

    span.back {
      i {
        display: inline-block;
        transform: scale(0.9);
        position: relative;
        top: 0.02rem;
      }

      font-size: var(--small-x);
    }

    div.name {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .header {
    background: #000;
    opacity: 0.5;
    position: relative;

    img {
      width: 3rem;
      margin: 0.4rem auto;
    }
    svg {
      position: absolute;
      bottom: 0.1rem;
      right: 0.15rem;
    }
  }

  .list {
    h3 {
      font-size: var(--small-x);
      font-weight: 600;
      color: var(--text-info);
      padding: 0.05rem;
    }

    ul {
      padding: 0.1rem 0.2rem;

      li {
        height: 0.5rem;
        display: flex;
        margin-bottom: 0.05rem;
        border-bottom: 1px solid var(--border-color);

        .left {
          width: 8%;
          color: var(--text-info);
          line-height: 0.5rem;
        }

        .right {
          color: var(--text-color);
          display: flex;
          flex-flow: column;
          justify-content: space-evenly;
          width: 80%;
          line-height: 0.2rem;

          .singer {
            color: var(--text-info);
          }
        }
      }
    }
  }
}
</style>
