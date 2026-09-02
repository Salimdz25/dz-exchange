import React from 'react';

export interface CurrencyAsset {
  flag: string;
  name: string;
  logoSvg?: React.ReactNode;
}

/**
 * Reusable mapping for currency flags, brand icons, and official logos
 * Exact matches from provided brand imagery.
 */
export const getCurrencyAsset = (code: string): CurrencyAsset => {
  const upperCode = code.toUpperCase();

  // 1. Wise Official Logo (Lime Green #9FE870 with Dark Green #163300 Symbol)
  if (upperCode.includes('WISE')) {
    return {
      flag: '🌐',
      name: 'Wise',
      logoSvg: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-xl shadow-xs">
          <rect width="100" height="100" rx="22" fill="#9FE870" />
          <path d="M33 26H68L52 46H38L29 26ZM47 46L68 26H55L37 46H47ZM47 74L68 32H55L36 74H47Z" fill="#163300" />
        </svg>
      ),
    };
  }

  // 2. Paysera Official Logo (White background with Blue / Dark Blue / Green "P")
  if (upperCode.includes('PAYSERA')) {
    return {
      flag: '💳',
      name: 'Paysera',
      logoSvg: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-xl shadow-xs">
          <rect width="100" height="100" rx="22" fill="#FFFFFF" />
          <rect x="23" y="42" width="12" height="42" fill="#22C55E" />
          <path d="M 23 42 C 23 20, 77 20, 77 42 H 65 C 65 28, 35 28, 35 42 Z" fill="#2985FF" />
          <path d="M 23 84 C 23 55, 77 75, 77 42 H 65 C 65 60, 35 48, 35 84 Z" fill="#0000A0" />
        </svg>
      ),
    };
  }

  // 3. PayPal Official Logo (Deep Blue #001C99 with White / Light Blue Double P)
  if (upperCode.includes('PAYPAL')) {
    return {
      flag: '🅿️',
      name: 'PayPal',
      logoSvg: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-xl shadow-xs">
          <rect width="100" height="100" rx="22" fill="#001C99" />
          <path d="M 31 18 H 53 C 65 18 71 24 69 34 C 67 46 58 52 47 52 H 39 L 34 78 H 23 L 31 18 Z" fill="#7BB2E8" opacity="0.8" />
          <path d="M 42 28 H 60 C 70 28 76 34 74 44 C 72 56 63 62 52 62 H 44 L 38 88 H 28 L 42 28 Z" fill="#FFFFFF" />
        </svg>
      ),
    };
  }

  // 4. RedotPay Official Logo (Red #E5002C with White "P" Loop)
  if (upperCode.includes('REDOTPAY')) {
    return {
      flag: '💳',
      name: 'RedotPay',
      logoSvg: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-xl shadow-xs">
          <rect width="100" height="100" rx="22" fill="#E5002C" />
          <path d="M 23 25 C 55 10 82 25 82 50 C 82 72 62 88 38 88 H 23 V 25 Z M 38 73 H 42 C 58 73 67 62 67 50 C 67 36 54 28 38 28 Z" fill="#FFFFFF" />
          <path d="M 38 38 C 50 38 58 45 58 53 C 58 60 50 63 38 63 V 38 Z" fill="#E5002C" />
        </svg>
      ),
    };
  }

  // 5. USDT (Tether) Official Logo (Emerald Green Hexagon #4DB197 with White T)
  if (upperCode.includes('USDT')) {
    return {
      flag: '🪙',
      name: 'USDT (Tether)',
      logoSvg: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-xl shadow-xs">
          <path d="M 50 6 L 88 28 L 88 72 L 50 94 L 12 72 L 12 28 Z" fill="#4DB197" />
          <path d="M 26 18 H 74 V 30 H 26 Z" fill="#FFFFFF" />
          <ellipse cx="50" cy="44" rx="28" ry="7" fill="none" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M 44 26 H 56 V 76 H 44 Z" fill="#FFFFFF" />
        </svg>
      ),
    };
  }

  // 6. USDC (USD Coin) Official Logo (Blue #0B5AD9 Circle with White Ring & Dollar Sign)
  if (upperCode.includes('USDC')) {
    return {
      flag: '🔵',
      name: 'USDC (USD Coin)',
      logoSvg: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-xl shadow-xs">
          <rect width="100" height="100" rx="22" fill="#0B5AD9" />
          <path d="M 50 14 C 28 14 14 30 14 50 C 14 70 28 86 50 86 C 72 86 86 70 86 50 C 86 30 72 14 50 14 Z M 50 78 C 33 78 22 65 22 50 C 22 35 33 22 50 22 C 67 22 78 35 78 50 C 78 65 67 78 50 78 Z" fill="#FFFFFF" />
          <rect x="42" y="10" width="16" height="16" fill="#0B5AD9" />
          <rect x="42" y="74" width="16" height="16" fill="#0B5AD9" />
          <path d="M 52 68 V 63 C 58 62 62 58 62 52 C 62 44 56 42 50 41 C 45 40 42 38 42 35 C 42 32 45 30 49 30 C 53 30 57 32 58 35 L 64 32 C 62 27 57 24 52 23 V 18 H 46 V 23 C 40 24 36 28 36 35 C 36 42 42 44 48 45 C 53 46 56 48 56 51 C 56 55 52 57 48 57 C 43 57 39 54 37 50 L 31 53 C 33 59 38 63 46 63 V 68 H 52 Z" fill="#FFFFFF" />
        </svg>
      ),
    };
  }

  // Standard Fiat Country Flags
  switch (upperCode) {
    case 'EUR':
      return { flag: '🇪🇺', name: 'Euro' };
    case 'USD':
      return { flag: '🇺🇸', name: 'US Dollar' };
    case 'GBP':
      return { flag: '🇬🇧', name: 'British Pound' };
    case 'CAD':
      return { flag: '🇨🇦', name: 'Canadian Dollar' };
    case 'CHF':
      return { flag: '🇨🇭', name: 'Swiss Franc' };
    case 'JPY':
      return { flag: '🇯🇵', name: 'Japanese Yen' };
    case 'CNY':
      return { flag: '🇨🇳', name: 'Chinese Yuan' };
    case 'TRY':
      return { flag: '🇹🇷', name: 'Turkish Lira' };
    case 'AED':
      return { flag: '🇦🇪', name: 'UAE Dirham' };
    case 'SAR':
      return { flag: '🇸🇦', name: 'Saudi Riyal' };
    case 'QAR':
      return { flag: '🇶🇦', name: 'Qatari Riyal' };
    case 'KWD':
      return { flag: '🇰🇼', name: 'Kuwaiti Dinar' };
    case 'MAD':
      return { flag: '🇲🇦', name: 'Moroccan Dirham' };
    case 'TND':
      return { flag: '🇹🇳', name: 'Tunisian Dinar' };
    case 'DZD':
      return { flag: '🇩🇿', name: 'Algerian Dinar' };
    default:
      return { flag: '🏳️', name: code };
  }
};
