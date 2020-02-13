<template>
  <div class="hotList">
    <h3>热门歌单</h3>
    <div class="ulWrapper">
      <ul class="listView" v-if="listItems">
        <li v-for="item in listItems" :key="item.id">
          <HotSongItem :itemInfo="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { listApi } from "@/api/list";
import HotSongItem from "@/views/home/childComponents/HotSongItem";

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
  methods: {
    init() {
      listApi.getSongListHot(10000000, 1).then(ret => {
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
    height: 1.6rem;
    overflow-y: hidden;

    ul.listView {
      @include flex-x;
      overflow-x: auto;

      li {
        flex-shrink: 0;
        margin-right: 0.15rem;
        width: 1.2rem;
        height: 1.6rem;
      }
    }
  }
}
</style>
