import { Search, TrendingUp, Leaf, Clock } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HomePage() {
  const categories = [
    { name: "清热解毒", icon: "🌿", color: "bg-green-100" },
    { name: "补气养血", icon: "❤️", color: "bg-red-100" },
    { name: "活血化瘀", icon: "💊", color: "bg-purple-100" },
    { name: "止咳平喘", icon: "🌸", color: "bg-blue-100" },
  ];

  const popularHerbs = [
    {
      id: 1,
      name: "金银花",
      latin: "Lonicera japonica",
      effect: "清热解毒，疏散风热",
      query: "honeysuckle flower",
    },
    {
      id: 2,
      name: "人参",
      latin: "Panax ginseng",
      effect: "大补元气，补脾益肺",
      query: "ginseng root",
    },
    {
      id: 3,
      name: "当归",
      latin: "Angelica sinensis",
      effect: "补血活血，调经止痛",
      query: "angelica root herbs",
    },
  ];

  const recentViews = [
    { name: "枸杞", time: "2小时前" },
    { name: "黄芪", time: "5小时前" },
    { name: "甘草", time: "1天前" },
  ];

  return (
    <div className="min-h-full bg-gradient-to-b from-green-50 to-white">
      {/* 顶部横幅 */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold mb-2">识百草</h1>
        <p className="text-green-50 text-sm">传承中医智慧，探索本草奥秘</p>
        
        {/* 搜索框 */}
        <Link to="/encyclopedia" className="block mt-4">
          <div className="bg-white rounded-full flex items-center shadow-lg px-[16px] py-[12px] mx-[0px] my-[5px]">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-400">搜索中草药名称...</span>
          </div>
        </Link>
      </div>

      {/* 快捷功能 */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-4 gap-3 mx-[0px] my-[25px]">
          {categories.map((category) => (
            <Link
              key={category.name}
              to="/encyclopedia"
              className="flex flex-col items-center"
            >
              <div className={`${category.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-2`}>
                {category.icon}
              </div>
              <span className="text-xs text-gray-700 text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 热门草药 */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="font-semibold text-gray-800">热门草药</h2>
          </div>
          <Link to="/encyclopedia" className="text-sm text-green-600">
            更多 →
          </Link>
        </div>

        <div className="space-y-3">
          {popularHerbs.map((herb) => (
            <div
              key={herb.id}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4 overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={`https://source.unsplash.com/80x80/?${herb.query}`}
                  alt={herb.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 mb-1">{herb.name}</h3>
                <p className="text-xs text-gray-500 mb-2 italic">{herb.latin}</p>
                <div className="flex items-center">
                  <Leaf className="w-3 h-3 text-green-600 mr-1" />
                  <p className="text-xs text-gray-600 truncate">{herb.effect}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 最近浏览 */}
      
    </div>
  );
}
