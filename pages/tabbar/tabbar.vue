<template>
	<view>
		<slot></slot>
		<view class="tabbar">
			<view
				v-for="(item, index) in tabList"
				:key="index"
				:class="['tab-item', { active: currentIndex === index }]"
				@click="switchTab(item, index)"
			>
				<view class="tab-icon">
					<text v-if="currentIndex === index" class="icon-text">{{ item.selectedIcon }}</text>
					<text v-else class="icon-text">{{ item.icon }}</text>
				</view>
				<text :class="['tab-text', { active: currentIndex === index }]">{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TabBar',
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
			current: {
				immediate: true,
				handler(newVal) {
					this.currentIndex = newVal;
				}
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
	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 1000;
	}

	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.tab-icon {
		font-size: 44rpx;
		margin-bottom: 4rpx;
	}

	.icon-text {
		font-size: 44rpx;
	}

	.tab-text {
		font-size: 22rpx;
		color: #7a7e83;
	}

	.tab-text.active {
		color: #18C445;
		font-weight: 600;
	}
</style>
