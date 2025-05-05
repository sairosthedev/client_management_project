/**
 * Formats a date into a human-readable string
 * @param date - Date string or Date object
 * @returns Formatted date string in the format "MMM DD, YYYY"
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
} 