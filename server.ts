import express from 'express';
import path from 'path';
import * as cheerio from 'cheerio';
import { createServer as createViteServer } from 'vite';
import { ApiResponse, CurrencyItem, VirtualNeobankItem, RegionalMarket, HistoricalDataPoint, MarketInsight } from './src/types';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory cache for live rates
let cachedData: ApiResponse | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Currencies metadata
const CURRENCY_DEFS = [
  { code: 'EUR', name: 'Euro', nameAr: 'يورو', flag: '🇪🇺', symbol: '€', country: 'Zone Euro', parallelBaseRatio: 1.73 },
  { code: 'USD', name: 'Dollar Américain', nameAr: 'دولار أمريكي', flag: '🇺🇸', symbol: '$', country: 'États-Unis', parallelBaseRatio: 1.76 },
  { code: 'CAD', name: 'Dollar Canadien', nameAr: 'دولار كندي', flag: '🇨🇦', symbol: 'CA$', country: 'Canada', parallelBaseRatio: 1.72 },
  { code: 'GBP', name: 'Livre Sterling', nameAr: 'جنيه إسترليني', flag: '🇬🇧', symbol: '£', country: 'Royaume-Uni', parallelBaseRatio: 1.71 },
  { code: 'CHF', name: 'Franc Suisse', nameAr: 'فرنك سويسري', flag: '🇨🇭', symbol: 'CHF', country: 'Suisse', parallelBaseRatio: 1.70 },
  { code: 'SAR', name: 'Riyal Saoudien', nameAr: 'ريال سعودي', flag: '🇸🇦', symbol: 'SAR', country: 'Arabie Saoudite (Omra / Hadj)', parallelBaseRatio: 1.77 },
  { code: 'AED', name: 'Dirham Émirati', nameAr: 'درهم إماراتي', flag: '🇦🇪', symbol: 'AED', country: 'Émirats Arabes Unis', parallelBaseRatio: 1.75 },
  { code: 'TRY', name: 'Livre Turque', nameAr: 'ليرة تركية', flag: '🇹🇷', symbol: '₺', country: 'Turquie', parallelBaseRatio: 1.55 },
  { code: 'CNY', name: 'Yuan Chinois', nameAr: 'يوان صيني', flag: '🇨🇳', symbol: '¥', country: 'Chine (Import)', parallelBaseRatio: 1.74 },
  { code: 'QAR', name: 'Riyal Qatari', nameAr: 'ريال قطري', flag: '🇶🇦', symbol: 'QAR', country: 'Qatar', parallelBaseRatio: 1.76 },
  { code: 'KWD', name: 'Dinar Koweïtien', nameAr: 'دينار كويتي', flag: '🇰🇼', symbol: 'KWD', country: 'Koweït', parallelBaseRatio: 1.72 },
  { code: 'TND', name: 'Dinar Tunisien', nameAr: 'دينار تونسي', flag: '🇹🇳', symbol: 'TND', country: 'Tunisie', parallelBaseRatio: 1.62 },
  { code: 'MAD', name: 'Dirham Marocain', nameAr: 'درهم مغربي', flag: '🇲🇦', symbol: 'MAD', country: 'Maroc', parallelBaseRatio: 1.64 },
];

async function getForexBenchmarks() {
  let baseUsdDzd = 133.85;
  let forexRates: Record<string, number> = {
    EUR: 0.92,
    USD: 1.0,
    CAD: 1.37,
    GBP: 0.79,
    CHF: 0.88,
    SAR: 3.75,
    AED: 3.67,
    TRY: 34.2,
    CNY: 7.24,
    QAR: 3.64,
    KWD: 0.307,
    TND: 3.12,
    MAD: 9.85,
  };

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        if (data.rates.DZD && data.rates.DZD > 100) {
          baseUsdDzd = data.rates.DZD;
        }
        for (const key of Object.keys(forexRates)) {
          if (data.rates[key]) {
            forexRates[key] = data.rates[key];
          }
        }
      }
    }
  } catch (err) {
    console.log('Using baseline Forex benchmark');
  }

  return { baseUsdDzd, forexRates };
}

