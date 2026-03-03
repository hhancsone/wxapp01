<template>
	<view class="identify-page">
		<!-- 顶部标题 -->
		<view class="header">
			<view class="header-content">
				<text class="title">智能识别</text>
				<text class="subtitle">上传照片，AI识别中草药</text>
			</view>
		</view>

		<!-- 上传区域 -->
		<view class="upload-section">
			<view class="upload-card">
				<!-- 未上传时显示 -->
				<view v-if="!identifyResult && !isIdentifying" class="upload-area">
					<view class="upload-icon-wrapper">
						<text class="upload-icon">📷</text>
					</view>
					<text class="upload-text">点击下方按钮上传照片</text>
					<text class="upload-hint">支持 JPG、PNG 格式</text>
				</view>

				<!-- 识别中显示 -->
				<view v-if="isIdentifying" class="identifying-area">
					<view class="loading-wrapper">
						<view class="loading-spinner"></view>
					</view>
					<text class="identifying-text">AI正在识别中...</text>
				</view>

				<!-- 识别结果显示 -->
				<view v-if="identifyResult && !isIdentifying" class="result-area">
					<view class="result-image" v-if="identifyResult.image">
						<image class="result-img" :src="identifyResult.image" mode="aspectFill"></image>
					</view>
					<view class="result-image result-image-placeholder" v-else>
						<text class="result-image-text">金银花</text>
					</view>
					<view class="result-header">
						<view class="result-name-section">
							<text class="result-name">{{ identifyResult.name }}</text>
							<text class="result-latin">{{ identifyResult.latinName }}</text>
						</view>
						<view class="confidence-section">
							<view class="confidence-label">
								<text class="confidence-icon">✨</text>
								<text class="confidence-text">可信度</text>
							</view>
							<text class="confidence-value">{{ identifyResult.confidence }}%</text>
						</view>
					</view>
					<view class="category-tag">
						<text class="category-tag-text">{{ identifyResult.category }}</text>
					</view>
				</view>

				<!-- 上传按钮 -->
				<view class="button-group">
					<view v-if="!identifyResult || isIdentifying" class="btn btn-primary" @click="handleUpload">
						<text class="btn-icon">📷</text>
						<text class="btn-text">拍照识别</text>
					</view>
					<view v-if="!identifyResult || isIdentifying" class="btn btn-outline" @click="handleUpload">
						<text class="btn-icon">📁</text>
						<text class="btn-text-outline">相册选择</text>
					</view>
					<view v-if="identifyResult && !isIdentifying" class="btn btn-primary btn-full" @click="resetIdentify">
						<text class="btn-text">重新识别</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 识别详情 -->
		<view v-if="identifyResult && !isIdentifying" class="detail-section">
			<view class="detail-card">
				<view class="detail-header">
					<text class="detail-icon">ℹ️</text>
					<text class="detail-title">详细信息</text>
				</view>
				<view class="detail-content">
					<view class="detail-item">
						<text class="detail-label">拉丁学名</text>
						<text class="detail-value">{{ identifyResult.latinName }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">药用部位</text>
						<text class="detail-value">{{ identifyResult.medicinalPart }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">性味</text>
						<text class="detail-value">{{ identifyResult.taste }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">归经</text>
						<text class="detail-value">{{ identifyResult.meridian }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">功效</text>
						<text class="detail-value">{{ identifyResult.efficacy }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">主治</text>
						<text class="detail-value">{{ identifyResult.indication }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 使用提示 -->
		<view v-if="!identifyResult" class="tip-section">
			<view class="tip-card">
				<view class="tip-header">
					<text class="tip-icon">💡</text>
					<text class="tip-title">拍摄建议</text>
				</view>
				<view class="tip-list">
					<text class="tip-item">• 确保光线充足，避免阴影遮挡</text>
					<text class="tip-item">• 尽量拍摄草药的全貌</text>
					<text class="tip-item">• 保持画面清晰，避免模糊</text>
					<text class="tip-item">• 背景简洁，突出主体</text>
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
				<text class="tab-icon active">📷</text>
				<text class="tab-text active">识别</text>
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
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	
	export default {
		computed: {
			userInfo() {
				return store.userInfo || {};
			}
		},
		data() {
			return {
				identifyResult: null,
				isIdentifying: false,
				apiBaseUrl: 'http://localhost:5000'
			}
		},
		methods: {
			handleUpload() {
				const _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						_this.startIdentify(res.tempFilePaths[0]);
					}
				});
			},
			async startIdentify(imagePath) {
			this.isIdentifying = true;
			this.identifyResult = null;

			try {
				const base64 = await this.imageToBase64(imagePath);
				
				const response = await new Promise((resolve, reject) => {
					uni.request({
						url: `${this.apiBaseUrl}/api/identify`,
						method: 'POST',
						header: {
							'Content-Type': 'application/json'
						},
						data: {
							image: base64
						},
						success: (res) => {
							if (res.statusCode === 200) {
								resolve(res.data);
							} else {
								reject(new Error('请求失败'));
							}
						},
						fail: reject
					});
				});

				if (response.success && response.result && response.result.length > 0) {
					const topResult = response.result[0];
					
					// 构建基础识别结果
					const result = {
						name: topResult.name,
						confidence: topResult.confidence,
						allResults: response.result,
						image: imagePath
					};
					
					// 查询药材详细信息
					try {
						const yaocai = uniCloud.importObject('yaocai');
						const detailRes = await yaocai.getDetailByName({
							name: topResult.name
						});
						
						if (detailRes.code === 0 && detailRes.data) {
							const herbData = detailRes.data;
							result.latinName = herbData.latin_name || '';
							result.category = herbData.category || '';
							// 根据实际数据库字段名称设置
							result.medicinalPart = herbData.medicinal_part || '';
							result.taste = herbData.taste || '';
							result.meridian = herbData.meridian || '';
							result.efficacy = herbData.efficacy || '';
							result.indication = herbData.indication || '';
						} else {
							// 尝试使用模糊匹配
							try {
								const searchRes = await yaocai.search(topResult.name);
								if (searchRes.code === 0 && searchRes.data && searchRes.data.length > 0) {
									const herbData = searchRes.data[0];
									result.latinName = herbData.latin_name || '';
									result.category = herbData.category || '';
									result.medicinalPart = herbData.medicinal_part || '';
									result.taste = herbData.taste || '';
									result.meridian = herbData.meridian || '';
									result.efficacy = herbData.efficacy || '';
									result.indication = herbData.indication || '';
								}
							} catch (searchErr) {
								// 忽略搜索错误
							}
						}
					} catch (e) {
						// 添加默认数据以便测试
						result.latinName = 'Test Latin Name';
						result.category = '测试分类';
						result.medicinalPart = '测试部位';
						result.taste = '甘，平';
						result.meridian = '肺、肝、肾经';
						result.efficacy = '清热解毒，消肿止痛';
						result.indication = '用于测试用途';
					}
				
				// 记录识别结果到数据库
				try {
					const userInfo = this.userInfo;
					console.log('准备记录识别结果，用户信息:', userInfo);
					console.log('识别结果:', topResult);
					
					// 上传图片到云存储
					let imageUrl = '';
					try {
						const uploadRes = await uniCloud.uploadFile({
							filePath: imagePath,
							cloudPath: `identify/${Date.now()}_${userInfo?._id || 'anonymous'}.jpg`
						});
						imageUrl = uploadRes.fileID;
						console.log('图片上传成功:', imageUrl);
					} catch (uploadErr) {
						console.error('图片上传失败:', uploadErr);
					}
					
					const shibie = uniCloud.importObject('shibie');
					const recordRes = await shibie.addRecord({
						herb_name: topResult.name,
						confidence: topResult.confidence,
						user_id: userInfo?._id || userInfo?.uid || '',
						user_nickname: userInfo?.nickname || '用户',
						image_url: imageUrl
					});
					
					console.log('识别记录保存结果:', recordRes);
					
					if (recordRes && recordRes.code === 0) {
						console.log('识别记录保存成功');
					} else {
						console.log('识别记录保存失败:', recordRes?.errCode, recordRes?.errMsg);
					}
				} catch (e) {
					console.error('保存识别记录异常:', e);
				}
				
				this.identifyResult = result;
			} else {
				uni.showToast({
					title: '未能识别出药材',
					icon: 'none'
				});
			}
			} catch (e) {
				console.error('识别失败:', e);
				uni.showToast({
					title: '识别失败，请检查网络',
					icon: 'none'
				});
			} finally {
				this.isIdentifying = false;
			}
		},
			imageToBase64(imagePath) {
				return new Promise((resolve, reject) => {
					uni.getFileSystemManager().readFile({
						filePath: imagePath,
						encoding: 'base64',
						success: (res) => {
							resolve(res.data);
						},
						fail: reject
					});
				});
			},
			resetIdentify() {
				this.identifyResult = null;
				this.isIdentifying = false;
			},
			switchTab(index) {
				if (index === 1) return;
				if (index === 0) {
					uni.switchTab({
						url: '/pages/index/index'
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
	.identify-page {
		min-height: 100vh;
		background: #f9fafb;
		padding-bottom: 120rpx;
	}

	.header {
		background: linear-gradient(135deg, #18C445 0%, #10B981 100%);
		padding: 180rpx 32rpx 60rpx;
		border-radius: 0 0 48rpx 48rpx;
	}

	.header-content {
		text-align: center;
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

	.upload-section {
		margin: -40rpx 32rpx 0;
		position: relative;
		z-index: 10;
	}

	.upload-card {
		background: #ffffff;
		border-radius: 32rpx;
		padding: 48rpx 32rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	}

	.upload-area,
	.identifying-area,
	.result-area {
		text-align: center;
		margin-bottom: 32rpx;
	}

	.upload-icon-wrapper {
		width: 160rpx;
		height: 160rpx;
		background: #dcfce7;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 32rpx;
	}

	.upload-icon {
		font-size: 64rpx;
	}

	.upload-text {
		display: block;
		font-size: 28rpx;
		color: #6b7280;
		margin-bottom: 8rpx;
	}

	.upload-hint {
		display: block;
		font-size: 24rpx;
		color: #9ca3af;
	}

	.loading-wrapper {
		display: flex;
		justify-content: center;
		margin-bottom: 32rpx;
	}

	.loading-spinner {
		width: 80rpx;
		height: 80rpx;
		border: 6rpx solid #18C445;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.identifying-text {
		font-size: 28rpx;
		color: #6b7280;
	}

	.result-image {
		width: 100%;
		height: 320rpx;
		border-radius: 24rpx;
		margin-bottom: 24rpx;
		background: #f3f4f6;
		overflow: hidden;
	}

	.result-img {
		width: 100%;
		height: 100%;
	}

	.result-image-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
	}

	.result-image-text {
		font-size: 64rpx;
		font-weight: bold;
		color: #ffffff;
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 16rpx;
	}

	.result-name-section {
		text-align: left;
	}

	.result-name {
		display: block;
		font-size: 44rpx;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 4rpx;
	}

	.result-latin {
		display: block;
		font-size: 26rpx;
		color: #9ca3af;
		font-style: italic;
	}

	.confidence-section {
		text-align: right;
	}

	.confidence-label {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-bottom: 4rpx;
	}

	.confidence-icon {
		font-size: 24rpx;
		margin-right: 4rpx;
	}

	.confidence-text {
		font-size: 24rpx;
		color: #18C445;
	}

	.confidence-value {
		font-size: 48rpx;
		font-weight: bold;
		color: #18C445;
	}

	.category-tag {
		display: inline-block;
		background: #dcfce7;
		padding: 8rpx 24rpx;
		border-radius: 24rpx;
	}

	.category-tag-text {
		font-size: 26rpx;
		color: #16a34a;
	}

	.button-group {
		display: flex;
		gap: 24rpx;
	}

	.btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24rpx 0;
		border-radius: 24rpx;
	}

	.btn-primary {
		background: linear-gradient(135deg, #18C445 0%, #10B981 100%);
	}

	.btn-outline {
		background: transparent;
		border: 2rpx solid #18C445;
	}

	.btn-full {
		flex: none;
		width: 100%;
	}

	.btn-icon {
		font-size: 32rpx;
		margin-right: 8rpx;
	}

	.btn-text {
		font-size: 28rpx;
		font-weight: 600;
		color: #ffffff;
	}

	.btn-text-outline {
		font-size: 28rpx;
		font-weight: 600;
		color: #18C445;
	}

	.detail-section {
		padding: 32rpx;
	}

	.detail-card {
		background: #ffffff;
		border-radius: 32rpx;
		padding: 32rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.detail-header {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid #f3f4f6;
	}

	.detail-icon {
		font-size: 32rpx;
		margin-right: 12rpx;
	}

	.detail-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1f2937;
	}

	.detail-content {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
	}

	.detail-label {
		font-size: 26rpx;
		color: #9ca3af;
		margin-bottom: 8rpx;
	}

	.detail-value {
		font-size: 28rpx;
		color: #374151;
		line-height: 1.6;
	}

	.effect-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
	}

	.effect-tag {
		background: #dcfce7;
		color: #16a34a;
		padding: 8rpx 20rpx;
		border-radius: 16rpx;
		font-size: 26rpx;
	}

	.detail-note {
		background: #fef3c7;
		padding: 20rpx;
		border-radius: 16rpx;
		border: 1rpx solid #fde68a;
	}

	.detail-note-text {
		font-size: 26rpx;
		color: #92400e;
		line-height: 1.6;
	}

	.tip-section {
		padding: 0 32rpx 48rpx;
	}

	.tip-card {
		background: #dbeafe;
		border: 1rpx solid #93c5fd;
		border-radius: 24rpx;
		padding: 24rpx;
	}

	.tip-header {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.tip-icon {
		font-size: 28rpx;
		margin-right: 8rpx;
	}

	.tip-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1e40af;
	}

	.tip-list {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.tip-item {
		font-size: 26rpx;
		color: #1e3a8a;
		line-height: 1.6;
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
