import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78 },
  JPY: { code: 'JPY', symbol: '¥', rate: 154.0 },
};

export const formatPrice = (amountUsd: number, currency: CurrencyCode = 'USD'): string => {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountUsd * config.rate;

  if (currency === 'JPY') {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${config.symbol}${converted.toFixed(2)}`;
};
