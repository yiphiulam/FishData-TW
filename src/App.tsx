/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MarketRadarView } from './components/MarketRadarView';
import { DataEngineeringView } from './components/DataEngineeringView';
import { MacroMicroView } from './components/MacroMicroView';
import { VesselRadarView } from './components/VesselRadarView';
import { ProcurementMatchView } from './components/ProcurementMatchView';
import { MerchantPromoView } from './components/MerchantPromoView';
import { FishPriceRecord, MarketInfo, FishSpecies, AnnualProductionItem, FishermenAssociation, DataQualityReport } from './types/fishery';
import { SPECIES_CATALOG, MARKETS_CATALOG } from './types/fisheryConstants';
import { getFishPrices, ANNUAL_PRODUCTION_DATA, FISHERMEN_ASSOCIATIONS, DATA_QUALITY_METRICS } from './services/fisheryService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('radar'); // Default: 即時行情與市場雷達 (Market Radar)
  const [selectedFishId, setSelectedFishId] = useState<string>('1010'); // Default: 白帶魚
  const [prices, setPrices] = useState<FishPriceRecord[]>(() => getFishPrices());
  const [markets, setMarkets] = useState<MarketInfo[]>(MARKETS_CATALOG);
  const [species, setSpecies] = useState<FishSpecies[]>(SPECIES_CATALOG);
  const [annualData, setAnnualData] = useState<AnnualProductionItem[]>(ANNUAL_PRODUCTION_DATA);
  const [associations, setAssociations] = useState<FishermenAssociation[]>(FISHERMEN_ASSOCIATIONS);
  const [qualityReport, setQualityReport] = useState<DataQualityReport | null>(DATA_QUALITY_METRICS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isTestingPipeline, setIsTestingPipeline] = useState<boolean>(false);

  // Load or sync data
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      // 嘗試調用 API；若純前端模式則直接同步本地服務數據
      const pRes = await fetch('/api/fish/prices');
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.data) {
          setPrices(pData.data);
          if (pData.markets) setMarkets(pData.markets);
          if (pData.species) setSpecies(pData.species);
        }
      } else {
        setPrices(getFishPrices());
      }
    } catch {
      setPrices(getFishPrices());
      setAnnualData(ANNUAL_PRODUCTION_DATA);
      setAssociations(FISHERMEN_ASSOCIATIONS);
      setQualityReport(DATA_QUALITY_METRICS);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunPipelineTest = async () => {
    setIsTestingPipeline(true);
    try {
      await fetch('/api/fish/connectivity-test');
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsTestingPipeline(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-['Noto_Sans_TC',sans-serif] selection:bg-[#0284c7] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshData={loadData}
        isRefreshing={isRefreshing}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Tab 1: Live Market & Arbitrage Radar (今日魚價行情) */}
        {activeTab === 'radar' && (
          <MarketRadarView
            prices={prices}
            markets={markets}
            species={species}
            selectedFishId={selectedFishId}
            onSelectFishId={setSelectedFishId}
          />
        )}

        {/* Tab 2: Procurement Matching & Trip Traceability (抓魚登記與找貨媒合) */}
        {activeTab === 'procurement' && (
          <ProcurementMatchView
            species={species}
            onNavigateToRadar={(fishId) => {
              setSelectedFishId(fishId);
              setActiveTab('radar');
            }}
          />
        )}

        {/* Tab 3: Partner Stores & Local Coupons (合作店家與吃魚優惠) */}
        {activeTab === 'promo' && (
          <MerchantPromoView />
        )}

        {/* Tab 4: Vessel Radar (漁船回港與海況) */}
        {activeTab === 'vessel' && (
          <VesselRadarView
            onLinkToMarketRadar={(fishId?: string) => {
              if (fishId) setSelectedFishId(fishId);
              setActiveTab('radar');
            }}
          />
        )}

        {/* Tab 5: Data Engineering & Quality Lab (資料品質實驗室) */}
        {activeTab === 'data-eng' && qualityReport && (
          <DataEngineeringView
            qualityReport={qualityReport}
            onRunTest={handleRunPipelineTest}
            isTesting={isTestingPipeline}
          />
        )}

        {/* Tab 6: Macro-Micro Cross Scale (全台生產量與漁會) */}
        {activeTab === 'macro-micro' && (
          <MacroMicroView
            annualData={annualData}
            associations={associations}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0b2847] text-slate-300 border-t-4 border-[#0284c7] py-8 px-4 text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-black text-sm">
              <span>FishData-TW 台灣智慧漁業開放資料與產銷決策平台</span>
              <span className="text-[11px] bg-[#ea580c] text-white px-2 py-0.5 rounded font-bold">
                基隆示範港
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              本平台協助漁民、漁會、魚市場、商戶與研究團隊整理漁獲紀錄、參考官方行情、檢查資料可比性，並延伸提供地方漁產展示與採購需求轉介。平台不宣稱掌握基隆漁民的完整實際捕獲量，也不保證行情等於現貨或供貨價格。
            </p>
            <div className="text-[11px] text-slate-400 pt-0.5">
              資料來源：農業部水產品交易行情資料庫 (AquaticTransData)、CF0110 漁業生產量、CF0120 漁業生產值、G74 漁會統計、民國114年漁業統計年報。
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs shrink-0">
            <span className="bg-[#10355c] text-sky-200 px-3 py-1.5 rounded-lg border border-sky-800/60 font-medium">
              政府資料開放授權 (ODGL 1.0)
            </span>
            <span className="bg-[#10355c] text-sky-200 px-3 py-1.5 rounded-lg border border-sky-800/60 font-medium">
              基隆崁仔頂試點
            </span>
            <span className="bg-[#10355c] text-sky-200 px-3 py-1.5 rounded-lg border border-sky-800/60 font-medium">
              南北俗名標準對齊
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
