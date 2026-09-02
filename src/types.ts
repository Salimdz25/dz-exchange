export interface RateDetails {
  buy: number;
  sell: number;
  mid?: number;
  change24h: number; // percentage ex: +0.45 or -0.2
  previousClose?: number;
}

export interface CurrencyItem {
  code: string;
  name: string;
  nameAr: string;
  flag: string;
  symbol: string;
  country: string;
  official: RateDetails;
  parallel?: RateDetails; // Square Port-Said
  unit?: number; // 1 or 100
}

export interface VirtualNeobankItem {
  id: string;
  name: string;
  category: 'crypto' | 'neobank' | 'virtual_card' | 'wallet';
  currency: string;
  currencySymbol: string;
  logo: string;
  badgeColor: string;
  buyDzd: number; // Prix achat en DZD
  sellDzd: number; // Prix vente en DZD
  change24h: number;
  paymentMethods: string[];
  minTransaction: string;
  avgTransferTime: string;
  popularUse: string;
  notes: string;
  rating: number;
  labelType?: 'observed' | 'estimated' | 'p2p';
}

export interface GoldRateItem {
  carat: number; // 24, 22, 21, 18
  name: string;
  nameAr: string;
  pricePerGramDzd: number;
  buyPerGramDzd?: number;
  change24h: number;
  basis: 'observed' | 'official_est' | 'parallel_est';
}

export interface RegionalMarket {
  city: string;
  locationName: string;
  eurBuy: number;
  eurSell: number;
  usdBuy: number;
  usdSell: number;
  liquidity: 'high' | 'medium' | 'low';
  lastActivity: string;
}

export interface HistoricalDataPoint {
  date: string;
  formattedDate: string;
  officialEur: number;
  parallelEur: number;
  virtualWiseEur: number;
  officialUsd: number;
  parallelUsd: number;
  virtualUsdt: number;
  spreadEurPercentage: number;
}

export interface MarketInsight {
  id: string;
  title: string;
  category: 'analyse' | 'tendance' | 'reglementation' | 'crypto';
  summary: string;
  impact: 'hausse' | 'baisse' | 'neutre';
  date: string;
  source: string;
}

export interface ApiResponse {
  timestamp: string;
  lastUpdatedFormatted: string;
  sourceName?: string;
  isVerified?: boolean;
  currencies: CurrencyItem[];
  virtualRates: VirtualNeobankItem[];
  goldRates: GoldRateItem[];
  regionalMarkets: RegionalMarket[];
  historical: HistoricalDataPoint[];
  insights: MarketInsight[];
  stats: {
    officialUsdToDzd: number;
    officialEurToDzd: number;
    parallelEurBuy: number;
    parallelEurSell: number;
    parallelUsdBuy: number;
    parallelUsdSell: number;
    usdtP2pRate: number;
    wiseEurRate: number;
    payseraEurRate: number;
    gapEurPercent: number;
    gapUsdPercent: number;
  };
}

export interface RateAlert {
  id: string;
  currencyCode: string;
  marketType: 'parallel' | 'virtual' | 'official';
  condition: 'above_or_equal' | 'below_or_equal';
  targetRate: number;
  currentRateAtCreation: number;
  note?: string;
  createdAt: number;
  triggered: boolean;
}
