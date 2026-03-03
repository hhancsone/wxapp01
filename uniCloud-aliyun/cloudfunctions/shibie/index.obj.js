// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * 添加识别记录
	 * @param {Object} options 识别记录参数
	 * @param {string} options.herb_name 药材名称
	 * @param {number} options.confidence 匹配度
	 * @param {string} options.user_id 用户ID
	 * @param {string} options.user_nickname 用户昵称
	 * @param {string} options.image_url 识别图片URL
	 * @returns {object} 返回添加结果
	 */
	async addRecord(options) {
		const { herb_name, confidence, user_id, user_nickname, image_url } = options;
		
		if (!herb_name || confidence === undefined) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '药材名称和匹配度不能为空'
			};
		}
		
		const db = uniCloud.database();
		const result = await db.collection('shibie').add({
			herb_name: herb_name,
			confidence: confidence,
			identify_time: Date.now(),
			user_id: user_id || '',
			user_nickname: user_nickname || '用户',
			image_url: image_url || ''
		});
		
		return {
			code: 0,
			msg: 'success',
			data: result
		};
	},
	
	/**
	 * 获取用户识别记录
	 * @param {string} user_id 用户ID
	 * @returns {object} 返回识别记录列表
	 */
	async getUserRecords(user_id) {
		if (!user_id) {
			return {
				errCode: 'USER_ID_IS_NULL',
				errMsg: '用户ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const result = await db.collection('shibie')
			.where({
				user_id: user_id
			})
			.orderBy('identify_time', 'desc')
			.get();
		
		return {
			code: 0,
			msg: 'success',
			data: result.data
		};
	},
	
	/**
	 * 获取识别记录统计
	 * @returns {object} 返回统计结果
	 */
	async getStatistics() {
		const db = uniCloud.database();
		const countResult = await db.collection('shibie').count();
		
		return {
			code: 0,
			msg: 'success',
			data: {
				total: countResult.total
			}
		};
	}
}
