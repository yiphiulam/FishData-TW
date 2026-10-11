import React, { useState } from 'react';
import { PartnerStore } from '../types/fishery';
import { 
  Store, 
  MapPin, 
  Tag, 
  ExternalLink, 
  MessageCircle, 
  CheckCircle2, 
  Ticket, 
  Clock, 
  Navigation, 
  QrCode, 
  Filter, 
  X,
  Phone,
  Sparkles,
  UtensilsCrossed,
  Info
} from 'lucide-react';

export const MerchantPromoView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeCouponStore, setActiveCouponStore] = useState<PartnerStore | null>(null);
  const [redeemedStores, setRedeemedStores] = useState<Record<string, boolean>>({});

  const partnerStores: PartnerStore[] = [
    {
      id: 'STORE-01',
      name: '崁仔頂漁火海味食堂',
      address: '基隆市仁愛區孝一路58號 (崁仔頂魚市核心商圈)',
      phone: '02-2428-1122',
      line_id: '@keelung_fish_kitchen',
      line_url: 'https://line.me/R/ti/p/@keelung_fish_kitchen',
      google_maps_url: 'https://www.google.com/maps/search/?api=1&query=基隆市仁愛區孝一路58號',
      featured_species: ['白帶魚', '鎖管 (透抽)', '花腹鯖'],
      recommended_dishes: [
        '崁仔頂現流白帶魚芋頭米粉鍋',
        '深夜現切透抽刺身拼盤',
        '北方三島火烤鯖魚定食',
      ],
      coupon_title: '出示手機畫面現折 NT$ 50 元',
      coupon_detail: '結帳出示本手機畫面，全單現折 50 元，每桌加碼贈送「基隆本港石花凍」2 份。',
      coupon_code: 'KL-FISH-50OFF',
      valid_until: '2026-12-31',
      tags: ['白帶魚', '透抽', '崁仔頂宵夜', '鮮魚米粉'],
    },
    {
      id: 'STORE-02',
      name: '八斗子潮境海景漁夫鍋',
      address: '基隆市中正區北寧路369巷43號 (八斗子漁港觀景平台旁)',
      phone: '02-2469-8899',
      line_id: '@badouzi_hotpot',
      line_url: 'https://line.me/R/ti/p/@badouzi_hotpot',
      google_maps_url: 'https://www.google.com/maps/search/?api=1&query=基隆市中正區北寧路369巷43號',
      featured_species: ['鎖管 (透抽)', '藍圓鰺 (巴隆)', '赤鯮'],
      recommended_dishes: [
        '八斗子現流活凍鎖管海味鍋',
        '彭佳嶼野生赤鯮一魚兩吃 (生魚片+清蒸)',
        '香煎巴隆 (藍圓鰺) 佐海鹽',
      ],
      coupon_title: '內用享「現流小管拼盤」份量免費升級',
      coupon_detail: '到店點購任一套餐，出示手機畫面即免費將鎖管拼盤升級為特大雙倍份量！',
      coupon_code: 'BADOUZI-DOUBLE-SQUID',
      valid_until: '2026-12-31',
      tags: ['透抽', '赤鯮', '八斗子海景', '海鮮火鍋'],
    },
    {
      id: 'STORE-03',
      name: '正濱漁港彩色屋漁人居酒屋',
      address: '基隆市中正區正濱路72號 (正濱漁港彩色屋水岸步道)',
      phone: '02-2462-7766',
      line_id: '@zhengbin_izakaya',
      line_url: 'https://line.me/R/ti/p/@zhengbin_izakaya',
      google_maps_url: 'https://www.google.com/maps/search/?api=1&query=基隆市中正區正濱路72號',
      featured_species: ['鬼頭刀', '黑鯛 (黑格)', '花腹鯖'],
      recommended_dishes: [
        '炙燒黑潮鬼頭刀握壽司',
        '正濱港町鯖魚一夜干炭火燒',
        '野生黑格 (黑鯛) 味噌雜炊',
      ],
      coupon_title: '點主餐免費招待「基隆港町炸物小品」',
      coupon_detail: '結帳出示畫面，每人點選一份定食即贈當日港口直送特選小菜或無酒精飲品一杯。',
      coupon_code: 'COLORFUL-HARBOR-TREAT',
      valid_until: '2026-12-31',
      tags: ['鬼頭刀', '黑鯛', '花腹鯖', '彩色屋打卡', '居酒屋'],
    },
    {
      id: 'STORE-04',
      name: '和平島潮境磯釣鮮魚小館',
      address: '基隆市中正區平一路46號 (和平島地質公園入口處)',
      phone: '02-2463-5511',
      line_id: '@heping_island_fish',
      line_url: 'https://line.me/R/ti/p/@heping_island_fish',
      google_maps_url: 'https://www.google.com/maps/search/?api=1&query=基隆市中正區平一路46號',
      featured_species: ['黃雞魚', '刺鯧 (肉魚)', '馬加鰆'],
      recommended_dishes: [
        '和平島定置網黃雞魚清蒸薑絲',
        '香酥野生刺鯧 (肉魚) 傳統風味',
        '冬季肥美馬加鰆生魚片與魚首海苔湯',
      ],
      coupon_title: '單筆消費滿 NT$ 800 現折 NT$ 100',
      coupon_detail: '至現場用餐並出示手機畫面，滿 800 元現折 100 元，支持東北角友善漁業！',
      coupon_code: 'HEPING-100DISCOUNT',
      valid_until: '2026-12-31',
      tags: ['黃雞魚', '肉魚', '馬加鰆', '定置網', '和平島美食'],
    },
  ];

  const filteredStores = partnerStores.filter((store) => {
    if (selectedCategory === 'ALL') return true;
    return (
      store.tags.some((t) => t.includes(selectedCategory)) ||
      store.featured_species.some((f) => f.includes(selectedCategory))
    );
  });

  const handleRedeemCoupon = (storeId: string) => {
    setRedeemedStores({ ...redeemedStores, [storeId]: true });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 頂部海港親切橫幅 */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-white border-2 border-sky-300 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-[#ea580c] text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide">
                地產地消 · 在地鮮魚推廣
              </span>
              <span className="text-xs text-sky-900 font-bold">
                基隆區漁會合作特約店家
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              合作店家與吃魚優惠
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              嚴選採用八斗子、崁仔頂與北方三島近海鮮魚的在地友善餐廳。到店出示手機畫面，即可由店家服務人員現場人工核銷享專屬折扣！
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>MVP 到店出示核銷流程</span>
            </span>
          </div>
        </div>

        {/* 魚種菜式分類快速篩選 */}
        <div className="mt-5 pt-4 border-t border-sky-200/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-700 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>魚種菜式快選：</span>
          </span>
          {[
            { id: 'ALL', label: '全部合作店家' },
            { id: '白帶魚', label: '白帶魚料理' },
            { id: '透抽', label: '鎖管/透抽料理' },
            { id: '鯖魚', label: '花腹鯖料理' },
            { id: '赤鯮', label: '赤鯮料理' },
            { id: '鬼頭刀', label: '鬼頭刀料理' },
            { id: '黃雞魚', label: '黃雞魚料理' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0284c7] text-white shadow-sm ring-2 ring-sky-300'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 合作店家列表卡片 (大按鈕、清楚欄位) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStores.map((store) => {
          const isRedeemed = Boolean(redeemedStores[store.id]);

          return (
            <div
              key={store.id}
              className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* 店名與地址 */}
                <div className="border-b border-slate-100 pb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Store className="w-5 h-5 text-[#ea580c] shrink-0" />
                      <span>{store.name}</span>
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
                      <MapPin className="w-4 h-4 text-[#0284c7] shrink-0" />
                      <span>{store.address}</span>
                    </div>
                  </div>
                  <span className="bg-sky-50 text-sky-800 border border-sky-200 text-xs px-2.5 py-1 rounded-lg font-black shrink-0">
                    基隆特約
                  </span>
                </div>

                {/* 使用魚種與推薦菜式 */}
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-black text-slate-500 block mb-1.5">
                      主打使用在地魚種：
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {store.featured_species.map((fish, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-bold"
                        >
                          {fish}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-black text-slate-500 block mb-1.5">
                      推薦招牌料理：
                    </span>
                    <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                      {store.recommended_dishes.map((dish, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                          <span>{dish}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 優惠內容與有效期限卡片 */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-amber-900 flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-[#ea580c]" />
                      <span>{store.coupon_title}</span>
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      期限：{store.valid_until}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {store.coupon_detail}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                    <span>核銷代碼：<strong>{store.coupon_code}</strong></span>
                    {isRedeemed ? (
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        已於現場完成核銷
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold">
                        到店出示手機 · 人工核銷
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 三大操作按鈕 (大按鈕、親切色調) */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 按鈕 1: 出示優惠券 (MVP 核銷) */}
                <button
                  type="button"
                  onClick={() => setActiveCouponStore(store)}
                  className={`py-3 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    isRedeemed
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-[#ea580c] hover:bg-[#c2410c] text-white active:scale-95'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>{isRedeemed ? '已完成核銷' : '出示優惠券'}</span>
                </button>

                {/* 按鈕 2: 聯絡店家 LINE 按鈕 */}
                <a
                  href={store.line_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl font-black text-xs sm:text-sm bg-[#06c755] hover:bg-[#05b34c] text-white flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>聯絡店家 LINE</span>
                </a>

                {/* 按鈕 3: Google Maps 導航按鈕 */}
                <a
                  href={store.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl font-black text-xs sm:text-sm bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>地圖導航前往</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 優惠券彈窗 (MVP 手機出示畫面由店家人工核銷) */}
      {activeCouponStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border-2 border-sky-400 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5 animate-scaleUp">
            {/* 關閉按鈕 */}
            <button
              type="button"
              onClick={() => setActiveCouponStore(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 標題與店家 */}
            <div className="text-center space-y-1 pt-2">
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full inline-block">
                ★ 2026 臺灣海洋黑客松 · 漁產優惠憑證
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {activeCouponStore.name}
              </h3>
              <p className="text-xs text-slate-500">
                {activeCouponStore.address}
              </p>
            </div>

            {/* 優惠券卡片本體 */}
            <div className="bg-gradient-to-br from-amber-500 to-[#ea580c] rounded-2xl p-5 text-white shadow-lg space-y-3 text-center relative overflow-hidden">
              <div className="text-xs uppercase tracking-wider text-amber-100 font-bold">
                SPECIAL LOCAL SEAFOOD VOUCHER
              </div>
              <div className="text-2xl font-black">
                {activeCouponStore.coupon_title}
              </div>
              <p className="text-xs text-amber-50 leading-relaxed">
                {activeCouponStore.coupon_detail}
              </p>

              <div className="pt-2 border-t border-white/20 flex flex-col items-center gap-1.5">
                <span className="text-[11px] text-amber-100">核銷代碼</span>
                <span className="font-mono text-xl tracking-widest bg-black/30 px-4 py-1.5 rounded-lg font-black">
                  {activeCouponStore.coupon_code}
                </span>
                <span className="text-[10px] text-amber-200">
                  有效期限至：{activeCouponStore.valid_until}
                </span>
              </div>
            </div>

            {/* 人工核銷說明 */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-black text-sky-950">
                <Info className="w-4 h-4 text-[#0284c7]" />
                <span>現場人工核銷流程說明</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                到店結帳時，請出示本手機畫面給櫃檯服務人員查看。服務人員確認優惠內容後，請點擊下方大按鈕完成核銷。
              </p>
            </div>

            {/* 核銷確認按鈕 */}
            <div className="space-y-2 pt-1">
              {redeemedStores[activeCouponStore.id] ? (
                <div className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-center text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>已於現場人工核銷完成！祝用餐愉快</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRedeemCoupon(activeCouponStore.id)}
                  className="w-full py-3.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>由店家服務人員點擊：確認核銷</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveCouponStore(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
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
