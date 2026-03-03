"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    switchTab(index) {
      common_vendor.index.switchTab({
        url: index === 0 ? "/pages/index/index" : index === 1 ? "/pages/identify/identify" : index === 2 ? "/pages/encyclopedia/encyclopedia" : "/pages/mine/mine"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o(($event) => $options.switchTab(0)),
    c: common_vendor.o(($event) => $options.switchTab(1)),
    d: common_vendor.o(($event) => $options.switchTab(2)),
    e: common_vendor.o(($event) => $options.switchTab(3))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/about.js.map
