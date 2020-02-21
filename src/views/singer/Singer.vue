<template>
  <div class="singer">
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
          :key="item.disstid"
          @click.native="$router.push(`/list/${item.disstid}`)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Header2 from "@/components/content/header/Header2";
import AblumItem from "./childComponents/AblumItem"
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
      Albumlist:[]
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
    }
  },
  created() {
    let id = this.$route.params.id;
    this.getArtistDetail(id);
    this.getArtistMv(id);
    this.getArtistAlbum(id);
    this.getArtistSong(id);
  },
  methods: {
    ...mapActions({
      startPlayingMusic: "startPlayingMusic"
    }),
    //获取歌手详情
    getArtistDetail(id) {
      if (id) {
        singerApi.getArtistDetail(id).then(res => {
          console.log(res, "歌手详情");
          this.singerName = res.data.singer_info.name;
          this.fansCount = res.data.singer_info.fans;
        });
      }
    },
    getArtistMv(id) {
      if (id) {
        singerApi.getArtistMv(id).then(res => {
          console.log(res, "歌手mv列表");
        });
      }
    },
    getArtistAlbum(id) {
      if (id) {
        singerApi.getArtistAlbum(id).then(res => {
          console.log(res, "歌手专辑列表");
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
        return { name: item.musicData.songname, singer: item.musicData.singer[0].name, id: item.musicData.songmid };
      });
      this.startPlayingMusic({ list, index });
    }
  }
};
</script>

<style lang="scss" scoped>
.singer {
  position: relative;
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
  }
}
</style>