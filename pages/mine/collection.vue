<template>
	<view class="collection-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="page-title">我的收藏</text>
			<view class="placeholder"></view>
		</view>

		<view class="collection-list" v-if="collections.length > 0">
			<view class="collection-item" v-for="item in collections" :key="item._id" @click="goToDetail(item)">
				<view class="item-image" :class="'bg-' + (Math.floor(Math.random() * 8) + 1)">
					<image v-if="item.herb_image" class="herb-img" :src="item.herb_image" mode="aspectFill"></image>
					<text v-else class="item-image-text">{{ item.herb_name ? item.herb_name.substring(0, 2) : '' }}</text>
				</view>
				<view class="item-info">
					<text class="item-name">{{ item.herb_name }}</text>
					<text class="item-time">{{ formatTime(item.create_date) }}</text>
				</view>
				<view class="delete-btn" @click.stop="removeCollection(item)">
					<text class="delete-icon">🗑️</text>
				</view>
			</view>
		</view>

		<view v-else class="empty-state">
			<text class="empty-icon">⭐</text>
			<text class="empty-text">暂无收藏</text>
			<text class="empty-hint">快去收藏喜欢的药材吧</text>
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
				collections: [],
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
			this.loadCollections();
		},
		methods: {
			async loadCollections() {
				this.isLoading = true;
				try {
					const shoucang = uniCloud.importObject('shoucang');
					if (!shoucang || !shoucang.getMyCollections) {
						console.error('云对象初始化失败');
						this.collections = [];
						return;
					}
					const userId = this.userInfo._id || this.userInfo.uid;
					const res = await shoucang.getMyCollections(userId);
					if (res && res.code === 0) {
						this.collections = res.data || [];
					} else if (res && res.errCode === 'NOT_LOGGED_IN') {
						this.collections = [];
					}
				} catch (e) {
					console.error('加载收藏失败:', e);
					this.collections = [];
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
				return `${year}-${month}-${day}`;
			},
			async removeCollection(item) {
				uni.showModal({
					title: '提示',
					content: '确定要取消收藏吗？',
					success: async (res) => {
						if (res.confirm) {
							const shoucang = uniCloud.importObject('shoucang');
							const userId = this.userInfo._id || this.userInfo.uid;
							const result = await shoucang.removeCollection(item.herb_id, userId);
							if (result && result.code === 0) {
								this.collections = this.collections.filter(c => c._id !== item._id);
								uni.showToast({
									title: '取消收藏',
									icon: 'none'
								});
							}
						}
					}
				});
			},
			goToDetail(item) {
				uni.navigateTo({
					url: `/pages/encyclopedia/detail?id=${item.herb_id}&name=${item.herb_name}`
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
	.collection-page {
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

	.collection-list {
		padding: 20rpx;
	}

	.collection-item {
		display: flex;
		align-items: center;
		background: #ffffff;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.item-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		flex-shrink: 0;
	}

	.herb-img {
		width: 100%;
		height: 100%;
	}

	.item-image-text {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
	}

	.item-info {
		flex: 1;
		margin-left: 20rpx;
	}

	.item-name {
		font-size: 30rpx;
		font-weight: bold;
		color: #1a1a1a;
		display: block;
		margin-bottom: 10rpx;
	}

	.item-time {
		font-size: 24rpx;
		color: #999;
	}

	.delete-btn {
		padding: 20rpx;
	}

	.delete-icon {
		font-size: 36rpx;
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

	.bg-1 {
		background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
	}
	.bg-2 {
		background: linear-gradient(135deg, #FF9800 0%, #E65100 100%);
	}
	.bg-3 {
		background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
	}
	.bg-4 {
		background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
	}
	.bg-5 {
		background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
	}
	.bg-6 {
		background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%);
	}
	.bg-7 {
		background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
	}
	.bg-8 {
		background: linear-gradient(135deg, #673AB7 0%, #512DA8 100%);
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
