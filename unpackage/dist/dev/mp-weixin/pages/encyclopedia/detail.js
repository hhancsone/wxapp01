"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const _sfc_main = {
  data() {
    return {
      herbId: "",
      herbName: "",
      userImageUrl: "",
      herb: {
        _id: "",
        name: "",
        latin_name: "",
        category: "",
        medicinal_part: "",
        taste: "",
        meridian: "",
        efficacy: "",
        indication: "",
        images: []
      },
      isCollected: false,
      isLoading: false
    };
  },
  computed: {
    userInfo() {
      return uni_modules_uniIdPages_common_store.store.userInfo || {};
    }
  },
  onLoad(options) {
    uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
    if (options.id) {
      this.herbId = options.id;
      this.loadHerbDetail();
    } else if (options.name) {
      this.herbName = options.name;
      this.userImageUrl = options.image_url || "";
      this.loadHerbDetailByName();
      common_vendor.index.setNavigationBarTitle({
        title: options.name
      });
    }
  },
  methods: {
    getImageUrl(images) {
      if (!images || images.length === 0)
        return "";
      const img = images[0];
      return typeof img === "string" ? img : img.url || "";
    },
    async loadHerbDetail() {
      this.isLoading = true;
      try {
        const yaocai = common_vendor.tr.importObject("yaocai");
        const res = await yaocai.getDetail(this.herbId);
        if (res && res.code === 0 && res.data) {
          this.herb = res.data;
        }
        try {
          const shoucang = common_vendor.tr.importObject("shoucang");
          if (shoucang && shoucang.checkIsCollected) {
            const userId = this.userInfo._id || this.userInfo.uid;
            const checkRes = await shoucang.checkIsCollected(this.herbId, userId);
            if (checkRes && checkRes.code === 0) {
              this.isCollected = checkRes.data || false;
            }
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/encyclopedia/detail.vue:151", "检查收藏状态失败:", e);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/encyclopedia/detail.vue:154", "加载药材详情失败:", e);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    async loadHerbDetailByName() {
      this.isLoading = true;
      try {
        const yaocai = common_vendor.tr.importObject("yaocai");
        const res = await yaocai.getDetailByName({
          name: this.herbName
        });
        if (res && res.code === 0 && res.data) {
          this.herb = res.data;
          this.herbId = res.data._id;
        } else {
          common_vendor.index.showToast({
            title: "药材不存在",
            icon: "none"
          });
        }
        try {
          const shoucang = common_vendor.tr.importObject("shoucang");
          if (shoucang && shoucang.checkIsCollected) {
            const userId = this.userInfo._id || this.userInfo.uid;
            const checkRes = await shoucang.checkIsCollected(this.herbId, userId);
            if (checkRes && checkRes.code === 0) {
              this.isCollected = checkRes.data || false;
            }
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/encyclopedia/detail.vue:190", "检查收藏状态失败:", e);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/encyclopedia/detail.vue:193", "加载药材详情失败:", e);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    async handleCollect() {
      try {
        const shoucang = common_vendor.tr.importObject("shoucang");
        if (!shoucang || !shoucang.addCollection || !shoucang.removeCollection) {
          common_vendor.index.showToast({
            title: "服务初始化失败",
            icon: "none"
          });
          return;
        }
        const userId = this.userInfo._id || this.userInfo.uid;
        if (!userId) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        if (!this.isCollected) {
          const herbImage = this.getImageUrl(this.herb.images);
          const nickname = this.userInfo.nickname || "用户";
          const res = await shoucang.addCollection({
            herb_id: this.herbId,
            herb_name: this.herb.name,
            herb_image: herbImage,
            user_id: userId,
            user_nickname: nickname
          });
          if (res && (res.code === 0 || res.errCode === "ALREADY_COLLECTED")) {
            this.isCollected = true;
            common_vendor.index.showToast({
              title: "收藏成功",
              icon: "success"
            });
          } else if (res && res.errCode === "NOT_LOGGED_IN") {
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
          } else {
            common_vendor.index.showToast({
              title: res && res.errMsg || "收藏失败",
              icon: "none"
            });
          }
        } else {
          const userId2 = this.userInfo._id || this.userInfo.uid;
          const res = await shoucang.removeCollection(this.herbId, userId2);
          if (res && res.code === 0) {
            this.isCollected = false;
            common_vendor.index.showToast({
              title: "取消收藏",
              icon: "none"
            });
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/encyclopedia/detail.vue:264", "收藏操作失败:", e);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userImageUrl
  }, $data.userImageUrl ? {
    b: $data.userImageUrl
  } : $options.getImageUrl($data.herb.images) ? {
    d: $options.getImageUrl($data.herb.images)
  } : {
    e: common_vendor.t($data.herb.name ? $data.herb.name.substring(0, 2) : ""),
    f: common_vendor.n($data.herb.bgColor)
  }, {
    c: $options.getImageUrl($data.herb.images),
    g: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    h: common_vendor.t($data.herb.name),
    i: common_vendor.t($data.isCollected ? "⭐" : "☆"),
    j: common_vendor.o((...args) => $options.handleCollect && $options.handleCollect(...args)),
    k: common_vendor.t($data.herb.latin_name),
    l: common_vendor.t($data.herb.category),
    m: common_vendor.t($data.herb.medicinal_part || "暂无"),
    n: common_vendor.t($data.herb.taste || "暂无"),
    o: common_vendor.t($data.herb.meridian || "暂无"),
    p: common_vendor.t($data.herb.efficacy || "暂无"),
    q: common_vendor.t($data.herb.indication || "暂无")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/encyclopedia/detail.js.map
