"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchQuery: "",
      activeTab: "all",
      isLoading: false,
      herbs: [],
      categories: [
        { id: "all", name: "全部" },
        { id: "heat", name: "清热解毒" },
        { id: "qi", name: "补气养血" },
        { id: "blood", name: "活血化瘀" },
        { id: "cough", name: "止咳平喘" }
      ]
    };
  },
  onLoad() {
    this.loadCategories();
    this.loadHerbs();
    common_vendor.index.$on("switchCategory", (categoryId) => {
      this.activeTab = categoryId;
      this.loadHerbs();
    });
  },
  onUnload() {
    common_vendor.index.$off("switchCategory");
  },
  computed: {
    filteredHerbs() {
      return this.herbs;
    }
  },
  methods: {
    getImageUrl(images) {
      if (!images || images.length === 0)
        return "";
      const img = images[0];
      return typeof img === "string" ? img : img.url || "";
    },
    async loadCategories() {
      try {
        const fenlei = common_vendor.tr.importObject("fenlei");
        const res = await fenlei.getList();
        if (res && res.code === 0 && res.data) {
          this.categories = [
            { id: "all", name: "全部" },
            ...res.data.map((item) => ({ id: item.name, name: item.name }))
          ];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/encyclopedia/encyclopedia.vue:143", "加载分类失败:", e);
      }
    },
    async loadHerbs() {
      this.isLoading = true;
      try {
        const yaocai = common_vendor.tr.importObject("yaocai");
        const res = await yaocai.getList({
          category: this.activeTab,
          keyword: this.searchQuery
        });
        if (res.code === 0) {
          this.herbs = res.data.list.map((item, index) => ({
            ...item,
            bgColor: `bg-${index % 8 + 1}`
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/encyclopedia/encyclopedia.vue:161", "加载药材列表失败:", e);
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
      common_vendor.index.navigateTo({
        url: `/pages/encyclopedia/detail?id=${herb._id}&name=${herb.name}`
      });
    },
    switchTab(index) {
      if (index === 2)
        return;
      if (index === 0) {
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      } else if (index === 1) {
        common_vendor.index.switchTab({
          url: "/pages/identify/identify"
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
  return common_vendor.e({
    a: $data.searchQuery,
    b: common_vendor.o(($event) => $data.searchQuery = $event.detail.value),
    c: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    d: common_vendor.f($data.categories, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: common_vendor.n({
          active: $data.activeTab === category.id
        }),
        c: category.id,
        d: common_vendor.n({
          active: $data.activeTab === category.id
        }),
        e: common_vendor.o(($event) => $options.switchCategory(category.id), category.id)
      };
    }),
    e: common_vendor.t($options.filteredHerbs.length),
    f: common_vendor.f($options.filteredHerbs, (herb, k0, i0) => {
      return common_vendor.e({
        a: $options.getImageUrl(herb.images)
      }, $options.getImageUrl(herb.images) ? {
        b: $options.getImageUrl(herb.images)
      } : {
        c: common_vendor.t(herb.name.substring(0, 2))
      }, {
        d: common_vendor.n(herb.bgColor),
        e: common_vendor.t(herb.name),
        f: common_vendor.t(herb.latin_name),
        g: common_vendor.t(herb.category),
        h: common_vendor.t(herb.views),
        i: herb._id,
        j: common_vendor.o(($event) => $options.goToDetail(herb), herb._id)
      });
    }),
    g: $options.filteredHerbs.length === 0
  }, $options.filteredHerbs.length === 0 ? {} : {}, {
    h: common_vendor.o(($event) => $options.switchTab(0)),
    i: common_vendor.o(($event) => $options.switchTab(1)),
    j: common_vendor.o(($event) => $options.switchTab(2)),
    k: common_vendor.o(($event) => $options.switchTab(3))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/encyclopedia/encyclopedia.js.map
