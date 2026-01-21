// src/utils/dateUtils.js
// import { format } from 'date-fns';

// /**
//  * Format a date to a specified format.
//  * @param {Date|string|number} date - The date to format.
//  * @param {string} dateFormat - The format string. Default is 'yyyy-MM-dd'.
//  * @return {string} The formatted date string.
//  */
// export function formatDate(date, dateFormat = 'dd-MM-yyyy') {
//     return format(new Date(date), dateFormat);
// }

// export function formatDateTime(date, dateFormat = 'dd-MMM-yyyy HH:ii') {
//     return format(new Date(date), dateFormat);
// }

import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Format a date to a specified format.
 * @param {Date|string|number} date - The date to format.
 * @param {string} dateFormat - The format string. Default is 'dd-MM-yyyy'.
 * @return {string} The formatted date string.
 */
export function formatDate(date, dateFormat = 'dd-MM-yyyy HH:mm') {
    const istDate = toZonedTime(new Date(date), 'Asia/Kolkata');
    return format(istDate, dateFormat);
}

/**
 * Format a date-time to a specified format in IST.
 * @param {Date|string|number} date - The date to format.
 * @param {string} dateFormat - The format string. Default is 'dd-MMM-yyyy HH:mm'.
 * @return {string} The formatted date-time string in IST.
 */
export function formatDateTime(date, dateFormat = 'dd-MMM-yyyy HH:mm') {
    // Convert UTC date to IST
    const istDate = toZonedTime(new Date(date), 'Asia/Kolkata');
    return format(istDate, dateFormat);
}


export const getMonthName = (monthNumber) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    // monthNumber is expected to be in the range 1-12
    return monthNames[monthNumber - 1];
};