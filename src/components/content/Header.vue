<template>
  <ul>
    <li
      v-for="(item,index) in this.navInfo.nav"
      :class="{active:index===navInfo.activeIndex}"
      @click="$router.push(item.path)"
      :key="index"
    >{{item.name}}</li>
  </ul>
</template>

<script>
export default {
  name: "Header",
  props: {
    navInfo: Object,
    default() {
      return {};
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/css/mixin";
ul {
  @include flex-x;
  line-height: 3;
  background: var(--background-color);
  color: var(--text-info);
  z-index: 10;
  position: fixed;
  width: 100%;
  li {
    flex: 1;
    text-align: center;
    &.active {
      color: #8156e8;
      position: relative;
      &::after {
        content: "";
        width: 20%;
        position: absolute;
        left: 50%;
        bottom: 0.05rem;
        transform: translateX(-50%);
        border-bottom: 2px solid #fa192e;
      }
    }
  }
}
</style>
