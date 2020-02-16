<template>
  <div class="mv">
    <div class="header">
      <svg
        t="1581831827324"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2704"
        width="20"
        height="20"
        @click="$router.back()"
      >
        <path
          d="M129.465 495.738c-11.408 11.408-11.408 29.855 0 41.142l351.952 351.952c11.408 11.408 29.855 11.408 41.142 0 5.703-5.703 8.496-13.107 8.496-20.631s-2.791-14.928-8.496-20.631l-302.194-302.194h650.627c16.142 0 29.127-12.986 29.127-29.127s-12.986-29.127-29.127-29.127h-650.627l302.194-302.194c5.703-5.703 8.496-13.107 8.496-20.631s-2.791-14.928-8.496-20.631c-11.408-11.408-29.855-11.408-41.142 0l-351.952 352.074z"
          fill="#8156e8"
          p-id="2705"
        />
      </svg>
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
  .title {
  }
}
.download {
  display: block;
  background: #8156e8;
  width: 80%;
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