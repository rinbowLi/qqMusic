<template>
  <div class="search">
    <header>
      <div class="searchBox">
        <i class="iconfont icon-flow back" @click="$router.back()"></i>
        <i class="iconfont icon-sousuo"></i>
        <input
          placeholder="请输入歌手名或歌曲名"
          v-model="keyword"
          ref="searchInput"
          @keyup.enter="search(-1)"
        />
        <div class="searchText" @click="search(-1)">搜索</div>
      </div>
    </header>
    <div class="list" v-if="listInfo.length>0">
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
      <Scroll
        class="content"
        ref="scroll"
        :probeType="3"
        :pullUpLoad="true"
        @pullingUp="loadMore"
        :style="{'top':singerInfoDetail?'1rem':'.5rem','bottom':$store.state.playlist.length>0?'0.64rem':'0'}"
        v-if="listInfo.length>0"
      >
        <ul class="songList" v-if="listInfo">
          <li v-for="(item,index) in listInfo" @click="liClick(index)" :key="item.id + index">
            <div class="musicLogo">
              <i class="iconfont icon-yinyue" />
            </div>
            <div class="name_li">{{item.name}}</div>
            <div class="singer_li">{{item.singer}}</div>
          </li>
        </ul>
      </Scroll>
    </div>
    <div class="searchHistory" v-if="searchHistory.length > 0&&listInfo.length==0">
      <ul>
        <li v-for="(item,index) in searchHistory" :key="index" @click="searchForHistory(item)">
          <div class="item">
             <i class="iconfont icon-lishijilu"></i>
            <div>{{item}}</div>
          </div>
          <div class="close" @click.stop="deleteItem(index)">
              <i class="iconfont icon-guanbi"></i>
          </div>
        </li>
      </ul>
      <div class="deleteAllHistory" v-if="searchHistory.length > 0">
        <span @click="deleteAllHistory()">清除浏览记录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { searchApi } from "@/api/search"; // song singer
import { singerApi } from "@/api/artist";
import { mapActions } from "vuex";

import Scroll from "@/components/common/scroll/Scroll";
import { throttle } from "@/assets/js/utils";

import Vue from "vue";
import { Toast } from "vant";

Vue.use(Toast);

export default {
  name: "Search",
  components: {
    Scroll
  },
  data() {
    return {
      keyword: "",
      error: false,
      singer: null,
      singerInfo: null,
      singerInfoDetail: null,
      listInfo: [],
      searchHistory: [],
      curPage: -1
    };
  },
  created() {
    const list = window.sessionStorage.getItem("searchHistory");
    this.searchHistory = JSON.parse(list) || [];
  },
  mounted() {
    this.$refs.searchInput.focus();
  },
  methods: {
    search(curPage) {
      this.singerInfoDetail = null;
      this.singerInfo = null;
      if (!this.keyword) {
        Toast("请输入歌手名或歌曲名");
        return;
      }
      //不存在时才加上
      if (this.searchHistory.indexOf(this.keyword) === -1) {
        this.searchHistory.push(this.keyword);
        window.sessionStorage.setItem(
          "searchHistory",
          JSON.stringify(this.searchHistory)
        );
      }
      searchApi.search("song", this.keyword, curPage + 1).then(res => {
        if (res.data.list.length === 0) {
          this.error = true;
          Toast.fail("没有更多内容咯");
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
        let listInfo1 = res.data.list.map(item => {
          return {
            name: item.songname,
            singer: item.singer[0].name,
            id: item.songmid
          };
        });
        this.listInfo = [...this.listInfo, ...listInfo1];
        this.curPage++;

        this.$nextTick(() => {
          this.$refs.scroll.finishPullUp(); // 上拉加载动作完成后调用此方法告诉BScroll完成一次上拉动作
        });
      });
    },
    searchForHistory(keywords) {
      this.singerInfoDetail = null;
      this.singerInfo = null;
      this.keyword = keywords;
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
        this.curPage++;
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
    loadMore() {
      let that = this;
      const search = throttle(that.search, 1000);
      search(that.curPage);
      this.$refs.scroll.refresh(); // DOM 结构发生变化后，重新初始化BScroll
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
      color: #ffffff;
      font-size: 0.2rem;
      top: 0.15rem;
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
  .content {
    overflow: hidden;
    position: absolute;
    top: 1rem;
    left: 0;
    right: 0;
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
      .name_li {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .musicLogo {
        position: absolute;
        left: 0;
        top: 0.15rem;
        i {
          color: #323233;
          height: 20px;
          width: 20px;
        }
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
      i {
        margin-right: 0.1rem;
        font-size: .2rem;
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
      line-height: 0.5rem;
    }
  }
}
</style>