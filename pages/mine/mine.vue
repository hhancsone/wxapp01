<template>
	<view class="mine-page">
		<!-- 顶部用户信息 -->
		<view class="header">
			<view class="user-info" @click="goToUserInfo">
				<view class="avatar">
					<image v-if="userInfo.avatar_file && userInfo.avatar_file.url" class="avatar-img" :src="userInfo.avatar_file.url" mode="aspectFill"></image>
					<text v-else class="avatar-icon">👤</text>
				</view>
				<view class="user-detail">
					<text class="username">{{ userInfo.nickname || '未登录' }}</text>
					<text class="user-hint">{{ isLoggedIn ? '点击查看资料' : '点击登录账号' }}</text>
				</view>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="menu-section">
			<view class="menu-group">
				<view class="menu-item" @click="handleMenuClick('collection')">
					<view class="menu-left">
						<text class="menu-icon">⭐</text>
						<text class="menu-text">我的收藏</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="handleMenuClick('identify')">
					<view class="menu-left">
						<text class="menu-icon">🔍</text>
						<text class="menu-text">识别记录</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
			</view>

			<view class="menu-group">
				<view class="menu-item" @click="handleMenuClick('about')">
					<view class="menu-left">
						<text class="menu-icon">ℹ️</text>
						<text class="menu-text">关于我们</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item logout-item" @click="handleLogout">
					<view class="menu-left">
						<text class="menu-icon">🚪</text>
						<text class="menu-text logout-text">退出登录</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 自定义底部导航 -->
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
		computed: {
			userInfo() {
				return store.userInfo
			},
			isLoggedIn() {
				return store.hasLogin
			}
		},
		data() {
			return {}
		},
		onShow() {
			mutations.updateUserInfo()
		},
		methods: {
			goToUserInfo() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
				});
			},
			handleMenuClick(type) {
				if (type === 'collection') {
					uni.navigateTo({
						url: '/pages/mine/collection'
					});
				} else if (type === 'identify') {
					uni.navigateTo({
						url: '/pages/mine/identify-records'
					});
				} else if (type === 'about') {
					uni.navigateTo({
						url: '/pages/mine/about'
					});
				} else {
					uni.showToast({
						title: '功能开发中',
						icon: 'none'
					});
				}
			},
			handleLogout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('uni_id_token');
							uni.setStorageSync('uni_id_token_expired', 0);
							uni.removeStorageSync('uni-id-pages-userInfo');
							store.userInfo = {};
							store.hasLogin = false;
							uni.showToast({
								title: '已退出登录',
								icon: 'success'
							});
						}
					}
				});
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
	.mine-page {
		min-height: 100vh;
		background: #f9fafb;
		padding-bottom: 120rpx;
	}

	.header {
		background: linear-gradient(135deg, #18C445 0%, #10B981 100%);
		padding: 180rpx 32rpx 60rpx;
		border-radius: 0 0 48rpx 48rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 24rpx;
		overflow: hidden;
	}

	.avatar-img {
		width: 100%;
		height: 100%;
	}

	.avatar-icon {
		font-size: 56rpx;
	}

	.user-detail {
		display: flex;
		flex-direction: column;
	}

	.username {
		font-size: 36rpx;
		font-weight: 600;
		color: #ffffff;
		margin-bottom: 8rpx;
	}

	.user-hint {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.menu-section {
		padding: 32rpx;
	}

	.menu-group {
		background: #ffffff;
		border-radius: 24rpx;
		margin-bottom: 24rpx;
		overflow: hidden;
	}

	.menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
		border-bottom: 1rpx solid #f3f4f6;
	}

	.menu-item:last-child {
		border-bottom: none;
	}

	.logout-item {
		margin-top: 20rpx;
	}

	.logout-text {
		color: #ef4444;
	}

	.menu-left {
		display: flex;
		align-items: center;
	}

	.menu-icon {
		font-size: 36rpx;
		margin-right: 20rpx;
	}

	.menu-text {
		font-size: 30rpx;
		color: #1f2937;
	}

	.menu-arrow {
		font-size: 36rpx;
		color: #d1d5db;
	}

	.custom-tabbar {
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
