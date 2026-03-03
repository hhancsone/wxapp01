<template>
	<view class="about-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="page-title">关于我们</text>
			<view class="placeholder"></view>
		</view>

		<view class="about-content">
			<view class="app-logo">
				<text class="logo-icon">🌿</text>
			</view>
			<text class="app-name">识百草</text>
			<text class="app-version">版本 1.0.0</text>

			<view class="intro-section">
				<text class="section-title">应用简介</text>
				<text class="section-content">
				 识百草是一款专注于中草药知识的小程序应用，致力于传承和弘扬中医文化。我们收录了丰富的中草药资源，为用户提供全面的药材信息查询服务。
				</text>
			</view>

			<view class="intro-section">
				<text class="section-title">主要功能</text>
				<view class="feature-list">
					<view class="feature-item">
						<text class="feature-icon">📚</text>
						<text class="feature-text">百科全书 - 收录千种中草药详情</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">📷</text>
						<text class="feature-text">拍照识别 - AI智能识别中草药</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">⭐</text>
						<text class="feature-text">收藏功能 - 收藏喜欢的药材</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">🔍</text>
						<text class="feature-text">搜索查询 - 快速查找药材信息</text>
					</view>
				</view>
			</view>

			<view class="intro-section">
				<text class="section-title">联系我们</text>
				<text class="section-content">
				 如有疑问或建议，欢迎反馈。我们将持续优化产品，为您提供更好的使用体验。
				</text>
			</view>

			<view class="copyright">
				<text class="copyright-text">© 2026 识百草</text>
				<text class="copyright-text">保留所有权利</text>
			</view>
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
	export default {
		data() {
			return {}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			switchTab(index) {
				uni.switchTab({
					url: index === 0 ? '/pages/index/index' : 
					    index === 1 ? '/pages/identify/identify' : 
					    index === 2 ? '/pages/encyclopedia/encyclopedia' : '/pages/mine/mine'
				});
			}
		}
	}
</script>

<style>
	page {
		background: #f5f5f5;
		height: 100%;
	}

	.about-page {
		min-height: 100vh;
		background: #f5f5f5;
		padding-bottom: 120rpx;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 32rpx;
		background: #ffffff;
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
		color: #1f2937;
		font-weight: bold;
	}

	.page-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #1f2937;
	}

	.placeholder {
		width: 60rpx;
	}

	.about-content {
		padding: 40rpx 32rpx;
	}

	.app-logo {
		display: flex;
		justify-content: center;
		margin-bottom: 24rpx;
	}

	.logo-icon {
		font-size: 120rpx;
	}

	.app-name {
		display: block;
		text-align: center;
		font-size: 40rpx;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 12rpx;
	}

	.app-version {
		display: block;
		text-align: center;
		font-size: 26rpx;
		color: #9ca3af;
		margin-bottom: 48rpx;
	}

	.intro-section {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
	}

	.section-title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 20rpx;
	}

	.section-content {
		display: block;
		font-size: 26rpx;
		color: #6b7280;
		line-height: 1.8;
	}

	.feature-list {
		margin-top: 8rpx;
	}

	.feature-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.feature-item:last-child {
		margin-bottom: 0;
	}

	.feature-icon {
		font-size: 32rpx;
		margin-right: 16rpx;
	}

	.feature-text {
		font-size: 26rpx;
		color: #6b7280;
	}

	.copyright {
		text-align: center;
		padding: 40rpx 0;
	}

	.copyright-text {
		display: block;
		font-size: 24rpx;
		color: #9ca3af;
		margin-bottom: 8rpx;
	}

	.custom-tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100rpx;
		background: #ffffff;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tabbar-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.tab-icon {
		font-size: 40rpx;
		margin-bottom: 4rpx;
	}

	.tab-text {
		font-size: 22rpx;
		color: #9ca3af;
	}

	.tab-icon.active,
	.tab-text.active {
		color: #10b981;
	}
</style>
