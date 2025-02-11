import dayjs from "dayjs";

/**
 * Format a date as a string
 *
 * @param date The date to format, or null if it should return now
 */
export function formatDate(date: Date|null = null): string
{
    return dayjs(date || Date.now()).format("YYYY-MM-DD HH:mm:ss");
}