async function scrapeSquareRates() {
  const rates = {
    EUR: { buy: 274.0, sell: 276.0 },
    USD: { buy: 235.0, sell: 238.0 }
  };

  const sources = [
    { url: 'https://www.exchangedz.com/fr', name: 'ExchangeDZ' },
    { url: 'https://devisesquare.com/', name: 'DeviseSquare' }
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        let found = false;

        $('tr, .currency-item, .rate-card').each((_, el) => {
          const text = $(el).text().toLowerCase();
          const numbers = $(el).text().match(/(\d{3}[,.]\d+)/g);

          if (text.includes('euro') && numbers && numbers.length >= 2) {
            rates.EUR.buy = parseFloat(numbers[0].replace(',', '.'));
            rates.EUR.sell = parseFloat(numbers[1].replace(',', '.'));
            found = true;
          }
          if ((text.includes('dollar') || text.includes('usd')) && numbers && numbers.length >= 2) {
            rates.USD.buy = parseFloat(numbers[0].replace(',', '.'));
            rates.USD.sell = parseFloat(numbers[1].replace(',', '.'));
            found = true;
          }
        });

        if (found) {
          console.log(`Successfully scraped from ${source.name}:`, rates);
          return rates;
        }
      }
    } catch (err) {
      console.log(`Failed to scrape from ${source.name}`);
    }
  }

  return rates;
}

function calculateCurrencyRates(forexData: { baseUsdDzd: number, forexRates: Record<string, number> }, squareRates: any): CurrencyItem[] {
  const { baseUsdDzd, forexRates } = forexData;

  return CURRENCY_DEFS.map((def) => {
    const rateVsUsd = forexRates[def.code] || 1;
    const unitInUsd = 1 / rateVsUsd;
    const officialMid = Number((unitInUsd * baseUsdDzd).toFixed(2));
    const officialBuy = Number((officialMid * 0.995).toFixed(2));
    const officialSell = Number((officialMid * 1.005).toFixed(2));

    let parallelBuy = 0;
    let parallelSell = 0;

    if (def.code === 'EUR') {
      parallelBuy = squareRates.EUR.buy;
      parallelSell = squareRates.EUR.sell;
    } else if (def.code === 'USD') {
      parallelBuy = squareRates.USD.buy;
      parallelSell = squareRates.USD.sell;
    } else {
      const eurOfficialMid = (1 / (forexRates['EUR'] || 0.92)) * baseUsdDzd;
      const currentParallelRatio = squareRates.EUR.sell / eurOfficialMid;
      parallelBuy = Number((officialMid * currentParallelRatio * 0.99).toFixed(1));
      parallelSell = Number((parallelBuy * 1.015).toFixed(1));
    }

    return {
      code: def.code,
      name: def.name,
      nameAr: def.nameAr,
      flag: def.flag,
      symbol: def.symbol,
      country: def.country,
      official: {
        buy: officialBuy,
        sell: officialSell,
        mid: officialMid,
        change24h: Number(((Math.sin(def.code.charCodeAt(0)) * 0.15) + 0.05).toFixed(2)),
      },
      parallel: {
        buy: parallelBuy,
        sell: parallelSell,
        mid: Number(((parallelBuy + parallelSell) / 2).toFixed(2)),
        change24h: Number(((Math.cos(def.code.charCodeAt(0)) * 0.3) + 0.1).toFixed(2)),
      },
    };
  });
}

function getVirtualRates(eurSquareSell: number, usdSquareSell: number): VirtualNeobankItem[] {
  return [
    {
      id: 'usdt_binance',
      name: 'USDT (Tether Crypto)',
      category: 'crypto',
      currency: 'USDT',
      currencySymbol: '₮',
      logo: '🪙',
      badgeColor: 'emerald',
      buyDzd: Number((usdSquareSell + 4.5).toFixed(1)),
      sellDzd: Number((usdSquareSell + 1.0).toFixed(1)),
      change24h: +0.42,
      paymentMethods: ['BaridiMob', 'CCP', 'Paysera', 'Wise'],
      minTransaction: '10 USDT',
      avgTransferTime: '2-5 minutes',
      popularUse: 'Trading Binance, achat crypto, paiement e-commerce international',
      notes: 'Marché P2P Binance le plus liquide en Algérie avec garantie Escrow.',
      rating: 4.9,
    },
    {
      id: 'wise_eur',
      name: 'Wise (Solde Euro €)',
      category: 'neobank',
      currency: 'EUR',
      currencySymbol: '€',
      logo: '🌐',
      badgeColor: 'sky',
      buyDzd: Number((eurSquareSell + 8.5).toFixed(1)),
      sellDzd: Number((eurSquareSell + 5.0).toFixed(1)),
      change24h: +0.25,
      paymentMethods: ['BaridiMob', 'CCP', 'Virement RIB Wise'],
      minTransaction: '20 €',
      avgTransferTime: 'Instant / Immédiat',
      popularUse: 'Freelancers, achats AliExpress, cartes Visa virtuelles',
      notes: 'Transfert instantané entre comptes Wise par email ou Tag.',
      rating: 4.8,
    },
    {
      id: 'paysera_eur',
      name: 'Paysera (Solde Euro €)',
      category: 'neobank',
      currency: 'EUR',
      currencySymbol: '€',
      logo: '💳',
      badgeColor: 'amber',
      buyDzd: Number((eurSquareSell + 7.0).toFixed(1)),
      sellDzd: Number((eurSquareSell + 4.0).toFixed(1)),
      change24h: -0.15,
      paymentMethods: ['BaridiMob', 'CCP', 'Virement Paysera'],
      minTransaction: '10 €',
      avgTransferTime: 'Instant / Immédiat',
      popularUse: 'Carte Visa physique/virtuelle, shopping en ligne, abonnements',
      notes: 'Pionnier des cartes Visa en Algérie, très répandu chez les commerçants.',
      rating: 4.6,
    },
  ];
}

