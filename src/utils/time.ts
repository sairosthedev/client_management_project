export const formatTime = (time: number): string => {
  // Ensure time is a number and not NaN
  if (isNaN(time) || typeof time !== 'number') {
    return '0h 0m';
  }

  // Convert to minutes if time is in milliseconds
  const minutes = time > 1000 ? Math.floor(time / (1000 * 60)) : time;
  
  // Calculate hours and remaining minutes
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  
  return `${hours}h ${mins}m`;
}; 