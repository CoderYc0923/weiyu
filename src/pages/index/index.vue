<template>
  <view class="content" :style="{ backgroundImage: bgHomeImg }">
    <text class="title">{{ title }}</text>

    <view class="tools" v-if="isShow">
      <view class="tools-bottom">
        <text class="tools-item">亲口说</text>
        <text class="tools-item" @click="uploadFile">上传录音</text>
      </view>
    </view>
    <text class="sub-title">倾听了{{ count }}次对话</text>
    <text class="btn-title" @click="handleClick">{{ btntitle }}</text>
  </view>
</template>

<script>
import homeImg from "../../static/img/localImg";
export default {
  data() {
    return {
      title: "未语",
      btntitle: "说出想说的话，我会帮你传达",
      count: 1000,
      isShow: false,
      extension: ["m4a", "mp3", "wav"],
      maxSize: 2 * 1024 * 1024,
    };
  },
  onShow() {},
  computed: {
    bgHomeImg() {
      return `url(${homeImg})`;
    },
  },
  methods: {
    handleClick() {
      this.isShow = true;
    },
    checkTypeAndSize(size, path) {
      if (size > this.maxSize) return false;
      let fileType = path.match(/[^.]+$/)[0];
      if (!this.extension.includes(fileType)) return false;
      return true;
    },
    createAudioPlay(path) {
      const innerAudioContext = uni.createInnerAudioContext();
      innerAudioContext.autoplay = true;
      innerAudioContext.src = path
      innerAudioContext.onPlay(() => {
        console.log("开始播放");
      });
      innerAudioContext.onError((res) => {
        console.log(res.errMsg);
        console.log(res.errCode);
      });
    },
    uploadFile() {
      let _this = this;
      wx.chooseMessageFile({
        count: 1,
        type: "file",
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFiles;
          const { size, path, name } = tempFilePaths[0];
          if (!_this.checkTypeAndSize(size, path)) {
            console.log("请选择音频");
            return;
          }
          _this.createAudioPlay(path);
        },
      });
    },
  },
};
</script>

<style>
.content {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: aliceblue;
}

.tools {
  position: relative;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100rpx;
}

.tools-bottom {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  color: #222121;
  font-size: 12px;
}

.tools-item {
  padding: 5rpx;
  border-bottom: 1px double rgba(0, 0, 0, 0.3);
}

.title {
  position: absolute;
  top: 50rpx;
  left: 100rpx;
}

.sub-title {
  position: absolute;
  top: 100rpx;
  left: 150rpx;
}

.btn-title {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 8rpx;
}
</style>
