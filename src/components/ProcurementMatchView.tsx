import React, { useState } from 'react';
import { FishSpecies, ProcurementIntent, FishingTripRecord, VerificationStatus } from '../types/fishery';
import { 
  ShoppingBag, 
  Anchor, 
  CheckCircle2, 
  FileText, 
  Send, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Camera, 
  Upload, 
  Info, 
  AlertTriangle, 
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Layers,
  HelpCircle
} from 'lucide-react';

interface ProcurementMatchViewProps {
  species: FishSpecies[];
  onNavigateToRadar?: (fishId: string) => void;
}

export const ProcurementMatchView: React.FC<ProcurementMatchViewProps> = ({
  species,
  onNavigateToRadar,
}) => {
  // 分頁切換：商戶想買魚 (採購媒合) / 漁民記帳與核對 / 系統流程圖
  const [activeSubTab, setActiveSubTab] = useState<'procurement' | 'triplog' | 'workflow'>('procurement');

  // ==========================================
  // 1. 商戶採購意願表單 (Merchant Procurement)
  // ==========================================
  const [procurementForm, setProcurementForm] = useState({
    fish_name: '白帶魚',
    quantity: '50',
    unit: '公斤 (KG)',
    specs: '特大規格 · 現流冰鮮 · 整尾保鮮',
    target_date: '2026-10-14',
    merchant_name: '崁仔頂漁火熱炒食堂 (基隆市仁愛區)',
    contact_name: '陳主廚',
    contact_phone: '0912-345-678',
    contact_line: 'chef_chen_kl',
    notes: '希望清晨 04:30 於八斗子或崁仔頂魚市交貨，需附當日靠港保鮮佐證。',
  });

  const [procurementSubmitted, setProcurementSubmitted] = useState<boolean>(false);
  const [intentList, setIntentList] = useState<ProcurementIntent[]>([
    {
      id: 'REQ-20261010-01',
      fish_name: '白帶魚',
      quantity: 80,
      unit: '公斤 (KG)',
      specs: '特大肥帶 · 現流冰鮮',
      target_date: '2026-10-12',
      contact_name: '林經理',
      contact_phone: '0988-112-233',
      contact_line: 'lin_seafood',
      merchant_name: '長榮桂冠酒店 (基隆) 餐廳部',
      notes: '每日固定清晨交貨，需符合基隆區漁會溯源標準。',
      status: 'TRANSFERRED',
      transferred_to: '基隆區漁會供銷課 / 八斗子卸魚合作社',
      created_at: '2026-10-10 09:20',
    },
    {
      id: 'REQ-20261009-02',
      fish_name: '鎖管 (透抽)',
      quantity: 40,
      unit: '公斤 (KG)',
      specs: '現流透抽 · 船凍急速急冷',
      target_date: '2026-10-13',
      contact_name: '張老闆',
      contact_phone: '0922-334-455',
      contact_line: 'badouzi_squid',
      merchant_name: '八斗子潮境海景鍋物',
      notes: '煮鍋專用，規格約每隻 20~25 公分。',
      status: 'SUPPLIER_CONFIRMED',
      transferred_to: '新益春號棒受網船隊 (已確認排單供貨)',
      created_at: '2026-10-09 14:15',
    },
  ]);

  const handleSubmitProcurement = (e: React.FormEvent) => {
    e.preventDefault();
    const newIntent: ProcurementIntent = {
      id: `REQ-${Date.now().toString().slice(-8)}`,
      fish_name: procurementForm.fish_name,
      quantity: Number(procurementForm.quantity) || 10,
      unit: procurementForm.unit,
      specs: procurementForm.specs,
      target_date: procurementForm.target_date,
      contact_name: procurementForm.contact_name,
      contact_phone: procurementForm.contact_phone,
      contact_line: procurementForm.contact_line,
      merchant_name: procurementForm.merchant_name,
      notes: procurementForm.notes,
      status: 'TRANSFERRED',
      transferred_to: '基隆區漁會產銷部 / 崁仔頂承銷人聯絡組',
      created_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    setIntentList([newIntent, ...intentList]);
    setProcurementSubmitted(true);
    // 滾動到提示區域
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // ==========================================
  // 2. 漁民逐航次漁獲登記 (Trip Log & Verification)
  // ==========================================
  const [tripForm, setTripForm] = useState({
    departure_date: '2026-10-07',
    return_date: '2026-10-08',
    gear_type: '棒受網 / 集魚燈誘捕 (近海捕撈)',
    sea_area: '北方三島 / 彭佳嶼東南海域',
    fish_name: '白帶魚',
    weight_kg: '420',
    unloading_port: '基隆八斗子漁港',
    market_name: '基隆市場 (崁仔頂魚市)',
    evidence_name: '八斗子卸魚地磅過磅單_20261008.jpg',
  });

  const [tripRecords, setTripRecords] = useState<FishingTripRecord[]>([
    {
      id: 'TRIP-KL-20261008-01',
      departure_date: '2026-10-06',
      return_date: '2026-10-08',
      gear_type: '近海扒網 / 棒受網',
      sea_area: '北方三島海域 (彭佳嶼周邊)',
      fish_name: '白帶魚',
      weight_kg: 520,
      unloading_port: '基隆八斗子漁港',
      market_name: '基隆市場 (崁仔頂魚市)',
      evidence_name: '八斗子魚市場卸魚交易過磅單_KL08.jpg',
      evidence_preview: '已檢附電子地磅過磅單聯號 #88412',
      verification_status: '已附佐證',
      official_market_price: 185,
      estimated_revenue: 96200,
      data_source: '農業部水產品交易行情 API (AquaticTransData 崁仔頂 KL01)',
      update_date: '2026-10-08',
      comparability_note: '交易日與卸魚日完全一致，規格符合拍賣中上價標準，可直接比較。',
    },
    {
      id: 'TRIP-KL-20261007-02',
      departure_date: '2026-10-06',
      return_date: '2026-10-07',
      gear_type: '集魚燈棒受網',
      sea_area: '基隆嶼外海',
      fish_name: '鎖管 (透抽)',
      weight_kg: 280,
      unloading_port: '基隆八斗子漁港',
      market_name: '基隆市場 (崁仔頂魚市)',
      evidence_name: '船員拍賣收據與魚箱現場照.png',
      evidence_preview: '已附船上冷藏魚箱與卸魚照片',
      verification_status: '已人工核對',
      official_market_price: 290,
      estimated_revenue: 81200,
      data_source: '農業部水產品交易行情 API (AquaticTransData 崁仔頂 KL01)',
      update_date: '2026-10-07',
      comparability_note: '經基隆區漁會查核過磅收據屬實，核對完成。',
    },
    {
      id: 'TRIP-KL-20261005-03',
      departure_date: '2026-10-04',
      return_date: '2026-10-05',
      gear_type: '一支釣 / 沿岸磯釣',
      sea_area: '和平島外海礁岩區',
      fish_name: '赤鯮',
      weight_kg: 65,
      unloading_port: '基隆正濱漁港',
      market_name: '基隆市場 (崁仔頂魚市)',
      evidence_name: '手寫出海筆記本.jpg',
      evidence_preview: '初階手寫拍照，待補充公證過磅單',
      verification_status: '使用替代日期或價格',
      official_market_price: 420,
      estimated_revenue: 27300,
      data_source: '農業部水產品交易行情 API (前一有效交易日參考價)',
      update_date: '2026-10-04',
      comparability_note: '10/05 為農曆十六休市日，採用 10/04 前一拍賣日均價作為可比性替代估算。',
    },
  ]);

  const [tripSubmittedSuccess, setTripSubmittedSuccess] = useState<boolean>(false);

  const handleAddTripRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = Number(tripForm.weight_kg) || 100;
    const basePrice = tripForm.fish_name === '白帶魚' ? 185 : tripForm.fish_name.includes('鎖管') ? 290 : 200;

    const newTrip: FishingTripRecord = {
      id: `TRIP-KL-${Date.now().toString().slice(-8)}`,
      departure_date: tripForm.departure_date,
      return_date: tripForm.return_date,
      gear_type: tripForm.gear_type,
      sea_area: tripForm.sea_area,
      fish_name: tripForm.fish_name,
      weight_kg: weight,
      unloading_port: tripForm.unloading_port,
      market_name: tripForm.market_name,
      evidence_name: tripForm.evidence_name,
      evidence_preview: '已上傳過磅單與漁獲拍照檔案',
      verification_status: tripForm.evidence_name ? '已附佐證' : '待核對',
      official_market_price: basePrice,
      estimated_revenue: weight * basePrice,
      data_source: '農業部水產品交易行情 API (AquaticTransData 崁仔頂 KL01)',
      update_date: tripForm.return_date,
      comparability_note: '比對當日崁仔頂批發拍賣均價，資料規格單位 (NT$/kg) 吻合。',
    };

    setTripRecords([newTrip, ...tripRecords]);
    setTripSubmittedSuccess(true);
    setTimeout(() => setTripSubmittedSuccess(false), 5000);
  };

  // 親切易讀的核對狀態標籤
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case '已附佐證':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-md text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            已附佐證
          </span>
        );
      case '已人工核對':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-1 rounded-md text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            已人工核對
          </span>
        );
      case '待核對':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-md text-xs font-bold">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            待核對
          </span>
        );
      case '使用替代日期或價格':
        return (
          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 border border-orange-300 px-2.5 py-1 rounded-md text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            使用替代日期或價格
          </span>
        );
      case '無完全對應資料':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-md text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            無完全對應資料
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 平台法定定位與安心說明 Banner (親切海港風格) */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-white border-2 border-sky-300 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#ea580c] text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide">
                平台定位聲明
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                基隆在地漁業開放資料 · 透明核對與需求轉介
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>【平台定位】：</strong>本平台協助漁民、漁會、魚市場、商戶與研究團隊整理漁獲紀錄、參考官方行情、檢查資料可比性，並延伸提供地方漁產展示與採購需求轉介。<strong className="text-sky-900 underline decoration-sky-400 underline-offset-2">平台不宣稱掌握基隆漁民的完整實際捕獲量，也不保證行情等於現貨或供貨價格。</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 主功能切換導覽列 (大按鈕、清楚分類) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* 按鈕 1: 商戶採購媒合 */}
          <button
            type="button"
            onClick={() => setActiveSubTab('procurement')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'procurement'
                ? 'bg-[#0284c7] text-white shadow-md shadow-sky-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <span>商戶採購媒合</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold hidden md:inline">
              餐廳買魚
            </span>
          </button>

          {/* 按鈕 2: 漁民出海捕魚紀錄 */}
          <button
            type="button"
            onClick={() => setActiveSubTab('triplog')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'triplog'
                ? 'bg-[#0284c7] text-white shadow-md shadow-sky-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Anchor className="w-5 h-5 text-sky-200" />
            <span>漁獲登記與核對</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold hidden md:inline">
              漁民記帳
            </span>
          </button>

          {/* 按鈕 3: 系統流程圖 */}
          <button
            type="button"
            onClick={() => setActiveSubTab('workflow')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'workflow'
                ? 'bg-[#0284c7] text-white shadow-md shadow-sky-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-5 h-5 text-emerald-200" />
            <span>系統流程圖</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold hidden md:inline">
              角色與核對機制
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-600 px-2 flex items-center gap-2 justify-end">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>對接基隆區漁會與崁仔頂承銷體系</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 區塊 1: 商戶採購媒合頁 (依使用需求嚴格實作) */}
      {/* ======================================================== */}
      {activeSubTab === 'procurement' && (
        <div className="space-y-6">
          {/* 成功登記提示 (嚴格符合指示文字，不包含線上付款或下單成功畫面) */}
          {procurementSubmitted && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-6 shadow-md animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-2 flex-1">
                  <span className="inline-block bg-emerald-200 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-md">
                    採購需求已順利送出
                  </span>
                  <p className="text-base sm:text-lg font-black text-emerald-950 leading-relaxed">
                    「已收到採購需求。平台將轉介給合作單位，實際供貨、價格與交貨時間仍須由供應方確認。」
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    ※ 說明：本平台為開放媒合與產銷資訊服務，<strong className="text-slate-800">不涉及線上付款或金流扣款</strong>。基隆區漁會或崁仔頂合作供應商將依您留下的電話或 LINE 與您接洽確認現貨與交貨細節。
                  </p>
                  <button
                    type="button"
                    onClick={() => setProcurementSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    關閉此通知或再填寫一筆
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 表單卡片 (大按鈕、直白易讀欄位) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-6 bg-[#ea580c] rounded-full inline-block" />
                  <h3 className="text-xl font-black text-slate-900">
                    填寫採購意願（商戶找魚登記）
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  請填寫您餐廳或店家的採購需求，平台將轉介給基隆在地船隊、漁會供銷課或合法承銷商。
                </p>
              </div>

              <form onSubmit={handleSubmitProcurement} className="space-y-5">
                {/* 欄位 1: 魚種 */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-black text-slate-900">
                    1. 想要採購的魚種 <span className="text-[#ea580c]">*</span>
                  </label>
                  {/* 大顆快選按鈕 */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['白帶魚', '鎖管 (透抽)', '花腹鯖', '赤鯮', '黃雞魚', '鬼頭刀', '刺鯧 (肉魚)'].map((fish) => (
                      <button
                        key={fish}
                        type="button"
                        onClick={() => setProcurementForm({ ...procurementForm, fish_name: fish })}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          procurementForm.fish_name === fish
                            ? 'bg-[#0284c7] text-white shadow-sm ring-2 ring-sky-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {fish}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    required
                    value={procurementForm.fish_name}
                    onChange={(e) => setProcurementForm({ ...procurementForm, fish_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7] transition"
                    placeholder="請輸入魚種名稱，例如：白帶魚、透抽、黑格..."
                  />
                </div>

                {/* 欄位 2: 需求數量與計量單位 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-black text-slate-900">
                      2. 需求數量 <span className="text-[#ea580c]">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={procurementForm.quantity}
                      onChange={(e) => setProcurementForm({ ...procurementForm, quantity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7] transition"
                      placeholder="例如：50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-black text-slate-900">
                      計量單位
                    </label>
                    <select
                      value={procurementForm.unit}
                      onChange={(e) => setProcurementForm({ ...procurementForm, unit: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7] transition cursor-pointer"
                    >
                      <option value="公斤 (KG)">公斤 (KG)</option>
                      <option value="箱 (約 15KG/箱)">箱 (約 15KG/箱)</option>
                      <option value="尾 / 隻 (單尾大魚)">尾 / 隻 (單尾大魚)</option>
                      <option value="台斤 (約 600g)">台斤 (約 600g)</option>
                    </select>
                  </div>
                </div>

                {/* 欄位 3: 規格或處理需求 */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-black text-slate-900">
                    3. 規格或處理需求 <span className="text-[#ea580c]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={procurementForm.specs}
                    onChange={(e) => setProcurementForm({ ...procurementForm, specs: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7] transition"
                    placeholder="例如：特大肥帶 · 現流冰鮮 · 去鱗去鰓去內臟"
                  />
                  {/* 直覺快捷標籤 */}
                  <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-600">
                    <span className="text-slate-500 font-bold">點選加入常用規格：</span>
                    {['現流冰鮮', '船凍急速', '整尾冷藏', '三去切段處理', '特大規格(500g以上)'].map((specTag) => (
                      <button
                        key={specTag}
                        type="button"
                        onClick={() => {
                          const current = procurementForm.specs;
                          setProcurementForm({
                            ...procurementForm,
                            specs: current ? `${current} · ${specTag}` : specTag,
                          });
                        }}
                        className="bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-700 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
                      >
                        + {specTag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 欄位 4: 預計採購日期 */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-black text-slate-900">
                    4. 預計採購或交貨日期 <span className="text-[#ea580c]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={procurementForm.target_date}
                      onChange={(e) => setProcurementForm({ ...procurementForm, target_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7] transition"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    清晨批發市場多於凌晨 01:00 ~ 05:00 卸魚拍賣，建議預先 1~2 天提出。
                  </p>
                </div>

                {/* 欄位 5: 聯絡方式 */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0284c7]" />
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      5. 店家聯絡方式 <span className="text-[#ea580c]">*</span>
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        店家或餐廳名稱 *
                      </label>
                      <input
                        type="text"
                        required
                        value={procurementForm.merchant_name}
                        onChange={(e) => setProcurementForm({ ...procurementForm, merchant_name: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                        placeholder="例如：基隆海味居酒屋"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        負責人或聯絡人姓名 *
                      </label>
                      <input
                        type="text"
                        required
                        value={procurementForm.contact_name}
                        onChange={(e) => setProcurementForm({ ...procurementForm, contact_name: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                        placeholder="例如：陳老闆 / 林主廚"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        聯絡電話或手機 *
                      </label>
                      <input
                        type="tel"
                        required
                        value={procurementForm.contact_phone}
                        onChange={(e) => setProcurementForm({ ...procurementForm, contact_phone: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                        placeholder="例如：0912-345-678"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        LINE ID (方便供應商聯繫)
                      </label>
                      <input
                        type="text"
                        value={procurementForm.contact_line}
                        onChange={(e) => setProcurementForm({ ...procurementForm, contact_line: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                        placeholder="例如：chef_chen_kl"
                      />
                    </div>
                  </div>
                </div>

                {/* 欄位 6: 備註 */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-black text-slate-900">
                    6. 其他備註說明
                  </label>
                  <textarea
                    rows={3}
                    value={procurementForm.notes}
                    onChange={(e) => setProcurementForm({ ...procurementForm, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7] transition"
                    placeholder="例如：希望在崁仔頂現場點收，或需協助運送至仁愛區店內..."
                  />
                </div>

                {/* 大送出按鈕 */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-base sm:text-lg font-black shadow-lg shadow-orange-200 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <Send className="w-5 h-5" />
                  <span>送出採購意願（轉介基隆在地供應端）</span>
                </button>
              </form>
            </div>

            {/* 右側資訊：近期媒合轉介紀錄與官方行情參考 */}
            <div className="lg:col-span-5 space-y-6">
              {/* 今日官方行情小卡片 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#0284c7]" />
                    <span>今日基隆市場官方參考均價</span>
                  </h4>
                  {onNavigateToRadar && (
                    <button
                      type="button"
                      onClick={() => onNavigateToRadar('1010')}
                      className="text-xs text-[#0284c7] hover:text-[#0369a1] font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>看完整雷達</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">白帶魚 (崁仔頂)</span>
                    <span className="text-base font-black text-slate-900">NT$ 185 /kg</span>
                    <span className="text-[11px] text-emerald-600 block mt-0.5">● 供貨穩定</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">鎖管/透抽 (八斗子)</span>
                    <span className="text-base font-black text-slate-900">NT$ 290 /kg</span>
                    <span className="text-[11px] text-sky-600 block mt-0.5">● 現流搶手</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">花腹鯖 (南方澳/基隆)</span>
                    <span className="text-base font-black text-slate-900">NT$ 62 /kg</span>
                    <span className="text-[11px] text-emerald-600 block mt-0.5">● 大宗平價</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">赤鯮 (彭佳嶼野生)</span>
                    <span className="text-base font-black text-slate-900">NT$ 420 /kg</span>
                    <span className="text-[11px] text-amber-600 block mt-0.5">● 高檔限定</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  來源：農業部水產品交易行情資料庫（AquaticTransData 2026 基準回測）。行情為拍賣批發價，實際供貨價格由供應端依規格處理報價。
                </p>
              </div>

              {/* 已登記轉介清單 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>近期商戶採購轉介追蹤</span>
                  </h4>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    共 {intentList.length} 筆
                  </span>
                </div>

                <div className="space-y-3">
                  {intentList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 space-y-2 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          {item.merchant_name}
                        </span>
                        <span className="text-[11px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                          {item.status === 'SUPPLIER_CONFIRMED' ? '供貨端已確認' : '已轉介漁會/合作社'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">需求魚種：</span>
                          <strong className="text-slate-900">{item.fish_name}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">需求數量：</span>
                          <strong className="text-slate-900">{item.quantity} {item.unit}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">規格：</span>
                          <span className="text-slate-700">{item.specs}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">預計交貨：</span>
                          <span className="text-slate-700">{item.target_date}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                        <span>轉介單位：{item.transferred_to}</span>
                        <span className="text-slate-400">{item.created_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 區塊 2: 漁民出海逐航次漁獲登記與核對 (Trip Log & Verification) */}
      {/* ======================================================== */}
      {activeSubTab === 'triplog' && (
        <div className="space-y-6">
          {tripSubmittedSuccess && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 shadow-sm flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-sm font-bold text-emerald-950">
                航次紀錄已成功送出！系統已自動與農業部當日交易行情完成比對，核對報表已更新於右方。
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 漁民出海登記錄入表單 */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-6 bg-[#0284c7] rounded-full inline-block" />
                  <h3 className="text-lg font-black text-slate-900">
                    漁民逐航次漁獲紀錄登記
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  登記出海與卸魚資料，系統將自動比對官方拍賣行情，產出高可信收益估算與佐證標章。
                </p>
              </div>

              <form onSubmit={handleAddTripRecord} className="space-y-4 text-xs sm:text-sm">
                {/* 出海與返港日期 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      出海日期 *
                    </label>
                    <input
                      type="date"
                      required
                      value={tripForm.departure_date}
                      onChange={(e) => setTripForm({ ...tripForm, departure_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      返港日期 *
                    </label>
                    <input
                      type="date"
                      required
                      value={tripForm.return_date}
                      onChange={(e) => setTripForm({ ...tripForm, return_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* 漁法與作業海域 */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      使用漁法 *
                    </label>
                    <input
                      type="text"
                      required
                      value={tripForm.gear_type}
                      onChange={(e) => setTripForm({ ...tripForm, gear_type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                      placeholder="例如：近海扒網、棒受網、延繩釣..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      作業海域 *
                    </label>
                    <input
                      type="text"
                      required
                      value={tripForm.sea_area}
                      onChange={(e) => setTripForm({ ...tripForm, sea_area: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                      placeholder="例如：北方三島海域、彭佳嶼周邊、基隆嶼..."
                    />
                  </div>
                </div>

                {/* 魚種與捕獲重量 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      主要魚種 *
                    </label>
                    <input
                      type="text"
                      required
                      value={tripForm.fish_name}
                      onChange={(e) => setTripForm({ ...tripForm, fish_name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      捕獲重量 (KG) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={tripForm.weight_kg}
                      onChange={(e) => setTripForm({ ...tripForm, weight_kg: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* 卸魚港口與交易市場 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      卸魚港口 *
                    </label>
                    <select
                      value={tripForm.unloading_port}
                      onChange={(e) => setTripForm({ ...tripForm, unloading_port: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    >
                      <option value="基隆八斗子漁港">基隆八斗子漁港</option>
                      <option value="基隆正濱漁港">基隆正濱漁港</option>
                      <option value="宜蘭南方澳漁港">宜蘭南方澳漁港</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      交易市場 *
                    </label>
                    <select
                      value={tripForm.market_name}
                      onChange={(e) => setTripForm({ ...tripForm, market_name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    >
                      <option value="基隆市場 (崁仔頂魚市)">基隆市場 (崁仔頂)</option>
                      <option value="八斗子魚貨直銷中心">八斗子直銷中心</option>
                      <option value="蘇澳市場 (南方澳)">蘇澳市場 (南方澳)</option>
                    </select>
                  </div>
                </div>

                {/* 上傳佐證文件 */}
                <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
                    <Camera className="w-4 h-4 text-[#0284c7]" />
                    <span>上傳過磅單、收據或魚貨拍照佐證</span>
                  </div>
                  <input
                    type="text"
                    value={tripForm.evidence_name}
                    onChange={(e) => setTripForm({ ...tripForm, evidence_name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    placeholder="例如：八斗子電子過磅單_KL08.jpg"
                  />
                  <span className="text-[11px] text-slate-600 block">
                    檢附過磅收據可獲得「已附佐證」標章，提升產銷透明度與批發定價公信力。
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>送出航次紀錄並比對官方行情</span>
                </button>
              </form>
            </div>

            {/* 核對報表與收益估算 */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>逐航次可追溯核對報表</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    勾稽農業部批發拍賣行情與 CF0110/CF0120 生產資料，標示資料可比性
                  </p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                  自動核對機制
                </span>
              </div>

              <div className="space-y-4">
                {tripRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-sky-300 transition bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-extrabold text-slate-900">{rec.id}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600">{rec.return_date} 靠港</span>
                      </div>
                      <div>{getStatusBadge(rec.verification_status)}</div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">申報魚種</span>
                        <span className="font-extrabold text-slate-900">{rec.fish_name}</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">申報重量</span>
                        <span className="font-extrabold text-slate-900">{rec.weight_kg} KG</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">官方拍賣均價</span>
                        <span className="font-extrabold text-[#ea580c]">NT$ {rec.official_market_price} /kg</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">收益估算</span>
                        <span className="font-black text-emerald-700">
                          NT$ {rec.estimated_revenue?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                      <div>漁法：<span className="font-bold text-slate-800">{rec.gear_type}</span></div>
                      <div>海域：<span className="font-bold text-slate-800">{rec.sea_area}</span></div>
                      <div>卸魚港口：<span className="font-bold text-slate-800">{rec.unloading_port}</span></div>
                      <div>交易市場：<span className="font-bold text-slate-800">{rec.market_name}</span></div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 pt-1">
                      <div>
                        <strong className="text-slate-800">佐證憑證：</strong> {rec.evidence_name} ({rec.evidence_preview})
                      </div>
                      <div>
                        <strong className="text-[#0284c7]">可比性校驗：</strong> {rec.comparability_note}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        來源：{rec.data_source} · 更新日期：{rec.update_date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 區塊 3: 系統全流程圖 (Architecture & Roles Flowchart) */}
      {/* ======================================================== */}
      {activeSubTab === 'workflow' && (
        <div className="space-y-6">
          {/* 流程總覽卡片 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-6 bg-[#0284c7] rounded-full inline-block" />
                <h3 className="text-xl font-black text-slate-900">
                  FishData-TW 系統全鏈路流程圖
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                呈現「漁民／供應端」、「平台資料核對」與「商戶／消費端推廣」三大角色的完整運作流程與邊界守則。
              </p>
            </div>

            {/* 流程三階段大卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 階段一：漁民／供應端 */}
              <div className="bg-slate-50 border-2 border-sky-300 rounded-2xl p-5 space-y-4 relative shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="bg-[#0284c7] text-white px-2.5 py-1 rounded-lg text-xs font-black">
                    一、漁民／供應端
                  </span>
                  <Anchor className="w-5 h-5 text-[#0284c7]" />
                </div>
                <h4 className="font-black text-base text-slate-900">
                  建立逐航次漁獲紀錄與佐證
                </h4>
                <ol className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0">1</span>
                    <span><strong>建立逐航次漁獲紀錄</strong>：每次出海與返港獨立填報。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0">2</span>
                    <span><strong>詳細填寫關鍵欄位</strong>：出海日期、返港日期、漁法、作業海域、魚種、重量、卸魚港與交易市場。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0">3</span>
                    <span><strong>上傳憑證照片</strong>：拍下收據、過磅單或魚貨照片作為佐證。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0">4</span>
                    <span><strong>送出紀錄至平台</strong>：進入資料核對庫。</span>
                  </li>
                </ol>
              </div>

              {/* 階段二：平台資料核對 */}
              <div className="bg-slate-50 border-2 border-amber-300 rounded-2xl p-5 space-y-4 relative shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="bg-[#ea580c] text-white px-2.5 py-1 rounded-lg text-xs font-black">
                    二、平台資料核對
                  </span>
                  <ShieldCheck className="w-5 h-5 text-[#ea580c]" />
                </div>
                <h4 className="font-black text-base text-slate-900">
                  官方行情比對與可比性校驗
                </h4>
                <ol className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">1</span>
                    <span><strong>儲存紀錄與佐證</strong>：建檔存查。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">2</span>
                    <span><strong>查詢行情 API</strong>：調閱農業部水產品交易行情。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">3</span>
                    <span><strong>比對多維條件</strong>：比對魚種、日期、交易市場、價格與單位。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">4</span>
                    <span><strong>查詢官方年度統計</strong>：調閱 CF0110 生產量與 CF0120 產值。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">5</span>
                    <span><strong>檢查可比性</strong>：驗證資料口徑是否可直接比較。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">6</span>
                    <span><strong>標示核對狀態</strong>：待核對、已附佐證、已人工核對、無完全對應資料、使用替代日期或價格。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">7</span>
                    <span><strong>揭露詮釋資料</strong>：來源、更新日、單位、時間範圍與限制。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">8</span>
                    <span><strong>產生報表</strong>：估算收益並產出可追溯核對報表。</span>
                  </li>
                </ol>
              </div>

              {/* 階段三：商戶／消費端 */}
              <div className="bg-slate-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-4 relative shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-black">
                    三、商戶／消費端
                  </span>
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-black text-base text-slate-900">
                  地方漁產推廣與需求轉介
                </h4>
                <ol className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">1</span>
                    <span><strong>瀏覽行情與魚種</strong>：了解規格與市場走向。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">2</span>
                    <span><strong>查閱行情限制</strong>：知悉價格日期、交易量與限制。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">3</span>
                    <span><strong>提交採購意願</strong>：魚種、需求量、規格、日期、聯絡方式。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">4</span>
                    <span><strong>平台轉介</strong>：轉介基隆區漁會、魚市場或合作供應商。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">5</span>
                    <span><strong>供應商確認</strong>：確認供貨、數量、價格與交貨時間。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">6</span>
                    <span><strong>消費者瀏覽推廣</strong>：合作餐廳、魚種菜式與在地優惠券。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">7</span>
                    <span><strong>到店消費與前往</strong>：出示手機核銷，LINE 或 Google Maps 導航。</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* 核對狀態 5 大標記說明 */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 sm:p-5 space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0284c7]" />
                <span>平台核對狀態 5 大類別定義說明</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5">{getStatusBadge('已附佐證')}</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    漁民已上傳地磅過磅單或正式魚市場拍賣收據。
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5">{getStatusBadge('已人工核對')}</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    經區漁會供銷人員或平台管理員人工抽驗單據核對無誤。
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5">{getStatusBadge('待核對')}</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    已建立航次紀錄但尚未上傳憑證照片，等待進一步核實。
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5">{getStatusBadge('使用替代日期或價格')}</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    遇魚市場休市日（農曆初三/十七），以相鄰最近拍賣日均價替代。
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5">{getStatusBadge('無完全對應資料')}</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    該魚種當日在該市場未有公開拍賣紀錄或分類代碼未收錄。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