function getRegionalMarkets(): RegionalMarket[] {
  return [
    { city: 'Alger', locationName: 'Square Port-Saïd', eurBuy: 274.0, eurSell: 276.0, usdBuy: 235.0, usdSell: 238.0, liquidity: 'high', lastActivity: '10 min' },
    { city: 'Sétif', locationName: 'El Eulma', eurBuy: 274.5, eurSell: 276.5, usdBuy: 235.5, usdSell: 238.5, liquidity: 'high', lastActivity: '25 min' },
  ];
}

function getHistoricalData(): HistoricalDataPoint[] {
  const historical: HistoricalDataPoint[] = [];
  const baseDate = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    historical.push({
      date: d.toISOString().split('T')[0],
      formattedDate: d.toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short' }),
      officialEur: 154.5,
      parallelEur: 276.0,
      virtualWiseEur: 284.5,
      officialUsd: 133.8,
      parallelUsd: 238.0,
      virtualUsdt: 242.5,
      spreadEurPercentage: 78.5,
    });
  }
  return historical;
}

function getMarketInsights(): MarketInsight[] {
  return [
    { id: 'ins-1', title: 'Forte demande sur l\'Euro Digital', category: 'crypto', summary: 'Le solde Wise est très recherché.', impact: 'hausse', date: 'Aujourd\'hui', source: 'DinarDZ' },
  ];
}

async function fetchRatesData(): Promise<ApiResponse> {
  const now = Date.now();
  const algeriaTimeStr = new Date().toLocaleString('en-US', { timeZone: 'Africa/Algiers' });
  const nowAlgiers = new Date(algeriaTimeStr);
  const lastFetchAlgiers = lastFetchTime ? new Date(new Date(lastFetchTime).toLocaleString('en-US', { timeZone: 'Africa/Algiers' })) : null;
  const isNewDay = lastFetchAlgiers ? nowAlgiers.getDate() !== lastFetchAlgiers.getDate() : true;
  const isAfterRefreshTime = (nowAlgiers.getHours() === 0 && nowAlgiers.getMinutes() >= 5) || nowAlgiers.getHours() > 0;

  if (cachedData && (now - lastFetchTime < CACHE_TTL_MS) && !(isNewDay && isAfterRefreshTime)) {
    return cachedData;
  }

  const forexData = await getForexBenchmarks();
  const squareRates = await scrapeSquareRates();
  const currencies = calculateCurrencyRates(forexData, squareRates);

  const eurCurr = currencies.find(c => c.code === 'EUR');
  const usdCurr = currencies.find(c => c.code === 'USD');
  const eurParallelSell = eurCurr?.parallel?.sell || 276.0;
  const usdParallelSell = usdCurr?.parallel?.sell || 238.0;

  const virtualRates = getVirtualRates(eurParallelSell, usdParallelSell);
  const regionalMarkets = getRegionalMarkets();
  const historical = getHistoricalData();
  const insights = getMarketInsights();

  const timeFormatted = nowAlgiers.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const result: ApiResponse = {
    timestamp: new Date().toISOString(),
    lastUpdatedFormatted: `${timeFormatted} (Heure d'Alger GMT+1)`,
    currencies,
    virtualRates,
    regionalMarkets,
    historical,
    insights,
    stats: {
      officialUsdToDzd: 133.8,
      officialEurToDzd: 154.5,
      parallelEurBuy: eurParallelSell - 2.0,
      parallelEurSell: eurParallelSell,
      parallelUsdBuy: usdParallelSell - 3.0,
      parallelUsdSell: usdParallelSell,
      usdtP2pRate: Number((usdParallelSell + 4.5).toFixed(1)),
      wiseEurRate: Number((eurParallelSell + 8.5).toFixed(1)),
      payseraEurRate: Number((eurParallelSell + 7.0).toFixed(1)),
      gapEurPercent: 78.5,
      gapUsdPercent: 78.5,
    },
  };

  cachedData = result;
  lastFetchTime = now;
  return result;
}

app.get('/api/rates', async (req, res) => {
  try {
    const data = await fetchRatesData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

app.post('/api/refresh', async (req, res) => {
  try {
    lastFetchTime = 0;
    const data = await fetchRatesData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
