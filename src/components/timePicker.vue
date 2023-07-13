<template>
	<view>
		<picker :range="years" @change="yearChange" mode="multiSelector" @columnchange="wctchPicker" :value="timeValue">
			{{timeValue}}
		</picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timeValue: '请选择时间',
				years: [
					[],
					[],
					[],
					[],
					[],
					[]
				],
			}
		},
		mounted() {
			this.loadTime()
		},
		methods: {
			loadTime(e) {
				this.years[0] = []
				this.years[1] = []
				this.years[2] = []
				this.years[3] = []
				this.years[4] = []
				this.years[5] = []
				let now = new Date();
				let _year = now.getFullYear();
				let _month =now.getMonth() + 1; 
				let _day = now.getDate();
				// let _hour = (10 > now.getHours()) ? '0' + now.getHours() : now.getHours();
				// let _minute = (10 > now.getMinutes()) ? '0' + now.getMinutes() : now.getMinutes();
				// let _second = (10 > now.getSeconds()) ? '0' + now.getSeconds() : now.getSeconds();
				// let nowTime = _year + '-' + _month + '-' + _day + ' ' + _hour + ':' + _minute

				// 计算每月会有多少天
				let temp = new Date(_year, _month)
				let days = new Date(temp.getTime() - 864e5).getDate()
				// 首次加载显示年
				for (let y = _year; y < _year + 30; y++) {
					this.years[0].push(y)
				}
				// 首次加载显示月
				for (let m = _month; m <= 12; m++) {
					m = m > 10 ? m : '0' + m
					this.years[1].push(m)
				}
				// 首次加载显示日
				for (let d = _day + 1; d <= days; d++) {
					d = d >= 10 ? d : '0' + d
					this.years[2].push(d)
				}
				// 首次加载显示小时
				for (let h = 1; h <= 24; h++) {
					h = h >= 10 ? h : '0' + h
					this.years[3].push(h)
				}
				// 首次加载显示分钟
				for (let m = 1; m <= 60; m++) {
					m = m >= 10 ? m : '0' + m
					this.years[4].push(m)
				}

				// 首次加载显示秒
				for (let s = 1; s <= 60; s++) {
					s = s >= 10 ? s : '0' + s
					this.years[5].push(s)
				}
			},
			yearChange(e) {
				console.log('222',e);
				this.timeValue = this.years[0][e.detail.value[0]] + '年' + this.years[1][e.detail.value[1]] + '月' + this.years[2][e.detail
					.value[2]
				] + '日' + '  ' + this.years[3][e.detail.value[3]] + ':' + this.years[4][e.detail.value[4]]
				this.$emit('getTime', this.timeValue)
			},
			wctchPicker(e) {
				let info = e.detail
				let now = new Date();
				let _year = now.getFullYear();
				let _month = (10 > (now.getMonth() + 1)) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
				let _day = (10 > now.getDate()) ? '0' + now.getDate() : now.getDate();
				let _hour = (10 > now.getHours()) ? '0' + now.getHours() : now.getHours();
				let _minute = (10 > now.getMinutes()) ? '0' + now.getMinutes() : now.getMinutes();
				let _second = (10 > now.getSeconds()) ? '0' + now.getSeconds() : now.getSeconds();
				
				if (info.column == 0 && info.value > 0) {
					this.years[1] = []
					this.years[2] = []
					this.years[3] = []
					this.years[4] = []
					// 改变年的值后加载显示月
					for (let m = 1; m <= 12; m++) {
						this.years[1].push(m)
					}
					let temp = new Date(this.years[info.column][info.value], 1)
					let days = new Date(temp.getTime() - 864e5).getDate()
					// 改变年的值后加载显示日
					for (let d = 1; d <= days; d++) {
						this.years[2].push(d)
					}
					// 改变年的值后加载显示小时
					for (let h = 1; h <= 24; h++) {
						this.years[3].push(h)
					}
					// 改变年的值后加载显示分钟
					this.sList.forEach(s => {
						this.years[4].push(s)
					})
				} else if (info.column == 0 && info.value == 0) {
					this.loadTime()
				} else if (info.column == 1 && info.value > 0) {
					this.years[2] = []
					this.years[3] = []
					this.years[4] = []
					let temp = new Date(this.years[info.column][info.value], 1)
					let days = new Date(temp.getTime() - 864e5).getDate()
					// 改变月份加载显示日
					for (let d = 1; d <= days; d++) {
						this.years[2].push(d)
					}
					// 改变月份加载显示小时
					for (let h = 1; h <= 24; h++) {
						this.years[3].push(h)
					}
					// 改变月份加载显示分钟
					this.sList.forEach(s => {
						this.years[4].push(s)
					})
				} else if (info.column == 1 && info.value == 0) {
					this.years[2] = []
					this.years[3] = []
					this.years[4] = []
					let temp = new Date(this.years[info.column][info.value], 1)
					let days = new Date(temp.getTime() - 864e5).getDate()
					for (let d = 1; d <= days; d++) {
						if (d >= _day) {
							this.years[2].push(d)
						}
					}
					for (let h = 1; h <= 24; h++) {
						if (h >= _hour) {
							this.years[3].push(h)
						}
					}
					this.sList.forEach(s => {
						if (s >= _minute) {
							this.years[4].push(s)
						}
					})
				} else if (info.column == 2 && info.value > 0) {
					this.years[3] = []
					this.years[4] = []
					// 改变日的值加载显示小时
					for (let h = 1; h <= 24; h++) {
						this.years[3].push(h)
					}
					// 改变日的值加载显示分钟
					this.sList.forEach(s => {
						this.years[4].push(s)
					})
				} else if (info.column == 2 && info.value == 0) {
					this.years[3] = []
					this.years[4] = []
					for (let h = 1; h <= 24; h++) {
						if (h >= _hour) {
							this.years[3].push(h)
						}
					}
					this.sList.forEach(s => {
						if (s >= _minute) {
							this.years[4].push(s)
						}
					})
				} else if (info.column == 3 && info.value > 0) {
					this.years[4] = []
					// 改变小时的值加载显示分钟
					this.sList.forEach(s => {
						this.years[4].push(s)
					})
				} else if (info.column == 3 && info.value == 0) {
					this.years[4] = []
					this.sList.forEach(s => {
						if (s >= _minute) {
							this.years[4].push(s)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
</style>
