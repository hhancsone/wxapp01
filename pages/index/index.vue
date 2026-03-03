<template>
	<view class="home-page">
		<!-- 顶部横幅 -->
		<view class="header">
			<view class="header-content">
				<text class="title">识百草</text>
				<text class="subtitle">传承中医智慧，探索本草奥秘</text>
			</view>
		</view>

		<!-- 系统描述 -->
		<view class="category-section">
			<view class="system-desc">
				<text class="desc-title">中草药百科</text>
				<text class="desc-content">收录千种中草药资源，提供详细的药材名称、功效、性味归经等信息，支持拍照识别，让您轻松了解身边的中草药知识。</text>
			</view>
		</view>

		<!-- 热门草药 -->
		<view class="section">
			<view class="section-header">
				<view class="section-title">
					<text class="section-icon">🔥</text>
					<text class="section-title-text">热门草药</text>
				</view>
				<text class="section-more" @click="goToEncyclopedia">更多 →</text>
			</view>
			<view class="herb-list">
				<view class="herb-item" v-for="(item, index) in popularHerbs" :key="item._id || index" @click="goToHerbDetail(item)">
					<view class="herb-image" :class="'bg-' + (index + 1)">
						<image v-if="getImageUrl(item.images)" class="herb-img" :src="getImageUrl(item.images)" mode="aspectFill"></image>
						<text v-else class="herb-image-text">{{ item.name.substring(0, 2) }}</text>
					</view>
					<view class="herb-info">
						<text class="herb-name">{{ item.name }}</text>
						<text class="herb-latin">{{ item.latin_name }}</text>
						<view class="herb-effect">
							<text class="effect-icon">🌿</text>
							<text class="effect-text">{{ item.effect }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 自定义底部导航 -->
		<view class="custom-tabbar">
			<view class="tabbar-item" @click="switchTab(0)">
				<text class="tab-icon active">🏠</text>
				<text class="tab-text active">首页</text>
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
				<text class="tab-icon">👤</text>
				<text class="tab-text">我的</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popularHerbs: []
			}
		},
		onLoad() {
			this.loadHotHerbs();
		},
		methods: {
			getImageUrl(images) {
				if (!images || images.length === 0) return '';
				const img = images[0];
				return typeof img === 'string' ? img : (img.url || '');
			},
			async loadHotHerbs() {
				try {
					const yaocai = uniCloud.importObject('yaocai');
					const res = await yaocai.getHotList(3);
					if (res.code === 0) {
						this.popularHerbs = res.data.map((item, index) => ({
							...item,
							effect: item.efficacy
						}));
					}
				} catch (e) {
					console.error('加载热门药材失败:', e);
				}
			},
			goToEncyclopedia() {
				uni.switchTab({
					url: '/pages/encyclopedia/encyclopedia'
				});
			},
			goToHerbDetail(item) {
				uni.navigateTo({
					url: `/pages/encyclopedia/detail?id=${item._id}&name=${item.name}`
				})
			},
			switchTab(index) {
				if (index === 0) return;
				if (index === 1) {
					uni.switchTab({
						url: '/pages/identify/identify'
					});
				} else if (index === 2) {
					uni.switchTab({
						url: '/pages/encyclopedia/encyclopedia'
					});
				} else if (index === 3) {
					uni.switchTab({
						url: '/pages/mine/mine'
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.home-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #f0f9f0 0%, #ffffff 100%);
		padding-bottom: 120rpx;
	}

	.header {
		background: linear-gradient(135deg, #18C445 0%, #10B981 100%);
		padding: 180rpx 32rpx 80rpx;
		border-radius: 0 0 48rpx 48rpx;
	}

	.header-content {
		margin-bottom: 32rpx;
	}

	.title {
		display: block;
		font-size: 56rpx;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 8rpx;
	}

	.subtitle {
		display: block;
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	.category-section {
		margin: -40rpx 32rpx 0;
		position: relative;
		z-index: 10;
	}

	.category-grid {
		display: flex;
		justify-content: space-between;
		background: #ffffff;
		border-radius: 32rpx;
		padding: 32rpx 24rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	}

	.category-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.category-icon {
		width: 112rpx;
		height: 112rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 12rpx;
	}

	.category-emoji {
		font-size: 48rpx;
	}

	.bg-green {
		background: #dcfce7;
	}

	.bg-red {
		background: #fee2e2;
	}

	.bg-purple {
		background: #f3e8ff;
	}

	.bg-blue {
		background: #dbeafe;
	}

	.category-name {
		font-size: 24rpx;
		color: #374151;
		text-align: center;
	}

	.system-desc {
		background: #ffffff;
		border-radius: 32rpx;
		padding: 32rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	}

	.desc-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 16rpx;
	}

	.desc-content {
		display: block;
		font-size: 26rpx;
		color: #6b7280;
		line-height: 1.6;
	}

	.section {
		padding: 32rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.section-title {
		display: flex;
		align-items: center;
	}

	.section-icon {
		font-size: 32rpx;
		margin-right: 12rpx;
	}

	.section-title-text {
		font-size: 32rpx;
		font-weight: 600;
		color: #1f2937;
	}

	.section-more {
		font-size: 26rpx;
		color: #18C445;
	}

	.herb-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.herb-item {
		display: flex;
		background: #ffffff;
		border-radius: 24rpx;
		padding: 20rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.herb-image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 16rpx;
		flex-shrink: 0;
		background: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.herb-image-text {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
	}

	.herb-img {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}

	.bg-1 {
		background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
	}

	.bg-2 {
		background: linear-gradient(135deg, #FF9800 0%, #E65100 100%);
	}

	.bg-3 {
		background: linear-gradient(135deg, #E91E63 0%, #AD1457 100%);
	}

	.herb-info {
		flex: 1;
		margin-left: 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.herb-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 6rpx;
	}

	.herb-latin {
		font-size: 22rpx;
		color: #9ca3af;
		font-style: italic;
		margin-bottom: 12rpx;
	}

	.herb-effect {
		display: flex;
		align-items: center;
	}

	.effect-icon {
		font-size: 24rpx;
		margin-right: 8rpx;
	}

	.effect-text {
		font-size: 24rpx;
		color: #6b7280;
	}

	.recent-list {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 8rpx 0;
	}

	.recent-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 32rpx;
		border-bottom: 1rpx solid #f3f4f6;
	}

	.recent-item:last-child {
		border-bottom: none;
	}

	.recent-name {
		font-size: 28rpx;
		color: #374151;
	}

	.recent-time {
		font-size: 24rpx;
		color: #9ca3af;
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
