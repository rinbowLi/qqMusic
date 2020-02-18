<template>
  <div id="app">
    <keep-alive exclude="Mv,TopList,SongList,Search">
      <router-view />
    </keep-alive>
    <play v-if="!idMvList" />
  </div>
</template>
<script>
import Play from "./views/player/Play";
export default {
  name: "App",
  components: {
    Play
  },
  computed: {
    idMvList() {
      return this.$route.fullPath.indexOf("/mv/") > -1;
    }
  }
};
</script>

<style lang="scss">
.bottomGrow {
  margin-bottom: 0.6rem;
}
</style>
