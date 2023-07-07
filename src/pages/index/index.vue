<template>
  <view class="content" :style="{ backgroundImage: bgHomeImg }">
    <text class="title">{{ title }}</text>
    <view class="tools" v-if="!isShow">
      <audio-show @playState="watchPlayState" v-if="isPlay"></audio-show>
      <view class="tools-bottom">
        <text class="tools-item" @click="startRecord">亲口说</text>
        <text class="tools-item" @click="uploadFile">上传录音</text>
      </view>
    </view>
    <text class="sub-title">倾听了{{ count }}次对话</text>
    <text class="btn-title" @click="handleClick">{{ btntitle }}</text>
    <record-show @close="close" v-if="showRecord"></record-show>
  </view>
</template>

<script>
import audioShow from '../../components/audioShow'
import recordShow from '../../components/recordShow'
import homeImg from "../../static/img/localImg";
var innerAudioContext;
export default {
  components: {
    audioShow,
    recordShow
  },
  data() {
    return {
      title: "未语",
      btntitle: "说出想说的话，我会帮你传达",
      count: 1000,
      isShow: false,
      extension: ["m4a", "mp3", "wav", "aac"],
      maxSize: 2 * 1024 * 1024,
      isPlay: false,
      showRecord: false,
    };
  },
  onUnload() {
    if (innerAudioContext) {
      innerAudioContext.destroy();
    }
  },
  computed: {
    bgHomeImg() {
      return `url(${homeImg})`;
    },
  },
  methods: {
    handleClick() {
      this.isShow = true;
    },
    startRecord() {
      this.showRecord = true
    },
    close(voicePath, fileSize) {
      this.showRecord = false
      if (!voicePath) {
        console.log('录音为空');
        return;
      };
      if (!this.checkTypeAndSize(fileSize, voicePath)) {
        console.log("录音格式错误或大小超出限制");
        return;
      }
      this.createAudioPlay(voicePath);
    },
    watchPlayState(state) {
      switch (state) {
        case 'running':
          innerAudioContext.play();
          break;
        case 'paused':
          innerAudioContext.pause();
      }
    },
    checkTypeAndSize(size, path) {
      if (size > this.maxSize) return false;
      let fileType = path.match(/[^.]+$/)[0];
      if (!this.extension.includes(fileType)) return false;
      return true;
    },
    createAudioPlay(path) {
      if (innerAudioContext) {
        console.log('已存在音频');
        return;
      }
      innerAudioContext = uni.createInnerAudioContext();
      innerAudioContext.autoplay = true;
      innerAudioContext.src = path
      innerAudioContext.onCanplay(() => {
        console.log("可以播放");
      });
      innerAudioContext.onPlay(() => {
        console.log("开始播放");
        this.isPlay = true;
      });
      innerAudioContext.onPause(() => {
        console.log("暂停播放");
      });
      innerAudioContext.onEnded(() => {
        console.log("播放结束");
        this.isPlay = false;
        innerAudioContext.destroy();
      });
      innerAudioContext.onError((res) => {
        console.log(res.errMsg);
        console.log(res.errCode);
        innerAudioContext.destroy();
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
