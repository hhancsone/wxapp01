import { useState } from "react";
import { Search, Filter, Leaf, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function EncyclopediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", name: "全部" },
    { id: "heat", name: "清热解毒" },
    { id: "qi", name: "补气养血" },
    { id: "blood", name: "活血化瘀" },
    { id: "cough", name: "止咳平喘" },
  ];

  const herbs = [
    {
      id: 1,
      name: "金银花",
      latin: "Lonicera japonica",
      category: "清热解毒",
      rating: 4.8,
      views: "12.5k",
      query: "honeysuckle flower",
    },
    {
      id: 2,
      name: "人参",
      latin: "Panax ginseng",
      category: "补气养血",
      rating: 4.9,
      views: "18.2k",
      query: "ginseng root",
    },
    {
      id: 3,
      name: "当归",
      latin: "Angelica sinensis",
      category: "补气养血",
      rating: 4.7,
      views: "9.8k",
      query: "angelica root herbs",
    },
    {
      id: 4,
      name: "川贝",
      latin: "Fritillaria cirrhosa",
      category: "止咳平喘",
      rating: 4.6,
      views: "7.3k",
      query: "fritillaria bulb",
    },
    {
      id: 5,
      name: "丹参",
      latin: "Salvia miltiorrhiza",
      category: "活血化瘀",
      rating: 4.7,
      views: "8.9k",
      query: "salvia root red",
    },
    {
      id: 6,
      name: "黄芪",
      latin: "Astragalus membranaceus",
      category: "补气养血",
      rating: 4.8,
      views: "11.2k",
      query: "astragalus root",
    },
    {
      id: 7,
      name: "板蓝根",
      latin: "Isatis indigotica",
      category: "清热解毒",
      rating: 4.5,
      views: "10.1k",
      query: "isatis root blue",
    },
    {
      id: 8,
      name: "枸杞",
      latin: "Lycium barbarum",
      category: "补气养血",
      rating: 4.9,
      views: "15.6k",
      query: "goji berry red",
    },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      {/* 顶部搜索区 */}
      <div className="bg-white px-4 pt-8 pb-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">草药百科</h1>
        
        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索中草药名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 分类标签 */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeTab === category.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 草药列表 */}
      <div className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">共 {herbs.length} 种草药</span>
          <div className="flex items-center text-sm text-gray-500">
            <Leaf className="w-4 h-4 mr-1 text-green-600" />
            <span>按热度排序</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-6">
          {herbs.map((herb) => (
            <div
              key={herb.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <ImageWithFallback
                  src={`https://source.unsplash.com/300x300/?${herb.query}`}
                  alt={herb.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-xs font-medium">{herb.rating}</span>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-gray-800 mb-1 truncate">
                  {herb.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2 truncate italic">
                  {herb.latin}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    {herb.category}
                  </span>
                  <span className="text-xs text-gray-400">{herb.views} 浏览</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 空状态提示（当搜索无结果时显示） */}
      {searchQuery && herbs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-500">未找到相关草药</p>
          <p className="text-sm text-gray-400 mt-2">请尝试其他关键词</p>
        </div>
      )}
    </div>
  );
}
