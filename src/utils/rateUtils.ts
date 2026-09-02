import { ApiResponse } from '../types';

/**
 * Get current rate for a specific currency and market type for alert evaluation
 */
export const getRateForAlert = (
  data: ApiResponse,
  currencyCode: string,
  marketType: 'parallel' | 'virtual' | 'official'
): number => {
  if (currencyCode === 'USDT') {
    return data.stats.usdtP2pRate || 0;
  }

  if (currencyCode === 'WISE_EUR') {
    return data.stats.wiseEurRate || 0;
  }

  const curr = data.currencies.find((c) => c.code === currencyCode);
  if (!curr) return 0;

  if (marketType === 'parallel') {
    return curr.parallel?.sell || 0;
  } else if (marketType === 'official') {
    return curr.official.mid || 0;
  } else {
    // Virtual fallback for standard currencies
    if (currencyCode === 'USD') return data.stats.usdtP2pRate || 0;
    if (currencyCode === 'EUR') return data.stats.wiseEurRate || 0;
    return curr.parallel?.sell || 0;
  }
};
