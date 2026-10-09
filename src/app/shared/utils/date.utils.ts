import { DATE_FORMAT } from '../config/date.config';

export function addDays(date: string, offset: number): string {
  const value = new Date(date + DATE_FORMAT.utcMidnight);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, DATE_FORMAT.isoDateLength);
}
export function formatDate(date: string): string {
  return date.split(DATE_FORMAT.isoSeparator).reverse().join(DATE_FORMAT.displaySeparator);
}
