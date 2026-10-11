import React, { useState, useMemo, useEffect } from 'react';
import { FishPriceRecord, MarketInfo, FishSpecies } from '../types/fishery';
import { ArrowUpRight, ArrowDownRight, Fish, MapPin, Calendar, Download, Scale, ShieldAlert, Zap, Compass, Calculator, Sparkles, Bot, X, Loader2, CheckCircle2 } from 'lucide-react';

interface MarketRadarViewProps {
  prices: FishPriceRecord[];
  markets: MarketInfo[];
  species: FishSpecies[];
  selectedFishId?: string;
  onSelectFishId?: (id: string) => void;
}

export const MarketRadarView: React.FC<MarketRadarViewProps> = ({
  prices,
  markets,
  species,
  selectedFishId: propSelectedFishId,
  onSelectFishId,
}) => {
  const [internalFishId, setInternalFishId] = useState<string>('1010'); // Default: 白帶魚
  const selectedFishId = propSelectedFishId || internalFishId;

  const handleSelectFish = (id: string) => {
    setInternalFishId(id);
    if (onSelectFishId) onSelectFishId(id);
  };

  const [selectedRangeDays, setSelectedRangeDays] = useState<number>(14);
  const [activeChartTab, setActiveChartTab] = useState<'compare' | 'band'>('compare');
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Gemini AI Strategic Advisor State
  const [showAdvisorModal, setShowAdvisorModal] = useState<boolean>(false);
  const [advisorLoading, setAdvisorLoading] = useState<boolean>(false);
  const [advisorPrompt, setAdvisorPrompt] = useState<string>('');
  const [advisorResponse, setAdvisorResponse] = useState<string>('');
  const [advisorSource, setAdvisorSource] = useState<string>('');

  // Selected Fish Details
  const currentFish = useMemo(() => {
    return species.find((s) => s.id === selectedFishId) || species[0];
  }, [species, selectedFishId]);

  // Unique dates sorted
  const sortedDates = useMemo(() => {
    const dates = Array.from(new Set(prices.map((p) => p.trade_date))).sort();
    return dates.slice(-selectedRangeDays);
  }, [prices, selectedRangeDays]);

  // Filter records for the selected fish within the chosen date range
  const currentFishRecords = useMemo(() => {
    return prices.filter(
      (p) => p.fish_id === selectedFishId && sortedDates.includes(p.trade_date)
    );
  }, [prices, selectedFishId, sortedDates]);

  // Group by date & market
  const marketDateMap = useMemo(() => {
    const map: Record<string, Record<string, FishPriceRecord>> = {};
    for (const r of currentFishRecords) {
      if (!map[r.trade_date]) map[r.trade_date] = {};
      map[r.trade_date][r.market_id] = r;
    }
    return map;
  }, [currentFishRecords]);

  // Latest Keelung & Comparison stats
  const latestDate = sortedDates[sortedDates.length - 1] || '';
  const previousDate = sortedDates[sortedDates.length - 2] || '';

  const latestKeelungRecord = marketDateMap[latestDate]?.['KL01'];
  const prevKeelungRecord = marketDateMap[previousDate]?.['KL01'];

  const keelungAvgPrice = latestKeelungRecord?.avg_price || 0;
  const keelungPrevAvgPrice = prevKeelungRecord?.avg_price || keelungAvgPrice;
  const priceChange = keelungAvgPrice - keelungPrevAvgPrice;
  const priceChangePct = keelungPrevAvgPrice ? ((priceChange / keelungPrevAvgPrice) * 100).toFixed(1) : '0';

  const keelungVolume = latestKeelungRecord?.trade_volume || 0;

  // Cross-market Arbitrage comparison for latest date
  const arbitrageAnalysis = useMemo(() => {
    if (!latestKeelungRecord) return null;
    const latestOtherMarkets = Object.values(marketDateMap[latestDate] || {}).filter(
      (m) => m.market_id !== 'KL01'
    );
    if (!latestOtherMarkets.length) return null;

    // Find lowest priced market
    const lowest = [...latestOtherMarkets].sort((a, b) => a.avg_price - b.avg_price)[0];
    const diff = latestKeelungRecord.avg_price - lowest.avg_price;
    const diffPct = ((diff / lowest.avg_price) * 100).toFixed(1);

    return {
      lowestMarket: lowest.market_name,
      lowestPrice: lowest.avg_price,
      keelungPrice: latestKeelungRecord.avg_price,
      diff,
      diffPct,
      hasArbitrageOpportunity: diff > 15,
    };
  }, [latestKeelungRecord, marketDateMap, latestDate]);

  // Detect recent anomalies (Z-score algorithm)
  const recentAnomalies = useMemo(() => {
    return currentFishRecords
      .filter((r) => r.anomaly_flag !== 'NORMAL')
      .sort((a, b) => b.trade_date.localeCompare(a.trade_date));
  }, [currentFishRecords]);

  // SVG Chart Dimensions
  const chartWidth = 840;
  const chartHeight = 290;
  const padding = { top: 30, right: 35, bottom: 45, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Find min and max price across all plotted records
  const { minPrice, maxPrice } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    currentFishRecords.forEach((r) => {
      if (r.low_price < min) min = r.low_price;
      if (r.high_price > max) max = r.high_price;
    });
    if (min === Infinity) min = 50;
    if (max === -Infinity) max = 300;
    const range = max - min;
    return {
      minPrice: Math.max(0, Math.floor(min - range * 0.1)),
      maxPrice: Math.ceil(max + range * 0.1),
    };
  }, [currentFishRecords]);

  const getX = (dateIndex: number) => {
    if (sortedDates.length <= 1) return padding.left + innerWidth / 2;
    return padding.left + (dateIndex / (sortedDates.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const safeMax = maxPrice === minPrice ? minPrice + 10 : maxPrice;
    const ratio = (val - minPrice) / (safeMax - minPrice);
    return padding.top + innerHeight - ratio * innerHeight;
  };

  // Maritime Harbor Palette for Markets
  const marketColors: Record<string, string> = {
    KL01: '#0284c7', // 基隆港 (湛藍 - 本地核心)
    IL01: '#ea580c', // 蘇澳南方澳 (鮮橘)
    PT01: '#0d9488', // 屏東東港 (海青)
    KH01: '#6366f1', // 高雄前鎮 (深靛藍)
    PH01: '#16a34a', // 澎湖 (海島綠)
    TC01: '#d97706', // 台中梧棲 (金黃)
  };

  // Export current table view to CSV
  const handleExportCsv = () => {
    const headers = ['交易日期,市場代碼,市場名稱,魚種名稱,上價(元/kg),中價(元/kg),下價(元/kg),平均價(元/kg),交易量(kg),異常狀態'];
    const rows = currentFishRecords.map((r) =>
      `${r.trade_date},${r.market_id},${r.market_name},${r.fish_name},${r.high_price},${r.mid_price},${r.low_price},${r.avg_price},${r.trade_volume},${r.anomaly_flag}`
    );
    const blob = new Blob([['\uFEFF', ...headers, '\n', rows.join('\n')].join('')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `基隆魚市行情_${currentFish.name}_${latestDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Trigger Gemini AI advisor
  const handleAskAdvisor = async (customPrompt?: string) => {
    const query = customPrompt || advisorPrompt || `針對目前【${currentFish.name}】在基隆崁仔頂的交易行情與跨市場比價，請提供黑客松評審最重視的成因剖析與答辯策略。`;
    setAdvisorLoading(true);
    setShowAdvisorModal(true);
    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          type: 'MARKET_ANALYSIS',
          context: {
            fishName: currentFish.name,
            keelungPrice: keelungAvgPrice,
            priceChange,
            priceChangePct,
            volume: keelungVolume,
            arbitrageDiff: arbitrageAnalysis?.diff,
            recentAnomalies: recentAnomalies.length,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdvisorResponse(data.reply || '');
        setAdvisorSource(data.source || 'GEMINI');
      } else {
        setAdvisorResponse('暫時無法連線至 AI 顧問服務，請稍後再試。');
      }
    } catch {
      setAdvisorResponse('連線異常，已切換至備援指引。');
    } finally {
      setAdvisorLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 頂部海港行情核心卡片 (Friendly White Card) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1.5 flex-wrap">
              <span className="bg-[#0284c7] text-white font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                基隆崁仔頂 · 八斗子鮮魚行情
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-200 font-bold px-2 py-0.5 rounded-full text-[11px]">
                對標農業部開放資料 · 2026 回測
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              今日魚價行情與各港比價
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              鎖定基隆與北部沿近海主力經濟魚種 · 清楚標示產地價差與風浪價格預警，漁民與商戶一眼看懂。
            </p>
          </div>

          {/* Time range selector & Export & AI Advisor (Big, friendly buttons) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="px-2 text-slate-500 font-bold">天數:</span>
              {[7, 14, 24].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setSelectedRangeDays(days)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    selectedRangeDays === days
                      ? 'bg-white text-[#0284c7] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {days} 天
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 text-xs transition cursor-pointer shadow-sm"
              title="下載目前乾淨格式之 CSV 報表"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>下載報表 (CSV)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAdvisorModal(true);
                if (!advisorResponse) {
                  handleAskAdvisor('【黑客松評審問答防禦】評審若質疑「漁民是否願意使用？數據如何協助產銷？」，該如何應對？');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI 產銷智庫 (專家分析)</span>
            </button>
          </div>
        </div>

        {/* 魚種快速切換按鈕區 (大按鈕、清楚俗名、好點選) */}
        <div className="pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Fish className="w-4 h-4 text-[#0284c7]" />
              <span>請選擇要查看的魚種（點擊切換）：</span>
            </span>
            {currentFish.north_south_names && (
              <span className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1 rounded-full font-bold">
                俗名叫法：{currentFish.north_south_names}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {species.map((fish) => {
              const isSelected = fish.id === selectedFishId;
              return (
                <button
                  key={fish.id}
                  type="button"
                  onClick={() => handleSelectFish(fish.id)}
                  className={`flex flex-col text-left p-3.5 rounded-xl border-2 transition cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-md ring-2 ring-sky-200'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-black text-base tracking-tight">{fish.name}</span>
                    <Fish className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                  </div>

                  {fish.north_south_names && (
                    <div
                      className={`text-[11px] font-bold px-2 py-0.5 rounded my-1 truncate ${
                        isSelected
                          ? 'bg-[#0369a1] text-sky-100'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {fish.north_south_names}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] mt-1 pt-1 border-t border-black/10">
                    <span className="truncate opacity-80">{fish.seasonality?.split(' ')[0] || '盛產期'}</span>
                    <span className={`font-bold ${isSelected ? 'text-amber-200' : 'text-emerald-700'}`}>
                      {fish.esg_status?.split('/')[0] || '當季'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 四大清楚指標卡片 (親切、直白、大字體、避免難懂術語) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 卡片 1: 崁仔頂均價 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-sky-300 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-slate-700">崁仔頂今日拍賣均價</span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[11px] font-bold">
              基隆批發魚市
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0f2b48] tracking-tight">
              NT$ {keelungAvgPrice}
            </span>
            <span className="text-xs text-slate-500 font-bold">/ 公斤</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-xs font-bold">
            <span
              className={`flex items-center px-2 py-0.5 rounded-full ${
                priceChange >= 0
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {priceChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {priceChange >= 0 ? `+${priceChange}` : priceChange} 元 ({priceChangePct}%)
            </span>
            <span className="text-slate-400 text-[11px]">比前一開市日</span>
          </div>
        </div>

        {/* 卡片 2: 到港交易量 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-sky-300 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-slate-700">今日到港拍賣量</span>
            <span className="text-[11px] text-slate-400">八斗子/正濱卸魚</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {keelungVolume.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-bold">公斤 (KG)</span>
          </div>
          <div className="mt-2.5 text-xs text-slate-600 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
            <span className="font-medium">卸魚量平穩 · 供應充足</span>
          </div>
        </div>

        {/* 卡片 3: 產地價差比價 (直白用語，不講 Arbitrage) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-sky-300 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-slate-700">產地與基隆價差 (各港比價)</span>
            <Scale className="w-4 h-4 text-[#ea580c]" />
          </div>
          {arbitrageAnalysis ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#ea580c] tracking-tight">
                  +NT$ {arbitrageAnalysis.diff}
                </span>
                <span className="text-xs text-orange-600 font-bold">({arbitrageAnalysis.diffPct}%)</span>
              </div>
              <div className="mt-2.5 text-xs text-slate-600 truncate">
                基隆均價高於 <strong className="text-slate-800">{arbitrageAnalysis.lowestMarket.split(' (')[0]}</strong>（合理冷鏈與鮮食溢價）
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">各市場比價計算中...</div>
          )}
        </div>

        {/* 卡片 4: 風浪海象與價格預警 (直白用語，不講 Z-Score 黑話) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-sky-300 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-slate-700">海象與價格波動警示</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            {recentAnomalies.length > 0 ? (
              <span className="text-2xl font-black text-rose-600 flex items-center gap-1.5">
                <Zap className="w-5 h-5 text-rose-600 fill-rose-600" />
                <span>注意風浪波動</span>
              </span>
            ) : (
              <span className="text-2xl font-black text-emerald-600">
                ✅ 價格平穩正常
              </span>
            )}
          </div>
          <div className="mt-2.5 text-xs text-slate-500">
            {recentAnomalies.length > 0
              ? `${recentAnomalies[0].trade_date} 受外海風浪或大量卸魚影響，價格波動偏大`
              : '過去 14 天均在穩定行情範圍內'}
          </div>
        </div>
      </div>

      {/* 主互動價格趨勢圖表區塊 (乾淨清爽海洋風) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#0284c7] rounded-full inline-block" />
            <h3 className="font-black text-slate-900 text-lg tracking-tight">
              {currentFish.name} · 價格時序趨勢走勢圖
            </h3>
          </div>

          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveChartTab('compare')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeChartTab === 'compare'
                  ? 'bg-white text-[#0284c7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              各主要魚市均價對比 (跨港比價)
            </button>
            <button
              onClick={() => setActiveChartTab('band')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeChartTab === 'band'
                  ? 'bg-white text-[#0284c7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              基隆崁仔頂 上/中/下價區間帶
            </button>
          </div>
        </div>

        {/* 圖例說明 (Friendly Legend) */}
        {activeChartTab === 'compare' ? (
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            {markets.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: marketColors[m.id] || '#94a3b8' }}
                />
                <span className={m.id === 'KL01' ? 'font-black text-[#0284c7]' : 'font-medium'}>
                  {m.name.split(' (')[0]} {m.id === 'KL01' && '(基隆本地核心)'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ea580c]" />
              <span className="font-bold text-slate-800">上價 (頂級現流鮮貨)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0284c7]" />
              <span className="font-bold text-slate-800">平均價 (拍賣成交均價)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              <span className="font-bold text-slate-800">下價 (加工或次級規格)</span>
            </div>
          </div>
        )}

        {/* SVG 圖表容器 */}
        <div className="relative overflow-x-auto bg-slate-50/70 p-3 rounded-xl border border-slate-200">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[700px] select-none"
          >
            {/* 柔和背景刻度線 */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = padding.top + innerHeight * pct;
              const priceAtY = Math.round(maxPrice - (maxPrice - minPrice) * pct);
              return (
                <g key={pct}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    fill="#64748b"
                    fontSize="11"
                    textAnchor="end"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    NT${priceAtY}
                  </text>
                </g>
              );
            })}

            {/* 日期 X 軸 */}
            {sortedDates.map((date, idx) => {
              if (sortedDates.length > 10 && idx % 2 !== 0 && idx !== sortedDates.length - 1) return null;
              const x = getX(idx);
              const isHovered = hoveredDate === date;
              return (
                <g key={date}>
                  <line
                    x1={x}
                    y1={padding.top + innerHeight}
                    x2={x}
                    y2={padding.top + innerHeight + 6}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y={padding.top + innerHeight + 20}
                    fill={isHovered ? '#0284c7' : '#64748b'}
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    {date.slice(5)}
                  </text>
                </g>
              );
            })}

            {/* 各市場行情折線 */}
            {activeChartTab === 'compare' ? (
              markets.map((m) => {
                const points = sortedDates
                  .map((date, idx) => {
                    const rec = marketDateMap[date]?.[m.id];
                    if (!rec) return null;
                    return `${getX(idx)},${getY(rec.avg_price)}`;
                  })
                  .filter(Boolean)
                  .join(' ');

                const isKeelung = m.id === 'KL01';

                return (
                  <g key={m.id}>
                    <polyline
                      points={points}
                      fill="none"
                      stroke={marketColors[m.id] || '#64748b'}
                      strokeWidth={isKeelung ? '3.5' : '1.8'}
                    />
                    {sortedDates.map((date, idx) => {
                      const rec = marketDateMap[date]?.[m.id];
                      if (!rec) return null;
                      const cx = getX(idx);
                      const cy = getY(rec.avg_price);
                      const isHovered = hoveredDate === date;
                      return (
                        <circle
                          key={date}
                          cx={cx}
                          cy={cy}
                          r={isHovered ? (isKeelung ? '6' : '4') : isKeelung ? '4' : '2.5'}
                          fill={marketColors[m.id] || '#64748b'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                );
              })
            ) : (
              (() => {
                const highPoints = sortedDates
                  .map((date, idx) => {
                    const rec = marketDateMap[date]?.['KL01'];
                    return rec ? `${getX(idx)},${getY(rec.high_price)}` : null;
                  })
                  .filter(Boolean);

                const lowPointsReversed = sortedDates
                  .map((date, idx) => {
                    const rec = marketDateMap[date]?.['KL01'];
                    return rec ? `${getX(idx)},${getY(rec.low_price)}` : null;
                  })
                  .filter(Boolean)
                  .reverse();

                const avgPoints = sortedDates
                  .map((date, idx) => {
                    const rec = marketDateMap[date]?.['KL01'];
                    return rec ? `${getX(idx)},${getY(rec.avg_price)}` : null;
                  })
                  .filter(Boolean)
                  .join(' ');

                const bandPolygon = [...highPoints, ...lowPointsReversed].join(' ');

                return (
                  <g>
                    <polygon
                      points={bandPolygon}
                      fill="#0284c7"
                      fillOpacity="0.12"
                    />
                    <polyline
                      points={highPoints.join(' ')}
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth="2"
                    />
                    <polyline
                      points={lowPointsReversed.reverse().join(' ')}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <polyline
                      points={avgPoints}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="3.5"
                    />
                  </g>
                );
              })()
            )}

            {/* 透明互動感應區 */}
            {sortedDates.map((date, idx) => {
              const x = getX(idx);
              const colWidth = innerWidth / (sortedDates.length - 1 || 1);
              return (
                <rect
                  key={date}
                  x={x - colWidth / 2}
                  y={padding.top}
                  width={colWidth}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                />
              );
            })}
          </svg>
        </div>

        {/* 懸浮檢視資訊卡片 */}
        {hoveredDate && marketDateMap[hoveredDate] && (
          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0284c7]" />
              <span className="font-extrabold text-slate-900">{hoveredDate}</span>
              <span className="text-slate-500">當日各地拍賣行情：</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {markets.map((m) => {
                const rec = marketDateMap[hoveredDate][m.id];
                if (!rec) return null;
                return (
                  <div key={m.id} className="flex items-center gap-1.5">
                    <span className="text-slate-600">{m.name.split(' (')[0]}:</span>
                    <span
                      className="font-black"
                      style={{ color: marketColors[m.id] || '#0284c7' }}
                    >
                      NT${rec.avg_price}
                    </span>
                    <span className="text-[11px] text-slate-400">({rec.trade_volume}kg)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 漲跌與異常預警統計算法解說 (清楚海港白色卡片) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#0284c7]" />
            <h3 className="text-lg font-black text-slate-900">
              統計算法與資料治理核心邏輯說明
            </h3>
          </div>
          <span className="text-xs bg-sky-50 text-sky-800 font-bold px-3 py-1 rounded-full border border-sky-100">
            統計模型規範
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 公式 1 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#0284c7] text-sm">01. 開市日報酬率 (Daily Return)</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 font-mono text-xs text-slate-900 font-bold rounded-lg">
              ΔP = P_t - P_prev<br />
              漲跌幅(%) = (ΔP / P_prev) × 100%
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-xs">
              排除傳統魚市場公休日（農曆初三、十七休市）的假性斷點，精準錨定前一實際有效拍賣日之成交均價。
            </p>
          </div>

          {/* 公式 2 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#ea580c] text-sm">02. 滾動 Z-Score 異常檢測</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 font-mono text-xs text-slate-900 font-bold rounded-lg">
              Z = (P_t - μ_14) / σ_14<br />
              觸發門檻：|Z| ≥ 2.5σ
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-xs">
              計算過去 14 天滾動平均與標準差；若偏離大於 2.5 個標準差，標定為外海風浪停捕暴漲或大卸魚爆量。
            </p>
          </div>

          {/* 公式 3 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-emerald-700 text-sm">03. 跨市場冷鏈價差 (Spread)</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 font-mono text-xs text-slate-900 font-bold rounded-lg">
              Spread = P_KL - min(P_others)<br />
              價差比(%) = (Spread / min) × 100%
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-xs">
              以基隆崁仔頂市場為消費地核心，比對南方澳、前鎮等產地之冷鏈差價，超過 15 元/kg 提示跨市場調度機會。
            </p>
          </div>
        </div>
      </div>

      {/* AI 決策智庫彈窗 (親切海洋現代風格) */}
      {showAdvisorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white border-2 border-sky-400 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* 彈窗頂部橫幅 */}
            <div className="bg-gradient-to-r from-[#0b2847] to-[#0284c7] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-base">
                    產銷決策 AI 智庫顧問 (Gemini 2.5 Flash)
                  </h3>
                  <p className="text-xs text-sky-100">
                    2026 臺灣海洋黑客松 · 評審問答防禦與產銷成因剖析
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvisorModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* 彈窗主體內容 */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* 當前目標速覽 */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sky-900 font-bold">當前分析目標：</span>
                  <span className="text-slate-900 font-black text-sm">{currentFish.name}</span>
                  <span className="text-slate-500">({currentFish.north_south_names || '北部主力'})</span>
                </div>
                <div className="flex items-center gap-4 text-slate-700">
                  <span>崁仔頂均價: <strong className="text-slate-900">NT${keelungAvgPrice}</strong></span>
                  <span>跨港價差: <strong className="text-[#ea580c]">+{arbitrageAnalysis?.diff || 0}元</strong></span>
                  <span>預警狀態: <strong className={recentAnomalies.length ? 'text-amber-700' : 'text-emerald-700'}>{recentAnomalies.length ? `${recentAnomalies.length}次海象波動` : '常態平穩'}</strong></span>
                </div>
              </div>

              {/* 快速點選範例問題 */}
              <div>
                <span className="text-xs font-black text-slate-700 block mb-2">
                  快速諮詢黑客松核心議題：
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '🛡️ 評審問答防禦（漁民願意用嗎？）', q: '【黑客松評審問答防禦】評審若質疑「漁民是否願意使用？數據如何協助產銷？」，該如何應對？' },
                    { label: '📈 產銷成因剖析（為何價格偏高？）', q: `【產銷成因剖析】診斷目前【${currentFish.name}】在基隆崁仔頂的交易行情成因與北方三島海象/卸魚關聯。` },
                    { label: '🌊 ESG 與海洋永續（SDG 14 實踐）', q: `【海洋永續與產銷】以【${currentFish.name}】為例，本平台如何結合產銷決策與 SDG 14「永續海洋」與低碳地產地消？` },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={advisorLoading}
                      onClick={() => {
                        setAdvisorPrompt(item.q);
                        handleAskAdvisor(item.q);
                      }}
                      className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-sky-100 hover:text-sky-900 text-slate-700 border border-slate-200 rounded-xl transition cursor-pointer font-bold"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI 回應展示區塊 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 min-h-[220px] relative">
                {advisorLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#0284c7] animate-spin" />
                    <p className="text-xs font-bold text-slate-800">
                      正在調用 Gemini 2.5 Flash 生成海洋黑客松專家級剖析報告...
                    </p>
                    <p className="text-xs text-slate-500">
                      整合基隆崁仔頂高頻拍賣、北方三島海象與 SDG 14 永續產銷邏輯
                    </p>
                  </div>
                ) : advisorResponse ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs text-slate-600">
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>智庫報告已就緒（來源：{advisorSource === 'GEMINI_2_5_FLASH' ? 'Gemini 2.5 Flash 即時分析' : '專家啟發式智庫備援'}）</span>
                      </span>
                      <span className="text-slate-400">2026 TAIWAN OCEAN HACKATHON</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                      {advisorResponse}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    請點選上方快捷議題或輸入自訂問題，啟動 AI 決策智庫。
                  </div>
                )}
              </div>

              {/* 自訂問題輸入列 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={advisorPrompt}
                  onChange={(e) => setAdvisorPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && advisorPrompt.trim() && !advisorLoading) {
                      handleAskAdvisor(advisorPrompt);
                    }
                  }}
                  placeholder="輸入自訂問題（例如：基隆市場相對於南方澳的冷鏈運銷溢價如何計算？）"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
                <button
                  type="button"
                  disabled={advisorLoading || !advisorPrompt.trim()}
                  onClick={() => handleAskAdvisor(advisorPrompt)}
                  className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>諮詢</span>
                </button>
              </div>
            </div>

            {/* 彈窗頁尾 */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
              <span>評審問答防禦模型 · 嚴格依據 2026 海洋黑客松評分規準</span>
              <button
                type="button"
                onClick={() => setShowAdvisorModal(false)}
                className="text-slate-700 hover:text-slate-900 font-bold cursor-pointer"
              >
                關閉返回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

