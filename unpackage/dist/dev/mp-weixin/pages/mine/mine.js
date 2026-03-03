"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const _sfc_main = {
  computed: {
    userInfo() {
      return uni_modules_uniIdPages_common_store.store.userInfo;
    },
    isLoggedIn() {
      return uni_modules_uniIdPages_common_store.store.hasLogin;
    }
  },
  data() {
    return {};
  },
  onShow() {
    uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
  },
  methods: {
    goToUserInfo() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/userinfo"
      });
    },
    handleMenuClick(type) {
      if (type === "collection") {
        common_vendor.index.navigateTo({
          url: "/pages/mine/collection"
        });
      } else if (type === "identify") {
        common_vendor.index.navigateTo({
          url: "/pages/mine/identify-records"
        });
      } else if (type === "about") {
        common_vendor.index.navigateTo({
          url: "/pages/mine/about"
        });
      } else {
        common_vendor.index.showToast({
          title: "功能开发中",
          icon: "none"
        });
      }
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("uni_id_token");
            common_vendor.index.setStorageSync("uni_id_token_expired", 0);
            common_vendor.index.removeStorageSync("uni-id-pages-userInfo");
            uni_modules_uniIdPages_common_store.store.userInfo = {};
            uni_modules_uniIdPages_common_store.store.hasLogin = false;
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
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
    a: $options.userInfo.avatar_file && $options.userInfo.avatar_file.url
  }, $options.userInfo.avatar_file && $options.userInfo.avatar_file.url ? {
    b: $options.userInfo.avatar_file.url
  } : {}, {
    c: common_vendor.t($options.userInfo.nickname || "未登录"),
    d: common_vendor.t($options.isLoggedIn ? "点击查看资料" : "点击登录账号"),
    e: common_vendor.o((...args) => $options.goToUserInfo && $options.goToUserInfo(...args)),
    f: common_vendor.o(($event) => $options.handleMenuClick("collection")),
    g: common_vendor.o(($event) => $options.handleMenuClick("identify")),
    h: common_vendor.o(($event) => $options.handleMenuClick("about")),
    i: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    j: common_vendor.o(($event) => $options.switchTab(0)),
    k: common_vendor.o(($event) => $options.switchTab(1)),
    l: common_vendor.o(($event) => $options.switchTab(2)),
    m: common_vendor.o(($event) => $options.switchTab(3))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/mine.js.map
