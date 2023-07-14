<template>
  <view class="content" :style="{ backgroundImage: bgHomeImg }">
    <text class="title">{{ title }}</text>
    <view class="tools" v-if="showAudio">
      <audio-show ref="audioShowRef" v-if="isPlay"></audio-show>
      <view class="tools-bottom">
        <text class="tools-item" @click="startRecord">亲口说</text>
        <text class="tools-item" @click="changeState" v-if="isPlay">{{ stateTitle }}</text>
        <text class="tools-item" @click="uploadFile">上传录音</text>
      </view>
    </view>
    <template v-if="showOther">
      <text class="email-title">把想说的话塞进她（他）的邮箱吧</text>
      <input class="uni-input" focus confirm-type="send" @confirm="handleComfirm" @blur="handleComfirm" />
      <time-picker class="time-box" @getTime="getTime"></time-picker>
    </template>
    <text class="sub-title">倾听了{{ count }}次对话</text>
    <text class="btn-title" @click="handleClick">{{ btnTitle }}</text>
    <record-show @close="close" v-if="showRecord"></record-show>
  </view>
</template>

<script>
import audioShow from '../../components/audioShow'
import recordShow from '../../components/recordShow'
import timePicker from '../../components/timePicker.vue'
import homeImg from "../../static/img/localImg";
import showMessage from '../../utils/showMessage'

import { submitEmail } from '../../api/index'

var innerAudioContext;
export default {
  components: {
    audioShow,
    recordShow,
    timePicker
  },
  data() {
    return {
      title: "未语",
      count: 1000,
      btnTitle: '',
      maxSize: 2 * 1024 * 1024,
      extension: ["m4a", "mp3", "wav", "aac"],
      playState: 'paused',
      stateTitle: '',
      rules: [],
      activeEmail: '',
      activeAudio: '',
      activeTime: '',
      isPlay: false,
      showRecord: false,
      showAudio: false,
      showOther: false,
      isPass: false
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
  watch: {
    showAudio: {
      handler(newV, oldV) {
        this.btnTitle = newV ? '继续完成后面的步骤吧' : '说出想说的话，我会帮你传达'
      },
      immediate: true
    },
    showOther: {
      handler(newV, oldV) {
        this.btnTitle = newV ? '一切就绪，发送给她（他）吧' : this.btnTitle
      },
      immediate: true
    },
    playState: {
      handler(newV, oldV) {
        this.stateTitle = this.showState(newV)
      },
      immediate: true
    }
  },
  methods: {
    changeState() {
      this.playState = this.playState === 'running' ? 'paused' : 'running'
      this.watchPlayState(this.playState)
    },
    showState(state) {
      let stateTitle = ''
      switch (state) {
        case 'running':
          stateTitle = '暂停';
          break;
        case 'paused':
          stateTitle = '播放'
          break;
      }
      return stateTitle;
    },
    checkRules(rules) {
      if (!rules.length) return true;
      for (let rule of rules) {
        if (!this[rule.stats]) {
          showMessage(rule.msg);
          return false
        }
      }
      return true
    },
    handleClick() {
      if (this.checkRules(this.rules)) {
        this.showAudio ? this.handleNext() : this.handleAudio()
      }
    },
    handleAudio() {
      this.showAudio = true;
      this.rules = [
        {
          stats: 'activeAudio',
          msg: '还没说出你想说的话喔'
        }
      ]
    },
    handleNext() {
      this.showOther ? this.handleSubmit() : this.handleOthers()
    },
    handleOthers() {
      this.showOther = true;
      this.rules = [{
        stats: 'activeAudio',
        msg: '还没说出你想说的话喔'
      }, {
        stats: 'activeEmail',
        msg: '还没填写你要寄送的邮箱喔'
      }, {
        stats: 'activeTime',
        msg: '还没选择你要寄送的时间喔'
      }]
    },
    handleSubmit() {
      this.sendMail();
    },
    getTime(timestamp) {
      this.activeTime = timestamp
    },
    sendMail() {
      if (this.checkMail(this.activeEmail)) {
        //调用接口发送请求
        let params = {
          send_email: this.activeEmail,
          audio_url: this.activeAudio,
          send_html: '',
          send_time: this.activeTime
        }
        submitEmail(params).then((res) => {
          console.log('submitEmail', res);
        }).catch(err => {
          console.log(err);
        })
      } else {
        showMessage('输入的邮箱有误喔')
      }
    },
    checkMail(email) {
      const reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
      return reg.test(email)
    },
    handleComfirm(e) {
      this.activeEmail = e.detail.value
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
      this.activeAudio = voicePath
      this.createAudioPlay(voicePath);
      this.canEmail = true;
    },
    watchPlayState(state) {
      switch (state) {
        case 'running':
          innerAudioContext.play();
          break;
        case 'paused':
          innerAudioContext.pause();
          break;
      }
      this.$refs.audioShowRef.changeState(state)
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
      this.activeAudio = path;
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
        this.playState = 'paused';
        this.$refs.audioShowRef.changeState('paused')
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
          _this.canEmail = true;
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
  top: 200rpx;
  left: 100rpx;
}

.sub-title {
  position: absolute;
  top: 250rpx;
  left: 150rpx;
}

.email-title {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
}

.uni-input {
  box-sizing: border-box;
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  border-radius: 80rpx;
  box-shadow: 0 0 6rpx 4rpx rgba(255, 255, 255, .6);
  font-size: 12px;
  height: 60rpx;
  padding: 0 15%;
}

.time-box {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
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
