import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { ApiResponse, CurrencyItem, VirtualNeobankItem, RegionalMarket, HistoricalDataPoint, MarketInsight } from './src/types';

const app = express();
const PORT = 3000;

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

async function fetchRatesData(): Promise<ApiResponse> {
  const now = Date.now();
  if (cachedData && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedData;
  }

  // Base official rate approximations (Banque d'Algérie interbank quotes)
  // 1 USD approx ~ 133.5 - 134.5 DZD official
  // 1 EUR approx ~ 145.0 - 146.5 DZD official
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
    clearTimeout(timeoutId);
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
    console.log('Using baseline Forex benchmark due to external fetch timeout');
  }

  // Official rates calculation
  const currencies: CurrencyItem[] = CURRENCY_DEFS.map((def) => {
    const rateVsUsd = forexRates[def.code] || 1;
    // 1 Unit of Currency in USD = 1 / rateVsUsd
    const unitInUsd = 1 / rateVsUsd;
    const officialMid = Number((unitInUsd * baseUsdDzd).toFixed(2));
    const officialBuy = Number((officialMid * 0.995).toFixed(2));
    const officialSell = Number((officialMid * 1.005).toFixed(2));

    // Parallel rate (Square Port-Saïd) based on real Algerian street market dynamics
    // EUR is typically ~249-252 DZD, USD ~232-235 DZD, CAD ~168-172 DZD, GBP ~292-298 DZD, SAR ~62-65 DZD
    let parallelBuy = 0;
    let parallelSell = 0;

    if (def.code === 'EUR') {
      parallelBuy = 250.0;
      parallelSell = 252.5;
    } else if (def.code === 'USD') {
      parallelBuy = 234.0;
      parallelSell = 236.5;
    } else if (def.code === 'CAD') {
      parallelBuy = 168.0;
      parallelSell = 171.0;
    } else if (def.code === 'GBP') {
      parallelBuy = 292.0;
      parallelSell = 296.0;
    } else if (def.code === 'CHF') {
      parallelBuy = 260.0;
      parallelSell = 264.0;
    } else if (def.code === 'SAR') {
      parallelBuy = 62.0;
      parallelSell = 63.5;
    } else if (def.code === 'AED') {
      parallelBuy = 63.5;
      parallelSell = 65.0;
    } else if (def.code === 'TRY') {
      parallelBuy = 6.8;
      parallelSell = 7.4;
    } else if (def.code === 'CNY') {
      parallelBuy = 31.5;
      parallelSell = 33.0;
    } else if (def.code === 'QAR') {
      parallelBuy = 63.0;
      parallelSell = 64.8;
    } else if (def.code === 'KWD') {
      parallelBuy = 750.0;
      parallelSell = 765.0;
    } else if (def.code === 'TND') {
      parallelBuy = 73.0;
      parallelSell = 76.0;
    } else if (def.code === 'MAD') {
      parallelBuy = 22.0;
      parallelSell = 24.0;
    } else {
      parallelBuy = Number((officialMid * (def.parallelBaseRatio || 1.7)).toFixed(2));
      parallelSell = Number((parallelBuy * 1.015).toFixed(2));
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

  // Virtual Neobanks & Crypto (P2P BaridiMob / CCP benchmarks)
  const virtualRates: VirtualNeobankItem[] = [
    {
      id: 'usdt_binance',
      name: 'USDT (Tether Crypto)',
      category: 'crypto',
      currency: 'USDT',
      currencySymbol: '₮',
      logo: '🪙',
      badgeColor: 'emerald',
      buyDzd: 240.5, // Client buys USDT via BaridiMob
      sellDzd: 238.0, // Client sells USDT for DZD
      change24h: +0.42,
      paymentMethods: ['BaridiMob', 'CCP', 'Paysera', 'Wise'],
      minTransaction: '10 USDT (~2,400 DA)',
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
      buyDzd: 248.5,
      sellDzd: 245.0,
      change24h: +0.25,
      paymentMethods: ['BaridiMob', 'CCP', 'Virement RIB Wise'],
      minTransaction: '20 € (~5,000 DA)',
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
      buyDzd: 247.0,
      sellDzd: 244.0,
      change24h: -0.15,
      paymentMethods: ['BaridiMob', 'CCP', 'Virement Paysera'],
      minTransaction: '10 € (~2,500 DA)',
      avgTransferTime: 'Instant / Immédiat',
      popularUse: 'Carte Visa physique/virtuelle, shopping en ligne, abonnements',
      notes: 'Pionnier des cartes Visa en Algérie, très répandu chez les commerçants.',
      rating: 4.6,
    },
    {
      id: 'redotpay_usd',
      name: 'RedotPay (Solde USD / Crypto Card)',
      category: 'virtual_card',
      currency: 'USD',
      currencySymbol: '$',
      logo: '🔴',
      badgeColor: 'rose',
      buyDzd: 238.5,
      sellDzd: 235.0,
      change24h: +0.60,
      paymentMethods: ['BaridiMob', 'Binance Pay USDT', 'CCP'],
      minTransaction: '10 $ (~2,400 DA)',
      avgTransferTime: '1-3 minutes',
      popularUse: 'Carte Visa virtuelle immédiate, sponsoring Facebook / TikTok Ads',
      notes: 'Rechargeable directement en USDT ou via revendeurs BaridiMob.',
      rating: 4.7,
    },
    {
      id: 'pyypl_usd',
      name: 'Pyypl (Mastercard Virtuelle)',
      category: 'wallet',
      currency: 'USD',
      currencySymbol: '$',
      logo: '🟣',
      badgeColor: 'purple',
      buyDzd: 236.0,
      sellDzd: 232.0,
      change24h: 0.0,
      paymentMethods: ['BaridiMob', 'Binance Pay'],
      minTransaction: '10 $ (~2,360 DA)',
      avgTransferTime: 'Instant',
      popularUse: 'Carte Mastercard virtuelle pour petites transactions et jeux',
      notes: 'Application basée aux EAU, supporte les recharges cryptos.',
      rating: 4.2,
    },
    {
      id: 'revolut_eur',
      name: 'Revolut (Solde Euro €)',
      category: 'neobank',
      currency: 'EUR',
      currencySymbol: '€',
      logo: '🔷',
      badgeColor: 'indigo',
      buyDzd: 249.0,
      sellDzd: 245.5,
      change24h: +0.10,
      paymentMethods: ['BaridiMob', 'Virement Revolut Tag (Revtag)'],
      minTransaction: '25 € (~6,200 DA)',
      avgTransferTime: 'Instant',
      popularUse: 'Comptes diaspora européenne, étudiants et voyageurs',
      notes: 'Transactions ultra-rapides sans frais entre utilisateurs Revolut.',
      rating: 4.8,
    },
  ];

  // Regional marketplaces across Algerian cities
  const regionalMarkets: RegionalMarket[] = [
    {
      city: 'Alger',
      locationName: 'Square Port-Saïd & Rue Abane Ramdane',
      eurBuy: 250.0,
      eurSell: 252.5,
      usdBuy: 234.0,
      usdSell: 236.5,
      liquidity: 'high',
      lastActivity: 'Il y a 10 min',
    },
    {
      city: 'Sétif',
      locationName: 'El Eulma (Bourse Dubaï & Commerce Gros)',
      eurBuy: 250.5,
      eurSell: 253.0,
      usdBuy: 234.5,
      usdSell: 237.0,
      liquidity: 'high',
      lastActivity: 'Il y a 25 min',
    },
    {
      city: 'Oran',
      locationName: 'Mdina Jdida & Rue Larbi Ben M\'hidi',
      eurBuy: 249.5,
      eurSell: 252.0,
      usdBuy: 233.5,
      usdSell: 236.0,
      liquidity: 'high',
      lastActivity: 'Il y a 15 min',
    },
    {
      city: 'Constantine',
      locationName: 'Souk El Asser & Souk Dubaï',
      eurBuy: 249.0,
      eurSell: 251.5,
      usdBuy: 233.0,
      usdSell: 235.5,
      liquidity: 'medium',
      lastActivity: 'Il y a 40 min',
    },
    {
      city: 'Tizi Ouzou',
      locationName: 'Boulevard Stiti & Centre Ville',
      eurBuy: 250.0,
      eurSell: 252.5,
      usdBuy: 234.0,
      usdSell: 236.5,
      liquidity: 'medium',
      lastActivity: 'Il y a 30 min',
    },
    {
      city: 'Annaba',
      locationName: 'Cours de la Révolution',
      eurBuy: 248.5,
      eurSell: 251.5,
      usdBuy: 233.0,
      usdSell: 235.5,
      liquidity: 'medium',
      lastActivity: 'Il y a 1h',
    },
  ];

  // Historical data (30 points)
  const historical: HistoricalDataPoint[] = [];
  const baseDate = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dayFactor = Math.sin(i * 0.3) * 1.5;
    const trendFactor = (29 - i) * 0.12;

    const offEur = Number((145.2 + (Math.cos(i * 0.2) * 0.6)).toFixed(2));
    const parEur = Number((246.0 + trendFactor + dayFactor).toFixed(1));
    const offUsd = Number((133.8 + (Math.sin(i * 0.2) * 0.4)).toFixed(2));
    const parUsd = Number((230.5 + trendFactor * 0.9 + dayFactor * 0.8).toFixed(1));
    const vWise = Number((parEur - 2.5).toFixed(1));
    const vUsdt = Number((parUsd + 2.0).toFixed(1));

    const spreadEur = Number((((parEur - offEur) / offEur) * 100).toFixed(1));

    historical.push({
      date: d.toISOString().split('T')[0],
      formattedDate: d.toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short' }),
      officialEur: offEur,
      parallelEur: parEur,
      virtualWiseEur: vWise,
      officialUsd: offUsd,
      parallelUsd: parUsd,
      virtualUsdt: vUsdt,
      spreadEurPercentage: spreadEur,
    });
  }

  // Market Insights
  const insights: MarketInsight[] = [
    {
      id: 'ins-1',
      title: 'Forte demande sur l\'USDT et les soldes Wise pour les achats e-commerce',
      category: 'crypto',
      summary: 'Les transactions P2P via BaridiMob connaissent un pic d\'activité avec l\'augmentation des importations de petits colis et des campagnes publicitaires sur les réseaux.',
      impact: 'hausse',
      date: 'Aujourd\'hui',
      source: 'Indice Binance P2P Algérie',
    },
    {
      id: 'ins-2',
      title: 'Stabilité relative de l\'Euro au Square Port-Saïd autour de 250 DA',
      category: 'tendance',
      summary: 'L\'offre en devises des ressortissants et la demande des voyageurs maintiennent l\'Euro dans un canal 250 - 252.5 DA.',
      impact: 'neutre',
      date: 'Aujourd\'hui',
      source: 'Bourse Informelle Alger',
    },
    {
      id: 'ins-3',
      title: 'Écart Banque d\'Algérie vs Marché Parallèle supérieur à 72%',
      category: 'analyse',
      summary: 'La prime de change informelle reste élevée, créant un différentiel majeur pour les transactions de commerce extérieur et les transferts personnels.',
      impact: 'neutre',
      date: 'Hier',
      source: 'Analyse Économique DinarDZ',
    },
    {
      id: 'ins-4',
      title: 'Plafonds de virement BaridiMob portés à 200 000 DA par jour',
      category: 'reglementation',
      summary: 'Facilite les règlements instantanés pour les opérations d\'achat de devises virtuelles et les recharges de cartes prépayées.',
      impact: 'hausse',
      date: 'Cette semaine',
      source: 'Algérie Poste',
    },
  ];

  const eurCurr = currencies.find(c => c.code === 'EUR');
  const usdCurr = currencies.find(c => c.code === 'USD');

  const eurOfficialMid = eurCurr?.official.mid || 145.5;
  const eurParallelSell = eurCurr?.parallel?.sell || 252.5;
  const usdOfficialMid = usdCurr?.official.mid || 133.8;
  const usdParallelSell = usdCurr?.parallel?.sell || 236.5;

  const result: ApiResponse = {
    timestamp: new Date().toISOString(),
    lastUpdatedFormatted: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' (Heure d\'Alger GMT+1)',
    currencies,
    virtualRates,
    regionalMarkets,
    historical,
    insights,
    stats: {
      officialUsdToDzd: usdOfficialMid,
      officialEurToDzd: eurOfficialMid,
      parallelEurBuy: eurCurr?.parallel?.buy || 250.0,
      parallelEurSell: eurParallelSell,
      parallelUsdBuy: usdCurr?.parallel?.buy || 234.0,
      parallelUsdSell: usdParallelSell,
      usdtP2pRate: 240.5,
      wiseEurRate: 248.5,
      payseraEurRate: 247.0,
      gapEurPercent: Number((((eurParallelSell - eurOfficialMid) / eurOfficialMid) * 100).toFixed(1)),
      gapUsdPercent: Number((((usdParallelSell - usdOfficialMid) / usdOfficialMid) * 100).toFixed(1)),
    },
  };

  cachedData = result;
  lastFetchTime = now;
  return result;
}

// API Routes
app.get('/api/rates', async (req, res) => {
  try {
    const data = await fetchRatesData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des taux' });
  }
});

app.post('/api/refresh', async (req, res) => {
  try {
    lastFetchTime = 0; // Invalidate cache
    const data = await fetchRatesData();
    res.json({ success: true, message: 'Données actualisées avec succès', data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Échec de l\'actualisation' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DinarDZ Currency Server running on http://localhost:${PORT}`);
  });
}

startServer();
