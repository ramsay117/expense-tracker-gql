export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
