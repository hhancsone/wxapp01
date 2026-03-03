"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const _sfc_main = {
  data() {
    return {
      collections: [],
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
    this.loadCollections();
  },
  methods: {
    async loadCollections() {
      this.isLoading = true;
      try {
        const shoucang = common_vendor.tr.importObject("shoucang");
        if (!shoucang || !shoucang.getMyCollections) {
          common_vendor.index.__f__("error", "at pages/mine/collection.vue:81", "云对象初始化失败");
          this.collections = [];
          return;
        }
        const userId = this.userInfo._id || this.userInfo.uid;
        const res = await shoucang.getMyCollections(userId);
        if (res && res.code === 0) {
          this.collections = res.data || [];
        } else if (res && res.errCode === "NOT_LOGGED_IN") {
          this.collections = [];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mine/collection.vue:93", "加载收藏失败:", e);
        this.collections = [];
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
      return `${year}-${month}-${day}`;
    },
    async removeCollection(item) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消收藏吗？",
        success: async (res) => {
          if (res.confirm) {
            const shoucang = common_vendor.tr.importObject("shoucang");
            const userId = this.userInfo._id || this.userInfo.uid;
            const result = await shoucang.removeCollection(item.herb_id, userId);
            if (result && result.code === 0) {
              this.collections = this.collections.filter((c) => c._id !== item._id);
              common_vendor.index.showToast({
                title: "取消收藏",
                icon: "none"
              });
            }
          }
        }
      });
    },
    goToDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/encyclopedia/detail?id=${item.herb_id}&name=${item.herb_name}`
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
    b: $data.collections.length > 0
  }, $data.collections.length > 0 ? {
    c: common_vendor.f($data.collections, (item, k0, i0) => {
      return common_vendor.e({
        a: item.herb_image
      }, item.herb_image ? {
        b: item.herb_image
      } : {
        c: common_vendor.t(item.herb_name ? item.herb_name.substring(0, 2) : "")
      }, {
        d: common_vendor.t(item.herb_name),
        e: common_vendor.t($options.formatTime(item.create_date)),
        f: common_vendor.o(($event) => $options.removeCollection(item), item._id),
        g: item._id,
        h: common_vendor.o(($event) => $options.goToDetail(item), item._id)
      });
    }),
    d: common_vendor.n("bg-" + (Math.floor(Math.random() * 8) + 1))
  } : {}, {
    e: common_vendor.o(($event) => $options.switchTab(0)),
    f: common_vendor.o(($event) => $options.switchTab(1)),
    g: common_vendor.o(($event) => $options.switchTab(2)),
    h: common_vendor.o(($event) => $options.switchTab(3))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/collection.js.map
