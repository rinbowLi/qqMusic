<template>
  <div class="home">
    <Header :navInfo="navInfo" />
    <Scroll class="content" ref="scroll" :probeType="3">
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
      }
    };
  }
};
</script>
<style scoped>
.content {
  height: calc(100vh - 43px);
  position: relative;
  top: 43px;
}
</style>
