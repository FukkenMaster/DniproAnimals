/**
 * Допоміжні функції для відображення віку та дат українською.
 */

export function plural(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function formatAge(months: number): string {
  if (months < 12) {
    return `${months} ${plural(months, 'місяць', 'місяці', 'місяців')}`;
  }
  const years = Math.floor(months / 12);
  return `${years} ${plural(years, 'рік', 'роки', 'років')}`;
}

export function ageGroup(months: number): 'kitten' | 'adult' | 'senior' {
  if (months < 12) return 'kitten';
  if (months < 96) return 'adult';
  return 'senior';
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export const statusOrder = {
  available: 0,
  reserved: 1,
  adopted: 2,
} as const;
