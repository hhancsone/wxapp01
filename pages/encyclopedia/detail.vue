<template>
	<view class="detail-page">
		<!-- 顶部图片区域 -->
		<view class="hero-section">
			<image v-if="userImageUrl" class="hero-image" :src="userImageUrl" mode="aspectFill"></image>
			<image v-else-if="getImageUrl(herb.images)" class="hero-image" :src="getImageUrl(herb.images)" mode="aspectFill"></image>
			<view v-else class="hero-placeholder" :class="herb.bgColor">
				<text class="hero-text">{{ herb.name ? herb.name.substring(0, 2) : '' }}</text>
			</view>
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
		</view>

		<!-- 主要信息卡片 -->
		<view class="main-card">
			<view class="name-section">
				<view class="name-row">
					<text class="herb-name">{{ herb.name }}</text>
					<text class="collect-icon" @click="handleCollect">{{ isCollected ? '⭐' : '☆' }}</text>
				</view>
				<text class="latin-name">{{ herb.latin_name }}</text>
			</view>
			<view class="category-tag">
				<text class="category-text">{{ herb.category }}</text>
			</view>
		</view>

		<!-- 信息列表 -->
		<view class="info-section">
			<view class="info-card">
				<view class="info-item">
					<view class="info-label">
						<text class="label-icon">🌿</text>
						<text class="label-text">药用部位</text>
					</view>
					<text class="info-value">{{ herb.medicinal_part || '暂无' }}</text>
				</view>
				<view class="info-divider"></view>
				<view class="info-item">
					<view class="info-label">
						<text class="label-icon">👅</text>
						<text class="label-text">性味</text>
					</view>
					<text class="info-value">{{ herb.taste || '暂无' }}</text>
				</view>
				<view class="info-divider"></view>
				<view class="info-item">
					<view class="info-label">
						<text class="label-icon">🧭</text>
						<text class="label-text">归经</text>
					</view>
					<text class="info-value">{{ herb.meridian || '暂无' }}</text>
				</view>
			</view>

			<view class="info-card">
				<view class="info-item full-width">
					<view class="info-label">
						<text class="label-icon">✨</text>
						<text class="label-text">功效</text>
					</view>
					<text class="info-value large">{{ herb.efficacy || '暂无' }}</text>
				</view>
			</view>

			<view class="info-card">
				<view class="info-item full-width">
					<view class="info-label">
						<text class="label-icon">💊</text>
						<text class="label-text">主治</text>
					</view>
					<text class="info-value large">{{ herb.indication || '暂无' }}</text>
				</view>
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
				herbId: '',
				herbName: '',
				userImageUrl: '',
				herb: {
					_id: '',
					name: '',
					latin_name: '',
					category: '',
					medicinal_part: '',
					taste: '',
					meridian: '',
					efficacy: '',
					indication: '',
					images: []
				},
				isCollected: false,
				isLoading: false
			}
		},
		computed: {
			userInfo() {
				return store.userInfo || {};
			}
		},
		onLoad(options) {
			mutations.updateUserInfo();
			if (options.id) {
				this.herbId = options.id;
				this.loadHerbDetail();
			} else if (options.name) {
				this.herbName = options.name;
				this.userImageUrl = options.image_url || '';
				this.loadHerbDetailByName();
				uni.setNavigationBarTitle({
					title: options.name
				});
			}
		},
		methods: {
			getImageUrl(images) {
				if (!images || images.length === 0) return '';
				const img = images[0];
				return typeof img === 'string' ? img : (img.url || '');
			},
			async loadHerbDetail() {
				this.isLoading = true;
				try {
					const yaocai = uniCloud.importObject('yaocai');
					const res = await yaocai.getDetail(this.herbId);
					if (res && res.code === 0 && res.data) {
						this.herb = res.data;
					}
					
					try {
						const shoucang = uniCloud.importObject('shoucang');
						if (shoucang && shoucang.checkIsCollected) {
							const userId = this.userInfo._id || this.userInfo.uid;
							const checkRes = await shoucang.checkIsCollected(this.herbId, userId);
							if (checkRes && checkRes.code === 0) {
								this.isCollected = checkRes.data || false;
							}
						}
					} catch (e) {
						console.error('检查收藏状态失败:', e);
					}
				} catch (e) {
					console.error('加载药材详情失败:', e);
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					});
				} finally {
					this.isLoading = false;
				}
			},
			async loadHerbDetailByName() {
				this.isLoading = true;
				try {
					const yaocai = uniCloud.importObject('yaocai');
					const res = await yaocai.getDetailByName({
						name: this.herbName
					});
					if (res && res.code === 0 && res.data) {
						this.herb = res.data;
						this.herbId = res.data._id;
					} else {
						uni.showToast({
							title: '药材不存在',
							icon: 'none'
						});
					}
					
					try {
						const shoucang = uniCloud.importObject('shoucang');
						if (shoucang && shoucang.checkIsCollected) {
							const userId = this.userInfo._id || this.userInfo.uid;
							const checkRes = await shoucang.checkIsCollected(this.herbId, userId);
							if (checkRes && checkRes.code === 0) {
								this.isCollected = checkRes.data || false;
							}
						}
					} catch (e) {
						console.error('检查收藏状态失败:', e);
					}
				} catch (e) {
					console.error('加载药材详情失败:', e);
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					});
				} finally {
					this.isLoading = false;
				}
			},
			goBack() {
				uni.navigateBack();
			},
			async handleCollect() {
				try {
					const shoucang = uniCloud.importObject('shoucang');
					if (!shoucang || !shoucang.addCollection || !shoucang.removeCollection) {
						uni.showToast({
							title: '服务初始化失败',
							icon: 'none'
						});
						return;
					}

					const userId = this.userInfo._id || this.userInfo.uid;
					if (!userId) {
						uni.showToast({
							title: '请先登录',
							icon: 'none'
						});
						return;
					}

					if (!this.isCollected) {
						const herbImage = this.getImageUrl(this.herb.images);
						const nickname = this.userInfo.nickname || '用户';
						const res = await shoucang.addCollection({
							herb_id: this.herbId,
							herb_name: this.herb.name,
							herb_image: herbImage,
							user_id: userId,
							user_nickname: nickname
						});
						if (res && (res.code === 0 || res.errCode === 'ALREADY_COLLECTED')) {
							this.isCollected = true;
							uni.showToast({
								title: '收藏成功',
								icon: 'success'
							});
						} else if (res && res.errCode === 'NOT_LOGGED_IN') {
							uni.showToast({
								title: '请先登录',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: (res && res.errMsg) || '收藏失败',
								icon: 'none'
							});
						}
					} else {
						const userId = this.userInfo._id || this.userInfo.uid;
						const res = await shoucang.removeCollection(this.herbId, userId);
						if (res && res.code === 0) {
							this.isCollected = false;
							uni.showToast({
								title: '取消收藏',
								icon: 'none'
							});
						}
					}
				} catch (e) {
					console.error('收藏操作失败:', e);
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.detail-page {
		min-height: 100vh;
		background: #f5f5f5;
	}

	.hero-section {
		position: relative;
		width: 100%;
		height: 500rpx;
		overflow: hidden;
	}

	.hero-image {
		width: 100%;
		height: 100%;
	}

	.hero-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-placeholder.bg-1 {
		background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
	}
	.hero-placeholder.bg-2 {
		background: linear-gradient(135deg, #FF9800 0%, #E65100 100%);
	}
	.hero-placeholder.bg-3 {
		background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
	}
	.hero-placeholder.bg-4 {
		background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
	}
	.hero-placeholder.bg-5 {
		background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
	}
	.hero-placeholder.bg-6 {
		background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%);
	}
	.hero-placeholder.bg-7 {
		background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
	}
	.hero-placeholder.bg-8 {
		background: linear-gradient(135deg, #673AB7 0%, #512DA8 100%);
	}

	.hero-text {
		font-size: 120rpx;
		font-weight: bold;
		color: #ffffff;
	}

	.back-btn {
		position: absolute;
		top: 80rpx;
		left: 30rpx;
		width: 70rpx;
		height: 70rpx;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		font-size: 50rpx;
		color: #ffffff;
		line-height: 1;
	}

	.main-card {
		margin: -60rpx 30rpx 30rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		position: relative;
		z-index: 1;
	}

	.name-section {
		margin-bottom: 20rpx;
	}

	.name-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.herb-name {
		font-size: 44rpx;
		font-weight: bold;
		color: #1a1a1a;
		display: block;
		margin-bottom: 10rpx;
		flex: 1;
	}

	.collect-icon {
		font-size: 44rpx;
		color: #ffc107;
		padding: 10rpx;
	}

	.latin-name {
		font-size: 28rpx;
		color: #888888;
		font-style: italic;
	}

	.category-tag {
		display: inline-block;
		background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
		padding: 10rpx 24rpx;
		border-radius: 30rpx;
	}

	.category-text {
		font-size: 24rpx;
		color: #ffffff;
	}

	.info-section {
		padding: 0 30rpx;
	}

	.info-card {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.info-item.full-width {
		flex-direction: column;
		align-items: flex-start;
	}

	.info-label {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.label-icon {
		font-size: 32rpx;
		margin-right: 12rpx;
	}

	.label-text {
		font-size: 28rpx;
		color: #666666;
	}

	.info-value {
		font-size: 30rpx;
		color: #1a1a1a;
		font-weight: 500;
	}

	.info-value.large {
		line-height: 1.6;
	}

	.info-divider {
		height: 1rpx;
		background: #f0f0f0;
		margin: 24rpx 0;
	}
</style>
