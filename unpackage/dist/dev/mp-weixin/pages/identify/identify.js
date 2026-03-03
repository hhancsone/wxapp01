"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const _sfc_main = {
  computed: {
    userInfo() {
      return uni_modules_uniIdPages_common_store.store.userInfo || {};
    }
  },
  data() {
    return {
      identifyResult: null,
      isIdentifying: false,
      apiBaseUrl: "http://localhost:5000"
    };
  },
  methods: {
    handleUpload() {
      const _this = this;
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
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
          common_vendor.index.request({
            url: `${this.apiBaseUrl}/api/identify`,
            method: "POST",
            header: {
              "Content-Type": "application/json"
            },
            data: {
              image: base64
            },
            success: (res) => {
              if (res.statusCode === 200) {
                resolve(res.data);
              } else {
                reject(new Error("请求失败"));
              }
            },
            fail: reject
          });
        });
        if (response.success && response.result && response.result.length > 0) {
          const topResult = response.result[0];
          const result = {
            name: topResult.name,
            confidence: topResult.confidence,
            allResults: response.result,
            image: imagePath
          };
          try {
            const yaocai = common_vendor.tr.importObject("yaocai");
            const detailRes = await yaocai.getDetailByName({
              name: topResult.name
            });
            if (detailRes.code === 0 && detailRes.data) {
              const herbData = detailRes.data;
              result.latinName = herbData.latin_name || "";
              result.category = herbData.category || "";
              result.medicinalPart = herbData.medicinal_part || "";
              result.taste = herbData.taste || "";
              result.meridian = herbData.meridian || "";
              result.efficacy = herbData.efficacy || "";
              result.indication = herbData.indication || "";
            } else {
              try {
                const searchRes = await yaocai.search(topResult.name);
                if (searchRes.code === 0 && searchRes.data && searchRes.data.length > 0) {
                  const herbData = searchRes.data[0];
                  result.latinName = herbData.latin_name || "";
                  result.category = herbData.category || "";
                  result.medicinalPart = herbData.medicinal_part || "";
                  result.taste = herbData.taste || "";
                  result.meridian = herbData.meridian || "";
                  result.efficacy = herbData.efficacy || "";
                  result.indication = herbData.indication || "";
                }
              } catch (searchErr) {
              }
            }
          } catch (e) {
            result.latinName = "Test Latin Name";
            result.category = "测试分类";
            result.medicinalPart = "测试部位";
            result.taste = "甘，平";
            result.meridian = "肺、肝、肾经";
            result.efficacy = "清热解毒，消肿止痛";
            result.indication = "用于测试用途";
          }
          try {
            const userInfo = this.userInfo;
            common_vendor.index.__f__("log", "at pages/identify/identify.vue:267", "准备记录识别结果，用户信息:", userInfo);
            common_vendor.index.__f__("log", "at pages/identify/identify.vue:268", "识别结果:", topResult);
            let imageUrl = "";
            try {
              const uploadRes = await common_vendor.tr.uploadFile({
                filePath: imagePath,
                cloudPath: `identify/${Date.now()}_${(userInfo == null ? void 0 : userInfo._id) || "anonymous"}.jpg`
              });
              imageUrl = uploadRes.fileID;
              common_vendor.index.__f__("log", "at pages/identify/identify.vue:278", "图片上传成功:", imageUrl);
            } catch (uploadErr) {
              common_vendor.index.__f__("error", "at pages/identify/identify.vue:280", "图片上传失败:", uploadErr);
            }
            const shibie = common_vendor.tr.importObject("shibie");
            const recordRes = await shibie.addRecord({
              herb_name: topResult.name,
              confidence: topResult.confidence,
              user_id: (userInfo == null ? void 0 : userInfo._id) || (userInfo == null ? void 0 : userInfo.uid) || "",
              user_nickname: (userInfo == null ? void 0 : userInfo.nickname) || "用户",
              image_url: imageUrl
            });
            common_vendor.index.__f__("log", "at pages/identify/identify.vue:292", "识别记录保存结果:", recordRes);
            if (recordRes && recordRes.code === 0) {
              common_vendor.index.__f__("log", "at pages/identify/identify.vue:295", "识别记录保存成功");
            } else {
              common_vendor.index.__f__("log", "at pages/identify/identify.vue:297", "识别记录保存失败:", recordRes == null ? void 0 : recordRes.errCode, recordRes == null ? void 0 : recordRes.errMsg);
            }
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/identify/identify.vue:300", "保存识别记录异常:", e);
          }
          this.identifyResult = result;
        } else {
          common_vendor.index.showToast({
            title: "未能识别出药材",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/identify/identify.vue:311", "识别失败:", e);
        common_vendor.index.showToast({
          title: "识别失败，请检查网络",
          icon: "none"
        });
      } finally {
        this.isIdentifying = false;
      }
    },
    imageToBase64(imagePath) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getFileSystemManager().readFile({
          filePath: imagePath,
          encoding: "base64",
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
      if (index === 1)
        return;
      if (index === 0) {
        common_vendor.index.switchTab({
          url: "/pages/index/index"
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
  return common_vendor.e({
    a: !$data.identifyResult && !$data.isIdentifying
  }, !$data.identifyResult && !$data.isIdentifying ? {} : {}, {
    b: $data.isIdentifying
  }, $data.isIdentifying ? {} : {}, {
    c: $data.identifyResult && !$data.isIdentifying
  }, $data.identifyResult && !$data.isIdentifying ? common_vendor.e({
    d: $data.identifyResult.image
  }, $data.identifyResult.image ? {
    e: $data.identifyResult.image
  } : {}, {
    f: common_vendor.t($data.identifyResult.name),
    g: common_vendor.t($data.identifyResult.latinName),
    h: common_vendor.t($data.identifyResult.confidence),
    i: common_vendor.t($data.identifyResult.category)
  }) : {}, {
    j: !$data.identifyResult || $data.isIdentifying
  }, !$data.identifyResult || $data.isIdentifying ? {
    k: common_vendor.o((...args) => $options.handleUpload && $options.handleUpload(...args))
  } : {}, {
    l: !$data.identifyResult || $data.isIdentifying
  }, !$data.identifyResult || $data.isIdentifying ? {
    m: common_vendor.o((...args) => $options.handleUpload && $options.handleUpload(...args))
  } : {}, {
    n: $data.identifyResult && !$data.isIdentifying
  }, $data.identifyResult && !$data.isIdentifying ? {
    o: common_vendor.o((...args) => $options.resetIdentify && $options.resetIdentify(...args))
  } : {}, {
    p: $data.identifyResult && !$data.isIdentifying
  }, $data.identifyResult && !$data.isIdentifying ? {
    q: common_vendor.t($data.identifyResult.latinName),
    r: common_vendor.t($data.identifyResult.medicinalPart),
    s: common_vendor.t($data.identifyResult.taste),
    t: common_vendor.t($data.identifyResult.meridian),
    v: common_vendor.t($data.identifyResult.efficacy),
    w: common_vendor.t($data.identifyResult.indication)
  } : {}, {
    x: !$data.identifyResult
  }, !$data.identifyResult ? {} : {}, {
    y: common_vendor.o(($event) => $options.switchTab(0)),
    z: common_vendor.o(($event) => $options.switchTab(1)),
    A: common_vendor.o(($event) => $options.switchTab(2)),
    B: common_vendor.o(($event) => $options.switchTab(3))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/identify/identify.js.map
