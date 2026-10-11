export interface FishPriceRecord {
  id: string;
  trade_date: string;
  market_id: string;
  market_name: string;
  fish_id: string;
  fish_name: string;
  category: string;
  high_price: number;
  mid_price: number;
  low_price: number;
  avg_price: number;
  trade_volume: number;
  anomaly_score: number;
  anomaly_flag: 'NORMAL' | 'HIGH_SURGE' | 'SHARP_DROP' | 'VOLUME_SPIKE';
}

export interface FishSpecies {
  id: string;
  name: string;
  rawNames: string[];
  category: string;
  seasonality: string;
  esg_status: string;
  fao_code?: string;
  scientific_name?: string;
  gear_type?: string;
  keelung_relevance?: string;
  north_south_names?: string; // 北部/南部簡短俗名對照
}

export interface MarketInfo {
  id: string;
  name: string;
  region: string;
  is_pilot: boolean;
}

export interface AnnualProductionItem {
  county: string;
  year: string;
  fishery_type: string;
  production_mt: number;
  production_val_million: number;
  fisher_households: number;
  fisher_population: number;
  main_species: string[];
  highlights: string;
}

export interface FishermenAssociation {
  id: string;
  name: string;
  county: string;
  address: string;
  members: number;
  boats: number;
  services: string[];
}

export interface DataQualityReport {
  raw_vs_standardized: {
    raw: {
      total_records: number;
      missing_price_rate: string;
      date_parse_failure_rate: string;
      duplicate_records_rate: string;
      name_inconsistency_rate: string;
      api_timeout_rate: string;
    };
    standardized: {
      total_records: number;
      missing_price_rate: string;
      date_parse_failure_rate: string;
      duplicate_records_rate: string;
      name_inconsistency_rate: string;
      api_timeout_rate: string;
    };
  };
  experiments: Array<{
    code: string;
    title: string;
    baseline: string;
    treatment: string;
    eval_metric: string;
    raw_score: string;
    cleaned_score: string;
    conclusion: string;
  }>;
}

export interface VesselDetail {
  'Vessel ID': string;
  '船名 (Ship Name)': string;
  'MMSI': string;
  '國籍 (Flag)': string;
  'IMO'?: string;
  'Gear Type'?: string;
  'Length'?: string;
  'Tonnage'?: string;
}

export interface VesselInsight {
  vessel_id: string;
  fishing_hours: number;
  total_voyages: number;
  main_eez: string;
  avg_speed_knots: number;
  target_species?: string;
}

export interface VesselEvent {
  type: string;
  start: string;
  end: string;
  port?: string;
  description?: string;
}

export interface VesselQueryResponse {
  mmsi: string;
  start_date: string;
  end_date: string;
  vessel_details: VesselDetail[];
  insights: VesselInsight[];
  events: VesselEvent[];
  source?: string;
}

export type VerificationStatus =
  | '待核對'
  | '已附佐證'
  | '已人工核對'
  | '無完全對應資料'
  | '使用替代日期或價格';

export interface ProcurementIntent {
  id: string;
  fish_name: string;
  quantity: number;
  unit: string;
  specs: string;
  target_date: string;
  contact_name: string;
  contact_phone: string;
  contact_line?: string;
  merchant_name: string;
  notes?: string;
  status: 'TRANSFERRED' | 'SUPPLIER_CONFIRMED';
  transferred_to: string;
  created_at: string;
}

export interface FishingTripRecord {
  id: string;
  departure_date: string;
  return_date: string;
  gear_type: string;
  sea_area: string;
  fish_name: string;
  weight_kg: number;
  unloading_port: string;
  market_name: string;
  evidence_name?: string;
  evidence_preview?: string;
  verification_status: VerificationStatus;
  official_market_price?: number;
  estimated_revenue?: number;
  data_source: string;
  update_date: string;
  comparability_note: string;
}

export interface PartnerStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  line_id: string;
  line_url: string;
  google_maps_url: string;
  featured_species: string[];
  recommended_dishes: string[];
  coupon_title: string;
  coupon_detail: string;
  coupon_code: string;
  valid_until: string;
  tags: string[];
}

