<template>
    <view class="record-show">
        <view class="show-box">
            <view class="start" @click="record">{{ showTitle() }}</view>
            <view class="btn" v-if="isStart">
                <view class="btn-item top" :style="{ 'animation-play-state': isPause ? 'paused' : 'running' }"></view>
                <view class="btn-item" :style="{ 'animation-play-state': isPause ? 'paused' : 'running' }"></view>
                <view class="btn-item bottom" :style="{ 'animation-play-state': isPause ? 'paused' : 'running' }"></view>
            </view>
            <view class="finish" @click="recordEnd">结束</view>
        </view>
    </view>
</template>
  
<script>
const recorderManager = uni.getRecorderManager();
export default {
    name: 'recordShow',
    data() {
        return {
            isStart: false,
            isPause: false,
            voicePath: '',
            fileSize: 0
        };
    },
    computed: {

    },
    methods: {
        showTitle() {
            if (!this.isStart) return '开始'
            else if (!this.isPause) return '暂停'
            else return '继续'
        },
        record() {
            if (!this.isStart) this.recordStart();
            else this.recordPaused();
        },
        recordPaused() {
            this.isPause ? recorderManager.resume() : recorderManager.pause();
        },
        recordStart() {
            if (this.isStart) return;
            recorderManager.start();
            let self = this
            recorderManager.onStart(function (res) {
                console.log('开始录音');
                self.isStart = true;
            });
            recorderManager.onStop(function (res) {
                console.log('recorder stop' + JSON.stringify(res));
                console.log('录音结束');
                self.voicePath = res.tempFilePath;
                self.fileSize = res.fileSize
                self.$emit('close', self.voicePath, self.fileSize)
            });
            recorderManager.onPause(function (res) {
                self.isPause = true;
                console.log('录音暂停');
            });
            recorderManager.onError(function (res) {
                console.log('录音错误');
                recorderManager.stop();
            });
            recorderManager.onResume(function (res) {
                self.isPause = false;
                console.log('录音继续');
            });
        },
        recordEnd() {
            console.log('recordEnd', this.isStart);
            if (this.isStart) {
                recorderManager.stop();
                this.isStart = false;
                this.isPause = false;
            } else {
                this.$emit('close', this.voicePath, this.fileSize)
            }
        }
    },
};
</script>
  
<style>
.record-show {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: transparent;
}

@keyframes recoding {
    0% {
        width: 0;
    }

    50% {
        width: 80%;
    }

    100% {
        width: 0;
    }
}

@keyframes recoding-top {
    0% {
        width: 0;
    }

    50% {
        width: 30%;
    }

    100% {
        width: 0;
    }
}

@keyframes recoding-bottom {
    0% {
        width: 0;
    }

    50% {
        width: 30%;
    }

    100% {
        width: 0;
    }
}

.btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 70%;
    height: 100%;
}

.btn-item {
    width: 0;
    height: 6rpx;
    background-color: beige;
    animation: recoding 1.5s infinite linear;
    animation-delay: 0;
}

.top {
    margin-bottom: 8rpx;
    animation: recoding-top 1.5s infinite linear;
    animation-delay: 1s;
}

.bottom {
    margin-top: 8rpx;
    animation: recoding-bottom 1.5s infinite linear;
    animation-delay: 2s;
}

.show-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 120rpx;
    border-radius: 120rpx;
    padding: 0 40rpx;
    background-color: transparent;
    backdrop-filter: blur(3px);
    font-size: 12px;
}
</style>
  