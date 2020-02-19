<template>
  <div class="progressBar" ref="progressBar">
    <div class="wrapper">
      <div class="progress" ref="progress"></div>
      <div
        class="progressBtnWrapper"
        ref="progressBtn"
        @touchstart.prevent="handleTouchStart"
        @touchmove.prevent="handleTouchMove"
        @touchend.prevent="handleTouchEnd"
      >
        <div class="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      touch: {},
      barPercentWidth: null
    };
  },
  watch: {
    percent(newVal) {
      if (this.touch.onTouch) {
        return false;
      }
      this._offset(newVal * this.barPercentWidth);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // todo 一直拿不到宽度,只能这样拿
      let ret = document.documentElement.style.fontSize.split("px")[0] * 1;
      this.barPercentWidth = 2.7 * ret - 16;
    },
    handleTouchStart(e) {
      this.touch.onTouch = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    handleTouchMove(e) {
      this._emitPercent();
      let deltaX = e.touches[0].pageX - this.touch.startX;
      // 最大偏移量不能大过barPercentWidth,最小偏移量不能小于0
      const offsetWidth = Math.min(
        this.barPercentWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
    },
    handleTouchEnd() {
      this.touch.onTouch = false;
      let percent = this.$refs.progress.clientWidth / this.barPercentWidth;
      this.$emit("percentChangeEnd", percent);
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style.transform = `translateX(${offsetWidth}px)`;
    },
    _emitPercent() {
      let percent = this.$refs.progress.clientWidth / this.barPercentWidth;
      this.$emit("percentChange", percent);
    }
  }
};
</script>

<style scoped lang="scss">
.progressBar {
  height: 0.3rem;
  width: 2.7rem;
  touch-action: none;
  .wrapper {
    position: relative;
    top: 0.13rem;
    height: 0.04rem;
    background: rgba(129, 86, 232, 0.3);

    .progress {
      position: absolute;
      left: 0;
      height: 100%;
      background: rgb(216, 255, 75);
    }

    .progressBtnWrapper {
      position: absolute;
      width: 0.32rem;
      height: 0.32rem;
      /*border: 1px solid red;*/
      top: -0.13rem;
      left: -0.08rem;

      .progressBtn {
        position: relative;
        top: 0.07rem;
        left: 0.07rem;
        width: 0.16rem;
        height: 0.16rem;
        border: 0.05rem solid #f1f1f1;
        background: #d44439;
        border-radius: 50%;
      }
    }
  }
}
</style>
