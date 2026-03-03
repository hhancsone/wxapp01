<script>
	import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
	export default {
		onLaunch: async function() {
			console.log('App Launch')
			await uniIdPageInit()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 每个页面公共css */
	page {
		background-color: #f8f8f8;
		font-size: 28rpx;
		color: #333;
	}

	view,
	text {
		box-sizing: border-box;
	}
</style>
