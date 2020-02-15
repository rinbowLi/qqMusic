<template>
  <div class="item" @click="$router.push(`/list/${itemInfo.dissid}`)">
    <img v-lazy="itemInfo.imgurl" alt @load="imgLoad" />
    <p>{{itemInfo.dissname}}</p>
  </div>
</template>

<script>
export default {
  name: "HotSongItem",
  props: {
    itemInfo: Object,
    default() {
      return {};
    }
  },
  methods:{
    imgLoad() {
      this.$bus.$emit("itemImgLoad");  //图片加载完后刷新better-scroll的高度
    },
  }
};
</script>

<style scoped lang="scss">
.item {
  width: 100%;
  height: 100%;
  img {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 0.1rem;
  }
  p {
    margin-top: 0.05rem;
    font-size: var(--small-s);
    color: var(--text-info);
    text-align: center;
  }
}
</style>
