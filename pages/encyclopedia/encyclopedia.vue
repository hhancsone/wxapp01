<template>
	<view class="encyclopedia-page">
		<!-- 顶部搜索区 -->
		<view class="search-header">
			<text class="page-title">草药百科</text>
			<!-- 搜索框 -->
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input
					class="search-input"
					type="text"
					placeholder="搜索中草药名称..."
					v-model="searchQuery"
				/>
				<view class="search-btn" @click="handleSearch">搜索</view>
			</view>
			<!-- 分类标签 -->
			<scroll-view class="category-scroll" scroll-x>
				<view class="category-list">
					<view
						v-for="category in categories"
						:key="category.id"
						:class="['category-tag', { active: activeTab === category.id }]"
						@click="switchCategory(category.id)"
					>
						<text :class="['category-tag-text', { active: activeTab === category.id }]">
							{{ category.name }}
						</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 草药列表 -->
		<view class="herb-section">
			<view class="herb-header">
				<text class="herb-count">共 {{ filteredHerbs.length }} 种草药</text>
				<view class="sort-info">
					<text class="sort-icon">🌿</text>
					<text class="sort-text">按热度排序</text>
				</view>
			</view>
			<view class="herb-grid">
				<view class="herb-card" v-for="herb in filteredHerbs" :key="herb._id" @click="goToDetail(herb)">
					<view class="herb-image-wrapper" :class="herb.bgColor">
						<image v-if="getImageUrl(herb.images)" class="herb-image" :src="getImageUrl(herb.images)" mode="aspectFill"></image>
						<text v-else class="herb-image-text">{{ herb.name.substring(0, 2) }}</text>
					</view>
					<view class="herb-card-content">
						<text class="herb-card-name">{{ herb.name }}</text>
						<text class="herb-card-latin">{{ herb.latin_name }}</text>
						<view class="herb-card-footer">
							<text class="herb-card-category">{{ herb.category }}</text>
							<text class="herb-card-views">{{ herb.views }} 浏览</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredHerbs.length === 0" class="empty-state">
			<view class="empty-icon-wrapper">
				<text class="empty-icon">🔍</text>
			</view>
			<text class="empty-text">未找到相关草药</text>
			<text class="empty-hint">请尝试其他关键词</text>
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
				<text class="tab-icon active">📚</text>
				<text class="tab-text active">百科</text>
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
				searchQuery: '',
				activeTab: 'all',
				isLoading: false,
				herbs: [],
				categories: [
					{ id: 'all', name: '全部' },
					{ id: 'heat', name: '清热解毒' },
					{ id: 'qi', name: '补气养血' },
					{ id: 'blood', name: '活血化瘀' },
					{ id: 'cough', name: '止咳平喘' }
				]
			}
		},
		onLoad() {
			this.loadCategories();
			this.loadHerbs();
			
			uni.$on('switchCategory', (categoryId) => {
				this.activeTab = categoryId;
				this.loadHerbs();
			});
		},
		onUnload() {
			uni.$off('switchCategory');
		},
		computed: {
			filteredHerbs() {
				return this.herbs;
			}
		},
		methods: {
			getImageUrl(images) {
				if (!images || images.length === 0) return '';
				const img = images[0];
				return typeof img === 'string' ? img : (img.url || '');
			},
			async loadCategories() {
				try {
					const fenlei = uniCloud.importObject('fenlei');
					const res = await fenlei.getList();
					if (res && res.code === 0 && res.data) {
						this.categories = [
							{ id: 'all', name: '全部' },
							...res.data.map(item => ({ id: item.name, name: item.name }))
						];
					}
				} catch (e) {
					console.error('加载分类失败:', e);
				}
			},
			async loadHerbs() {
				this.isLoading = true;
				try {
					const yaocai = uniCloud.importObject('yaocai');
					const res = await yaocai.getList({
						category: this.activeTab,
						keyword: this.searchQuery
					});
					if (res.code === 0) {
						this.herbs = res.data.list.map((item, index) => ({
							...item,
							bgColor: `bg-${(index % 8) + 1}`
						}));
					}
				} catch (e) {
					console.error('加载药材列表失败:', e);
				} finally {
					this.isLoading = false;
				}
			},
			switchCategory(categoryId) {
				this.activeTab = categoryId;
				this.loadHerbs();
			},
			handleSearch() {
				this.loadHerbs();
			},
			goToDetail(herb) {
				uni.navigateTo({
					url: `/pages/encyclopedia/detail?id=${herb._id}&name=${herb.name}`
				});
			},
			switchTab(index) {
				if (index === 2) return;
				if (index === 0) {
					uni.switchTab({
						url: '/pages/index/index'
					});
				} else if (index === 1) {
					uni.switchTab({
						url: '/pages/identify/identify'
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
	.encyclopedia-page {
		min-height: 100vh;
		background: #f9fafb;
		padding-bottom: 120rpx;
	}

	.search-header {
		background: #ffffff;
		padding: 180rpx 32rpx 24rpx;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.page-title {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 24rpx;
	}

	.search-box {
		display: flex;
		align-items: center;
		background: #f3f4f6;
		border-radius: 24rpx;
		padding: 16rpx 16rpx 16rpx 24rpx;
		margin-bottom: 24rpx;
	}

	.search-icon {
		font-size: 32rpx;
		margin-right: 16rpx;
	}

	.search-input {
		flex: 1;
		font-size: 28rpx;
		color: #1f2937;
	}

	.search-btn {
		background: #10b981;
		color: #ffffff;
		font-size: 26rpx;
		padding: 12rpx 24rpx;
		border-radius: 20rpx;
		margin-left: 16rpx;
	}

	.category-scroll {
		white-space: nowrap;
	}

	.category-list {
		display: inline-flex;
		gap: 16rpx;
	}

	.category-tag {
		display: inline-block;
		padding: 16rpx 32rpx;
		background: #f3f4f6;
		border-radius: 40rpx;
		transition: all 0.2s;
	}

	.category-tag.active {
		background: linear-gradient(135deg, #18C445 0%, #10B981 100%);
	}

	.category-tag-text {
		font-size: 26rpx;
		color: #6b7280;
		white-space: nowrap;
	}

	.category-tag-text.active {
		color: #ffffff;
		font-weight: 600;
	}

	.herb-section {
		padding: 32rpx;
	}

	.herb-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.herb-count {
		font-size: 26rpx;
		color: #9ca3af;
	}

	.sort-info {
		display: flex;
		align-items: center;
	}

	.sort-icon {
		font-size: 24rpx;
		margin-right: 8rpx;
	}

	.sort-text {
		font-size: 26rpx;
		color: #6b7280;
	}

	.herb-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 24rpx;
	}

	.herb-card {
		width: calc(50% - 12rpx);
		background: #ffffff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
		transition: all 0.2s;
	}

	.herb-card:active {
		transform: scale(0.98);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	}

	.herb-image-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.herb-image {
		width: 100%;
		height: 100%;
	}

	.herb-image-text {
		font-size: 56rpx;
		font-weight: bold;
		color: #ffffff;
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

	.bg-4 {
		background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%);
	}

	.bg-5 {
		background: linear-gradient(135deg, #F44336 0%, #C62828 100%);
	}

	.bg-6 {
		background: linear-gradient(135deg, #FFEB3B 0%, #F9A825 100%);
	}

	.bg-7 {
		background: linear-gradient(135deg, #3F51B5 0%, #283593 100%);
	}

	.bg-8 {
		background: linear-gradient(135deg, #FF5722 0%, #D84315 100%);
	}

	.herb-card-content {
		padding: 20rpx;
	}

	.herb-card-name {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 4rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.herb-card-latin {
		display: block;
		font-size: 22rpx;
		color: #9ca3af;
		font-style: italic;
		margin-bottom: 12rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.herb-card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.herb-card-category {
		font-size: 22rpx;
		background: #dcfce7;
		color: #16a34a;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
	}

	.herb-card-views {
		font-size: 22rpx;
		color: #9ca3af;
	}

	.empty-state {
		text-align: center;
		padding: 120rpx 0;
	}

	.empty-icon-wrapper {
		width: 160rpx;
		height: 160rpx;
		background: #f3f4f6;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 32rpx;
	}

	.empty-icon {
		font-size: 64rpx;
	}

	.empty-text {
		display: block;
		font-size: 30rpx;
		color: #6b7280;
		margin-bottom: 8rpx;
	}

	.empty-hint {
		display: block;
		font-size: 26rpx;
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
