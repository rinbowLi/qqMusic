<template>
  <div class="search">
    <header>
      <div class="searchBox">
        <svg
          t="1581831827324"
          class="icon back"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2704"
          width="20"
          height="20"
          @click="$router.back()"
        >
          <path
            d="M129.465 495.738c-11.408 11.408-11.408 29.855 0 41.142l351.952 351.952c11.408 11.408 29.855 11.408 41.142 0 5.703-5.703 8.496-13.107 8.496-20.631s-2.791-14.928-8.496-20.631l-302.194-302.194h650.627c16.142 0 29.127-12.986 29.127-29.127s-12.986-29.127-29.127-29.127h-650.627l302.194-302.194c5.703-5.703 8.496-13.107 8.496-20.631s-2.791-14.928-8.496-20.631c-11.408-11.408-29.855-11.408-41.142 0l-351.952 352.074z"
            fill="#ffffff"
            p-id="2705"
          />
        </svg>
        <i class="iconfont icon-icon-test"></i>
        <input placeholder="请输入歌手名或歌曲名" v-model="keyword" @keyup.enter="search()" />
        <div class="searchText" @click="search()">搜索</div>
      </div>
    </header>
    <div class="list" v-if="listInfo">
      <div class="singer" v-if="singerInfoDetail">
        <div class="name">
          <span>歌手:</span>
          {{singer.name}}
        </div>
        <div class="info">
          <span>专辑:{{singerInfoDetail.total_album}}</span>
          <span>粉丝:{{singerInfoDetail.singer_info.fans}}</span>
          <span>点播数:{{singerInfoDetail.extras[0].listen_count}}</span>
        </div>
      </div>
      <ul class="songList" v-if="listInfo">
        <li v-for="(item,index) in listInfo" @click="liClick(index)" :key="index">
          <div class="musicLogo">
            <svg
              t="1581845229045"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3653"
              width="20"
              height="20"
            >
              <path
                d="M179.2 1024C81.454545 1024 0 944.872727 0 844.8s79.127273-179.2 179.2-179.2c39.563636 0 76.8 13.963636 109.381818 37.236364l9.309091 6.981818V134.981818c0-34.909091 27.927273-62.836364 60.509091-62.836363l598.109091-69.818182h4.654545C993.745455 0 1024 27.927273 1024 62.836364v672.581818c0 48.872727-18.618182 93.090909-53.527273 125.672727-32.581818 32.581818-79.127273 51.2-125.672727 51.2-97.745455 0-179.2-79.127273-179.2-179.2 0-97.745455 79.127273-179.2 179.2-179.2 39.563636 0 79.127273 13.963636 109.381818 37.236364l9.309091 6.981818V286.254545l-605.090909 65.163637v493.381818c-2.327273 100.072727-81.454545 179.2-179.2 179.2z m0-295.563636c-65.163636 0-118.690909 53.527273-118.690909 118.690909s53.527273 118.690909 118.690909 118.690909 118.690909-53.527273 118.690909-118.690909c-2.327273-67.490909-53.527273-118.690909-118.690909-118.690909z m665.6-111.709091c-65.163636 0-118.690909 53.527273-118.690909 118.690909s53.527273 118.690909 118.690909 118.690909 118.690909-53.527273 118.690909-118.690909-53.527273-118.690909-118.690909-118.690909z m-488.727273-325.818182l605.090909-65.163636V60.509091l-598.109091 69.818182h-6.981818v160.581818z"
                p-id="3654"
                fill="#323233"
              />
            </svg>
          </div>
          <div class="name_li">{{item.name}}</div>
          <div class="singer_li">{{item.singer}}</div>
        </li>
      </ul>
    </div>
    <div class="searchHistory" v-if="searchHistory.length > 0&&!listInfo">
      <ul>
        <li v-for="(item,index) in searchHistory" :key="index" @click="searchForHistory(item)">
          <div class="item">
            <svg
              t="1581847046448"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4448"
              width="22"
              height="22"
            >
              <path
                d="M512 959.7C265.2 959.7 64.3 758.9 64.3 512S265.2 64.3 512 64.3 959.7 265.1 959.7 512 758.8 959.7 512 959.7z m0-833.6c-212.8 0-385.9 173.1-385.9 385.9S299.2 897.9 512 897.9 897.9 724.8 897.9 512 724.8 126.1 512 126.1z"
                p-id="4449"
                fill="#8a8a8a"
              />
              <path d="M774.4 589.2H434.8V265h61.8v262.4h277.8z" p-id="4450" fill="#8a8a8a" />
            </svg>
            <div>{{item}}</div>
          </div>
          <div class="close" @click.stop="deleteItem(index)">
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
                fill="#8a8a8a"
              />
            </svg>
          </div>
        </li>
      </ul>
      <div class="deleteAllHistory" v-if="searchHistory.length > 0">
        <span @click="deleteAllHistory()">清楚浏览记录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { searchApi } from "@/api/search"; // song singer
import { singerApi } from "@/api/artist";
import { mapActions } from "vuex";

import Vue from "vue";
import { Toast } from "vant";

