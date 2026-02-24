import { parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  const localDate = toZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone);
  return format(localDate, 'dd-MMM-yyyy HH:mm');
}
export function formatDateOnly(dateString) {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  const localDate = toZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone);
  return format(localDate, 'dd-MMM-yyyy'); // <-- No time
}
export function formatNumber(value) {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

/** Format a number to exactly 2 decimal places for graph display (e.g. 10.00, 7.89). */
export function formatToTwoDecimalPlaces(value) {
  if (value === null || value === undefined || isNaN(value)) return '0.00';
  return Number(value).toFixed(2);
}

/** Format number with Indian commas for form display (e.g. 10,000 and 10,00,000). */
export function formatNumberIndian(value) {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/** Strip Indian commas from input string for form state (e.g. "10,00,000" → "1000000"). */
export function parseIndianNumber(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/,/g, '').trim();
}
