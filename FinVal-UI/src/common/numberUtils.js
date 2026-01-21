import { format, parseISO } from 'date-fns'; // Import parseISO from date-fns
import { toZonedTime } from 'date-fns-tz'; // Import toZonedTime from date-fns-tz

// Helper function to format numbers
export function formatNumber(num) {
    if (num === undefined || num === null) return "";
    const number = parseFloat(num);
    if (isNaN(number)) return "";
    
    const formattedNum = Math.abs(number).toFixed(2);  // Use absolute value to remove the negative sign
    return number < 0 ? `(${formattedNum})` : formattedNum;
  }

export function formatPreviewNumber(num) {
  if (num === undefined || num === null) return "";
  const number = parseFloat(num);
  if (isNaN(number)) return "";
  
  const formattedNum = Math.abs(number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return number < 0 ? `(${formattedNum})` : formattedNum;
}  

export function formatFrontNumber(num) {
    if (num === undefined || num === null) return "";
    const number = parseFloat(num);
    if (isNaN(number)) return "";
    
    const formattedNum = number.toFixed(2);  // Use absolute value to remove the negative sign
    return formattedNum;
  }  

  export function formatForecastNumber(num) {
    if (num === undefined || num === null) return "";
    const number = parseFloat(num);
    if (isNaN(number)) return "";
    
    const formattedNum = number.toFixed(1);  // Use absolute value to remove the negative sign
    return formattedNum;
  }    

export const getMonthName = (monthNumber) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    // monthNumber is expected to be in the range 1-12
    return monthNames[monthNumber - 1];
};

// export function formatDate(date, dateFormat = 'dd-MMM-yyyy') {
//   return format(new Date(date), dateFormat);
// }

// export function formatDate(dateString) {
//   // Parse the date string into a Date object
//   const date = parseISO(dateString);

//   // Convert to UTC
//   const utcDate = toZonedTime(date, 'UTC');

//   // Format the date into 'dd-MMM-yyyy HH:mm:ss' format
//   const formattedDate = format(utcDate, 'dd-MMM-yyyy HH:mm');

//   // Append 'GMT' to the formatted date string
//   return `${formattedDate} GMT`;
// }

export function formatDate(dateString) {
  // Parse the date string into a Date object
  const date = parseISO(dateString);

  // Convert to system's local timezone
  const localDate = toZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Format the date into 'dd-MMM-yyyy HH:mm' format
  return format(localDate, 'dd-MMM-yyyy HH:mm');
}      


