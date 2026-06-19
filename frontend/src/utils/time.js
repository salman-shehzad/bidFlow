export const timeLeft = (endTime) => {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
};
