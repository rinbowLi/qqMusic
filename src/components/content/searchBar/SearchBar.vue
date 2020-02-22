<template>
  <div class="search">
    <div class="searchBox">
      <i class="iconfont icon-sousuo">搜索</i>
    </div>
  </div>
</template>

<script>
export default {
  name: "search"
};
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
  height: 0.47rem;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  position:fixed;
  z-index: 10;
  top: .47rem;
  left: 0;
  .searchBox {
    background-color: #ffffff;
    height: 0.25rem;
    width: 80%;
    border-radius: .25rem;
    text-align: center;
    line-height: .25rem;
    i {
      font-size: var(--normal-s);
      color: var(--text-info);
    }
  }
}
</style>