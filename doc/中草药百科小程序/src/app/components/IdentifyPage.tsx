import { useState } from "react";
import { Camera, Upload, Image as ImageIcon, Info, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function IdentifyPage() {
  const [identifyResult, setIdentifyResult] = useState<any>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);

  const handleIdentify = () => {
    setIsIdentifying(true);
    // 模拟识别过程
    setTimeout(() => {
      setIdentifyResult({
        name: "金银花",
        latinName: "Lonicera japonica",
        confidence: 95,
        category: "清热解毒",
        description: "金银花为忍冬科植物忍冬的干燥花蕾或带初开的花。",
        effects: ["清热解毒", "疏散风热", "凉血止痢"],
        usage: "煎服，6-15g；外用适量。",
        notes: "脾胃虚寒及气虚疮疡脓清者忌服。",
      });
      setIsIdentifying(false);
    }, 2000);
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* 顶部标题 */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold mb-2">智能识别</h1>
        <p className="text-green-50 text-sm">上传照片，AI识别中草药</p>
      </div>

      {/* 上传区域 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {!identifyResult ? (
            <>
              {/* 上传图片区 */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-12 h-12 text-green-600" />
                </div>
                <p className="text-gray-600 mb-2">点击下方按钮上传照片</p>
                <p className="text-xs text-gray-400">支持 JPG、PNG 格式</p>
              </div>

              {/* 上传按钮 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleIdentify}
                  className="bg-green-600 text-white py-3 rounded-xl flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  拍照识别
                </button>
                <button
                  onClick={handleIdentify}
                  className="bg-white border-2 border-green-600 text-green-600 py-3 rounded-xl flex items-center justify-center hover:bg-green-50 transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  相册选择
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 识别中动画 */}
              {isIdentifying ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">AI正在识别中...</p>
                </div>
              ) : (
                <>
                  {/* 识别结果 */}
                  <div className="mb-4">
                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden">
                      <ImageWithFallback
                        src="https://source.unsplash.com/400x300/?honeysuckle,flower"
                        alt="识别的图片"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                          {identifyResult.name}
                        </h2>
                        <p className="text-sm text-gray-500 italic">
                          {identifyResult.latinName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-600 mb-1">
                          <Sparkles className="w-4 h-4 mr-1" />
                          <span className="text-sm">可信度</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {identifyResult.confidence}%
                        </div>
                      </div>
                    </div>

                    <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mb-4">
                      {identifyResult.category}
                    </div>
                  </div>

                  <button
                    onClick={() => setIdentifyResult(null)}
                    className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    重新识别
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* 识别详情 */}
      {identifyResult && !isIdentifying && (
        <div className="px-4 mt-4 pb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Info className="w-5 h-5 text-green-600 mr-2" />
              详细信息
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">简介</p>
                <p className="text-gray-700">{identifyResult.description}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">功效作用</p>
                <div className="flex flex-wrap gap-2">
                  {identifyResult.effects.map((effect: string) => (
                    <span
                      key={effect}
                      className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">用法用量</p>
                <p className="text-gray-700">{identifyResult.usage}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-gray-500 mb-1">注意事项</p>
                <p className="text-amber-800 text-sm">{identifyResult.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      {!identifyResult && (
        <div className="px-4 mt-4 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              拍摄建议
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 确保光线充足，避免阴影遮挡</li>
              <li>• 尽量拍摄草药的全貌</li>
              <li>• 保持画面清晰，避免模糊</li>
              <li>• 背景简洁，突出主体</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
