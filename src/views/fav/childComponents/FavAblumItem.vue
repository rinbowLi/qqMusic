<template>
  <div class="item">
    <div class="left">
      <img :src="itemInfo.logo" alt />
    </div>
    <div class="right">
      <div class="title">{{itemInfo.dissname}}</div>
      <div class="count">共{{itemInfo.songnum}}首</div>
      <div class="svg">
        <i class="iconfont icon-xiangyou"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FavAblumItem",
  props: {
    itemInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>

<style scoped lang="scss">
.item {
  background: #fff;
  display: flex;
  padding: 0.1rem 0.15rem;
  border-radius: 0.08rem;
  overflow: hidden;
  margin-top: 0.1rem;
  background: var(--background-color);
  .left {
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    img {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 0.1rem;
    }
  }
  .right {
    width: 80%;
    padding-left: 3%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;

    .title {
      color: #333333;
      font-size: 0.17rem;
      margin-bottom: 0.1rem;
    }
    .count {
      color: #999;
      font-size: 0.14rem;
    }

    i {
      position: absolute;
      right: 0.1rem;
      top: 0.2rem;
      font-size: 0.3rem;
    }
  }
}
</style>
