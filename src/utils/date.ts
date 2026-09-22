export function formatPostDate(isoString: string): {
  dateStr: string;
  timeStr: string;
  relativeStr: string;
  fullFormatted: string;
} {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return {
      dateStr: '22 SEP 2026',
      timeStr: '15:03',
      relativeStr: 'just now',
      fullFormatted: '22 SEP 2026 · 15:03 · just now'
    };
  }

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const dateStr = `${day} ${month} ${year}`;
  const timeStr = `${hours}:${minutes}`;

  // Relative time
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relativeStr = 'just now';
  if (diffSec < 60) {
    relativeStr = 'just now';
  } else if (diffMin < 60) {
    relativeStr = `${diffMin}m ago`;
  } else if (diffHours < 24) {
    relativeStr = `${diffHours}h ago`;
  } else if (diffDays < 30) {
    relativeStr = `${diffDays}d ago`;
  } else {
    const diffMonths = Math.floor(diffDays / 30);
    relativeStr = `${diffMonths}mo ago`;
  }

  const fullFormatted = `${dateStr} · ${timeStr} · ${relativeStr}`;

  return {
    dateStr,
    timeStr,
    relativeStr,
    fullFormatted
  };
}
