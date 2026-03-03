<template>
	<view class="custom-tabbar">
		<view class="tabbar-container">
			<view
				v-for="(item, index) in tabList"
				:key="index"
				:class="['tabbar-item', { active: currentIndex === index }]"
				@click="switchTab(item, index)"
			>
				<view class="tabbar-icon">
					<text v-if="currentIndex === index" class="icon-active">{{ item.selectedIcon }}</text>
					<text v-else class="icon-normal">{{ item.icon }}</text>
				</view>
				<text :class="['tabbar-text', { active: currentIndex === index }]">{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'CustomTabbar',
		props: {
			current: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				currentIndex: 0,
				tabList: [
					{
						pagePath: '/pages/index/index',
						text: '首页',
						icon: '🏠',
						selectedIcon: '🏠'
					},
					{
						pagePath: '/pages/identify/identify',
						text: '识别',
						icon: '📷',
						selectedIcon: '📷'
					},
					{
						pagePath: '/pages/encyclopedia/encyclopedia',
						text: '百科',
						icon: '📚',
						selectedIcon: '📚'
					}
				]
			}
		},
		watch: {
			current(newVal) {
				this.currentIndex = newVal;
			}
		},
		methods: {
			switchTab(item, index) {
				if (this.currentIndex === index) return;
				this.currentIndex = index;
				uni.switchTab({
					url: item.pagePath
				});
			}
		}
	}
</script>

<style lang="scss">
	.custom-tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		background: #ffffff;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tabbar-container {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100rpx;
	}

	.tabbar-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.tabbar-icon {
		font-size: 44rpx;
		margin-bottom: 4rpx;
	}

	.icon-normal,
	.icon-active {
		font-size: 44rpx;
	}

	.tabbar-text {
		font-size: 22rpx;
		color: #7a7e83;
	}

	.tabbar-text.active {
		color: #18C445;
		font-weight: 600;
	}
</style>
