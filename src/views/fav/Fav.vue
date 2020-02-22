<template>
  <div class="fav">
    <i class="iconfont icon-flow back" @click="$router.back()"></i>
    <Header2 :navInfo="navInfo" @changeIndex="changeIndex" />
    <div
      class="favSong"
      v-if="navInfo.activeIndex===0"
      :class="{active:$store.state.playlist.length>0}"
    >
      <div class="list" v-if="$store.state.favlist.length>0">
        <ul>
          <li v-for="(item,index) in $store.state.favlist" @click="liClick(index)" :key="item.id">
            <div class="left">{{index+1}}</div>
            <div class="right">
              <p class="title nowrap">{{item.title}}</p>
              <p class="singer">{{item.singer[0].name}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="noSong" v-else>
        <div class="svgBox">
          <i class="iconfont icon-yinyue"></i>
          <div>没有喜欢的歌曲</div>
        </div>
      </div>
    </div>

    <div class="favAlbum" v-else :style="{'bottom':$store.state.playlist.length>0?'0.64rem':'0'}">
      <div class="list" v-if="$store.state.favAlbumlist.length>0">
        <FavAblumItem
          class="listItem"
          v-for=" item in $store.state.favAlbumlist"
          :itemInfo="item"
          :key="item.disstid"
          @click.native="$router.push(`/list/${item.disstid}`)"
        />
      </div>
      <div class="noAlbum" v-else>
        <div class="svgBox">
          <i class="iconfont icon-zhuanji"></i>
          <div>没有喜欢的专辑</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header2 from "@/components/content/header/Header2";

import FavAblumItem from "./childComponents/FavAblumItem";
import { mapActions } from "vuex";

export default {
  name: "fav",
  components: {
    Header2,
    FavAblumItem
  },
  data() {
    return {
      navInfo: {
        activeIndex: 0,
        nav: [{ name: "喜欢的歌曲" }, { name: "喜欢的歌单" }]
      }
    };
  },
  methods: {
    ...mapActions({
      startPlayingMusic: "startPlayingMusic"
    }),
    changeIndex(index) {
      this.navInfo.activeIndex = index;
    },
    liClick(index) {
      let list = this.$store.state.favlist.map(item => {
        return { name: item.name, singer: item.singer[0].name, id: item.mid };
      });
      this.startPlayingMusic({ list, index });
    }
  }
};
</script>

<style lang="scss" scoped>
.fav {
  position: relative;
  .back {
    position: fixed;
    left: 0.15rem;
    top: 0.12rem;
    font-size: 0.3rem;
    color: #8156e8;
    z-index: 11;
  }
  .favSong {
    width: 100%;
    position: relative;
    top: 0.47rem;
    .noSong {
      width: 100%;
      height: 80vh;
      .svgBox {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        i {
          color: #8156e8;
          font-size: 1rem;
        }
        div {
          height: 0.2rem;
          margin-top: 0.1rem;
          color: #999999;
        }
      }
    }
    .list {
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
  .active {
    margin-bottom: 0.64rem;
  }
  .favAlbum {
    width: 100%;
    top: 0.47rem;
    position: relative;
    .noAlbum {
      width: 100%;
      height: 80vh;
      .svgBox {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        i {
          color: #8156e8;
          font-size: 1rem;
        }
        div {
          height: 0.2rem;
          margin-top: 0.1rem;
          color: #999999;
        }
      }
    }
    .list {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
}
</style>