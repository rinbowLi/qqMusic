<template>
  <div class="item">
    <div class="left">
      <img :src="img" alt />
    </div>
    <div class="right">
      <div class="title">{{itemInfo.album_name}}</div>
      <div class="count">共{{itemInfo.latest_song.song_count}}首</div>
      <div class="svg">
        <svg
          t="1581997896055"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2159"
          width="20"
          height="20"
        >
          <path
            d="M330.56 247.68a32 32 0 0 1 42.88-47.36l320 288a32 32 0 0 1 0 47.36l-320 288a32 32 0 0 1-42.88-47.36L624.32 512z"
            p-id="2160"
            fill="#707070"
          />
        </svg>
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
  },
  data(){
    return{
      img:require("@/assets/img/default.png")
    }
  }
};
</script>

<style scoped lang="scss">
.item {
  background: #fff;
  display: flex;
 padding: 0.1rem .15rem;
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
    .svg {
      position: absolute;
      right: 0.1rem;
      top: 0.2rem;
    }
  }
}
</style>
