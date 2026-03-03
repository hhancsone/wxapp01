"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const _sfc_main = {
  data() {
    return {
      records: [],
      isLoading: false
    };
  },
  computed: {
    userInfo() {
      return uni_modules_uniIdPages_common_store.store.userInfo || {};
    }
  },
  onShow() {
    uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
    this.loadRecords();
  },
  methods: {
    async loadRecords() {
      this.isLoading = true;
      try {
        const userId = this.userInfo._id || this.userInfo.uid;
        common_vendor.index.__f__("log", "at pages/mine/identify-records.vue:84", "用户信息:", this.userInfo);
        common_vendor.index.__f__("log", "at pages/mine/identify-records.vue:85", "用户ID:", userId);
        if (!userId) {
          common_vendor.index.__f__("log", "at pages/mine/identify-records.vue:88", "用户未登录");
          this.records = [];
          return;
        }
        common_vendor.index.__f__("log", "at pages/mine/identify-records.vue:93", "开始加载识别记录...");
        const shibie = common_vendor.tr.importObject("shibie");
        const res = await shibie.getUserRecords(userId);
        common_vendor.index.__f__("log", "at pages/mine/identify-records.vue:96", "识别记录查询结果:", res);
        if (res && res.code === 0) {
          this.records = res.data || [];
          common_vendor.index.__f__("log", "at pages/mine/identify-records.vue:100", "识别记录数据:", this.records);
        } else {
          common_vendor.index.__f__("log", "at pages/mine/identify-records.vue:102", "查询失败，错误码:", res == null ? void 0 : res.errCode);
          this.records = [];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mine/identify-records.vue:106", "加载识别记录失败:", e);
        this.records = [];
      } finally {
        this.isLoading = false;
      }
    },
    formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    goToDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/encyclopedia/detail?name=${item.herb_name}&image_url=${encodeURIComponent(item.image_url || "")}`
      });
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    switchTab(index) {
      if (index === 3)
        return;
      if (index === 0) {
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      } else if (index === 1) {
        common_vendor.index.switchTab({
          url: "/pages/identify/identify"
        });
      } else if (index === 2) {
        common_vendor.index.switchTab({
          url: "/pages/encyclopedia/encyclopedia"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.records.length > 0
  }, $data.records.length > 0 ? {
    c: common_vendor.f($data.records, (item, index, i0) => {
      return common_vendor.e({
        a: item.image_url
      }, item.image_url ? {
        b: item.image_url
      } : {}, {
        c: common_vendor.t(item.herb_name || "未知药材"),
        d: common_vendor.t(item.confidence || 0),
        e: common_vendor.t($options.formatTime(item.identify_time)),
        f: item._id,
        g: common_vendor.o(($event) => $options.goToDetail(item), item._id)
      });
    })
  } : {}, {
    d: common_vendor.o(($event) => $options.switchTab(0)),
    e: common_vendor.o(($event) => $options.switchTab(1)),
    f: common_vendor.o(($event) => $options.switchTab(2)),
    g: common_vendor.o(($event) => $options.switchTab(3))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/identify-records.js.map
