import React, { useState } from 'react';
import { AnnualProductionItem, FishermenAssociation } from '../types/fishery';
import { BarChart, Landmark, Users, Ship, ShieldAlert, Info, TrendingUp } from 'lucide-react';

interface MacroMicroViewProps {
  annualData: AnnualProductionItem[];
  associations: FishermenAssociation[];
}

export const MacroMicroView: React.FC<MacroMicroViewProps> = ({
  annualData,
  associations,
}) => {
  const [selectedCounty, setSelectedCounty] = useState<string>('基隆市');

  // Filter for selected county
  const countyRecords = annualData.filter((d) => d.county === selectedCounty);

  const totalCountyProduction = countyRecords.reduce((acc, curr) => acc + curr.production_mt, 0);
  const totalCountyValue = countyRecords.reduce((acc, curr) => acc + curr.production_val_million, 0);
  const totalCountyFishers = countyRecords.reduce((acc, curr) => acc + curr.fisher_population, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 標題與縣市切換橫幅 */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-white border-2 border-sky-300 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-[#0284c7] text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide">
                宏觀年報統計與微觀行情互補
              </span>
              <span className="text-xs text-sky-900 font-bold">
                CF0110 (生產量) × CF0120 (產值) × 114年統計年報
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              宏觀產業結構與高頻市場行情的互補性研究 (RQ4)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              破解「市場交易量 ≠ 當地生產量」與「拍賣批發價 ≠ 漁民產地實收價」的統計分析邊界，建立基隆與全台漁業產銷趨勢評估基準。
            </p>
          </div>

          {/* 縣市選擇器 (親切大按鈕) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-slate-700">切換縣市：</span>
            <div className="flex flex-wrap gap-1.5">
              {['基隆市', '宜蘭縣', '高雄市', '屏東縣', '澎湖縣'].map((county) => (
                <button
                  key={county}
                  type="button"
                  onClick={() => setSelectedCounty(county)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                    selectedCounty === county
                      ? 'bg-[#0284c7] text-white shadow-sm ring-2 ring-sky-300'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {county} {county === '基隆市' && '(示範試點)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 跨尺度研究限制與防錯提示卡片 (溫和友善的警示) */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <span>跨尺度研究限制與因果推論防錯聲明</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          微觀每日拍賣資料反映的是「短期供需與季節鮮食行情」，受外縣市魚貨進口調度影響；宏觀年度統計反映的是「行政轄區註冊漁船年產量」。
          本平台採用兩者作為「供給端趨勢（產量增減）」與「需求端價格彈性」的交叉驗證依據，而非直接等同加總。
        </p>
      </div>

      {/* 三大宏觀產業結構指標卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 hover:border-sky-300 transition">
          <span className="text-xs text-slate-500 font-bold block">
            年度總漁業生產量 (CF0110)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {totalCountyProduction.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-bold">公噸 (MT)</span>
          </div>
          <span className="text-xs text-[#0284c7] font-bold block">
            {selectedCounty === '基隆市' ? '近海漁獲佔比 89.4% (以扒網棒受網為主)' : '含沿近海、遠洋與繁養殖'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 hover:border-sky-300 transition">
          <span className="text-xs text-slate-500 font-bold block">
            年度總漁業生產值 (CF0120)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#ea580c]">
              NT$ {totalCountyValue.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-bold">百萬元</span>
          </div>
          <span className="text-xs text-slate-500 font-medium block">
            折合新台幣 {Number((totalCountyValue / 10).toFixed(1))} 億元產值規模
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 hover:border-sky-300 transition">
          <span className="text-xs text-slate-500 font-bold block">
            漁業從業人口規模 (114年統計)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">
              {totalCountyFishers.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-bold">人</span>
          </div>
          <span className="text-xs text-slate-500 font-medium block">
            以各級區漁會登記服務之從業人口為骨幹
          </span>
        </div>
      </div>

      {/* 漁業分類結構表格 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#0284c7] rounded-full inline-block" />
            <h3 className="text-lg font-black text-slate-900">
              {selectedCounty} 漁業類別結構剖析 (CF0110 / CF0120 實測結構)
            </h3>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
            官方統計年報對標
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">漁業分類</th>
                <th className="py-3.5 px-4 font-bold">年產量 (公噸)</th>
                <th className="py-3.5 px-4 font-bold">年產值 (百萬元)</th>
                <th className="py-3.5 px-4 font-bold">漁業從業人數</th>
                <th className="py-3.5 px-4 font-bold">代表主要魚種</th>
                <th className="py-3.5 px-4 font-bold">產業特色與產地脈絡</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {countyRecords.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.fishery_type}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-[#0284c7]">{item.production_mt.toLocaleString()} MT</td>
                  <td className="py-3.5 px-4 font-mono font-black text-[#ea580c]">NT$ {item.production_val_million} M</td>
                  <td className="py-3.5 px-4 text-slate-700">{item.fisher_population.toLocaleString()} 人</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{item.main_species.join('、')}</td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">{item.highlights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 漁會組織基本資料網絡 (G74) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#0284c7] rounded-full inline-block" />
            <div>
              <h3 className="text-lg font-black text-slate-900">
                各級區漁會組織服務網絡 (農業部開放資料 G74)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                各級漁會是行情資訊落地的最後一哩路，支持漁民手機行情查詢與產銷履歷驗證。
              </p>
            </div>
          </div>
          <span className="text-xs bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-bold">
            G74 官方 API 串接
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {associations.map((fa) => {
            const isPilot = fa.county === '基隆市';
            return (
              <div
                key={fa.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isPilot
                    ? 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <span>{fa.name}</span>
                    {isPilot && (
                      <span className="text-xs bg-[#ea580c] text-white font-extrabold px-2 py-0.5 rounded-full">
                        示範試點
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-slate-500 font-bold">{fa.county}</span>
                </div>

                <div className="text-xs text-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">會員漁民數：</span>
                    <strong className="text-slate-900">{fa.members.toLocaleString()} 人</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">作業漁船數：</span>
                    <strong className="text-slate-900">{fa.boats.toLocaleString()} 艘</strong>
                  </div>
                  <div className="text-slate-600 truncate pt-1">
                    <span className="text-slate-400">地址：</span>
                    <span>{fa.address}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-slate-500 block mb-1.5 font-bold">主要服務項目：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {fa.services.map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[11px] rounded-md font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
