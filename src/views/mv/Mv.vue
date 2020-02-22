<template>
  <div class="mv">
    <div class="header">
      <i class="iconfont icon-flow"  @click="$router.back()"></i>
      <div class="title">{{videoTitle}}</div>
      <div class="like">喜欢</div>
    </div>

    <video :src="videoSrc" autoplay controls :poster="pic"></video>
    <a class="download" target="_blank" download="test.mp4" :href="videoSrc">下载</a>
    <div class="info">
      <h3>简介</h3>
      <p>歌手:{{singer}}</p>
      <p>{{videoDesc}}</p>
    </div>
  </div>
</template>

<script>
import { mvApi } from "@/api/mv";
export default {
  name: "Mv",
  data() {
    return {
      videoSrc: "",
      videoTitle: "",
      pic: "",
      videoDesc: "",
      singer: ""
    };
  },
  created() {
    this.getURL();
  },
  methods: {
    getURL() {
      const id = this.$route.params.id;
      this.videoSrc = `https://v1.itooi.cn/tencent/mvUrl?id=${id}&quality=480`;
      mvApi.getMvDetail(id).then(res => {
        const videoInfo = res.data[id];
        this.videoTitle = videoInfo.name;
        this.videoDesc = videoInfo.desc;
        this.pic = videoInfo.cover_pic;
        this.singer = videoInfo.singers[0].name;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mv {
  min-height: 100vh;
}
video {
  width: 100%;
  min-height: 2.34rem;
}
.header {
  width: 100%;
  display: flex;
  height: 0.5rem;
  line-height: 0.5rem;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: #8156e8;
  i{
    font-size: .3rem;
  }
  .title {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
}
.download {
  display: block;
  background: #8156e8;
  width: 75%;
  padding: 0.1rem;
  border-radius: 0.3rem;
  margin: 0.1rem auto;
  text-align: center;
  color: white;
}
.info {
  padding: 0.1rem;
  h3 {
    line-height: 0.3rem;
    font-weight: 600;
  }
  p {
    line-height: 1.2;
    &:nth-of-type(1) {
      color: var(--text-info);
      margin-bottom: 0.3rem;
    }
  }
}
</style>