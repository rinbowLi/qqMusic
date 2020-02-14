<template>
  <div class="hotList">
    <h3>热门歌单</h3>
    <div class="ulWrapper">
      <!-- <ul class="listView" v-if="listItems">
        <li v-for="item in listItems" :key="item.id">
          <HotSongItem :itemInfo="item" />
        </li>
      </ul>-->
      <van-grid :border="false" :column-num="3" class="listView">
        <van-grid-item v-for="item in listItems1" :key="item.id" class="listViewItem">
          <HotSongItem :itemInfo="item" />
        </van-grid-item>
      </van-grid>
      <van-grid :border="false" :column-num="3" class="listView">
        <van-grid-item v-for="item in listItems2" :key="item.id" class="listViewItem">
          <HotSongItem :itemInfo="item" />
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { listApi } from "@/api/list";
import HotSongItem from "@/views/home/childComponents/HotSongItem";

import Vue from "vue";
import { Grid, GridItem } from "vant";
Vue.use(Grid);
Vue.use(GridItem);

export default {
  name: "HotSongList",
  components: { HotSongItem },
  data() {
    return {
      listItems: []
    };
  },
  created() {
    this.init();
  },
  computed: {
    listItems1() {
      return this.listItems.slice(0, 3); //取前三位
    },
    listItems2() {
      return this.listItems.slice(3); //取后三位
    }
  },
  methods: {
    init() {
      listApi.getSongListHot(10000000, 1, 1, 6).then(ret => {
        if (ret.code === 200) {
          this.listItems = ret.data.list;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/css/mixin";

div.hotList {
  padding-left: 0.15rem;

  h3 {
    font-size: var(--large);
    font-weight: 600;
    line-height: 2;
  }

  div.ulWrapper {
    height: 3.8rem;
    overflow-y: hidden;

    .listView {
      @include flex-x;
      overflow-x: hidden;

      .listViewItem {
        flex-shrink: 0;
        width: 1.2rem;
        height: 1.9rem;
      }
    }
  }
}
</style>
