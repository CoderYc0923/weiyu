<template>
	<view class="date_area">
		<view class="date_row" v-for="(item, idx) in timeOptions" :key="`option${idx}`"
			@touchstart="onTouchStart($event, item.option)" @touchmove="onTouchMove($event, item.option)"
			@touchend="onTouchEnd($event, item.option)">
			<view class="date_row_line" v-for="(dateItem, dateIndex) in dateTime[`${item.option}Arr`]" :key="dateItem">
				{{ dateItem + ' ' + item.unit }}
			</view>
			<view class="date_row_line_bottom"></view>
		</view>
		<view class="selected_line"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			timeOptions: [{
				option: 'year',
				unit: '年'
			},
			{
				option: 'month',
				unit: '月'
			},
			{
				option: 'day',
				unit: '日'
			},
			{
				option: 'hour',
				unit: '时'
			},
			{
				option: 'minute',
				unit: '分'
			}, {
				option: 'second',
				unit: '秒'
			}],
			// 时间初始值
			dateTime: {
				yearArr: [], //年
				monthArr: [], //月
				dayArr: [], //日
				hourArr: [], //时
				minuteArr: [], //分
				secondArr: [], //秒
			},
			// 当前选中结果
			selectedDateTime: {
				year: null,
				month: null,
				day: null,
				hour: null,
				minute: null,
				second: null
			},
			// 年月日时分秒的默认位置 y轴
			translateYNumber: {
				year: 0,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0,
				second: 0
			},
			// 年月日时分秒 当前所在位置 y轴
			translateNow: {
				year: 0,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0,
				second: 0
			},
			// 年月日时分秒 起始位置  y轴
			start: {
				year: 0,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0,
				second: 0
			},
			// 年月日时分秒 当前位置  y轴
			current: {
				year: 0,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0,
				second: 0
			},
		}
	},
	mounted() {
		this.createdTime()
	},
	methods: {
		// 生成时间范围
		createdTime() {
			// 年
			let yearArr = [];
			// 月
			let monthArr = [];
			// 日
			let dayArr = [];
			// 时
			let hourArr = [];
			// 分
			let minuteArr = [];
			// 秒
			let secondArr = [];
			//生成年
			// 获取当前年份
			let nowYear = new Date().getFullYear();
			// 当前年份后50年
			let nowYearAfterArr = [];
			// 生成当前年份后50年
			for (let i = 1; i <= 50; i++) {
				nowYearAfterArr.push((nowYear + i).toString());
			}
			// 将当前数值年 转为 字符
			let nowYearString = nowYear.toString();
			yearArr = [...[nowYearString], ...nowYearAfterArr];
			//生成 月 
			for (let i = 1; i <= 12; i++) {
				if (i < 10) {
					let pushMonth = '0' + i;
					monthArr.push(pushMonth);
				} else {
					let pushMonth = i.toString();
					monthArr.push(pushMonth);
				}
			}
			// 生成日
			for (let i = 1; i <= 31; i++) {
				if (i < 10) {
					let pushDay = '0' + i;
					dayArr.push(pushDay);
				} else {
					let pushDay = i.toString();
					dayArr.push(pushDay);
				}
			}
			// 生成 时
			for (let i = 0; i < 24; i++) {
				if (i < 10) {
					let pushHour = '0' + i;
					hourArr.push(pushHour);
				} else {
					let pushHour = i.toString();
					hourArr.push(pushHour);
				}
			}
			// 生成 分 秒
			for (let i = 0; i < 60; i++) {
				if (i < 10) {
					let pushTime = '0' + i;
					minuteArr.push(pushTime);
					secondArr.push(pushTime);
				} else {
					let pushTime = i.toString();
					minuteArr.push(pushTime);
					secondArr.push(pushTime);
				}
			}
			this.dateTime.yearArr = yearArr;
			this.dateTime.monthArr = monthArr;
			this.dateTime.dayArr = dayArr;
			this.dateTime.hourArr = hourArr;
			this.dateTime.minuteArr = minuteArr;
			this.dateTime.secondArr = secondArr;
		},
		// 滑动开始
		onTouchStart(event, type) {
			this.start[type] = event.touches[0].clientY;
		},
		// 滑动进行中
		onTouchMove(event, type) {
			this.current[type] = event.touches[0].clientY;
			this.translateNow[type] = this.current[type] - this.start[type] + this.translateYNumber[type];
		},
		// 滑动结束
		onTouchEnd(event, type) {
			console.log('onTouchEnd',event);
			let index = Math.round(-this.translateNow[type] / 30);
			this.translateNow[type] = -index * 30;
			this.translateYNumber[type] = this.translateNow[type];
			// 上滑的最小高度
			let minHeight = 90;
			if (this.translateNow[type] >= minHeight) {
				this.translateNow[type] = minHeight;
				this.translateYNumber[type] = minHeight;
			}
			// 下滑的最大高度  取反
			//  因为  最多显示 7条  前四条 取正值（0，30，60，90） 所以减去
			let maxHeight = -((this.dateTime[type + 'Arr'].length - 4) * 30);
			if (this.translateNow[type] <= maxHeight) {
				this.translateNow[type] = maxHeight;
				this.translateYNumber[type] = maxHeight;
			}
			// 计算处于选中框内的数据
			index = Math.round(-this.translateNow[type] / 30) + 3;
			this.selectedDateTime[type] = this.dateTime[type + 'Arr'][index];
		},
	},
}
</script>

<style>
::-webkit-scrollbar {
	display: none;
}

.date_area {
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 5px 0px;
	position: relative;
	min-height: 1px;
}

.date_row {
	padding-top: calc(60rpx * 2);
	height: calc(60rpx * 3);
	overflow: auto;
	scroll-snap-type: y mandatory;
}

.date_row_line {
	height: 60rpx;
	line-height: 60rpx;
	font-size: 14px;
	color: black;
	scroll-snap-align: center;
}

.date_row_line_bottom {
	height: calc(60rpx * 2);
	line-height: calc(60rpx * 2);
}

.selected_line {
	pointer-events: none;
	position: absolute;
	left: 0;
	top: calc(60rpx * 2.25);
	width: 100%;
	height: 60rpx;
	border-top: 1px solid #000;
	border-bottom: 1px solid #000;
	z-index: 90;
}
</style>
