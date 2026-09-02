/**
 * Reusable mapping for currency flags and icons
 */
export const getCurrencyAsset = (code: string) => {
  switch (code.toUpperCase()) {
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
    case 'USDT':
      return { flag: '🪙', name: 'USDT (Tether)' };
    case 'WISE_EUR':
      return { flag: '🌐', name: 'Wise' };
    case 'PAYSERA_EUR':
      return { flag: '💳', name: 'Paysera' };
    default:
      return { flag: '🏳️', name: code };
  }
};
