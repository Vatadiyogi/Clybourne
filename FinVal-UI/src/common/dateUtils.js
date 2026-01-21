// src/utils/dateUtils.js
import { format, parseISO } from 'date-fns'; // Import parseISO from date-fns
import { toZonedTime } from 'date-fns-tz'; // Import toZonedTime from date-fns-tz
/**
 * Format a date to a specified format.
 * @param {Date|string|number} date - The date to format.
 * @param {string} dateFormat - The format string. Default is 'yyyy-MM-dd'.
 * @return {string} The formatted date string.
 */
// export function formatDate(date, dateFormat = 'dd-MMM-yyyy') {
//     return format(new Date(date), dateFormat);
// }

// export function formatDate(dateString) {
//     // Parse the date string into a Date object
//     const date = parseISO(dateString);

//     // Convert to UTC
//     const utcDate = toZonedTime(date, 'UTC');

//     // Format the date into 'dd-MMM-yyyy HH:mm:ss' format
//     const formattedDate = format(utcDate, 'dd-MMM-yyyy HH:mm');

//     // Append 'GMT' to the formatted date string
//     return `${formattedDate} GMT`;
// }

export function formatDate(dateString) {
  // Parse the date string into a Date object
  const date = parseISO(dateString);

  // Convert to system's local timezone
  const localDate = toZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Format the date into 'dd-MMM-yyyy HH:mm' format
  return format(localDate, 'dd-MMM-yyyy HH:mm');
}


  
export function formatDateTime(date, dateFormat = 'dd-MMM-yyyy HH:ii') {
    return format(new Date(date), dateFormat);
}

export const getMonthName = (monthNumber) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    // monthNumber is expected to be in the range 1-12
    return monthNames[monthNumber - 1];
};