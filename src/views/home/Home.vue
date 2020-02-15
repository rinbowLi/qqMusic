<template>
  <div class="home">
    <Header :navInfo="navInfo" />
    <Scroll class="content" ref="scroll" :probeType="3" :class="{active:$store.state.playlist.length>0}">
      <section class="main">
        <HotSong />
        <HotMv />
      </section>
    </Scroll>
  </div>
</template>

<script>
import Header from "@/components/content/Header";
import Scroll from "@/components/common/scroll/Scroll";

import HotSong from "./childComponents/HotSong";
import HotMv from "./childComponents/HotMv";

import { debounce } from "@/assets/js/utils";

export default {
  name: "Home",
  components: {
    Header,
    HotMv,
    HotSong,
    Scroll
  },
  data() {
    return {
      navInfo: {
        activeIndex: 0,
        nav: [
          { name: "推荐", path: "/recommend" },
          { name: "排行", path: "/rank" },
          { name: "我喜欢", path: "/fav" }
        ]
      },
      itemIamgeFunc: null,
      newRefresh: null
    };
  },
  mounted() {
    this.newRefresh =
      this.$refs.scroll && debounce(this.$refs.scroll.refresh, 100);
    this.itemIamgeFunc = () => {
      this.newRefresh();
    };
    this.$bus.$on("itemImgLoad", this.itemIamgeFunc);
  }
};
</script>
<style scoped>
.home {
  position: relative;
}
.content {
  height: calc(100vh - 43px);
  position: relative;
  top: 43px;
}
.active{
  height: calc(100vh - 43px - 0.6rem);
}
</style>
