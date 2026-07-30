export function formatCurrencyINR(value: number, fractions: 0 | 1 | 2 = 0): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: fractions,
      minimumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(value % 1_00_000 === 0 ? 0 : 1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  return formatCurrencyINR(value);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/gu, '')
    .replace(/[\s_-]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
}
