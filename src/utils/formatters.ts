/**
 * Format currency number with Algerian standards
 */
export function formatDZD(amount: number, lang: 'fr' | 'ar' = 'fr'): string {
  const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return lang === 'ar' ? `${formatted} دج` : `${formatted} DA`;
}

export function formatNumber(amount: number, decimals: number = 2, lang: 'fr' | 'ar' = 'fr'): string {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Convert Dinar amount to traditional Algerian "Centimes" terminology
 * 1 Dinar = 100 Centimes
 * 10 000 Dinar = 1 Million de centimes (مليون سنتيم)
 * 100 000 Dinar = 10 Millions de centimes (10 ملايين سنتيم)
 * 1 000 000 Dinar = 100 Millions de centimes (100 مليون سنتيم / 1 مليار سنتيم)
 */
export function formatCentimesAlgerien(dzdAmount: number, lang: 'fr' | 'ar' = 'fr'): string {
  if (isNaN(dzdAmount) || dzdAmount <= 0) {
    return lang === 'ar' ? '0 سنتيم' : '0 Centime';
  }

  const centimes = dzdAmount * 100;

  if (centimes >= 1_000_000_000) {
    const milliards = centimes / 1_000_000_000;
    if (lang === 'ar') {
      return `${milliards.toFixed(2).replace(/\.00$/, '')} مليار سنتيم (${milliards >= 2 ? 'ملايير' : 'مليار'})`;
    }
    return `${milliards.toFixed(2).replace(/\.00$/, '')} Milliard${milliards >= 2 ? 's' : ''} de centimes (Mlyar)`;
  }

  if (centimes >= 1_000_000) {
    const millions = centimes / 1_000_000;
    if (lang === 'ar') {
      return `${millions.toFixed(2).replace(/\.00$/, '')} مليون سنتيم (${millions >= 10 ? Math.floor(millions) + ' ملايين' : 'مليون'})`;
    }
    return `${millions.toFixed(2).replace(/\.00$/, '')} Million${millions >= 2 ? 's' : ''} de centimes (${millions >= 10 ? Math.floor(millions) + ' Mlayen' : 'Mlyoun'})`;
  }

  if (centimes >= 1_000) {
    const milliers = centimes / 1_000;
    if (lang === 'ar') {
      return `${milliers.toFixed(0)} ألف سنتيم (${milliers} ألف)`;
    }
    return `${milliers.toFixed(0)} Mille centimes (${milliers} Alef)`;
  }

  return lang === 'ar' ? `${centimes.toFixed(0)} سنتيم` : `${centimes.toFixed(0)} Centimes`;
}

/**
 * Calculate BaridiMob official transfer fees in Algeria
 */
export function calculateBaridimobFee(dzdAmount: number): number {
  if (dzdAmount <= 5000) return 12;
  if (dzdAmount <= 20000) return 18;
  if (dzdAmount <= 50000) return 28;
  if (dzdAmount <= 100000) return 50;
  if (dzdAmount <= 200000) return 80;
  return 100;
}
