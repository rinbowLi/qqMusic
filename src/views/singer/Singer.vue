<template>
  <div class="singer" :style="{'bottom':$store.state.playlist.length>0?'0.6rem':'0'}">
    <div class="back" :style="style">
      <span class="back" @click="$router.back()">
        <i class="iconfont icon-flow" />返回
      </span>
      <div class="name nowrap">{{singerName}}</div>
    </div>
    <div class="imgBox">
      <img v-lazy="imgPic" class="singerImg" />
      <div class="singerName">{{singerName}}</div>
      <div class="singerFans">{{fans}}</div>
    </div>
    <Header2 @changeIndex="changeIndex" :navInfo="navInfo" class="title" />
    <div class="textBox">
      <div v-if="navInfo.activeIndex===0">
        <ul>
          <li v-for="(item,index) in songList" @click="liClick(index)" :key="item.id">
            <div class="left">{{index+1}}</div>
            <div class="right">
              <p class="title nowrap">{{item.musicData.songname}}</p>
              <p class="singer">{{item.musicData.singer[0].name}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="navInfo.activeIndex===1">
        <AblumItem
          class="listItem"
          v-for=" item in Albumlist"
          :itemInfo="item"
          :key="item.album_mid"
        />
        <!-- @click.native="$router.push(`/list/${item.album_mid}`)" -->
      </div>
      <div v-else-if="navInfo.activeIndex===2" class="mvList">
        <ul>
          <li v-for="item in mvList" :key="item.id" @click="$router.push(`/mv/${item.vid}`)">
            <img v-lazy="item.pic" :alt="item.title" />
            <span class="date">{{item.date}}</span>
            <span class="icon">
              <i class="iconfont icon-shexiang"></i>
              {{listenCount(item.listenCount)}}
            </span>
          </li>
        </ul>
      </div>
      <div v-else>
        <div class="singerInfo">
          <div class="title">歌手资料</div>
          <div class="info">{{singerInfo.singer_brief}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header2 from "@/components/content/header/Header2";
import AblumItem from "./childComponents/AblumItem";
import { singerApi } from "@/api/artist";
import { mapActions } from "vuex";
export default {
  name: "singer",
  data() {
    return {
      singerName: "",
      fansCount: 0,
      navInfo: {
        activeIndex: 0,
        nav: [
          { name: "歌曲" },
          { name: "专辑" },
          { name: "MV" },
          { name: "说明" }
        ]
      },
      songList: [],
      Albumlist: [],
      opacity: 0.1,
      mvList: [],
      singerInfo: {}
    };
  },
  components: {
    Header2,
    AblumItem
  },
  computed: {
    imgPic() {
      return this.$store.state.curSingerPic;
    },
    fans() {
      const count = this.fansCount;
      if (count > 10000) {
        return `${(count / 10000).toFixed(1)}万 粉丝`;
      } else {
        return `${count} 粉丝`;
      }
    },
    style() {
      return {
        background: `rgba(129,86,232,${this.opacity})`
      };
    },
    listenCount() {
      return function(count) {
        if (count > 10000) {
          return `${(count / 10000).toFixed(1)}万`;
        } else {
          return `${count}`;
        }
      };
    }
  },
  created() {
    let id = this.$route.params.id;
    this.getArtistDetail(id);
    this.getArtistMv(id);
    this.getArtistAlbum(id);
    this.getArtistSong(id);
  },
  mounted() {
    let that = this;
    window.addEventListener(
      "scroll",
      function(e) {
        let scrollTop =
          document.documentElement.scrollTop ||
          window.pageYOffset ||
          document.body.scrollTop;
        that.opacity = (scrollTop / 340) * 0.5;
      },
      true
    );
  },
  methods: {
    ...mapActions({
      startPlayingMusic: "startPlayingMusic"
    }),

    //获取歌手详情
    getArtistDetail(id) {
      if (id) {
        singerApi.getArtistDetail(id).then(res => {
          this.singerName = res.data.singer_info.name;
          this.fansCount = res.data.singer_info.fans;
          this.singerInfo = res.data;
        });
      }
    },
    getArtistMv(id) {
      if (id) {
        singerApi.getArtistMv(id).then(res => {
          this.mvList = res.data;
        });
      }
    },
    getArtistAlbum(id) {
      if (id) {
        singerApi.getArtistAlbum(id).then(res => {
          this.Albumlist = res.data;
        });
      }
    },
    getArtistSong(id) {
      if (id) {
        singerApi.getArtistSong(id).then(res => {
          this.songList = res.data;
        });
      }
    },
    changeIndex(index) {
      this.navInfo.activeIndex = index;
    },
    liClick(index) {
      let list = this.songList.map(item => {
        return {
          name: item.musicData.songname,
          singer: item.musicData.singer[0].name,
          id: item.musicData.songmid
        };
      });
      this.startPlayingMusic({ list, index });
    }
  }
};
</script>

<style lang="scss" scoped>
.singer {
  position: relative;
  width: 100%;
  top: 0;
  bottom: 0;
  //overflow-y: auto;
  .back {
    position: fixed;
    z-index: 10;
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
  .imgBox {
    position: relative;
    background-color: var(--background-color);
    .singerImg {
      width: 100%;
      height: 3rem;
      border-radius: 0 0 0.3rem 0.3rem;
      opacity: 0.6;
    }
    .singerName {
      color: #8156e8;
      font-size: 0.27rem;
      font-weight: 600;
      position: absolute;
      left: 0.2rem;
      bottom: 0.45rem;
    }
    .singerFans {
      color: #ffffff;
      font-size: 0.12rem;
      position: absolute;
      left: 0.2rem;
      bottom: 0.2rem;
    }
  }
  .title {
    position: sticky;
  }
  .textBox {
    margin-bottom: 0.6rem;
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
    .mvList {
      display: flex;
      width: 100%;
      flex-direction: column;

      ul {
        padding: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 50%;
          position: relative;
          padding: 0.05rem;
          height: 1.2rem;
          img {
            width: 100%;
            border-radius: 5px;
          }
          .icon {
            position: absolute;
            right: 0.13rem;
            bottom: 0.13rem;
            color: #ffffff;
            font-size: 0.13rem;
            i {
              position: relative;
              top: 0.03rem;
            }
          }
          .date {
            position: absolute;
            left: 0.13rem;
            bottom: 0.13rem;
            color: #ffffff;
            font-size: 0.13rem;
          }
        }
      }
    }
    .singerInfo {
      .title {
        margin: 0.1rem;
        font-size: 0.17rem;
        font-weight: 600;
      }
      .info {
        font-size: 0.15rem;
        text-indent: 0.25rem;
        letter-spacing: 0.03rem;
        color: #999;
        line-height: 0.2rem;
        padding: 0.1rem;
      }
    }
  }
}
</style>