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
