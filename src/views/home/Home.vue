<template comments>
  <!-- 这是一个测试备注 -->
  <div class="home">
    <!-- 这是一个测试备注 -->
    <Header :navInfo="navInfo" />
    <SearchBar @click.native="gotoSearch"></SearchBar>
    <Scroll
      class="content"
      ref="scroll"
      :probeType="3"
      :class="{active:$store.state.playlist.length>0}"
    >
      <section class="main">
        <HotSong />
        <HotMv />
      </section>
    </Scroll>
    <!-- 这是一个测试备注 -->
  </div>
</template>

<script>
import Header from "@/components/content/header/Header";
import Scroll from "@/components/common/scroll/Scroll";
import SearchBar from "@/components/content/searchBar/SearchBar";

import HotSong from "./childComponents/HotSong";
import HotMv from "./childComponents/HotMv";

import { debounce } from "@/assets/js/utils";

export default {
  //comments: true,
  name: "Home",
  components: {
    Header,
    HotMv,
    HotSong,
    Scroll,
    SearchBar
  },
  data() {
    return {
      navInfo: {
        activeIndex: 0,
        nav: [
          { name: "推荐", path: "/" },
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
  },
  methods: {
    gotoSearch() {
      this.$router.push("/search");
    }
  }
};
</script>
<style scoped>
.home {
  position: relative;
}
.content {
  height: calc(100vh - 0.94rem);
  position: relative;
  top: 0.94rem;
}
.active {
  height: calc(100vh - 0.94rem - 0.6rem);
}
</style>
