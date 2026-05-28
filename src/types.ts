export interface StockMetric {
  ticker: string;
  name: string;
  peCurrent: number;
  peFiveYearAvg: number;
  revenueGrowthYoY: number; // e.g. 115.5 for 115.5% growth
  fcfYield: number; // e.g. 4.2 for 4.2%
  capexRecentBillion: number; // in billion USD
  cloudRevenueGrowthYoY?: number; // e.g. 33 for 33% (Azure / AWS / GCP)
  status: 'Subavaliado' | 'Preço Justo' | 'Esticado' | 'Bolha Especulativa';
  reasoning: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface StockScanResult {
  metrics: StockMetric[];
  marketSummary: string;
  sources: GroundingSource[];
  lastUpdated: string;
  isDemo?: boolean;
  apiError?: string;
  isQuotaExceeded?: boolean;
}
