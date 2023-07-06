<template>
  <view class="content" :style="{ backgroundImage: bgHomeImg }">
    <text class="title">{{ title }}</text>
    <view class="tools">
      <text class="tools-item">亲口说</text>
      <text class="tools-item">上传录音</text>
    </view>
    <text class="sub-title">倾听了{{ count }}次对话</text>
    <text class="btn-title" @click="handleClick">{{ btntitle }}</text>
  </view>
</template>

<script>
import homeImg from '../../static/img/localImg';
export default {
  data() {
    return {
      title: '未语',
      btntitle: '说出想说的话，我会帮你传达',
      count: 1000
    }
  },
  onShow() {
    this.subTitle = ``
  },
  computed: {
    bgHomeImg() {
      return `url(${homeImg})`
    }
  },
  methods: {
    handleClick() {
      console.log('点击了');
    }
  },
}
</script>

<style>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100vw;
  height: 100vh;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: aliceblue;
}

.tools {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100rpx;
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
  border-bottom: 1px solid rgba(255, 255, 255, .3);
  padding-bottom: 8rpx;
}
</style>
