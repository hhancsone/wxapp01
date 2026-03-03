<template>
	<view class="identify-records-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="page-title">识别记录</text>
			<view class="placeholder"></view>
		</view>

		<view class="records-list" v-if="records.length > 0">
			<view class="record-item" v-for="(item, index) in records" :key="item._id" @click="goToDetail(item)">
				<view class="item-icon">
					<image v-if="item.image_url" class="herb-img" :src="item.image_url" mode="aspectFill"></image>
					<text v-else class="icon-text">🔍</text>
				</view>
				<view class="item-info">
					<text class="item-name">{{ item.herb_name || '未知药材' }}</text>
					<view class="item-meta">
						<text class="item-confidence">匹配度: {{ item.confidence || 0 }}%</text>
						<text class="item-time">{{ formatTime(item.identify_time) }}</text>
					</view>
				</view>
				<view class="arrow-icon">
					<text class="arrow">›</text>
				</view>
			</view>
		</view>

		<view v-else class="empty-state">
			<text class="empty-icon">🔍</text>
			<text class="empty-text">暂无识别记录</text>
			<text class="empty-hint">快去识别药材吧</text>
		</view>

		<view class="custom-tabbar">
			<view class="tabbar-item" @click="switchTab(0)">
				<text class="tab-icon">🏠</text>
				<text class="tab-text">首页</text>
			</view>
			<view class="tabbar-item" @click="switchTab(1)">
				<text class="tab-icon">📷</text>
				<text class="tab-text">识别</text>
			</view>
			<view class="tabbar-item" @click="switchTab(2)">
				<text class="tab-icon">📚</text>
				<text class="tab-text">百科</text>
			</view>
			<view class="tabbar-item" @click="switchTab(3)">
				<text class="tab-icon active">👤</text>
				<text class="tab-text active">我的</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	
	export default {
		data() {
			return {
				records: [],
				isLoading: false
			}
		},
		computed: {
			userInfo() {
				return store.userInfo || {};
			}
		},
		onShow() {
			mutations.updateUserInfo();
			this.loadRecords();
		},
		methods: {
			async loadRecords() {
				this.isLoading = true;
				try {
					const userId = this.userInfo._id || this.userInfo.uid;
					console.log('用户信息:', this.userInfo);
					console.log('用户ID:', userId);
					
					if (!userId) {
						console.log('用户未登录');
						this.records = [];
						return;
					}
					
					console.log('开始加载识别记录...');
					const shibie = uniCloud.importObject('shibie');
					const res = await shibie.getUserRecords(userId);
					console.log('识别记录查询结果:', res);
					
					if (res && res.code === 0) {
						this.records = res.data || [];
						console.log('识别记录数据:', this.records);
					} else {
						console.log('查询失败，错误码:', res?.errCode);
						this.records = [];
					}
				} catch (e) {
					console.error('加载识别记录失败:', e);
					this.records = [];
				} finally {
					this.isLoading = false;
				}
			},
			formatTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}`;
			},
			goToDetail(item) {
				uni.navigateTo({
					url: `/pages/encyclopedia/detail?name=${item.herb_name}&image_url=${encodeURIComponent(item.image_url || '')}`
				});
			},
			goBack() {
				uni.navigateBack();
			},
			switchTab(index) {
				if (index === 3) return;
				if (index === 0) {
					uni.switchTab({
						url: '/pages/index/index'
					});
				} else if (index === 1) {
					uni.switchTab({
						url: '/pages/identify/identify'
					});
				} else if (index === 2) {
					uni.switchTab({
						url: '/pages/encyclopedia/encyclopedia'
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.identify-records-page {
		min-height: 100vh;
		background: #f5f5f5;
		padding-bottom: 120rpx;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 100rpx 30rpx 30rpx;
		background: #ffffff;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.back-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		font-size: 48rpx;
		color: #333;
	}

	.page-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #1a1a1a;
	}

	.placeholder {
		width: 60rpx;
	}

	.records-list {
		padding: 20rpx;
	}

	.record-item {
		display: flex;
		align-items: center;
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.item-icon {
		width: 100rpx;
		height: 100rpx;
		background: linear-gradient(135deg, #18C445 0%, #10B981 100%);
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
	}

	.herb-img {
		width: 100%;
		height: 100%;
	}

	.icon-text {
		font-size: 48rpx;
	}

	.item-info {
		flex: 1;
		margin-left: 20rpx;
	}

	.item-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #1a1a1a;
		display: block;
		margin-bottom: 12rpx;
	}

	.item-meta {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.item-confidence {
		font-size: 24rpx;
		color: #18C445;
		background: #dcfce7;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
	}

	.item-time {
		font-size: 24rpx;
		color: #666;
	}

	.debug-info {
		font-size: 20rpx;
		color: #ff0000;
		margin-top: 8rpx;
		word-break: break-all;
	}

	.arrow-icon {
		padding: 10rpx;
	}

	.arrow {
		font-size: 36rpx;
		color: #d1d5db;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 200rpx 0;
	}

	.empty-icon {
		font-size: 100rpx;
		margin-bottom: 30rpx;
	}

	.empty-text {
		font-size: 32rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.empty-hint {
		font-size: 26rpx;
		color: #999;
	}

	.custom-tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background: #ffffff;
		display: flex;
		align-items: center;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 1000;
	}

	.tabbar-item {
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

	.tab-text {
		font-size: 22rpx;
		color: #7a7e83;
	}

	.tab-text.active {
		color: #18C445;
		font-weight: 600;
	}
</style>
