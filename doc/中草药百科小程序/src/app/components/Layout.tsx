import { Outlet, useLocation, Link } from "react-router";
import { Home, Camera, BookOpen } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "首页" },
    { path: "/identify", icon: Camera, label: "识别" },
    { path: "/encyclopedia", icon: BookOpen, label: "百科" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 主内容区域 */}
      <div className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </div>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
              >
                <Icon
                  className={`w-7 h-7 mb-1 transition-all ${
                    isActive 
                      ? "text-green-600 scale-110 drop-shadow-lg" 
                      : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive ? "text-green-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}