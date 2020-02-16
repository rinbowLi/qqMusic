<template>
  <div id="app">
    <router-view />
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