Vue.use(Toast);

export default {
  name: "Search",
  data() {
    return {
      keyword: "",
      error: false,
      singer: null,
      singerInfo: null,
      singerInfoDetail: null,
      listInfo: null,
      searchHistory: []
    };
  },
  created() {
    const list = window.sessionStorage.getItem("searchHistory");
    this.searchHistory = JSON.parse(list);
  },
  methods: {
    search() {
      this.singerInfoDetail = null;
      this.singerInfo = null;
      if (!this.keyword) {
        Toast("请输入歌手名或歌曲名");
        return;
      }
      this.searchHistory.push(this.keyword);
      window.sessionStorage.setItem(
        "searchHistory",
        JSON.stringify(this.searchHistory)
      );
      searchApi.search("song", this.keyword).then(res => {
        if (res.data.list.length === 0) {
          this.error = true;
          return;
        }
        // 歌手信息注入
        if (
          res.data.list.length > 0 &&
          res.data.list[0].singer[0].name === this.keyword
        ) {
          this.singer = {};
          this.singer.name = res.data.list[0].singer[0].name;
          this.singer.id = res.data.list[0].singer[0].mid;
          singerApi.getArtistDetail(this.singer.id).then(res => {
            this.singerInfoDetail = res.data;
          });
        }
        // 歌曲列表注入
        this.listInfo = res.data.list.map(item => {
          return {
            name: item.songname,
            singer: item.singer[0].name,
            id: item.songmid
          };
        });
      });
    },
    searchForHistory(keywords) {
      this.singerInfoDetail = null;
      this.singerInfo = null;
      searchApi.search("song", keywords).then(res => {
        if (res.data.list.length === 0) {
          this.error = true;
          return;
        }
        // 歌手信息注入
        if (
          res.data.list.length > 0 &&
          res.data.list[0].singer[0].name === keywords
        ) {
          this.singer = {};
          this.singer.name = res.data.list[0].singer[0].name;
          this.singer.id = res.data.list[0].singer[0].mid;
          singerApi.getArtistDetail(this.singer.id).then(res => {
            this.singerInfoDetail = res.data;
          });
        }
        // 歌曲列表注入
        this.listInfo = res.data.list.map(item => {
          return {
            name: item.songname,
            singer: item.singer[0].name,
            id: item.songmid
          };
        });
      });
    },
    deleteItem(index) {
      this.searchHistory.splice(index, 1);
      window.sessionStorage.setItem(
        "searchHistory",
        JSON.stringify(this.searchHistory)
      );
    },
    deleteAllHistory() {
      this.searchHistory.splice(0, this.searchHistory.length);
      window.sessionStorage.setItem(
        "searchHistory",
        JSON.stringify(this.searchHistory)
      );
    },
    liClick(index) {
      this.startPlayingMusic({ index, list: this.listInfo });
    },
    ...mapActions({
      startPlayingMusic: "startPlayingMusic"
    })
  }
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  background-color: #8156e8;
  .searchBox {
    width: 80%;
    height: 0.5rem;
    margin-left: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .back {
      position: absolute;
      left: -0.3rem;
    }
    i {
      height: 0.25rem;
      width: 0.25rem;
      position: absolute;
      top: 0.18rem;
      left: 0.1rem;
      color: #93969c;
    }
    input {
      height: 0.25rem;
      width: 100%;
      padding: 0 0.3rem;
      border-radius: 0.25rem;
    }
    .searchText {
      font-size: var(--normal);
      color: #ffffff;
      position: absolute;
      right: -0.35rem;
      height: 0.3rem;
      line-height: 0.3rem;
    }
  }
}
.list {
  background: var(--background-color);
  margin-bottom: 0.6rem;
  .singer {
    display: flex;
    flex-flow: column;
    padding: 0 0.1rem;
    background: rgba(65, 90, 236, 0.06);
    .name {
      line-height: 0.3rem;
      font-weight: 600;
      span {
        color: var(--text-info);
        font-size: var(--normal);
      }
    }
    .info {
      display: flex;
      line-height: 0.2rem;
      font-size: var(--normal);
      color: #8156e8;
      span {
        margin-right: 0.05rem;
      }
    }
  }
  .songList {
    padding: 0 0.1rem;
    color: var(--text-color);
    li {
      border-bottom: 1px solid var(--border-color);
      height: 0.5rem;
      line-height: 0.25rem;
      padding-left: 0.35rem;
      position: relative;
      .singer_li {
        font-size: var(--normal);
        color: var(--text-info);
      }
      .musicLogo {
        position: absolute;
        left: 0;
        top: 0.15rem;
      }
    }
  }
}
.searchHistory {
  li {
    display: flex;
    justify-content: space-between;
    height: 0.5rem;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666666;
      margin-left: 0.2rem;
      svg {
        margin-right: 0.1rem;
      }
    }
    .close {
      margin-right: 0.1rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0.5rem;
    }
  }
  .deleteAllHistory {
    height: 0.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8156e8;
    span {
      height: 100%;
      line-height: .5rem;
    }
  }
}
</style>