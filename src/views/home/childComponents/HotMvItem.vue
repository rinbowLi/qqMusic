<template>
  <div class="itemInfo clear" @click="$router.push(`/mv/${itemInfo.vid}`)">
    <img :src="itemInfo.picurl" alt @load="imgLoad" />
    <p>{{itemInfo.singers[0].name}}-{{itemInfo.title}}</p>
  </div>
</template>

<script>
export default {
  name: "HotMvItem",
  props: {
    itemInfo: Object,
    default() {
      return {};
    }
  },
  methods: {
    imgLoad() {
      this.$bus.$emit("itemImgLoad"); //图片加载完后刷新better-scroll的高度
    }
  }
};
</script>

<style scoped lang="scss">
.itemInfo {
  img {
    width: 100%;
  }
  p {
    text-align: center;
    margin: 0.1rem 0;
    font-size: var(--normal);
  }
}
</style>
