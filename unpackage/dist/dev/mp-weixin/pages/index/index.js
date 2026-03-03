"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      popularHerbs: []
    };
  },
  onLoad() {
    this.loadHotHerbs();
  },
  methods: {
    getImageUrl(images) {
      if (!images || images.length === 0)
        return "";
      const img = images[0];
      return typeof img === "string" ? img : img.url || "";
    },
    async loadHotHerbs() {
      try {
        const yaocai = common_vendor.tr.importObject("yaocai");
        const res = await yaocai.getHotList(3);
        if (res.code === 0) {
          this.popularHerbs = res.data.map((item, index) => ({
            ...item,
            effect: item.efficacy
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:95", "加载热门药材失败:", e);
      }
    },
    goToEncyclopedia() {
      common_vendor.index.switchTab({
        url: "/pages/encyclopedia/encyclopedia"
      });
    },
    goToHerbDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/encyclopedia/detail?id=${item._id}&name=${item.name}`
      });
    },
    switchTab(index) {
      if (index === 0)
        return;
      if (index === 1) {
        common_vendor.index.switchTab({
          url: "/pages/identify/identify"
        });
      } else if (index === 2) {
        common_vendor.index.switchTab({
          url: "/pages/encyclopedia/encyclopedia"
        });
      } else if (index === 3) {
        common_vendor.index.switchTab({
          url: "/pages/mine/mine"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goToEncyclopedia && $options.goToEncyclopedia(...args)),
    b: common_vendor.f($data.popularHerbs, (item, index, i0) => {
      return common_vendor.e({
        a: $options.getImageUrl(item.images)
      }, $options.getImageUrl(item.images) ? {
        b: $options.getImageUrl(item.images)
      } : {
        c: common_vendor.t(item.name.substring(0, 2))
      }, {
        d: common_vendor.n("bg-" + (index + 1)),
        e: common_vendor.t(item.name),
        f: common_vendor.t(item.latin_name),
        g: common_vendor.t(item.effect),
        h: item._id || index,
        i: common_vendor.o(($event) => $options.goToHerbDetail(item), item._id || index)
      });
    }),
    c: common_vendor.o(($event) => $options.switchTab(0)),
    d: common_vendor.o(($event) => $options.switchTab(1)),
    e: common_vendor.o(($event) => $options.switchTab(2)),
    f: common_vendor.o(($event) => $options.switchTab(3))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
