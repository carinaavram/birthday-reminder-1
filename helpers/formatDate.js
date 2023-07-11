export default function formatDate(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York',
  };
  return date.toLocaleDateString('en-US', options);
}
