<template>
    <view class="audio-show" @click="handleClick">
        <view class="show-item" v-for="(item, index) in showArr" :key="index" :style="{ '--d': item , 'animation-play-state': playState}"></view>
    </view>
</template>
  
<script>
export default {
    name: 'audioShow',
    data() {
        return {
            showArr: [7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7],
            playState: 'running'
        };
    },
    onShow() { },
    computed: {

    },
    methods: {
        handleClick() {
            this.playState = this.playState === 'paused' ? 'running' : 'paused'
            this.$emit('playState', this.playState)
        }
    },
};
</script>
  
<style>
.audio-show {
    --h: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: var(--h);
}

@keyframes dancing {
    0% {
        background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
        height: 20%;
        border-radius: calc(var(--h) * 0.2 * 0.5);
    }

    50% {
        background-image: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);
        height: 100%;
        border-radius: calc(var(--h) * 1 * 0.5);
    }

    100% {
        background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
        height: 20%;
        border-radius: calc(var(--h) * 0.2 * 0.5);
    }
}

.show-item {
    background: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);
    width: 8rpx;
    height: 20%;
    border-radius: calc(var(--h) * 0.2 * 0.5);
    margin-right: 8rpx;
    animation: dancing 1.5s infinite linear;
    animation-delay: calc(0.2s * var(--d));
}

.show-item:last-child {
    margin-right: 0px;
}
</style>
  