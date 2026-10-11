import React from 'react';
import { RefreshCw, Fish, ClipboardCheck, Store, Ship, Database, BarChart3, Anchor, MapPin } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRefreshData,
  isRefreshing,
}) => {
  const tabs = [
    {
      id: 'radar',
      label: '今日魚價行情',
      desc: '崁仔頂與各港比價',
      icon: Fish,
      tag: '查魚價',
    },
    {
      id: 'procurement',
      label: '抓魚登記與找貨媒合',
      desc: '漁民記帳 · 餐廳想買魚',
      icon: ClipboardCheck,
      tag: '登記/買魚',
    },
    {
      id: 'promo',
      label: '合作店家與吃魚優惠',
      desc: '基隆在地海產 · 出示折價',
      icon: Store,
      tag: '拿折價券',
    },
    {
      id: 'vessel',
      label: '漁船回港與海況',
      desc: '北方三島捕撈與卸魚動態',
      icon: Ship,
      tag: '看船隻',
    },
    {
      id: 'data-eng',
      label: '資料品質實驗室',
      desc: '俗名對齊 · 數據整理實證',
      icon: Database,
      tag: '看品質',
    },
    {
      id: 'macro-micro',
      label: '全台生產量與漁會',
      desc: '年報統計與漁會服務',
      icon: BarChart3,
      tag: '看統計',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b2847] text-white shadow-md border-b-4 border-[#0284c7]">
      {/* 頂部海港氣象與定位親切小列 */}
      <div className="bg-[#071c33] text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="bg-[#ea580c] text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
            基隆示範場域
          </span>
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
            崁仔頂夜間魚市 · 八斗子漁港 · 正濱漁港 · 潮境海灣
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            依據農業部水產品交易行情資料庫 · 2026 基準回測
          </span>
          <button
            type="button"
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-[#0369a1] hover:bg-[#0284c7] text-white px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer shadow-sm active:scale-95"
            title="點擊重新同步最新行情數據"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? '更新中...' : '重新整理行情'}</span>
          </button>
        </div>
      </div>

      {/* 主標題與標誌 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div
            onClick={() => setActiveTab('radar')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 bg-white text-[#0b2847] rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#e0f2fe] transition">
              <Anchor className="w-6 h-6 text-[#0284c7]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  FishData-TW
                </span>
                <span className="bg-[#0284c7] text-white text-xs px-2 py-0.5 rounded font-bold">
                  基隆港鱻
                </span>
              </div>
              <p className="text-xs text-slate-300 font-normal">
                台灣智慧漁業開放資料與產銷決策平台 · 漁民實用 · 清楚透明
              </p>
            </div>
          </div>

          {/* 漁民/商戶貼心說明提示 */}
          <div className="hidden lg:flex items-center gap-2 bg-[#10355c] px-3.5 py-2 rounded-xl border border-sky-800/60 text-xs text-sky-100">
            <span className="text-base">⚓</span>
            <div>
              <div className="font-bold text-white">漁民好幫手 · 餐廳買好魚</div>
              <div className="text-[11px] text-sky-200">免繁瑣操作，按鈕大、字體大，手機單手就能點選！</div>
            </div>
          </div>
        </div>

        {/* 清楚直白的大按鈕導航列 (Large Thumb-Friendly Navigation) */}
        <nav className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 text-left ${
                  isActive
                    ? 'bg-white text-[#0b2847] shadow-md ring-2 ring-[#38bdf8]'
                    : 'bg-[#123860] text-slate-200 hover:bg-[#194b7f] hover:text-white border border-sky-900/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-[#e0f2fe] text-[#0284c7]' : 'bg-[#09223d] text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black whitespace-nowrap">
                      {tab.label}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        isActive
                          ? 'bg-[#ea580c] text-white'
                          : 'bg-[#09223d] text-sky-300'
                      }`}
                    >
                      {tab.tag}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] font-normal whitespace-nowrap ${
                      isActive ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
