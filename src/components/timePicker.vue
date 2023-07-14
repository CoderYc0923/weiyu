<template>
	<view>
		<picker :range="years" @change="yearChange" mode="multiSelector" @columnchange="wctchPicker" :value="pickerValue">
			{{ timeValue }}
		</picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			timeValue: '请选择时间',
			pickerValue: [],
			selectYear: 2023,
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
		getNowTimeValue() {
			let nowDate = new Date();
			let yearIndex = 1;
			let monthIndex = nowDate.getMonth() + 1;
			let datIndex = nowDate.getDate();
			let hourIndex = nowDate.getHours();
			let minuteIndex = nowDate.getMinutes();
			let secondIndex = nowDate.getSeconds();
			console.log(nowDate, yearIndex, monthIndex, datIndex, hourIndex, minuteIndex, secondIndex);
			this.pickerValue = [yearIndex - 1, monthIndex - 1, datIndex - 1, hourIndex - 1, minuteIndex - 1, secondIndex - 1]
		},
		createTimeData() {
			this.years[0] = []
			this.years[1] = []
			this.years[2] = []
			this.years[3] = []
			this.years[4] = []
			this.years[5] = []
			// 计算每月会有多少天
			let nowYear = new Date().getFullYear();
			let nowMonth = new Date().getMonth();
			let days = this.checkDays(nowMonth)
			// 首次加载显示年
			for (let y = nowYear; y < nowYear + 30; y++) {
				this.years[0].push(y)
			}
			// 首次加载显示月
			for (let m = 1; m <= 12; m++) {
				m = m >= 10 ? m : '0' + m
				this.years[1].push(m)
			}
			// 首次加载显示日
			for (let d = 1; d <= days; d++) {
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
		loadTime(e) {
			this.getNowTimeValue();
			this.createTimeData();
		},
		yearChange(e) {
			this.timeValue = this.years[0][e.detail.value[0]] + '-' + this.years[1][e.detail.value[1]] + '-' + this.years[2][e.detail
				.value[2]
			] + '  ' + this.years[3][e.detail.value[3]] + ':' + this.years[4][e.detail.value[4]] + ':' + this.years[5][e.detail.value[5]]
			let timestamp = Date.parse(new Date(this.timeValue)) / 1000
			this.$emit('getTime', timestamp)
		},
		setDay(days) {
			let daysArr = []
			for (let d = 1; d <= days; d++) {
				d = d >= 10 ? d : '0' + d
				daysArr.push(d)
			}
			return daysArr
		},
		checkLeapYear(year) {
			console.log('checkLeapYear', year);
			return (year % 4 === 0 && year % 100 !== 0)
		},
		checkDays(month) {
			let smallMonths = [3, 5, 8, 10]
			let days = 31
			if (smallMonths.includes(month)) days = 30;
			else if (month === 1) {
				days = this.checkLeapYear(this.selectYear) ? 29 : 28
			}
			return days
		},
		wctchPicker(e) {
			let info = e.detail
			const { column, value } = info;
			if (column === 0) {
				this.selectYear = this.years[0][value];
			}
			else if (column === 1) {
				let days = this.checkDays(value)
				this.years[2] = [...this.setDay(days)]
			}
		}
	}
}
</script>

<style lang="scss"></style>
